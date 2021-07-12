import UsersAccess from '../filesPage/users-access'
import { useEffect, useState } from 'react'
import IUser from '../../models/user'
import DialogModal from '../dialog-modal'

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
    useEffect(() => {
        if (formOpened) setUsersWithAccess(executans || [])
    }, [formOpened])

    return (
        <DialogModal
            title="Исполнители задания"
            description="Вы можете изменить список сотрудников, исполняющих задание"
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <div className="">
                <UsersAccess user={currUser} usersWithAccess={usersWithAccess} setUsersAccess={setUsersWithAccess} />
            </div>
            <div className="mt-4 flex justify-center sm:block">
                <button
                    type="button"
                    className={`transition disabled:cursor-default ${'py-2 '} px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    onClick={() => onSave(usersWithAccess)}
                >
                    Сохранить
                </button>
                <button
                    type="button"
                    className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                    onClick={() => setFormOpened(false)}
                >
                    Отменить
                </button>
            </div>
        </DialogModal>
    )
}

export default ExecutansManageForm
