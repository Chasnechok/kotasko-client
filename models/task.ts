import IUser from './user'
import IFile from './file'
export interface IMessage {
    emmiter: string

    type: string

    content: string

    attachments?: IFile[]
}
export default interface ITask {
    name: string

    details: string

    state: string

    attachments: IFile[]

    creator: IUser

    assignedTo: IUser[]

    isServiceTask: boolean

    messages: IMessage[]
}
