import 'tailwindcss/tailwind.css'
import '../global.css'
import { SWRConfig } from 'swr'
import $api from '../http/index'

function MyApp({ Component, pageProps }) {
    return (
        <SWRConfig
            value={{
                fetcher: (resource, init) =>
                    $api.get(resource, init).then((res) => res.data),
            }}
        >
            <div className="font-body h-screen flex">
                <Component {...pageProps} />
            </div>
        </SWRConfig>
    )
}

export default MyApp
