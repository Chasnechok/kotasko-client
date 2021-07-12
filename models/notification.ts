import IChore from './chore'
import IFile from './file'
import ITask from './task'
import IUser from './user'

export enum NotificationsTypes {
    NEW_TASK,
    UPDATE_TASK,
    NEW_TASK_MESSAGE,
    COMPLETE_TASK,
    NEW_SHARED_FILE,
    SYSTEM,
    FILE_UNSHARED,
    TASK_UNASSIGNED,
    TASK_REMOVED,
    NEW_CHORE,
    NEW_CHORE_MESSAGE,
    CHORE_SOLVED,
    CHORE_REMOVED,
    CHORE_UPDATED,
}

export default interface INotification {
    _id: string
    receiver: IUser
    sender?: IUser
    isSeen: boolean
    referencedTask?: ITask
    referencedFile?: IFile
    referencedChore?: IChore
    details?: string
    type: NotificationsTypes
    createdAt: string
}
