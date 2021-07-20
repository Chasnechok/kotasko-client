import router from 'next/router'
import { removeNotificationByEntity } from '@hooks/useNotifications'
import $api from '../http'
import IChore, { ChoreStates, ChoreTypes } from '@models/chore'
import { MessagesTypes } from '@models/message'
import { AlertsService } from './alerts.service'
import MessagesService from './messages.service'
import UsersService from './users.service'
import ChoreCreateLsi from '@lsi/chores/chore-create.lsi'

export default class ChoresService {
    static async createChore(details: string) {
        try {
            await $api.post<IChore>('/chores/create', { details })
            AlertsService.addAlert({ content: ChoreCreateLsi.onCreate[router.locale], theme: 'success' })
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
                `${UsersService.formatName(newSolver)} ${ChoreCreateLsi.acceptedChore[router.locale]}`,
                MessagesTypes.INCHORE_SYS_MESSAGE,
                null,
                chore._id
            )
            AlertsService.addAlert({
                content: ChoreCreateLsi.youResponsible[router.locale],
                theme: 'success',
            })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async finishChore(chore: IChore, types: ChoreTypes[]) {
        await Promise.all([this.setState(chore, ChoreStates.SOLVED), this.setTypes(chore, types)])
        if (types) {
            let mess = ChoreCreateLsi.choreCateg[router.locale] + '\n'
            types.forEach((type, i) => {
                mess += this.formatTypeName(type) + (i == types.length - 1 ? '' : ', ')
            })
            MessagesService.sendMessage(mess, MessagesTypes.INCHORE_SYS_MESSAGE, null, chore._id)
        }
        MessagesService.sendMessage(
            ChoreCreateLsi.choreSolved[router.locale],
            MessagesTypes.INCHORE_SYS_MESSAGE,
            null,
            chore._id
        )
        AlertsService.addAlert({ content: ChoreCreateLsi.onFinish[router.locale], theme: 'success' })
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
            if (document.location.search.includes(chore._id)) {
                router.replace('/chores', null, { shallow: true })
            }
            removeNotificationByEntity<IChore>('referencedChore', chore)
            AlertsService.addAlert({ content: ChoreCreateLsi.onDelete[router.locale] })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static formatTypeName(type: ChoreTypes) {
        switch (type) {
            case ChoreTypes.APP_HELP:
                return ChoreCreateLsi.typeAppHelp[router.locale]
            case ChoreTypes.APP_INSTALL:
                return ChoreCreateLsi.typeAppInstall[router.locale]
            case ChoreTypes.CONNECTION:
                return ChoreCreateLsi.typeConnection[router.locale]
            case ChoreTypes.FILES_MISSING:
                return ChoreCreateLsi.typeFilesMissing[router.locale]
            case ChoreTypes.OS_REINSTALL:
                return ChoreCreateLsi.typeOsReinstall[router.locale]
            case ChoreTypes.OS_SLOW:
                return ChoreCreateLsi.typeOsSlow[router.locale]
            case ChoreTypes.PRINTER_BROKE:
                return ChoreCreateLsi.typePrinterBroke[router.locale]
            case ChoreTypes.VIRUS:
                return ChoreCreateLsi.typeVirus[router.locale]
            case ChoreTypes.OTHER:
            default:
                return ChoreCreateLsi.typeOther[router.locale]
        }
    }
}
