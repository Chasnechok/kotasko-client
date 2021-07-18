import router from 'next/router'
import $api from '../http'
import { InputAttachments } from '../models/file'
import { MessagesTypes } from '../models/message'
import ITask, { TaskStates } from '../models/task'
import IUser from '../models/user'
import { AlertsService } from './alerts.service'
import FilesService from './files.service'
import MessagesService from './messages.service'
import { removeNotificationByEntity } from '../hooks/useNotifications'

export default class TasksService {
    static async createTask(name: string, details: string, assignedTo: IUser[], attachments: InputAttachments) {
        try {
            let uploadedAttachments = []
            if (attachments && attachments.toUpload) {
                uploadedAttachments = await FilesService.uploadFiles(attachments.toUpload)
            }
            const atts = uploadedAttachments.concat(attachments?.onServer || [])
            await $api.post<ITask>('/tasks/create', {
                name,
                details,
                assignedTo: assignedTo.map((u) => u._id),
                attachments: atts.map((at) => at._id),
            })
            AlertsService.addAlert({ content: 'Задание успешно создано, исполнители уведомлены', theme: 'success' })
        } catch (error) {
            console.log(error)

            AlertsService.alertFromError(error)
        }
    }

    static async setExecutans(task: ITask, executans: IUser[]) {
        try {
            await $api.patch<ITask>('/tasks/setExecutans', {
                taskId: task._id,
                userIds: executans.map((u) => u._id),
            })
            AlertsService.addAlert({ content: 'Исполнители задания успешно обновлены', theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async setTaskState(task: ITask, state: TaskStates) {
        try {
            await $api.patch<ITask>('/tasks/setState', {
                taskId: task._id,
                value: state,
            })
            const alertMessage =
                state === TaskStates.CREATED
                    ? 'Задание пересоздано'
                    : state === TaskStates.PENDING_REVIEW
                    ? 'Задание ожидает ревизии, поручитель уведомлен'
                    : 'Задание выполненно'
            MessagesService.sendMessage(alertMessage, MessagesTypes.INTASK_SYS_MESSAGE, null, task._id)
            AlertsService.addAlert({ content: alertMessage, theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async deleteTask(task: ITask) {
        try {
            await $api.delete<ITask>(`/tasks?taskId=${task._id}`)
            if (document.location.search.includes(task._id)) {
                router.replace('/tasks', null, { shallow: true })
            }
            removeNotificationByEntity<ITask>('referencedTask', task)
            AlertsService.addAlert({ content: 'Задание удалено' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }
}
