import IOrganisation from './organisation'
import IUser from './user'

export default interface IDepartment {
    _id: string
    name: string
    organisation: IOrganisation
    address: string
    isServiceAllowed: boolean
    head?: IUser
}
