import { SearchCircleIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction, useMemo } from 'react'
import IUser from '../../models/user'

export interface SearchUserProps {
    setAppUsers: Dispatch<SetStateAction<IUser[]>>
    appUsers: IUser[]
    className?: string
}

const SearchUser: React.FC<SearchUserProps> = ({ setAppUsers, appUsers, className }) => {
    const memory = useMemo(() => appUsers, [])
    function handleFilter(e) {
        if (!e.target.value) return setAppUsers(memory)
        const filtered = memory.filter((u) => {
            const userName = u.details.firstName + u.details.lastName
            return userName.toLowerCase().includes(e.target.value.toLowerCase().trim())
        })
        setAppUsers(filtered)
    }

    return (
        <div className={`${className} group relative`}>
            <input
                onInput={handleFilter}
                className="appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                id="search"
                type="text"
                placeholder="Имя сотрудника"
            />
            <SearchCircleIcon className="h-5 text-gray-500 group-focus-within:text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
    )
}

export default SearchUser
