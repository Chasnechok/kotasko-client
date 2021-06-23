import { Dispatch, SetStateAction, SyntheticEvent } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import useInput from '../../hooks/useInput'
import Lsi from '../../lsi/login-page.lsi'
import LsiComponent from '../../models/lsi-component'
import Logo from '../logo'
import LanguageSelector from './language-selector'

export interface LoginFormProps extends LsiComponent {
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
    isLoading: boolean
    handleLogin: (
        event: SyntheticEvent,
        login: string,
        password: string
    ) => void
    handleLanguageChange: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
    setIsDialogOpen,
    isLoading,
    handleLogin,
    language,
    handleLanguageChange,
}) => {
    const [login, setLogin] = useInput<string>('nanoid')
    const [password, setPassword] = useInput<string>('admin2')

    return (
        <form
            onSubmit={(e) => handleLogin(e, login, password)}
            className="flex flex-nowrap gap-y-6 flex-col bg-white sm:rounded-md p-10 shadow-md relative"
        >
            <Logo />
            <LanguageSelector
                language={language}
                onChange={handleLanguageChange}
                classNames="absolute right-10"
            />
            <div className="">
                <h2 className="font-medium text-xl">
                    {Lsi.greeting[language]}
                </h2>
                <h4 className="text-gray-500 text-sm">
                    {Lsi.subGreeting[language]}
                </h4>
            </div>
            <div className="relative focus-within:text-blue-600">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 pl-3 absolute top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
                <input
                    className="w-full rounded-md pl-12"
                    placeholder={Lsi.loginForm[language]}
                    disabled={isLoading}
                    type="text"
                    id="login"
                    value={login}
                    onChange={setLogin}
                />
            </div>
            <div>
                <div className="relative focus-within:text-blue-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 pl-3 absolute top-1/2 transform -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    <input
                        className="rounded-md pl-12 w-full"
                        type="password"
                        placeholder={Lsi.passwordForm[language]}
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
                    {Lsi.detailsSummary[language]}
                </span>
            </div>
            <div className="relative h-10">
                <input
                    disabled={!password || !login}
                    className={`${
                        isLoading
                            ? 'cursor-default pointer-events-none'
                            : 'cursor-pointer'
                    } w-full h-full border rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:cursor-default disabled:bg-gray-500
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    type="submit"
                    value={!isLoading ? Lsi.enter[language] : ''}
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
