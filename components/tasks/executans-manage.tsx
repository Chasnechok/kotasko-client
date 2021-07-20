import UsersAccess from '../filesPage/users-access'
import { useEffect, useState } from 'react'
import IUser from '@models/user'
import DialogModal, { DialogButtons } from '../dialog-modal'
import useLocale from '@hooks/useLocale'
import ExecutansManageLsi from '@lsi/tasks/executans-manage.lsi'

interface ExecutansManageFormProps {
    formOpened: boolean
    setFormOpened: React.Dispatch<React.SetStateAction<boolean>>
    executans: IUser[]
    onSave: (executans: IUser[]) => Promise<void>
    currUser: IUser
}

const ExecutansManageForm: React.FC<ExecutansManageFormProps> = ({
    formOpened,
    setFormOpened,
    executans,
    onSave,
    currUser,
}) => {
    const [usersWithAccess, setUsersWithAccess] = useState<IUser[]>()
    const { locale } = useLocale()
    useEffect(() => {
        if (formOpened) setUsersWithAccess(executans || [])
    }, [formOpened])

    return (
        <DialogModal
            title={ExecutansManageLsi.title[locale]}
            description={ExecutansManageLsi.description[locale]}
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <div className="">
                <UsersAccess user={currUser} usersWithAccess={usersWithAccess} setUsersAccess={setUsersWithAccess} />
            </div>
            <DialogButtons
                isLoading={false}
                onSave={() => onSave(usersWithAccess)}
                onCancel={() => setFormOpened(false)}
            />
        </DialogModal>
    )
}

export default ExecutansManageForm
