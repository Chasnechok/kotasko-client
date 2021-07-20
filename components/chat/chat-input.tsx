import { PaperClipIcon } from '@heroicons/react/outline'
import useLocale from '@hooks/useLocale'
import ChatLsi from '@lsi/chat/index.lsi'
import { useState } from 'react'
import { InputAttachments } from '@models/file'
import IUser from '@models/user'
import SimpleSpinner from '../simple-spinner'
import InputAttachmentForm from './input-attachment-form'

interface ChatInputProps {
    onMessageInput?: (messageContent: string, inputAttachments: InputAttachments) => Promise<void>
    attachments: 'single' | 'none' | 'multiple'
    currUser: IUser
}

const ChatInput: React.FC<ChatInputProps> = ({ onMessageInput, attachments, currUser }) => {
    const [message, setMessage] = useState('')
    const [formOpened, setFormOpened] = useState(false)
    const [inputAttachments, setInputAttachments] = useState<InputAttachments>()
    const [loading, setLoading] = useState(false)
    const { locale } = useLocale()

    function countTextAreaRows(): number {
        const lines = message.match(/(\r\n|\r|\n)/g)
        if (!message || !lines) return 1
        return lines.length < 5 ? lines.length + 1 : 5
    }

    function countAttachments() {
        if (!inputAttachments) return 0
        return inputAttachments?.onServer.length + inputAttachments?.toUpload.length
    }

    function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.ctrlKey) {
            e.preventDefault()
            handleSendMessage()
        }
        if (e.key === 'Enter' && e.ctrlKey) {
            setMessage((m) => m + '\n')
        }
    }

    async function handleSendMessage() {
        try {
            if (!message) return
            setLoading(true)
            await onMessageInput(message, inputAttachments)
            setInputAttachments(null)
            setMessage('')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-4 mb-1 ">
            {attachments !== 'none' && (
                <InputAttachmentForm
                    currUser={currUser}
                    formOpened={formOpened}
                    setFormOpened={setFormOpened}
                    setInputAttachments={setInputAttachments}
                    initial={inputAttachments}
                    single={attachments === 'single' ? true : false}
                />
            )}
            <div className="flex flex-wrap items-center">
                {attachments !== 'none' && (
                    <button
                        onClick={() => setFormOpened(true)}
                        className="relative mr-2 group rounded-md focus:ring-0 focus:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
                    >
                        <span className="absolute text-xs pointer-events-none -top-2 -right-1">
                            {countAttachments() || ''}
                        </span>
                        <PaperClipIcon className="h-5 text-gray-600 hover:text-blue-600 group-focus:text-blue-600" />
                    </button>
                )}
                <div className="relative flex-1 flex items-center">
                    <textarea
                        className="resize-none border-gray-200 w-full focus:border-gray-200 bg-gray-50 border-1 shadow-inner rounded-md text-xs sm:text-sm focus:outline-none focus:ring-0 focus:text-gray-700 text-gray-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
                        placeholder={ChatLsi.placeholder[locale]}
                        rows={countTextAreaRows()}
                        role="textbox"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleEnter}
                        readOnly={loading}
                    />
                    <SimpleSpinner
                        loading={loading}
                        className="absolute text-gray-400 w-3 h-3 top-1/2 -translate-y-1/2 right-2 z-10"
                    />
                </div>
                <button
                    disabled={!message || loading}
                    onClick={handleSendMessage}
                    className="disabled:bg-gray-500 disabled:hover:bg-gray-500 disabled:cursor-default text-xs sm:text-sm disabled:focus-visible:ring-0 flex ml-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
                >
                    <span className="text-white">{ChatLsi.send[locale]}</span>
                </button>
            </div>
            <span className="text-gray-500 text-xs select-none leading-none">{ChatLsi.sendTip[locale]}</span>
        </div>
    )
}

export default ChatInput
