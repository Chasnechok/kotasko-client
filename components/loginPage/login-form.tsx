import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction, SyntheticEvent } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import useInput from '@hooks/useInput'
import useLocale from '@hooks/useLocale'
import Lsi from '@lsi/login/index.lsi'
import Logo from '../logo'
import LanguageSelector from './language-selector'

export interface LoginFormProps {
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
    isLoading: boolean
    handleLogin: (event: SyntheticEvent, login: string, password: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ setIsDialogOpen, isLoading, handleLogin }) => {
    const [login, setLogin] = useInput('')
    const [password, setPassword] = useInput('')
    const { locale } = useLocale()

    return (
        <form
            onSubmit={(e) => handleLogin(e, login, password)}
            className="flex flex-nowrap gap-y-6 flex-col bg-white sm:rounded-md p-10 shadow-md relative"
        >
            <div className="flex justify-between items-center">
                <Logo />
                <LanguageSelector />
            </div>
            <div className="">
                <h2 className="font-medium text-xl">{Lsi.greeting[locale]}</h2>
                <h4 className="text-gray-500 text-sm">{Lsi.subGreeting[locale]}</h4>
            </div>
            <div className="relative focus-within:text-blue-600">
                <UserCircleIcon className="h-8 w-8 pl-3 absolute top-1/2 -translate-y-1/2" />
                <input
                    className="w-full rounded-md pl-12"
                    placeholder={Lsi.loginForm[locale]}
                    disabled={isLoading}
                    type="text"
                    id="login"
                    value={login}
                    onChange={setLogin}
                />
            </div>
            <div>
                <div className="relative focus-within:text-blue-600">
                    <LockClosedIcon className="h-8 w-8 pl-3 absolute top-1/2 -translate-y-1/2" />
                    <input
                        className="rounded-md pl-12 w-full"
                        type="password"
                        placeholder={Lsi.passwordForm[locale]}
                        disabled={isLoading}
                        value={password}
                        id="password"
                        onChange={setPassword}
                    />
                </div>
                <span
                    onClick={() => setIsDialogOpen(true)}
                    className="text-gray-500 inline-block mt-2 underline cursor-pointer hover:text-gray-400"
                >
                    {Lsi.detailsSummary[locale]}
                </span>
            </div>
            <div className="relative h-10">
                <input
                    disabled={!password || !login}
                    className={`${
                        isLoading ? 'cursor-default pointer-events-none' : 'cursor-pointer'
                    } w-full h-full border rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:cursor-default disabled:bg-gray-500
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    type="submit"
                    value={!isLoading ? Lsi.enter[locale] : ''}
                />
                <BarLoader
                    color="white"
                    loading={isLoading}
                    css="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                />
            </div>
        </form>
    )
}

export default LoginForm
