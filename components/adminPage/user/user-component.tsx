import useLocale from '@hooks/useLocale'
import UserCreateLsi from '@lsi/admin/user-create.lsi'
import IUser, { UserStatesTypes } from '@models/user'
import UsersService from '@services/users.service'

interface UserComponentProps {
    user: IUser
    onClick: () => void
}

const UserComponent: React.FC<UserComponentProps> = ({ user, onClick }) => {
    const { locale } = useLocale()
    function userStateComponent(user: IUser) {
        switch (user.state) {
            case UserStatesTypes.ACTIVE:
                return (
                    <p className="flex justify-end items-center after:block after:h-2 after:w-2 after:rounded-full after:bg-blue-600 after:ring-1 after:ring-offset-1">
                        <span className="mr-1 text-xs">{UserCreateLsi.stateActive[locale]}</span>
                    </p>
                )
            case UserStatesTypes.CREATED:
                return (
                    <p className="flex justify-end items-center after:block after:h-2 after:w-2 after:rounded-full after:bg-yellow-600 after:ring-1 after:ring-offset-1">
                        <span className="mr-1 text-xs">{UserCreateLsi.stateCreated[locale]}</span>
                    </p>
                )
            case UserStatesTypes.ARCHIVED:
                return (
                    <p className="flex justify-end items-center after:block after:h-2 after:w-2 after:rounded-full after:bg-gray-600 after:ring-1 after:ring-offset-1">
                        <span className="mr-1 text-xs">{UserCreateLsi.stateArchived[locale]}</span>
                    </p>
                )
        }
    }

    return (
        <li
            className="bg-gray-100 cursor-pointer transition-colors bg-gradient-to-r from-white hover:to-blue-100/50 shadow py-2 px-2 mb-5 mx-1 rounded select-none hover:shadow-md"
            onClick={onClick}
        >
            {userStateComponent(user)}
            <h1 className="font-medium py-2 leading-none">{UsersService.formatName(user, locale)}</h1>
        </li>
    )
}

export default UserComponent
