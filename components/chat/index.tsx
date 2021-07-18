import { useEffect, useRef } from 'react'
import { PuffLoader } from 'react-spinners'
import IUser from '../../models/user'
import ChatMessage from './chat-message'
import ChatInput from './chat-input'
import { MessagesTypes } from '../../models/message'
import { useMessageBus } from '../../hooks/useMessageBus'
import { InputAttachments } from '../../models/file'
import MessagesService from '../../services/messages.service'
import NotificationsService from '../../services/notifications.service'

interface ChatProps {
    currUser: IUser
    messageType: MessagesTypes
    attachments: 'single' | 'none' | 'multiple'
    // entity id, ex: message.id
    busId: string
    className?: string
}

const Chat: React.FC<ChatProps> = ({ busId, currUser, attachments, className, messageType }) => {
    const listRef = useRef<HTMLDivElement>()
    const { data: messages, loading } = useMessageBus(busId)

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTo(0, listRef.current.scrollHeight)
        }
    }, [messages, loading])

    useEffect(() => {
        if (busId) {
            NotificationsService.setSeenByEntity(busId)
        }
    }, [busId])

    async function onMessageInput(messageContent: string, attachments: InputAttachments) {
        await MessagesService.sendMessage(messageContent, messageType, attachments, busId)
    }

    return (
        <div className={`h-full flex flex-col rounded-md overflow-hidden ${className}`}>
            <div
                ref={listRef}
                className="bg-gray-100 flex-1 flex py-4 h-full overflow-y-scroll rounded-md flex-col justify-end shadow-inner "
                id="chat"
            >
                {loading && <PuffLoader css="display: block; margin: 0 auto;" />}
                {!loading && !messages?.length && (
                    <span className="text-gray-500 select-none self-center">Сообщений пока нет</span>
                )}
                {!loading && messages && (
                    <ul className={`${messages.length ? 'h-full' : ''}`}>
                        {messages.map((ms) => (
                            <li key={ms._id} className="pb-2">
                                <ChatMessage user={currUser} message={ms} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <ChatInput currUser={currUser} attachments={attachments} onMessageInput={onMessageInput} />
        </div>
    )
}

export default Chat
