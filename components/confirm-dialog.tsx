import { Dispatch, SetStateAction } from 'react'
import DialogModal from './dialog-modal'

interface ComfirmDialogProps {
    title: string
    onFire: () => void
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
    description?: string
}

const ConfirmDialog: React.FC<ComfirmDialogProps> = ({ title, description, onFire, opened, setOpened }) => {
    return (
        <DialogModal formOpened={opened} setFormOpened={setOpened} description={description || ''} title={title}>
            <div className="mt-4 flex justify-center sm:block">
                <button
                    type="button"
                    className={`transition disabled:cursor-default py-2 px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    onClick={onFire}
                >
                    Подтверждаю
                </button>
                <button
                    type="button"
                    className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={() => setOpened(false)}
                >
                    Отменить
                </button>
            </div>
        </DialogModal>
    )
}

export default ConfirmDialog
