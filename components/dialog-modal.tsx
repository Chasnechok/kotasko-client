import { Fragment, Dispatch, SetStateAction } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { BarLoader } from 'react-spinners'
import useLocale from '@hooks/useLocale'
import GlobalLsi from '@lsi/global.lsi'

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

interface DialogButtonsProps {
    isLoading: boolean
    onSave: () => void
    saveButtonName?: string
    cancelButtonName?: string
    onCancel: () => void
    saveDisabled?: boolean
}
export const DialogButtons: React.FC<DialogButtonsProps> = ({
    isLoading,
    onCancel,
    onSave,
    saveButtonName,
    saveDisabled,
    cancelButtonName,
}) => {
    const { locale } = useLocale()
    return (
        <div className="mt-4 flex justify-center sm:block">
            <button
                type="button"
                disabled={saveDisabled || false}
                className={`transition disabled:cursor-default disabled:text-gray-900 disabled:bg-gray-100 disabled:hover:bg-gray-100 ${
                    isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                onClick={onSave}
            >
                {!isLoading && (saveButtonName || GlobalLsi.save[locale])}
                <BarLoader css="display: block; margin: 0 auto;" loading={isLoading} color="rgba(30, 58, 138)" />
            </button>
            {!isLoading && (
                <button
                    type="button"
                    className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={onCancel}
                >
                    {cancelButtonName || GlobalLsi.cancel[locale]}
                </button>
            )}
        </div>
    )
}

export default DialogModal
