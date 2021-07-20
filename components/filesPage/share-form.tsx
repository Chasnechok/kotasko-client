import UsersAccess from './users-access'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import IUser from '@models/user'
import IFile from '@models/file'
import DialogModal, { DialogButtons } from '../dialog-modal'
import { MUTATE_FILE_LIST as mutateList } from '@pages/files'
import FilesService from '@services/files.service'
import useLocale from '@hooks/useLocale'
import ShareFormLsi from '@lsi/files/share-form.lsi'

interface ShareFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    user: IUser
    file: IFile
}

const ShareForm: React.FC<ShareFormProps> = ({ formOpened, user, file, setFormOpened }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { locale } = useLocale()
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
            title={`${ShareFormLsi.fileAccess[locale]} ${file.originalname}`}
            description={
                !usersAccess.length
                    ? ShareFormLsi.accessOnlyYou[locale]
                    : `${ShareFormLsi.accessMultiple[locale]} ${usersAccess.length}`
            }
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <div className="">
                <UsersAccess user={user} usersWithAccess={usersAccess} setUsersAccess={setUsersAccess} />
            </div>
            <DialogButtons isLoading={isLoading} onCancel={handleClose} onSave={handleManageAccess} />
        </DialogModal>
    )
}

export default ShareForm
