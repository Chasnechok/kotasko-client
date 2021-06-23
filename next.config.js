module.exports = {
    poweredByHeader: false,
    i18n: {
        locales: ['ru', 'ua'],
        defaultLocale: 'ru',
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/files',
                permanent: true,
            },
        ]
    },
}
