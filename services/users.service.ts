import { mutate } from 'swr'
import $api from '../http'
import IDepartment from '@models/department'
import IUser, { UserRoleTypes } from '@models/user'
import { AlertsService } from './alerts.service'
import Router from 'next/router'
import UserCreateLsi from '@lsi/admin/user-create.lsi'

export default class UsersService {
    static formatName(user: IUser, locale: string = 'ru') {
        if (!user || !user.details) return UserCreateLsi.userUnknown[locale]
        return user.details.firstName + ' ' + user.details.lastName
    }
    static async register(login, firstName, lastName, quota) {
        try {
            const created = await $api.post<IUser>('/auth/register', {
                login,
                details: {
                    firstName,
                    lastName,
                },
                quota,
            })

            mutate(
                '/users/findAll',
                (userList) => {
                    return [created.data, ...userList]
                },
                false
            )
            AlertsService.addAlert({ content: UserCreateLsi.onSuccess[Router.locale], theme: 'success' })
            return created.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async deleteUser(user: IUser) {
        try {
            await $api.delete('/users/delete', {
                data: {
                    userIds: [user._id],
                },
            })
            mutate(
                '/users/findAll',
                (userList) => {
                    return userList.filter((u) => u._id !== user._id)
                },
                false
            )
            AlertsService.addAlert({ content: UserCreateLsi.onDelete[Router.locale], theme: 'info' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async resetUser(user: IUser) {
        try {
            const updated = await $api.put<IUser>('/users/reset', {
                userId: user._id,
            })
            mutate(
                '/users/findAll',
                (userList) => {
                    const r = userList.map((u) => {
                        if (u._id === user._id) return updated.data
                        return u
                    })
                    return r
                },
                false
            )
            AlertsService.addAlert({
                content: UserCreateLsi.onReset[Router.locale],
                theme: 'success',
            })

            return updated.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async changeDepartment(user: IUser, departmentId: string, shouldRegister: boolean) {
        try {
            const updated = await $api.patch<IUser>(
                shouldRegister ? '/users/registerToDepartment' : '/users/clearDepartments',
                {
                    userId: user._id,
                    departmentId,
                }
            )
            mutate(
                '/users/findAll',
                (userList) => {
                    const r = userList.map((u) => {
                        if (u._id === user._id) return updated.data
                        return u
                    })
                    return r
                },
                false
            )
            AlertsService.addAlert({
                content: UserCreateLsi.onDepChange[Router.locale],
                theme: 'success',
            })

            return updated.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async updateUser(user: IUser) {
        try {
            const updated = await $api.put<IUser>('/users/update', {
                userId: user._id,
                details: user.details,
                quota: user.quota,
                roles: user.roles,
            })
            mutate(
                '/users/findAll',
                (userList) => {
                    const r = userList.map((u) => {
                        if (u._id === user._id) return updated.data
                        return u
                    })
                    return r
                },
                false
            )
            AlertsService.addAlert({
                content: UserCreateLsi.onUpdate[Router.locale],
                theme: 'success',
            })
            return updated.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async finishRegistration(password: string, department: IDepartment, room: string, mobile: string) {
        try {
            const dtoIn = { password, department: department?._id, room }
            const updated = await $api.patch<IUser>(
                '/auth/finishRegistration',
                mobile.length == 13 ? Object.assign(dtoIn, { mobile }) : dtoIn
            )
            AlertsService.addAlert({ content: UserCreateLsi.onReg[Router.locale], theme: 'success' })
            return updated.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static formatMobile(mobile: string) {
        if (!mobile || mobile.length < 13) return mobile
        const match = mobile.match(/^\+38(\d{3})(\d{3})(\d{2})(\d{2})$/)
        if (!match) return mobile
        return `+38 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`
    }

    static getRoleName(roleType: UserRoleTypes, locale: string = 'ru'): string {
        switch (roleType) {
            case UserRoleTypes.ADMIN:
                return UserCreateLsi.typeAdmin[locale]
            case UserRoleTypes.REVISOR:
                return UserCreateLsi.typeRevisor[locale]
            case UserRoleTypes.TECHNICIAN:
                return UserCreateLsi.typeTechnician[locale]
            case UserRoleTypes.USER:
                return UserCreateLsi.typeUser[locale]
        }
    }
}
