import 'tailwindcss/tailwind.css'
import '../global.css'
import { SWRConfig } from 'swr'
import $api from '../http/index'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../redux.store'

function KotaskoApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <SWRConfig
                value={{
                    fetcher: (resource, init) => $api.get(resource, init).then((res) => res.data),
                }}
            >
                <div className="font-body h-screen flex">
                    <Component {...pageProps} />
                </div>
            </SWRConfig>
        </Provider>
    )
}

export default KotaskoApp
