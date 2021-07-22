import { useRouter } from 'next/router'

export default function useLocale() {
    const router = useRouter()
    const locale = router.locale
    const locales = router.locales
    const setLocale = (locale: string, e?: any) => {
        if (e && e.preventDefault) e.preventDefault()
        document.cookie = 'NEXT_LOCALE= ; expires = Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'NEXT_LOCALE=' + locale + ';path=/'
        return router.replace({ pathname: router.pathname, query: router.query }, null, {
            shallow: true,
            locale,
        })
    }

    return { locale, locales, setLocale }
}
