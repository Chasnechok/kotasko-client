import { useState, useEffect } from 'react'
import INotification, { NotificationsTypes } from '@models/notification'
import { ChevronUpIcon, DownloadIcon, EyeIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'
import IUser from '@models/user'
import filesize from 'filesize'
import downloadFile from '../../http/download-file'
import Link from 'next/link'
import NotificationsService from '@services/notifications.service'
import useLocale from '@hooks/useLocale'
import NotificationsLsi from '@lsi/notifications/index.lsi'
import UsersService from '@services/users.service'

interface NotificationProps {
    notification: INotification
    currUser: IUser
}

const Notification: React.FC<NotificationProps> = ({ notification, currUser }) => {
    const [opened, setOpened] = useState(false)
    const { locale } = useLocale()
    useEffect(() => {
        let timer
        if (!notification.isSeen && opened) {
            timer = setTimeout(async () => {
                NotificationsService.setSeen(notification)
            }, 200)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [opened, notification])

    function formatName(user: IUser): string {
        return `${NotificationsLsi.from[locale]}: ${UsersService.formatName(user)}`
    }
    function formatDate(dateString: string): string {
        const d = new Date(dateString)
        return d.toLocaleString()
    }

    function sharedFileNf() {
        if (notification.type !== NotificationsTypes.NEW_SHARED_FILE) return null
        return (
            <div className="px-2 py-2 relative rounded-md flex items-center justify-between shadow">
                <div className="w-2/3 overflow-x-auto">
                    <h1 className="text-xs md:text-sm">{notification.referencedFile.originalname}&nbsp;</h1>
                    <span className="hidden md:inline text-xs">
                        |&nbsp;{filesize(notification.referencedFile.size)}
                    </span>
                </div>
                <span
                    onClick={() => downloadFile(notification.referencedFile)}
                    className="text-xs cursor-pointer hover:text-blue-600 flex items-center"
                >
                    <span className="hidden lg:inline">{NotificationsLsi.download[locale]}</span>
                    <DownloadIcon className="mx-1 h-5" />
                </span>
            </div>
        )
    }

    function taskNf() {
        if (
            notification.type !== NotificationsTypes.NEW_TASK &&
            notification.type !== NotificationsTypes.UPDATE_TASK &&
            notification.type !== NotificationsTypes.NEW_TASK_MESSAGE
        ) {
            return null
        }
        const referencedTask = notification.referencedTask
        if (!referencedTask) return null
        return (
            <Link href={`/tasks?shared=${referencedTask.creator?._id !== currUser._id}&taskId=${referencedTask._id}`}>
                <p className="underline cursor-pointer max-w-full truncate">
                    {NotificationsLsi.task[locale]}: {referencedTask.name}
                </p>
            </Link>
        )
    }

    function systemNf() {
        if (notification.type !== NotificationsTypes.SYSTEM) return null
        return (
            <div className="px-2">
                <p className="text-gray-500 text-sm">{notification.details || 'Пустое уведомление'}</p>
            </div>
        )
    }

    function choreNf() {
        if (
            notification.type !== NotificationsTypes.CHORE_SOLVED &&
            notification.type !== NotificationsTypes.CHORE_UPDATED &&
            notification.type !== NotificationsTypes.NEW_CHORE &&
            notification.type !== NotificationsTypes.NEW_CHORE_MESSAGE
        ) {
            return null
        }
        const referencedChore = notification.referencedChore
        if (!referencedChore) return null
        return (
            <Link href={`/chores?choreId=${referencedChore._id}`}>
                <p className="underline cursor-pointer max-w-full truncate">
                    {NotificationsLsi.chore[locale]}: {referencedChore.details}
                </p>
            </Link>
        )
    }

    return (
        <li onClick={() => setOpened(!opened)} className={`rounded-md px-2 select-none transition-colors py-2`}>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={`flex justify-between w-full px-4 py-2 font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75
                    ${
                        notification.isSeen
                            ? 'text-gray-900 bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-500'
                            : 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                    }`}
                        >
                            <span className="select-none text-xs md:text-sm flex items-center gap-x-1">
                                {notification.isSeen && <EyeIcon className="h-5" />}
                                {NotificationsService.getNotificationLabel(notification)}
                            </span>
                            <ChevronUpIcon
                                className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ${
                                    notification.isSeen ? 'text-gray-500' : 'text-blue-500'
                                } `}
                            />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-4 pt-1 pb-2 text-gray-500">
                            <p className="pb-1 text-sm text-gray-500">Дата: {formatDate(notification.createdAt)}</p>
                            <p className="pb-1 text-sm text-gray-500">
                                {notification.type === NotificationsTypes.SYSTEM ? '' : formatName(notification.sender)}
                            </p>
                            {sharedFileNf()}
                            {systemNf()}
                            {taskNf()}
                            {choreNf()}
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className="mt-2"></div>
        </li>
    )
}

export default Notification
