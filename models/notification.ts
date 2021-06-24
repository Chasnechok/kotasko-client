import IFile from './file'
import ITask from './task'
import IUser from './user'

export enum NotificationsTypes {
    NEW_TASK,
    UPDATE_TASK,
    COMPLETE_TASK,
    NEW_SHARED_FILE,
    SYSTEM,
    FILE_UNSHARED,
}

export default interface INotification {
    _id: string
    receiver: IUser
    sender?: IUser
    isSeen: boolean
    referencedTask?: ITask
    referencedFile?: IFile
    details?: string
    type: NotificationsTypes
    createdAt: string
}
