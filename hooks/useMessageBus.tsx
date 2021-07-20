import { useEffect, useRef } from 'react'
import { API_URL } from '../http'
import { IMessage } from '@models/message'
import { io, Socket } from 'socket.io-client'
import useSWR from 'swr'
import Router from 'next/router'

export function useMessageBus(busId: string) {
    const { data, mutate, error } = useSWR<IMessage[]>(`/messages?entityId=${busId}`, {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)
    const socket = useRef<Socket>()

    useEffect(() => {
        socket.current = io(API_URL + '/chat', {
            withCredentials: true,
            transports: ['websocket'],
        })
        socket.current.on('connect', () => socket.current.emit('room', { entityId: busId }))
        socket.current.io.on('reconnect', () => socket.current.emit('room', { entityId: busId }))
        socket.current.on('message', (data) => {
            mutate((msgs) => [...msgs, data], false)
        })
        return () => {
            socket.current.close()
        }
    }, [busId])

    useEffect(() => {
        if (loggedOut) {
            Router.replace('/login')
        }
    }, [loggedOut])

    return { loading, data }
}
