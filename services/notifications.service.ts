import { mutate } from 'swr'
import { setSeen } from '@hooks/useNotifications'
import $api from '../http'
import INotification, { NotificationsTypes } from '@models/notification'
import { AlertsService } from './alerts.service'
import router from 'next/router'
import NotificationsLsi from '@lsi/notifications/index.lsi'

export default class NotificationsService {
    static async setSeen(notification: INotification) {
        try {
            setSeen(notification)
            return await $api.patch('/notifications/setSeenStatus', {
                notificationId: notification._id,
                isSeen: true,
            })
        } catch (error) {
            if (error.response?.status == 404) return
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
                return NotificationsLsi.newFile[router.locale]
            case NotificationsTypes.NEW_TASK:
                return NotificationsLsi.newTask[router.locale]
            case NotificationsTypes.UPDATE_TASK:
                return NotificationsLsi.updateTask[router.locale]
            case NotificationsTypes.COMPLETE_TASK:
                return NotificationsLsi.completeTask[router.locale]
            case NotificationsTypes.SYSTEM:
                return NotificationsLsi.system[router.locale]
            case NotificationsTypes.CHORE_UPDATED:
                return NotificationsLsi.choreUpdated[router.locale]
            case NotificationsTypes.NEW_CHORE_MESSAGE:
            case NotificationsTypes.NEW_TASK_MESSAGE:
                return NotificationsLsi.newMessage[router.locale]
            case NotificationsTypes.NEW_CHORE:
                return NotificationsLsi.newChore[router.locale]
            default:
                return NotificationsLsi.default[router.locale]
        }
    }
}
