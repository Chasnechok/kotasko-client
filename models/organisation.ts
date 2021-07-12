import IUser from './user'

export default interface IOrganisation {
    _id: string
    name: string
    address: string
    head?: IUser
}
