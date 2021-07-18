import { mutate } from 'swr'
import { setSeen } from '../hooks/useNotifications'
import $api from '../http'
import INotification, { NotificationsTypes } from '../models/notification'
import { AlertsService } from './alerts.service'

export default class NotificationsService {
    static async setSeen(notification: INotification) {
        try {
            setSeen(notification)
            return await $api.patch('/notifications/setSeenStatus', {
                notificationId: notification._id,
                isSeen: true,
            })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async setSeenByEntity(entityId: string) {
        mutate(
            '/notifications',
            (nfs: INotification[]) => {
                if (!nfs) return
                const r = nfs.map((nf) => {
                    if (nf.referencedChore && nf.referencedChore._id == entityId && !nf.isSeen) {
                        this.setSeen(nf)
                        return { ...nf, isSeen: true }
                    }
                    if (nf.referencedTask && nf.referencedTask._id == entityId && !nf.isSeen) {
                        this.setSeen(nf)
                        return { ...nf, isSeen: true }
                    }
                    return nf
                })
                return r
            },
            false
        )
    }

    static async remove(notification: INotification) {
        try {
            await $api.delete(`/notifications?notificationId=${notification._id}`)
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static getNotificationLabel(notification: INotification) {
        switch (notification.type) {
            case NotificationsTypes.NEW_SHARED_FILE:
                return 'Новый файл'
            case NotificationsTypes.NEW_TASK:
                return 'Новое задание'
            case NotificationsTypes.UPDATE_TASK:
                return 'Новая активность в задании'
            case NotificationsTypes.COMPLETE_TASK:
                return 'Задание выполненно'
            case NotificationsTypes.SYSTEM:
                return 'Системное уведомление'
            case NotificationsTypes.CHORE_UPDATED:
                return 'Сервисный запрос обновлен'
            case NotificationsTypes.NEW_CHORE_MESSAGE:
            case NotificationsTypes.NEW_TASK_MESSAGE:
                return 'Новое сообщение'
            case NotificationsTypes.NEW_CHORE:
                return 'Новый сервисный запрос'
            default:
                return 'Новое уведомление'
        }
    }
}
