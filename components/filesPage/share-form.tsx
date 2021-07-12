import UsersAccess from './users-access'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import IUser from '../../models/user'
import IFile from '../../models/file'
import DialogModal from '../dialog-modal'
import { MUTATE_FILE_LIST as mutateList } from '../../pages/files'
import FilesService from '../../services/files.service'

interface ShareFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    user: IUser
    file: IFile
}

const ShareForm: React.FC<ShareFormProps> = ({ formOpened, user, file, setFormOpened }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    function handleClose() {
        setFormOpened(false)
    }
    useEffect(() => {
        setUsersAccess(file.shared)
    }, [formOpened])

    async function handleManageAccess() {
        setIsLoading(true)
        await FilesService.shareFile(file, usersAccess)
        if (mutateList) await mutateList()
        setIsLoading(false)
        setFormOpened(false)
    }

    return (
        <DialogModal
            title={`Доступ к файлу ${file.originalname}`}
            description={
                !usersAccess.length
                    ? 'Доступ есть только у вас'
                    : `Доступ есть у вас и еще у ${usersAccess.length}
                                        ${usersAccess.length == 1 ? 'сотрудника' : 'сотрудников'}`
            }
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <div className="">
                <UsersAccess user={user} usersWithAccess={usersAccess} setUsersAccess={setUsersAccess} />
            </div>
            <div className="mt-4 flex justify-center sm:block">
                <button
                    type="button"
                    className={`transition disabled:cursor-default ${
                        isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                    } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    onClick={handleManageAccess}
                >
                    {!isLoading && 'Сохранить'}
                    <BarLoader css="display: block; margin: 0 auto;" loading={isLoading} color="rgba(30, 58, 138)" />
                </button>
                {!isLoading && (
                    <button
                        type="button"
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={handleClose}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </DialogModal>
    )
}

export default ShareForm
