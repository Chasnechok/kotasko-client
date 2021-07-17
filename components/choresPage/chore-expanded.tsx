import { DesktopComputerIcon, PlusIcon } from '@heroicons/react/outline'
import IUser from '../../models/user'
import { MessagesTypes } from '../../models/message'
import Chat from '../chat'
import { useRouter } from 'next/router'

interface ChoreExpandedProps {
    choreId: string
    user: IUser
}

const ChoreExpanded: React.FC<ChoreExpandedProps> = ({ choreId, user }) => {
    const router = useRouter()

    if (!choreId) {
        return (
            <div className="hidden lg:flex flex-col items-center opacity-50 select-none mt-10">
                <span>Выберите запрос</span>
                <DesktopComputerIcon className="h-20 pt-1" />
            </div>
        )
    }

    function clearQuery() {
        if (router.query.choreId) {
            delete router.query.choreId
            router.push({ pathname: router.pathname, query: router.query }, {}, { shallow: true })
        }
    }

    return (
        <div className="bg-white shadow rounded h-full">
            <div className="px-5 pb-2 pt-6 h-full relative">
                <PlusIcon
                    onClick={clearQuery}
                    className="rotate-45 text-gray-500 hover:text-gray-600 cursor-pointer w-5 h-5 absolute top-1 right-1"
                />
                <Chat
                    className="px-1"
                    currUser={user}
                    attachments="none"
                    messageType={MessagesTypes.INCHORE_MESSAGE}
                    fetchUrl={`/messages/listForChore?choreId=${choreId}`}
                    busId={choreId}
                />
            </div>
        </div>
    )
}

export default ChoreExpanded
