import { Dispatch, SetStateAction, useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import IUser from '../../models/user'
import UsersAccess from './users-access'
import UploadFormFile from './upload-form-file'
import DialogModal from '../dialog-modal'
import FilesService from '../../services/files.service'
import fileSize from 'filesize'
import { MUTATE_FILE_LIST as mutateList } from '../../pages/files'
interface UploadFormProps {
    files: FileList
    setFiles: Dispatch<SetStateAction<FileList>>
    user: IUser
}

const UploadForm: React.FC<UploadFormProps> = ({ files, setFiles, user }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)

    function isExceeded() {
        if (!files || !files.length) return false
        let allSize = 0
        Array.from(files).forEach((f) => (allSize += f.size))
        return allSize && allSize > user.quota - user.spaceUsed && user.quota !== -1
    }

    async function handleUploadFiles() {
        setIsLoading(true)
        await FilesService.uploadFiles(Array.from(files), usersAccess)
        if (mutateList) mutateList()
        setFiles(null)
        setUsersAccess([])
        setIsLoading(false)
    }

    return (
        <DialogModal
            title="Загрузка файлов"
            description={
                user.quota !== -1
                    ? `Ваше хранилище заполнено на ${fileSize(user.spaceUsed)} из ${fileSize(user.quota)}`
                    : 'Ваше хранилище безлимитно'
            }
            setFormOpened={() => null}
            formOpened={files && files.length ? true : false}
        >
            <ul className="py-2 px-1 max-h-64 lg:max-h-80 overflow-auto">
                {files &&
                    Array.from(files).map((file, i) => (
                        <li key={i} className="mt-2 overflow-auto">
                            <UploadFormFile file={file} canUpload={!isExceeded()} />
                        </li>
                    ))}
            </ul>
            <div className="py-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900 select-none">Доступ к файлу</h3>
                <p className="pt-1 text-sm text-gray-500 select-none">
                    {!usersAccess.length
                        ? 'Доступ будет только у вас'
                        : `Доступ будет у вас и еще у ${usersAccess.length}
                                            ${usersAccess.length == 1 ? ' человека' : 'людей'}`}
                </p>
                <div className="">
                    <UsersAccess user={user} usersWithAccess={usersAccess} setUsersAccess={setUsersAccess} />
                </div>
            </div>
            <div className="mt-4 flex justify-center sm:block">
                {files && !isExceeded() && (
                    <button
                        type="button"
                        className={`transition disabled:cursor-default ${
                            isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                        } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                        onClick={handleUploadFiles}
                    >
                        {!isLoading && 'Загрузить'}
                        <BarLoader
                            css="display: block; margin: 0 auto;"
                            loading={isLoading}
                            color="rgba(30, 58, 138)"
                        />
                    </button>
                )}
                {!isLoading && (
                    <button
                        type="button"
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={() => {
                            setFiles(null)
                            setUsersAccess([])
                        }}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </DialogModal>
    )
}

export default UploadForm
