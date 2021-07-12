import $api from '../http'
import IChore, { ChoreStates, ChoreTypes } from '../models/chore'
import { MessagesTypes } from '../models/message'
import { AlertsService } from './alerts.service'
import MessagesService from './messages.service'
import UsersService from './users.service'

export default class ChoresService {
    static async createChore(details: string) {
        try {
            await $api.post<IChore>('/chores/create', { details })
            AlertsService.addAlert({ content: 'Запрос создан, компетентные особы уведомлены', theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async becomeSolver(chore: IChore) {
        try {
            const updated = await $api.patch<IChore>('/chores/setSolvers', {
                choreId: chore._id,
                mode: 'add',
            })
            const newSolver = updated.data.solvers.concat(chore.solvers)[0]
            await MessagesService.sendMessage(
                `${UsersService.formatName(newSolver)} принял запрос`,
                MessagesTypes.INCHORE_SYS_MESSAGE,
                null,
                chore._id
            )
            AlertsService.addAlert({
                content: 'Отныне вы ответственны за решения этого запроса',
                theme: 'success',
            })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async finishChore(chore: IChore, types: ChoreTypes[]) {
        await Promise.all([this.setState(chore, ChoreStates.SOLVED), this.setTypes(chore, types)])
        if (types) {
            let mess = 'Запрос категоризирован\n'
            types.forEach((type, i) => {
                mess += this.formatTypeName(type) + (i == types.length - 1 ? '' : ', ')
            })
            MessagesService.sendMessage(mess, MessagesTypes.INCHORE_SYS_MESSAGE, null, chore._id)
        }
        MessagesService.sendMessage('Запрос решен', MessagesTypes.INCHORE_SYS_MESSAGE, null, chore._id)
        AlertsService.addAlert({ content: 'Запрос успешно завершен, пользователь уведомлен', theme: 'success' })
        return
    }

    static async setState(chore: IChore, state: ChoreStates) {
        try {
            const c = await $api.patch<IChore>('/chores/setState', {
                choreId: chore._id,
                state,
            })
            return c
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async setTypes(chore: IChore, types: ChoreTypes[]) {
        try {
            await $api.patch<IChore>('/chores/setType', {
                choreId: chore._id,
                types,
            })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async deleteChore(chore: IChore) {
        try {
            await $api.delete<IChore>(`/chores?choreId=${chore._id}`)
            AlertsService.addAlert({ content: 'Запрос удален' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static formatTypeName(type: ChoreTypes) {
        switch (type) {
            case ChoreTypes.APP_HELP:
                return 'Настройка приложения'
            case ChoreTypes.APP_INSTALL:
                return 'Установка приложения'
            case ChoreTypes.CONNECTION:
                return 'Проблемы с соединением'
            case ChoreTypes.FILES_MISSING:
                return 'Пропали файлы'
            case ChoreTypes.OS_REINSTALL:
                return 'Переустановка системы'
            case ChoreTypes.OS_SLOW:
                return 'Система тормозит'
            case ChoreTypes.OTHER:
                return 'Другое'
            case ChoreTypes.PRINTER_BROKE:
                return 'Проблема с принтером'
            case ChoreTypes.VIRUS:
                return 'Вирус в системе'
        }
    }
}
