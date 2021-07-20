import { Dispatch, SetStateAction, useState } from 'react'
import IUser from '@models/user'
import UsersAccess from './users-access'
import UploadFormFile from './upload-form-file'
import DialogModal, { DialogButtons } from '../dialog-modal'
import FilesService from '@services/files.service'
import fileSize from 'filesize'
import { MUTATE_FILE_LIST as mutateList } from '@pages/files'
import useLocale from '@hooks/useLocale'
import UploadFormLsi from '@lsi/files/upload-form.lsi'
import ShareFormLsi from '@lsi/files/share-form.lsi'
interface UploadFormProps {
    files: FileList
    setFiles: Dispatch<SetStateAction<FileList>>
    user: IUser
}

const UploadForm: React.FC<UploadFormProps> = ({ files, setFiles, user }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { locale } = useLocale()

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
            title={UploadFormLsi.title[locale]}
            description={
                user.quota !== -1
                    ? `${UploadFormLsi.userSpace[locale]} ${fileSize(user.spaceUsed)} ${
                          UploadFormLsi.outOf[locale]
                      } ${fileSize(user.quota)}`
                    : UploadFormLsi.userSpaceUnlimeted[locale]
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
                        ? ShareFormLsi.accessOnlyYou[locale]
                        : `${ShareFormLsi.accessMultiple[locale]} ${usersAccess.length}`}
                </p>
                <div className="">
                    <UsersAccess user={user} usersWithAccess={usersAccess} setUsersAccess={setUsersAccess} />
                </div>
            </div>
            <DialogButtons
                onCancel={() => {
                    setFiles(null)
                    setUsersAccess([])
                }}
                isLoading={isLoading}
                onSave={handleUploadFiles}
                saveDisabled={!files || isExceeded()}
                saveButtonName={UploadFormLsi.upload[locale]}
            />
        </DialogModal>
    )
}

export default UploadForm
