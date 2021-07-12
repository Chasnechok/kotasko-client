import ITask from './task'
import IUser from './user'

export interface InputAttachments {
    onServer: IFile[]
    toUpload: File[]
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
