import useLocale from '@hooks/useLocale'
import GlobalLsi from '@lsi/global.lsi'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface ButtonCountdownProps {
    countdown: number
    onFire: () => void
    label: string | JSX.Element
    triggered: boolean
    setTriggered: Dispatch<SetStateAction<boolean>>
    disabled?: boolean
    accent?: 'red' | 'blue' | 'gray' | 'yellow'
}

const ButtonCountdown: React.FC<ButtonCountdownProps> = ({
    countdown,
    onFire,
    label,
    triggered,
    setTriggered,
    disabled,
    accent,
}) => {
    useEffect(() => {
        let deleteT
        if (triggered) {
            deleteT = setTimeout(onFire, countdown)
        }
        return () => {
            if (deleteT) clearTimeout(deleteT)
            if (triggered) setTriggered(false)
        }
    }, [triggered])

    const color = accent || 'gray'
    const { locale } = useLocale()
    return (
        <button
            onClick={() => setTriggered(!triggered)}
            disabled={disabled}
            type="button"
            className={`
            disabled:cursor-default
            ${triggered ? 'bg-gray-100 hover:bg-gray-200' : `bg-${color}-100 hover:bg-${color}-200`}
            px-4 overflow-hidden relative mb-1 block w-full select-none py-2 text-sm font-medium text-${color}-900 border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-${color}-500`}
        >
            <span className={`${triggered ? 'text-red-900' : `text-${color}-900`}`}>
                {triggered ? GlobalLsi.cancel[locale] : label}
            </span>
            <div
                className={`w-full ${
                    triggered ? 'animate-delete-bar' : 'translate-x-full'
                } left-0 top-0 absolute opacity-60 h-full bg-red-300 z-0`}
            />
        </button>
    )
}

export default ButtonCountdown
