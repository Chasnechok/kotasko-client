import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="application-name" content="Kotasko" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                    <meta name="apple-mobile-web-app-title" content="Kotasko" />
                    <meta name="description" content="Kotasko WebApp" />
                    <meta name="format-detection" content="telephone=no" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="msapplication-config" content="/browserconfig.xml" />
                    <meta name="msapplication-TileColor" content="#FFFFFF" />
                    <meta name="msapplication-tap-highlight" content="no" />
                    <meta name="theme-color" content="#000000" />
                    <meta name="google" content="notranslate" />
                    <meta name="apple-mobile-web-app-capable" content="yes"></meta>
                    <meta name="apple-mobile-web-app-status-bar-style" content="white"></meta>
                    <link rel="apple-touch-icon" href="/icons/logos/logo-80.png" />
                    <link rel="apple-touch-icon" sizes="152x152" href="/icons/logos/logo-152.png" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/logos/logo-180.png" />
                    <link rel="apple-touch-icon" sizes="167x167" href="/icons/logos/logo-167.png" />
                    <link href="/apple_splash_750.png" sizes="750x1334" rel="apple-touch-startup-image" />
                    <link href="/apple_splash_640.png" sizes="640x1136" rel="apple-touch-startup-image" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.ico" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.ico" />
                    <link rel="manifest" href="/manifest.json" />
                    <link rel="mask-icon" href="/icons/logo-truck.svg" color="#000000" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
