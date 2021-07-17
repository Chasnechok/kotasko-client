import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import IChore from '../../models/chore'
import IFile from '../../models/file'
import INotification from '../../models/notification'
import ITask from '../../models/task'
import type { RootState } from '../../redux.store'

// Define a type for the slice state
interface NotificationsState {
    items: INotification[]
}

// Define the initial state using that type
const initialState: NotificationsState = {
    items: [],
}

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<INotification[]>) => {
            state.items = action.payload
        },
        addNotification: (state, action: PayloadAction<INotification & Partial<{ filterBy: string }>>) => {
            if (action.payload.filterBy) {
                const f = action.payload.filterBy
                const filtered = state.items.filter((item) => item[f]?._id !== action.payload[f]?._id)
                state.items = [action.payload, ...filtered]
            } else state.items = [action.payload, ...state.items]
        },
        removeNotification: (state, action: PayloadAction<INotification>) => {
            state.items = state.items.filter((a) => a._id !== action.payload._id)
        },
        removeByChore: (state, action: PayloadAction<IChore>) => {
            state.items = state.items.filter((a) =>
                a.referencedChore ? a.referencedChore._id !== action.payload._id : true
            )
        },
        removeByTask: (state, action: PayloadAction<ITask>) => {
            state.items = state.items.filter((a) =>
                a.referencedTask ? a.referencedTask._id !== action.payload._id : true
            )
        },
        removeByFile: (state, action: PayloadAction<IFile>) => {
            state.items = state.items.filter((a) =>
                a.referencedFile ? a.referencedFile._id !== action.payload._id : true
            )
        },
        setSeen: (state, action: PayloadAction<INotification>) => {
            state.items = state.items.map((nf) => ({
                ...nf,
                isSeen: nf._id === action.payload._id || nf.isSeen,
            }))
        },
    },
})

export const {
    addNotification,
    removeNotification,
    setNotifications,
    setSeen,
    removeByChore,
    removeByTask,
    removeByFile,
} = notificationsSlice.actions

export const getNotifications = (state: RootState) => state.notifications.items

export default notificationsSlice.reducer
