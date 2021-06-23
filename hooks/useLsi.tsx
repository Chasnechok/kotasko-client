import { useRouter } from 'next/router'

export default function useLsi(): Array<any> {
    const router = useRouter()
    const locale = router.locale
    const setOppositeLsi = (e?: any) => {
        if (e && e.preventDefault) e.preventDefault()
        return router.push(router.route, null, {
            shallow: true,
            locale: locale === 'ru' ? 'ua' : 'ru',
        })
    }

    return [locale, setOppositeLsi]
}
