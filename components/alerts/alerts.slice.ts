import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux.store'
import IAlert from '@models/alert.model'

// Define a type for the slice state
interface AlertsState {
    items: IAlert[]
}

// Define the initial state using that type
const initialState: AlertsState = {
    items: [],
}

export const alertsSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<IAlert>) => {
            state.items = [action.payload, ...state.items]
        },
        removeAlert: (state, action: PayloadAction<IAlert>) => {
            state.items = state.items.filter((a) => a.content !== action.payload.content)
        },
    },
})

export const { addAlert, removeAlert } = alertsSlice.actions

export const getAlerts = (state: RootState) => state.alerts.items

export default alertsSlice.reducer
