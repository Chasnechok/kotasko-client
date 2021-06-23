import { Transition } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

export interface ErrorBlockProps {
    loginError: string
    setLoginError: Dispatch<SetStateAction<{ ru: string; ua: string }>>
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({
    loginError,
    setLoginError,
}) => {
    return (
        <Transition
            show={loginError ? true : false}
            appear
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
        >
            <div className="bg-red-200 transition-all relative cursor-default bg-opacity-60 sm:rounded-md shadow-md text-center text-red-500 p-2 mb-2 border border-red-500">
                <span>{loginError}</span>
                <span
                    onClick={() => setLoginError(null)}
                    className="cursor-pointer font-medium absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                    X
                </span>
            </div>
        </Transition>
    )
}

export default ErrorBlock
