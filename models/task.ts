import IUser from './user'
import IFile from './file'

export enum TaskStates {
    CREATED = 'CREATED',
    PENDING_REVIEW = 'PENDING_REVIEW',
    FINISHED = 'FINISHED',
}

export default interface ITask {
    _id: string
    name: string
    details: string
    state: TaskStates
    attachments: IFile[]
    creator: IUser
    assignedTo: IUser[]
    createdAt: Date
}
