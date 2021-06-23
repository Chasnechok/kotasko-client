import IDepartment from './department'

export interface IUserDetails {
    firstName: string
    lastName: string
}

export default interface IUser {
    _id: string
    login: string
    password: string
    role: string
    departments: IDepartment[]
    details: IUserDetails
    state: string
}
