import IOrganisation from './organisation'
import IUser from './user'

export default interface IDepartment {
    name: string
    organisation: IOrganisation
    head: IUser
}
