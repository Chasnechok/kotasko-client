import { useState, useEffect } from 'react'
import INotification, { NotificationsTypes } from '../../../models/notification'
import { ChevronUpIcon, DownloadIcon, EyeIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'
import $api from '../../../http'
import IUser from '../../../models/user'
import filesize from 'filesize'
import downloadFile from '../../../http/download-file'

interface NotificationProps {
    notification: INotification
    setNotifications: () => void
}

const Notification: React.FC<NotificationProps> = ({ notification, setNotifications }) => {
    const [isSeen, setIsSeen] = useState(notification.isSeen)
    const [opened, setOpened] = useState(false)
    useEffect(() => {
        let timer
        if (!isSeen && opened) {
            timer = setTimeout(async () => {
                setIsSeen(true)
                await $api.patch('/notifications/setSeenStatus', {
                    notificationId: notification._id,
                    isSeen: true,
                })
                await setNotifications()
            }, 1500)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [opened])

    function getNotificationLabel() {
        switch (notification.type) {
            case NotificationsTypes.NEW_SHARED_FILE:
                return 'Новый файл'
            case NotificationsTypes.NEW_TASK:
                return 'Новое задание'
            case NotificationsTypes.UPDATE_TASK:
                return 'Новая активность в задании'
            case NotificationsTypes.COMPLETE_TASK:
                return 'Задание выполненно'
            case NotificationsTypes.SYSTEM:
                return 'Системное уведомление'
        }
    }

    function formatName(user: IUser): string {
        if (!user) return 'От анонима'
        return `От: ${user.details.firstName} ${user.details.lastName}`
    }
    function formatDate(dateString: string): string {
        const d = new Date(dateString)
        return d.toLocaleString()
    }

    function sharedFileNf() {
        if (notification.type !== NotificationsTypes.NEW_SHARED_FILE) return null
        return (
            <div className="px-2 py-2 rounded-md flex items-center justify-between shadow">
                <span>
                    {notification.referencedFile.originalname}&nbsp;
                    <span className="text-xs">|&nbsp;{filesize(notification.referencedFile.size)}</span>
                </span>
                <span
                    onClick={() => downloadFile(notification.referencedFile)}
                    className="text-xs cursor-pointer hover:text-blue-600 flex items-center"
                >
                    Скачать
                    <DownloadIcon className="mx-1 h-5" />
                </span>
            </div>
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

    return (
        <li onClick={() => setOpened(!opened)} className={`rounded-md px-2 select-none transition-colors py-2`}>
            <Disclosure>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className={`flex justify-between w-full px-4 py-2 font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75
                    ${
                        isSeen
                            ? 'text-gray-900 bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-500'
                            : 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                    }`}
                        >
                            <span className="select-none text-xs md:text-sm flex items-center gap-x-1">
                                {isSeen && <EyeIcon className="h-5" />}
                                {getNotificationLabel()}
                            </span>
                            <ChevronUpIcon
                                className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ${
                                    isSeen ? 'text-gray-500' : 'text-blue-500'
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
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
            <div className="mt-2"></div>
        </li>
    )
}

export default Notification
