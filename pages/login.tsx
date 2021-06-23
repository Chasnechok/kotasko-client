import Head from 'next/head'
import { FC, SyntheticEvent, useState, useEffect } from 'react'
import Router from 'next/router'
import $api from '../http'
import ErrorBlock from '../components/loginPage/error-block'
import LoginDialog from '../components/loginPage/dialog'
import LoginForm from '../components/loginPage/login-form'
import Lsi from '../lsi/login-page.lsi'
import useLsi from '../hooks/useLsi'
import formatReqCookies from '../http/cookie'
import useSWR from 'swr'

export interface LoginPageProps {
    locale: string
}

const Login: FC = () => {
    const [loginError, setLoginError] = useState<{ ru: string; ua: string }>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [locale, setLocale] = useLsi()
    const { error } = useSWR('/auth/checkSession')
    useEffect(() => {
        console.log(error)

        if (!error) {
            Router.replace('/files')
        }
    }, [error])
    async function handleLogin(
        e: SyntheticEvent,
        login: string,
        password: string
    ) {
        try {
            e.preventDefault()
            setIsLoading(true)
            const delay = (ms) => new Promise((res) => setTimeout(res, ms))
            await delay(1000)
            await $api.post('/auth/login', { login, password })
            Router.push('/files')
        } catch (error) {
            const code = error?.response?.status
            setLoginError(Lsi[code] || Lsi[500])
            console.log(error.response)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen bg-gray-100 flex justify-center items-center w-full">
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <LoginDialog
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
                language={locale}
            />
            <div className="flex-grow max-w-md">
                <ErrorBlock
                    loginError={loginError?.[locale]}
                    setLoginError={setLoginError}
                />
                <LoginForm
                    setIsDialogOpen={setIsDialogOpen}
                    isLoading={isLoading}
                    handleLogin={handleLogin}
                    language={locale}
                    handleLanguageChange={setLocale}
                />
            </div>
        </div>
    )
}

export default Login

export async function getServerSideProps({ req }) {
    try {
        await $api.get('/auth/checkSession', {
            headers: {
                Cookie: formatReqCookies(req),
            },
        })
        return {
            redirect: {
                destination: '/files',
                permanent: false,
            },
        }
    } catch (error) {
        return { props: {} }
    }
}
