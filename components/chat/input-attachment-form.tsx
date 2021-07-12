import { Dispatch, SetStateAction } from 'react'
import { InputAttachments } from '../../models/file'
import IUser from '../../models/user'
import AttachFiles from '../attach-files'
import DialogModal from '../dialog-modal'

interface InputAttachmentFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    setInputAttachments: Dispatch<SetStateAction<InputAttachments>>
    single?: boolean
    initial: InputAttachments
    currUser: IUser
}

const InputAttachmentForm: React.FC<InputAttachmentFormProps> = ({
    formOpened,
    setFormOpened,
    setInputAttachments,
    single,
    initial,
    currUser,
}) => {
    return (
        <DialogModal
            title="Добавить вложение"
            description={`Вы можете прикрепить ${single ? 'файл' : 'файлы'}`}
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <AttachFiles
                userFromSession={currUser}
                single
                initial={initial}
                setInputAttachments={setInputAttachments}
            />
            <div className="mt-4 flex justify-center sm:block">
                <button
                    type="button"
                    className={`transition disabled:cursor-default py-2 px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    onClick={() => setFormOpened(false)}
                >
                    Прикрепить
                </button>
            </div>
        </DialogModal>
    )
}

export default InputAttachmentForm
