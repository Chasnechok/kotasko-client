import Router from 'next/router'
import { useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { API_URL } from '../http'
import { FileFetchResponse } from '../models/file'
import INotification, { NotificationsTypes } from '../models/notification'
import IUser from '../models/user'

export function useUser() {
    const { data, mutate, error } = useSWR('/users/info')
    const user: IUser = data
    const loading = !data && !error
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)

    useEffect(() => {
        if (loggedOut) {
            Router.replace('/login')
        }
    }, [loggedOut])

    return {
        loading,
        loggedOut,
        user,
        mutate,
    }
}

export function useFiles() {
    const { data, mutate, error } = useSWR('/files/listForUser', {
        revalidateOnFocus: false,
    })
    const files: FileFetchResponse = data
    const loading = !data && !error
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)
    useEffect(() => {
        if (loggedOut) {
            Router.replace('/login')
        }
    }, [loggedOut])

    return {
        loading,
        loggedOut,
        files,
        mutate,
    }
}

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

    useEffect(() => {
        const notificationsSource = new EventSource(API_URL + '/notifications', {
            withCredentials: true,
        })
        notificationsSource.onmessage = function (event) {
            const notification: INotification = JSON.parse(event.data)
            switch (notification.type) {
                case NotificationsTypes.FILE_UNSHARED:
                    setNotifications((notifications: INotification[]) => {
                        return notifications.filter((nf) => {
                            if (nf.type !== NotificationsTypes.NEW_SHARED_FILE) return nf
                            return nf.referencedFile._id !== notification.referencedFile._id
                        })
                    }, false)
                    mutate(
                        '/files/listForUser',
                        (files: FileFetchResponse) => {
                            return {
                                owns: files.owns,
                                hasAccess: files.hasAccess.filter((f) => f._id !== notification.referencedFile._id),
                            }
                        },
                        false
                    )
                    break
                case NotificationsTypes.NEW_SHARED_FILE:
                    // add a notification & update users files without refetching
                    setNotifications((notifications: INotification[]) => {
                        return [notification, ...notifications]
                    }, false)
                    mutate(
                        '/files/listForUser',
                        (files: FileFetchResponse) => {
                            return {
                                owns: files.owns,
                                hasAccess: [notification.referencedFile, ...files.hasAccess],
                            }
                        },
                        false
                    )
                    break
                default:
                    setNotifications((notifications: INotification[]) => {
                        return [notification, ...notifications]
                    }, false)
            }
        }
        if (loggedOut) {
            Router.replace('/login')
        }
        return function cleanup() {
            notificationsSource.close()
        }
    }, [loggedOut])

    return {
        loading,
        loggedOut,
        notifications,
        setNotifications,
    }
}
