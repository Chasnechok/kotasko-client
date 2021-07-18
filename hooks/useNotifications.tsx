import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { Socket, io } from 'socket.io-client'
import { API_URL } from '../http'
import INotification, { NotificationsTypes } from '../models/notification'
import { MUTATE_CHORE_LIST as mutateChores } from '../pages/chores'
import { MUTATE_FILE_LIST as mutateFiles } from '../pages/files'
import { MUTATE_TASK_LIST as mutateTasks } from '../pages/tasks'
import NotificationsService from '../services/notifications.service'
import useSWR, { mutate } from 'swr'

type SupportedEntities = 'referencedChore' | 'referencedTask' | 'referencedFile'
export function addNotification(nf: INotification, filterBy?: SupportedEntities) {
    if (filterBy) {
        return mutate(
            '/notifications',
            (nfs) => {
                if (!nfs) return [nf]
                const filtered = nfs.filter((n) => (n[filterBy] ? n[filterBy]._id !== nf[filterBy]._id : true))
                return [nf, ...filtered]
            },
            false
        )
    }
    return mutate('/notifications', (nfs) => (nfs ? [nf, ...nfs] : [nf]), false)
}
export function removeNotification(nf: INotification) {
    return mutate('/notifications', (nfs) => (nfs ? nfs.filter((n) => n._id !== nf._id) : nfs), false)
}

export function removeNotificationByEntity<T extends { _id: string }>(filterBy: SupportedEntities, entity: T) {
    return mutate(
        '/notifications',
        (nfs) => (nfs ? nfs.filter((n) => (n[filterBy] ? n[filterBy]._id !== entity._id : true)) : nfs),
        false
    )
}

export function setSeen(nf: INotification) {
    return mutate(
        '/notifications',
        (nfs: INotification[]) => {
            const r = nfs.map((n) => ({ ...n, isSeen: n._id == nf._id || n.isSeen }))
            return r
        },
        false
    )
}

export function useNotifications() {
    const { data, error } = useSWR<INotification[]>('/notifications', {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    const socket = useRef<Socket>()
    const router = useRouter()
    useEffect(() => {
        socket.current = io(API_URL + '/notifications', {
            withCredentials: true,
            transports: ['websocket'],
        })
        socket.current.emit('room')
        socket.current.io.on('reconnect', () => socket.current.emit('room'))
        socket.current.on('notification', (nf: INotification) => {
            const onFilesPage = document.location.pathname == '/files'
            const onTasksPage = document.location.pathname == '/tasks'
            const onChoresPage = document.location.pathname == '/chores'
            const taskShared = onTasksPage && document.location.search.includes('shared=true')
            const choresActive = onTasksPage && document.location.search.includes('active=true')
            switch (nf.type) {
                case NotificationsTypes.NEW_SHARED_FILE:
                    if (onFilesPage && mutateFiles) mutateFiles()
                    addNotification(nf)
                    break
                case NotificationsTypes.FILE_UNSHARED:
                    if (onFilesPage && mutateFiles) mutateFiles()
                    removeNotificationByEntity('referencedFile', nf.referencedFile)
                    socket.current.emit('list')
                    break
                case NotificationsTypes.NEW_TASK:
                    if (onTasksPage && mutateTasks) mutateTasks()
                    addNotification(nf)
                    break
                case NotificationsTypes.TASK_REMOVED:
                case NotificationsTypes.TASK_UNASSIGNED:
                    if (onTasksPage && mutateTasks) {
                        if (document.location.search.includes(nf.referencedTask?._id)) {
                            router.push(`/tasks?shared=${taskShared}`, null, { shallow: true })
                        }
                        mutateTasks()
                    }
                    removeNotificationByEntity('referencedTask', nf.referencedTask)
                    break
                case NotificationsTypes.UPDATE_TASK:
                case NotificationsTypes.COMPLETE_TASK:
                    if (onTasksPage && mutateTasks) mutateTasks()
                    if (onTasksPage && document.location.search.includes(nf.referencedTask?._id)) {
                        NotificationsService.remove(nf)
                    } else addNotification(nf, 'referencedTask')

                    break
                case NotificationsTypes.NEW_TASK_MESSAGE:
                    if (onTasksPage && document.location.search.includes(nf.referencedTask?._id)) {
                        NotificationsService.remove(nf)
                    } else addNotification(nf, 'referencedTask')
                    break
                case NotificationsTypes.NEW_CHORE:
                    if (onChoresPage && mutateChores) mutateChores()
                    addNotification(nf)
                    break
                case NotificationsTypes.CHORE_SOLVED:
                case NotificationsTypes.CHORE_UPDATED:
                    if (onChoresPage && mutateChores) mutateChores()
                    if (onChoresPage && document.location.search.includes(nf.referencedChore?._id)) {
                        NotificationsService.remove(nf)
                    } else addNotification(nf, 'referencedChore')
                    break
                case NotificationsTypes.CHORE_REMOVED:
                    if (onChoresPage && mutateChores) {
                        if (document.location.search.includes(nf.referencedChore?._id)) {
                            router.push(`/chores?active=${choresActive}`, null, { shallow: true })
                        }
                        mutateChores()
                    }
                    removeNotificationByEntity('referencedChore', nf.referencedChore)
                    break
                case NotificationsTypes.NEW_CHORE_MESSAGE:
                    if (onChoresPage && document.location.search.includes(nf.referencedChore?._id)) {
                        NotificationsService.remove(nf)
                    } else addNotification(nf, 'referencedChore')
                    break
                default:
                    console.log(nf)
            }
        })
        return () => {
            socket.current.close()
        }
    }, [])

    return {
        loading,
        data,
    }
}
