import { Fragment, Dispatch, SetStateAction } from 'react'
import { Transition, Dialog } from '@headlessui/react'

interface DialogProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    title: string | JSX.Element
    description?: string | JSX.Element
    maxWidth?: 'max-w-md' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl'
}

const DialogModal: React.FC<DialogProps> = ({
    children,
    formOpened,
    setFormOpened,
    title,
    description,
    maxWidth = 'max-w-md',
}) => {
    function handleClose() {
        setFormOpened(false)
    }

    return (
        <Transition appear show={formOpened} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={handleClose}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child as={Fragment}>
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            className={`inline-block text-gray-900 w-full ${maxWidth} p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl`}
                        >
                            <Dialog.Title as="h3" className="text-md md:text-lg font-medium leading-6 select-none">
                                {title}
                            </Dialog.Title>
                            <Dialog.Description className="pt-1 select-none text-sm text-gray-500">
                                {description}
                            </Dialog.Description>
                            {children}
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default DialogModal
