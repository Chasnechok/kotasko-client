import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { API_URL } from '../http'
import { IMessage } from '../models/message'

export function useMessageBus(initialUrl: string, busId: string) {
    const {
        data,
        mutate: setMessages,
        error,
    } = useSWR<IMessage[]>(initialUrl, {
        revalidateOnFocus: false,
    })
    const loading = !data && !error
    const loggedOut = error && [401, 403].includes(error.status || error.response?.status)
    const router = useRouter()

    useEffect(() => {
        const messageBus = new EventSource(API_URL + `/messages/subscribe?busId=${busId}`, {
            withCredentials: true,
        })
        messageBus.onmessage = function (event) {
            const message: IMessage = JSON.parse(event.data)
            setMessages((msgs) => {
                if (!msgs) return [message]
                return [...msgs, message]
            }, false)
        }
        if (loggedOut) {
            router.replace('/login')
        }
        return () => messageBus.close()
    }, [loggedOut, busId])

    return {
        loading,
        error,
        data,
        setMessages,
    }
}
