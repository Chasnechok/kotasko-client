import IUser from './user'

export enum ChoreTypes {
    VIRUS = 'VIRUS',
    PRINTER_BROKE = 'PRINTER_BROKE',
    FILES_MISSING = 'FILES_MISSING',
    OS_SLOW = 'OS_SLOW',
    OS_REINSTALL = 'OS_REINSTALL',
    CONNECTION = 'CONNECTION',
    APP_INSTALL = 'APP_INSTALL',
    APP_HELP = 'APP_HELP',
    OTHER = 'OTHER',
}

export enum ChoreStates {
    CREATED = 'CREATED',
    SOLVING = 'SOLVING',
    SOLVED = 'SOLVED',
}

export default interface IChore {
    _id: string
    details: string
    state: ChoreStates
    types?: ChoreTypes[]
    solvers?: IUser[]
    solvedAt?: Date
    creator: IUser
    createdAt: Date
}
