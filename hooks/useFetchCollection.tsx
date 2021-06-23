import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import IFile, { FileFetchResponse } from '../models/file'
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
