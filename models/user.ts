import IDepartment from './department'

export interface IUserDetails {
    firstName: string
    lastName: string
    mobile: string
}

export enum UserRoleTypes {
    ADMIN = 'ADMIN',
    TECHNICIAN = 'TECHNICIAN',
    USER = 'USER',
    REVISOR = 'REVISOR',
}

export enum UserStatesTypes {
    CREATED = 'CREATED',
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
}

export default interface IUser {
    _id: string
    login: string
    password?: string
    roles: UserRoleTypes[]
    department: IDepartment
    details: IUserDetails
    state: string
    room?: string
    quota: number
    spaceUsed?: number
}
