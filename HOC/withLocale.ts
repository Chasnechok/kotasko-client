import { GetServerSideProps, GetServerSidePropsContext } from 'next'
export function withLocale(ssp: GetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        const { req, locale, resolvedUrl, locales, defaultLocale } = context
        const userLocale = req.cookies && req.cookies['NEXT_LOCALE']
        if (userLocale && locales.includes(userLocale) && userLocale !== locale) {
            if (userLocale === defaultLocale) {
                return {
                    redirect: { destination: resolvedUrl, permanent: true },
                }
            }
            return {
                redirect: { destination: `/${userLocale}${resolvedUrl}`, permanent: true },
            }
        }
        return await ssp(context)
    }
}
