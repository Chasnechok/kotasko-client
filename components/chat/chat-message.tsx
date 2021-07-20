import { PaperClipIcon } from '@heroicons/react/outline'
import UsersService from '@services/users.service'
import fileSize from 'filesize'
import { IMessage, MessagesTypes } from '@models/message'
import IUser from '@models/user'
import FilesService from '@services/files.service'

interface ChatMessageProps {
    message: IMessage
    user: IUser
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user }) => {
    const isSender = message.sender && message.sender._id === user._id
    function isSystemMessage(message: IMessage): boolean {
        return [MessagesTypes.INCHORE_SYS_MESSAGE, MessagesTypes.INTASK_SYS_MESSAGE].includes(message.type)
    }
    if (isSystemMessage(message)) {
        return (
            <p className="text-center text-sm text-gray-500 select-none whitespace-pre-line break-words my-2 mx-4">
                {message.content}
            </p>
        )
    }
    return (
        <div
            className={`bg-gradient-to-b ${
                !isSender ? 'to-blue-50 from-gray-50 text-gray-600' : ' from-blue-500 to-blue-400 text-white ml-auto'
            } my-2 shadow-md mx-4 rounded-md px-4 py-2 w-2/3 relative`}
        >
            <p className="select-none text-xs leading-none text-right">
                {new Date(message.createdAt).toLocaleString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    day: '2-digit',
                })}
            </p>
            <h1 className="overflow-x-auto text-xs sm:text-sm select-none font-medium">
                {UsersService.formatName(message.sender)}
            </h1>
            <span className="max-w-full break-words text-xs sm:text-sm whitespace-pre-line">{message.content}</span>
            {message.attachments &&
                message.attachments.map((at) => (
                    <div key={at._id} className="border-t-2 pt-2 mt-2 px-2 flex items-center justify-between">
                        <div>
                            <PaperClipIcon className="h-4 w-4 mr-2 block" />
                        </div>
                        <div className="select-none max-w-1/2 overflow-x-auto">
                            <p
                                onClick={() => FilesService.downloadFile(at)}
                                className="text-xs font-medium underline cursor-pointer"
                            >
                                {at.originalname}
                            </p>
                            <p className="text-xs text-right">{fileSize(at.size)}</p>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default ChatMessage
