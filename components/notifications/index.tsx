import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Notification from './notification'
import Bell from './bell'
import { EyeIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import { useNotifications } from '../../hooks/useNotifications'
import IUser from '../../models/user'

interface NotificationsProps {
    currUser: IUser
}

const Notifications: React.FC<NotificationsProps> = ({ currUser }) => {
    const { data: notifications } = useNotifications()
    const hasNew = notifications && notifications.some((nf) => !nf.isSeen)
    const newNfs = hasNew && notifications.filter((nf) => !nf.isSeen)

    useEffect(() => {
        let interval
        let sound: HTMLAudioElement
        const title = document.title
        if (hasNew) {
            sound = new Audio('/notification.mp3')
            sound.play().catch(() => {
                console.log('Sound will be played once user interacts with the page')
            })
            document.title = `Уведомления: ${newNfs.length} | ` + title
            interval = setInterval(() => {
                sound.play().catch(() => {
                    console.log('Sound will be played once user interacts with the page')
                })
            }, 5000)
        } else {
            document.title = title
        }
        return function cleanup() {
            document.title = title
            if (interval) clearInterval(interval)
            if (sound) sound.remove()
        }
    }, [hasNew, newNfs])

    return (
        <div className="fixed md:relative pointer-events-none z-30 left-0 w-full md:w-auto">
            <Popover className="relative flex md:block justify-end">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`
                ${open ? '' : 'text-opacity-90'}
                text-white mr-20 md:mr-0 group pointer-events-auto rounded-md inline-flex items-center hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <Bell formOpened={open} hasNew={hasNew} />
                        </Popover.Button>
                        <Popover.Overlay
                            className={`${
                                open ? 'opacity-30 pointer-events-auto fixed inset-0' : 'opacity-0'
                            } bg-black`}
                        />
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 md:-translate-x-full left-1/2 sm:px-0 lg:max-w-md">
                                <div className="overflow-hidden bg-white p-5 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <h3 className="text-lg px-2 font-medium leading-6 text-gray-900 select-none">
                                        Ваши уведомления
                                    </h3>
                                    {hasNew && (
                                        <p className="px-2 flex items-center text-gray-500 pt-1 text-sm select-none gap-x-1">
                                            <EyeIcon className="h-5  " /> - прочитанные уведомления
                                        </p>
                                    )}

                                    <div className="relative pt-2 pointer-events-auto overflow-auto max-h-60">
                                        {notifications && (
                                            <ul>
                                                {notifications.map((nf) => (
                                                    <Notification currUser={currUser} key={nf._id} notification={nf} />
                                                ))}
                                            </ul>
                                        )}
                                        {(!notifications || !notifications.length) && (
                                            <div className="py-2 px-2 select-none">
                                                <p>У вас нет новых уведомлений</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

export default Notifications
