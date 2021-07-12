import { configureStore } from '@reduxjs/toolkit'
import alertsSlice from './components/alerts/alerts-slice'

export const store = configureStore({
    reducer: {
        alerts: alertsSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
