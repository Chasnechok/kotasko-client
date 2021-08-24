import Router from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import IDepartment from '@models/department'
import IOrganisation from '@models/organisation'
import IUser, { UserRoleTypes } from '@models/user'

export function useUser(initialData: IUser) {
    const { data, mutate, error } = useSWR<IUser>('/users/info', {
        initialData,
    })
    const loading = !data && !error
    checkLogin(error)

    // redirect a user from the admin page if admin role was removed from him
    useEffect(() => {
        const onAdminPage = Router.pathname.includes('admin')
        if (data && onAdminPage && !data.roles.includes(UserRoleTypes.ADMIN)) {
            Router.replace('/files')
        }
    }, [data])

    return {
        loading,
        user: data,
        mutate,
    }
}

export function useActiveUsers() {
    const { data, mutate, error } = useSWR<IUser[]>('/users/findActive', {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    checkLogin(error)

    return {
        loading,
        error,
        data,
        mutate,
    }
}

export function useOrgList() {
    const { data, mutate, error } = useSWR<IOrganisation[]>('/organisation/list', {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    checkLogin(error)
    return {
        loading,
        error,
        data,
        mutate,
    }
}

export function useDepList() {
    const { data, mutate, error } = useSWR<IDepartment[]>('/department/list', {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    checkLogin(error)
    return {
        loading,
        error,
        data,
        mutate,
    }
}

export function useAppUsers() {
    const { data, mutate, error } = useSWR<IUser[]>('/users/findAll')
    const loading = !data && !error
    checkLogin(error)
    return {
        loading,
        error,
        data,
        mutate,
    }
}

function checkLogin(error) {
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)
    useEffect(() => {
        if (loggedOut) {
            Router.replace('/login')
        }
    }, [loggedOut])
}
