import { Fragment, ReactChild, ReactElement, FC, useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import $api from '../http'
import { useRouter } from 'next/router'
import Lsi from '@lsi/layout/index.lsi'
import Logo from './logo'
import MenuIcon from './layout/meni-icon'
import BarLoader from 'react-spinners/BarLoader'
import {
    ClipboardCheckIcon,
    FolderDownloadIcon,
    CogIcon,
    LogoutIcon,
    DesktopComputerIcon,
    ChipIcon,
} from '@heroicons/react/outline'
import { useUser } from '@hooks/useFetchCollection'
import IUser, { UserRoleTypes, UserStatesTypes } from '@models/user'
import Notifications from './notifications'
import FinishReg from './layout/finish-reg'
import Head from 'next/head'
import AlertsList from './alerts/alerts-list'
import SettingsForm from './layout/settings-form'
import UsersService from '@services/users.service'
import useLocale from '@hooks/useLocale'

type Renderable = ReactChild | Renderable[]

type FC_CustomChildren<P = {}> = { [K in keyof FC<P>]: FC<P>[K] } & {
    (props: P, context?: any): ReactElement | null
}

interface LayoutProps {
    userFromSession?: IUser
    children: (user: IUser) => Renderable
}

const Layout: FC_CustomChildren<LayoutProps> = ({ children, userFromSession }) => {
    const router = useRouter()
    const currentRoute = router.route
    const { locale } = useLocale()
    const [menuOpened, setMenuOpened] = useState(false)
    const [settingsOpened, setSettingsOpened] = useState(false)
    const overlayRef = useRef<HTMLDivElement>()
    const closeMenu = useCallback(() => {
        setMenuOpened(false)
    }, [setMenuOpened])

    function handleMenu(state) {
        const overlay = overlayRef.current
        if (state && overlay) {
            overlay.addEventListener('click', closeMenu)
        }
        if (!state && overlay) {
            overlay.removeEventListener('click', closeMenu)
        }
        setMenuOpened(state)
    }
    const { user, loading, mutate: mutateCurrUser } = useUser(userFromSession)

    useEffect(() => {
        if (userFromSession._id !== user._id) mutateCurrUser()
    }, [])

    async function logout() {
        try {
            await $api.get('auth/logout')
            router.replace('/login')
        } catch (error) {
            console.log(error)
        }
    }

    function serviceAllowed(user: IUser) {
        if (!user) return false
        return user.department?.isServiceAllowed || user.roles.includes(UserRoleTypes.TECHNICIAN)
    }

    function isAdmin(user: IUser) {
        if (!user || !user.roles) return false
        return user.roles.includes(UserRoleTypes.ADMIN)
    }

    return (
        <Fragment>
            <div className="top-bar flex fixed items-center justify-between shadow-md px-10 py-3 z-20 w-full bg-white md:bg-transparent md:shadow-none">
                <Logo className="justify-center" />
                <div className="flex gap-x-4 relative items-center">
                    {loading && <BarLoader />}
                    <Notifications currUser={user} />

                    {user && <span className="cursor-default hidden md:inline">{UsersService.formatName(user)}</span>}
                </div>
                <MenuIcon menuOpened={menuOpened} handleMenu={handleMenu} />
            </div>
            <nav
                className={`bg-white max-w-2xs h-full flex-1 z-10 flex flex-nowrap flex-col fixed py-4 shadow-xl
                transition-transform transform ${
                    menuOpened ? 'translate-x-0' : '-translate-x-full'
                } md:transform-none md:relative`}
            >
                <ul className="py-12">
                    <li
                        className={`px-10 py-3 lg:transition-colors lg:duration-300 min-w-max ${
                            currentRoute === '/files' ? 'text-gray-900' : 'text-gray-400'
                        } border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4`}
                    >
                        <Link href="/files">
                            <a className="flex items-center gap-x-2">
                                <FolderDownloadIcon className="h-6 w-6" />
                                {Lsi.filesLink[locale]}
                            </a>
                        </Link>
                    </li>
                    <li
                        className={`px-10 py-3 transition-colors duration-300 min-w-max ${
                            currentRoute === '/tasks' ? 'text-gray-900' : 'text-gray-400'
                        } border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4`}
                    >
                        <Link href="/tasks">
                            <a className="flex items-center gap-x-2">
                                <ClipboardCheckIcon className="h-6 w-6" />
                                {Lsi.tasksLink[locale]}
                            </a>
                        </Link>
                    </li>
                    {serviceAllowed(user) && (
                        <li
                            className={`px-10 py-3 transition-colors duration-300 min-w-max ${
                                currentRoute === '/chores' ? 'text-gray-900' : 'text-gray-400'
                            } border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4`}
                        >
                            <Link href="/chores">
                                <a className="flex items-center gap-x-2">
                                    <DesktopComputerIcon className="h-6 w-6" />
                                    {Lsi.choresLink[locale]}
                                </a>
                            </Link>
                        </li>
                    )}
                    {isAdmin(user) && (
                        <li
                            className={`px-10 py-3 transition-colors duration-300 min-w-max ${
                                currentRoute === '/admin' ? 'text-gray-900' : 'text-gray-400'
                            } border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4`}
                        >
                            <Link href="/admin">
                                <a className="flex items-center gap-x-2">
                                    <ChipIcon className="h-6 w-6" />
                                    {Lsi.adminLink[locale]}
                                </a>
                            </Link>
                        </li>
                    )}
                </ul>
                <ul>
                    <li
                        onClick={() => setSettingsOpened(true)}
                        className="flex text-gray-400 py-3 cursor-pointer gap-x-2 px-10 border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4"
                    >
                        <CogIcon className="w-6 h-6" />
                        {Lsi.settingsLink[locale]}
                    </li>
                    <li
                        onClick={logout}
                        className="flex text-gray-400 py-3 cursor-pointer gap-x-2 px-10 border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4"
                    >
                        <LogoutIcon className="w-6 h-6" />
                        {Lsi.logout[locale]}
                    </li>
                </ul>
            </nav>

            {user && user.state == UserStatesTypes.CREATED && (
                <Fragment>
                    <Head>
                        <title>Kotasko | Регистрация</title>
                        <link rel="icon" href="/favicon.ico" />
                    </Head>
                    <FinishReg
                        mutateCurrUser={mutateCurrUser}
                        formOpened={true}
                        setFormOpened={() => null}
                        targetUser={user}
                    />
                </Fragment>
            )}

            <div ref={overlayRef} className="absolute md:hidden w-screen h-screen left-0"></div>
            <AlertsList />
            <SettingsForm currUser={user} opened={settingsOpened} setOpened={setSettingsOpened} />
            <main
                className={`md:px-7 overflow-auto relative flex-1 pt-16 filter md:filter-none  ${
                    menuOpened
                        ? 'blur-sm bg-gray-200 pointer-events-none md:pointer-events-auto md:bg-gray-100'
                        : 'bg-gray-100'
                } `}
            >
                {user && user.state === UserStatesTypes.ACTIVE && children(user)}
            </main>
        </Fragment>
    )
}

export default Layout
