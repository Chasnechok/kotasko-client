import { Transition } from '@headlessui/react'
import { InformationCircleIcon, CheckCircleIcon, BanIcon } from '@heroicons/react/outline'
import { useEffect, Fragment, useState } from 'react'
import { AlertsService } from '@services/alerts.service'
import IAlert from '@models/alert.model'

interface AlertComponentProps {
    alert: IAlert
    className?: string
}

const AlertIcon: React.FC<AlertComponentProps> = ({ alert }) => {
    if (alert.theme === 'danger') return <BanIcon className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2" />
    if (alert.theme === 'success')
        return <CheckCircleIcon className="w-5 h-5 absolute left-2 top-1/2 -translate-y-1/2" />
    return <InformationCircleIcon className="w-5 h-5 text-yellow-500 absolute left-2 top-1/2 -translate-y-1/2" />
}

const AlertComponent: React.FC<AlertComponentProps> = ({ alert }) => {
    const [isShown, setIsShown] = useState(true)

    useEffect(() => {
        let t = setTimeout(() => {
            setIsShown(false)
        }, alert.closeAfterMS)
        return () => {
            if (t) clearTimeout(t)
        }
    }, [alert])

    useEffect(() => {
        if (!isShown) {
            setTimeout(removeAlert, 200)
        }
    }, [isShown])

    function removeAlert() {
        AlertsService.removeAlert(alert)
    }

    return (
        <Transition
            as={Fragment}
            appear={true}
            show={isShown}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-50 -translate-y-10"
            enterTo="opacity-100 scale-100 -translate-y-0"
            leave="transform duration-200ms transition ease-in-out"
            leaveFrom="opacity-100 scale-100 "
            leaveTo="opacity-0 scale-50"
        >
            <div
                className={`shadow-lg relative rounded py-2 pl-10 pr-2 mt-2 items-center ring-1 ${
                    alert.theme == 'danger'
                        ? 'ring-red-500 bg-red-50 text-red-900'
                        : alert.theme == 'success'
                        ? 'ring-green-500 bg-green-50 text-green-900'
                        : 'ring-yellow-500 bg-yellow-50 text-yellow-900'
                }`}
            >
                <AlertIcon alert={alert} />
                <p className="select-none text-sm first-letter:uppercase mr-1 max-h-16 overflow-y-auto">
                    {alert.content}
                </p>
            </div>
        </Transition>
    )
}

export default AlertComponent
