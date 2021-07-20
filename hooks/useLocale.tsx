import { useRouter } from 'next/router'

export default function useLocale() {
    const router = useRouter()
    const locale = router.locale
    const locales = router.locales
    const setLocale = (locale: string, e?: any) => {
        if (e && e.preventDefault) e.preventDefault()
        return router.replace(router.route, null, {
            shallow: true,
            locale,
        })
    }

    return { locale, locales, setLocale }
}
