import { BellIcon } from '@heroicons/react/solid'

interface BellProps {
    hasNew: boolean
    formOpened: boolean
}

const Bell: React.FC<BellProps> = ({ hasNew, formOpened }) => {
    return (
        <div className="bg-white rounded-full cursor-pointer md:shadow-md p-2">
            <BellIcon
                className={`${hasNew ? ' text-blue-500 hover:text-blue-600 ' : 'text-gray-500 hover:text-gray-600'} ${
                    !formOpened && hasNew ? 'animate-pulse' : ''
                } h-5`}
            />
        </div>
    )
}

export default Bell
