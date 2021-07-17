import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import { API_URL } from '../http'
import INotification, { NotificationsTypes } from '../models/notification'
import { MUTATE_CHORE_LIST as mutateChores } from '../pages/chores'
import { MUTATE_FILE_LIST as mutateFiles } from '../pages/files'
import { MUTATE_TASK_LIST as mutateTasks } from '../pages/tasks'
import NotificationsService from '../services/notifications.service'
import { useDispatch, useSelector } from 'react-redux'
import {
    getNotifications,
    setNotifications,
    addNotification,
    removeNotification,
} from '../components/notifications/notifications.slice'

export function useNotifications() {
    const [loading, setLoading] = useState(true)
    const notifications = useSelector(getNotifications)
    const dispatch = useDispatch()
    const socket = useRef<Socket>()
    const router = useRouter()
    useEffect(() => {
        setLoading(true)
        socket.current = io(API_URL + '/notifications', {
            withCredentials: true,
            transports: ['websocket'],
        })
        socket.current.emit('list')
        socket.current.on('list', (data) => {
            dispatch(setNotifications(data))
            setLoading(false)
        })
        socket.current.on('notification', (nf: INotification) => {
            const onFilesPage = document.location.pathname == '/files'
            const onTasksPage = document.location.pathname == '/tasks'
            const onChoresPage = document.location.pathname == '/chores'
            const taskShared = onTasksPage && document.location.search.includes('shared=true')
            const choresActive = onTasksPage && document.location.search.includes('active=true')
            switch (nf.type) {
                case NotificationsTypes.NEW_SHARED_FILE:
                    if (onFilesPage && mutateFiles) mutateFiles()
                    dispatch(addNotification(nf))
                    break
                case NotificationsTypes.FILE_UNSHARED:
                    if (onFilesPage && mutateFiles) mutateFiles()
                    socket.current.emit('list')
                    break
                case NotificationsTypes.NEW_TASK:
                    if (onTasksPage && mutateTasks) mutateTasks()
                    dispatch(addNotification(nf))
                    break
                case NotificationsTypes.TASK_REMOVED:
                case NotificationsTypes.TASK_UNASSIGNED:
                    if (onTasksPage && mutateTasks) {
                        if (document.location.search.includes(nf.referencedTask?._id)) {
                            router.push(`/tasks?shared=${taskShared}`, null, { shallow: true })
                        }
                        mutateTasks()
                    }
                    dispatch(removeNotification(nf))
                    break
                case NotificationsTypes.UPDATE_TASK:
                case NotificationsTypes.COMPLETE_TASK:
                    if (onTasksPage && mutateTasks) mutateTasks()
                    if (onTasksPage && document.location.search.includes(nf.referencedTask?._id)) {
                        NotificationsService.remove(nf)
                    } else dispatch(addNotification(Object.assign(nf, { filterBy: 'referencedTask' })))

                    break
                case NotificationsTypes.NEW_TASK_MESSAGE:
                    if (onTasksPage && document.location.search.includes(nf.referencedTask?._id)) {
                        NotificationsService.remove(nf)
                    } else dispatch(addNotification(Object.assign(nf, { filterBy: 'referencedTask' })))
                    break
                case NotificationsTypes.NEW_CHORE:
                    if (onChoresPage && mutateChores) mutateChores()
                    dispatch(addNotification(nf))
                    break
                case NotificationsTypes.CHORE_SOLVED:
                case NotificationsTypes.CHORE_UPDATED:
                    if (onChoresPage && mutateChores) mutateChores()
                    if (onChoresPage && document.location.search.includes(nf.referencedChore?._id)) {
                        NotificationsService.remove(nf)
                    } else dispatch(addNotification(Object.assign(nf, { filterBy: 'referencedChore' })))
                    break
                case NotificationsTypes.CHORE_REMOVED:
                    if (onChoresPage && mutateChores) {
                        if (document.location.search.includes(nf.referencedChore?._id)) {
                            router.push(`/chores?active=${choresActive}`, null, { shallow: true })
                        }
                        mutateChores()
                    }
                    dispatch(removeNotification(nf))
                    break
                case NotificationsTypes.NEW_CHORE_MESSAGE:
                    if (onChoresPage && document.location.search.includes(nf.referencedChore?._id)) {
                        NotificationsService.remove(nf)
                    } else dispatch(addNotification(Object.assign(nf, { filterBy: 'referencedChore' })))
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
        notifications,
    }
}
