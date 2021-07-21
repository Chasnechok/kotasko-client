const withPWA = require('next-pwa')
module.exports = withPWA({
    poweredByHeader: false,
    pwa: {
        dest: 'public',
        register: false,
        dynamicStartUrlRedirect: '/files',
        runtimeCaching: [
            {
                urlPattern: /.*/i,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'others',
                    expiration: {
                        maxEntries: 16,
                        maxAgeSeconds: 24 * 60 * 60,
                    },
                },
            },
        ],
    },
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
})
