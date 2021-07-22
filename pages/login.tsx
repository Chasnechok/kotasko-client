import Head from 'next/head'
import { FC, SyntheticEvent, useState, useEffect } from 'react'
import Router from 'next/router'
import $api from '../http'
import ErrorBlock from '@components/loginPage/error-block'
import LoginDialog from '@components/loginPage/dialog'
import LoginForm from '@components/loginPage/login-form'
import Lsi from '@lsi/login/index.lsi'
import useLocale from '@hooks/useLocale'
import formatReqCookies from '../http/cookie'
import useSWR from 'swr'
import axios from 'axios'
import { withLocale } from 'HOC/withLocale'

const Login: FC = () => {
    const [loginError, setLoginError] = useState<{ ru: string; ua: string }>()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { locale } = useLocale()
    const { error } = useSWR('/auth/checkSession', { shouldRetryOnError: false })
    useEffect(() => {
        if (!error) {
            Router.replace('/files', null, { locale })
        }
    }, [error])
    async function handleLogin(e: SyntheticEvent, login: string, password: string) {
        try {
            e.preventDefault()
            setIsLoading(true)
            const delay = (ms) => new Promise((res) => setTimeout(res, ms))
            await delay(1000)
            await $api.post('/auth/login', { login, password })
            Router.replace('/files', null, { locale })
        } catch (error) {
            const code = error?.response?.status
            setLoginError(Lsi[code] || Lsi[500])
            console.log(error.response)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="h-screen bg-gray-100 text-blue-900 flex justify-center items-center w-full">
            <Head>
                <title>{Lsi.pageName[locale]}</title>
            </Head>

            <LoginDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            <div className="flex-grow max-w-md">
                <ErrorBlock loginError={loginError?.[locale]} setLoginError={setLoginError} />
                <LoginForm setIsDialogOpen={setIsDialogOpen} isLoading={isLoading} handleLogin={handleLogin} />
            </div>
        </div>
    )
}

export default Login

export const getServerSideProps = withLocale(async ({ req }) => {
    try {
        await axios.get('http://localhost:5000/auth/checkSession', {
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
})
