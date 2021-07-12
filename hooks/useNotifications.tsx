import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { API_URL } from '../http'
import INotification, { NotificationsTypes } from '../models/notification'
import { MUTATE_CHORE_LIST } from '../pages/chores'
import { MUTATE_FILE_LIST } from '../pages/files'
import { MUTATE_TASK_LIST } from '../pages/tasks'
import NotificationsService from '../services/notifications.service'

export function useNotifications() {
    const {
        data,
        mutate: setNotifications,
        error,
    } = useSWR('/notifications/list', {
        revalidateOnFocus: false,
    })
    const notifications: INotification[] = data
    const loading = !data && !error
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)
    const router = useRouter()

    useEffect(() => {
        const notificationsSource = new EventSource(API_URL + '/notifications', {
            withCredentials: true,
        })

        notificationsSource.onmessage = function (event) {
            const notification: INotification = JSON.parse(event.data)
            switch (notification.type) {
                case NotificationsTypes.FILE_UNSHARED:
                case NotificationsTypes.NEW_SHARED_FILE:
                    const onFilesPage = router.route === '/files'
                    setNotifications()
                    if (MUTATE_FILE_LIST && onFilesPage) MUTATE_FILE_LIST()
                    break
                case NotificationsTypes.NEW_TASK:
                case NotificationsTypes.UPDATE_TASK:
                    const onTasksPage = router.route === '/tasks'
                    if (onTasksPage && MUTATE_TASK_LIST) {
                        MUTATE_TASK_LIST()
                    }
                    setNotifications()
                    break
                case NotificationsTypes.NEW_TASK_MESSAGE: {
                    const onTasksPage = router.route === '/tasks'
                    if (!onTasksPage) {
                        setNotifications()
                    } else NotificationsService.remove(notification)
                }
                case NotificationsTypes.TASK_UNASSIGNED:
                case NotificationsTypes.TASK_REMOVED: {
                    const onTasksPage = router.route === '/tasks'
                    if (onTasksPage && MUTATE_TASK_LIST) {
                        MUTATE_TASK_LIST()
                    }
                    setNotifications()
                    break
                }

                case NotificationsTypes.NEW_CHORE_MESSAGE: {
                    const onChoresPage = router.route === '/chores'
                    if (!onChoresPage) {
                        setNotifications()
                    } else NotificationsService.remove(notification)
                    break
                }
                case NotificationsTypes.NEW_CHORE: {
                    const userOnPage = router.pathname === '/chores'
                    setNotifications((notifications: INotification[]) => {
                        if (!notifications) return [notification]
                        return [
                            notification,
                            ...notifications.filter((nf) =>
                                nf.referencedChore ? nf.referencedChore._id !== notification.referencedChore._id : true
                            ),
                        ]
                    }, false)
                    if (userOnPage && MUTATE_CHORE_LIST) {
                        MUTATE_CHORE_LIST()
                    }
                    break
                }
                case NotificationsTypes.CHORE_UPDATED:
                case NotificationsTypes.CHORE_SOLVED:
                case NotificationsTypes.CHORE_REMOVED: {
                    const userOnPage = router.pathname === '/chores'
                    if (userOnPage && MUTATE_CHORE_LIST) {
                        MUTATE_CHORE_LIST()
                    }
                    setNotifications()
                    break
                }
            }
        }
        if (loggedOut) {
            router.replace('/login')
        }
        return function cleanup() {
            notificationsSource.close()
        }
    }, [loggedOut])

    return {
        loading,
        error,
        notifications,
        setNotifications,
    }
}
