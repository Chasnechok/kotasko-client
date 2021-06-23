import {
    Fragment,
    ReactChild,
    ReactElement,
    FC,
    useState,
    useRef,
    useCallback,
} from 'react'
import Link from 'next/link'
import $api from '../http'
import { useRouter } from 'next/router'
import useLsi from '../hooks/useLsi'
import LanguageSelector from '../components/layout/language-selector'
import Lsi from '../lsi/layout.lsi'
import Logo from '../components/logo'
import MenuIcon from '../components/layout/meni-icon'
import BarLoader from 'react-spinners/BarLoader'
import {
    ClipboardCheckIcon,
    FolderDownloadIcon,
    CogIcon,
    LogoutIcon,
} from '@heroicons/react/outline'
import { BellIcon } from '@heroicons/react/solid'
import { useUser } from '../hooks/useFetchCollection'
import IUser from '../models/user'

type Renderable = ReactChild | Renderable[]

type FC_NoChildren<P = {}> = { [K in keyof FC<P>]: FC<P>[K] } & {
    (props: P, context?: any): ReactElement | null
}

interface LayoutProps {
    children: (language: string, user: IUser) => Renderable
}

const Layout: FC_NoChildren<LayoutProps> = ({ children }) => {
    const Router = useRouter()
    const currentRoute = Router.route
    const [locale, setLocale] = useLsi()
    const [menuOpened, setMenuOpened] = useState(false)
    const mainRef = useRef<HTMLDivElement>()
    const closeMenu = useCallback(() => setMenuOpened(false), [setMenuOpened])
    function handleMenu(state) {
        const mainComponent = mainRef.current
        if (state && mainComponent) {
            mainComponent.addEventListener('click', closeMenu)
        }
        if (!state && mainComponent) {
            mainComponent.removeEventListener('click', closeMenu)
        }
        setMenuOpened(state)
    }
    const { user, loading } = useUser()
    async function logout() {
        try {
            await $api.get('auth/logout')
            Router.replace('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Fragment>
            <div className="top-bar flex fixed items-center justify-between shadow-md px-10 py-3 z-20 w-full bg-white md:bg-transparent md:shadow-none">
                <Logo className="justify-center" />
                <MenuIcon menuOpened={menuOpened} handleMenu={handleMenu} />
                <div className="user-info hidden md:flex gap-x-4 items-center">
                    <BellIcon className="h-8 bg-white rounded-full shadow-md p-2" />
                    {loading && <BarLoader />}
                    {user && (
                        <span className="cursor-default">
                            {user.details.firstName +
                                ' ' +
                                user.details.lastName}
                        </span>
                    )}
                </div>
            </div>
            <nav
                className={`bg-white max-w-2xs h-full flex-1 flex flex-nowrap flex-col fixed  py-4 shadow-xl z-10
                transition-transform transform ${
                    menuOpened ? 'translate-x-0' : '-translate-x-full'
                } md:transform-none md:relative`}
            >
                <ul className="py-12">
                    <li
                        className={`px-10 py-3 lg:transition-colors lg:duration-300 min-w-max ${
                            currentRoute === '/files'
                                ? 'text-gray-900'
                                : 'text-gray-400'
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
                            currentRoute === '/tasks'
                                ? 'text-gray-900'
                                : 'text-gray-400'
                        } border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4`}
                    >
                        <Link href="/tasks">
                            <a className="flex items-center gap-x-2">
                                <ClipboardCheckIcon className="h-6 w-6" />
                                {Lsi.tasksLink[locale]}
                            </a>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li className="flex text-gray-400 py-3 cursor-pointer gap-x-2 px-10 border-transparent rounded-l-sm hover:border-blue-600 hover:text-gray-900 border-l-4">
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
            {/* <div style={{ width: '9rem' }} className="mx-auto">
                        <LanguageSelector
                            language={locale}
                            setLanguage={setLocale}
                        />
                    </div> */}
            <main
                ref={mainRef}
                className={`px-7 overflow-auto relative flex-1 pt-16 filter md:filter-none ${
                    menuOpened ? 'blur-sm bg-gray-200' : 'bg-gray-100'
                }`}
            >
                {children(locale, user)}
            </main>
        </Fragment>
    )
}

export default Layout
