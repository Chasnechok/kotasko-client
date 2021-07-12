import IChore from './chore'
import IFile from './file'
import ITask from './task'
import IUser from './user'

export enum MessagesTypes {
    INTASK_MESSAGE,
    INTASK_SYS_MESSAGE,
    PRIVATE_MESSAGE,
    INCHORE_MESSAGE,
    INCHORE_SYS_MESSAGE,
}

export class IMessage {
    _id: string
    sender: IUser
    type: MessagesTypes
    content: string
    receiver?: IUser
    referencedTask?: ITask
    referencedChore?: IChore
    attachments?: IFile[]
    createdAt: Date
}
