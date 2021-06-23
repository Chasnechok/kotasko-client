import ITask from './task'
import IUser from './user'

export interface FileFetchResponse {
    owns: IFile[]
    hasAccess: IFile[]
}

export interface FileDeleteResponse {
    success: IFile[]
    failed: IFile[]
}

export default interface IFile {
    _id: string
    originalname: string
    filename: string
    mimetype: string
    size: number
    owner: IUser
    shared: IUser[]
    linkedTasks: ITask[]
    createdAt: string
    updatedAt: string
}
