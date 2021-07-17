import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../http'
import { IMessage } from '../models/message'
import { io, Socket } from 'socket.io-client'

export function useMessageBus(busId: string) {
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState<IMessage[]>()
    const socket = useRef<Socket>()

    useEffect(() => {
        setLoading(true)
        setMessages([])
        socket.current = io(API_URL + '/chat', {
            withCredentials: true,
            transports: ['websocket'],
        })
        socket.current.emit('list', { entityId: busId })
        socket.current.on('list', (data) => {
            setMessages(data)
            setLoading(false)
        })
        socket.current.on('message', (data) => {
            setMessages((msgs) => [...msgs, data])
        })
        return () => {
            socket.current.close()
        }
    }, [busId])

    return { loading, messages }
}
