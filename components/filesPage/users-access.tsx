import { Switch } from '@headlessui/react'
import { Fragment } from 'react'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import IUser from '../../models/user'
import Search, { SearchEntities } from '../search'
import PuffLoader from 'react-spinners/PuffLoader'
import { useActiveUsers } from '../../hooks/useFetchCollection'
import UsersService from '../../services/users.service'
import GlobalLsi from '@lsi/global.lsi'
import useLocale from '@hooks/useLocale'

interface UsersAccessProps {
    setUsersAccess: Dispatch<SetStateAction<IUser[]>>
    usersWithAccess: IUser[]
    user: IUser
    className?: string
}

const UsersAccess: React.FC<UsersAccessProps> = ({ usersWithAccess, setUsersAccess, user, className }) => {
    const { data: activeUsers, loading } = useActiveUsers()
    const [appUsers, setAppUsers] = useState<IUser[]>([])
    const { locale } = useLocale()

    useEffect(() => {
        if (!loading) {
            setAppUsers(activeUsers)
        }
    }, [loading, activeUsers])

    function manageUserAccess(user: IUser, addAccess: boolean) {
        if (addAccess) {
            setUsersAccess([...usersWithAccess, user])
        } else {
            setUsersAccess(usersWithAccess.filter((u) => u._id !== user._id))
        }
    }

    function hasAccess(user: IUser): boolean {
        return usersWithAccess.some((u) => u._id === user._id)
    }

    return !loading ? (
        <Fragment>
            <Search
                searchBy={SearchEntities.USERS}
                className="ml-1 mr-4 my-3"
                setItems={setAppUsers}
                items={activeUsers}
            />

            <div className={`relative w-full max-h-40 overflow-auto px-1 select-none ${className}`}>
                {!activeUsers && <p>В приложении нет пользователей</p>}
                {appUsers && appUsers.length ? (
                    <ul className="w-full">
                        {appUsers
                            .filter((u) => u._id !== user._id)
                            .map((user) => (
                                <li
                                    key={user._id}
                                    className={`cursor-default group my-3 ${
                                        hasAccess(user)
                                            ? 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-500'
                                    } relative py-3 px-4 rounded-md max-h-60 focus:outline-none text-sm`}
                                    value={null}
                                >
                                    <Switch.Group>
                                        <div className="flex flex-nowrap items-center justify-between">
                                            <Switch.Label className="mr-4 flex-1">
                                                <p className="font-medium">{UsersService.formatName(user)}</p>
                                                <p>{user.department ? user.department.name : ''}</p>
                                            </Switch.Label>
                                            <Switch
                                                checked={hasAccess(user)}
                                                onChange={(value) => manageUserAccess(user, value)}
                                                className={`${
                                                    hasAccess(user)
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-200 group-hover:bg-gray-400'
                                                } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                            >
                                                <span
                                                    className={`${
                                                        hasAccess(user) ? 'translate-x-6' : 'translate-x-1'
                                                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                                                />
                                            </Switch>
                                        </div>
                                    </Switch.Group>
                                </li>
                            ))}
                    </ul>
                ) : (
                    <p>{GlobalLsi.nothingFound[locale]}</p>
                )}
            </div>
        </Fragment>
    ) : (
        <PuffLoader css="display: block; margin: 2rem auto;" />
    )
}

export default UsersAccess
