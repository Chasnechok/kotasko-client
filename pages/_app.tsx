import 'tailwindcss/tailwind.css'
import '../global.css'
import { SWRConfig } from 'swr'
import $api from '../http/index'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { store } from '../redux.store'
import { useEffect } from 'react'
import { Workbox } from 'workbox-window'
declare global {
    interface Window {
        workbox: Workbox
    }
}
function KotaskoApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
            const wb = window.workbox
            const promptNewVersionAvailable = (event) => {
                if (confirm('Доступна новая версия приложения, загрузить?')) {
                    wb.addEventListener('controlling', (event) => {
                        window.location.reload()
                    })
                    // Send a message to the waiting service worker, instructing it to activate.
                    wb.messageSkipWaiting()
                } else {
                    console.log('Пользователь отказался загружать новую версию.')
                }
            }
            wb.addEventListener('waiting', promptNewVersionAvailable)
            wb.register()
        }
    }, [])
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
