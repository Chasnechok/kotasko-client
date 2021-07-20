import { SearchCircleIcon } from '@heroicons/react/outline'
import useLocale from '@hooks/useLocale'
import { Dispatch, SetStateAction, useMemo } from 'react'
import IDepartment from '@models/department'
import IOrganisation from '@models/organisation'
import IUser from '@models/user'
import GlobalLsi from '@lsi/global.lsi'

type Supported = IUser | IDepartment | IOrganisation

export enum SearchEntities {
    USERS,
    DEPARTMENTS,
    ORGANISATIONS,
}

interface SearchProps {
    setItems: Dispatch<SetStateAction<Supported[]>>
    items: Supported[]
    searchBy: SearchEntities
    className?: string
}

const Search: React.FC<SearchProps> = ({ setItems, items, className, searchBy }) => {
    const memory = useMemo(() => items, [])
    const { locale } = useLocale()
    function handleFilter(e) {
        if (!e.target.value) return setItems(memory)
        if (!memory) return
        const filtered = memory.filter((item) => {
            switch (searchBy) {
                case SearchEntities.USERS: {
                    item = item as IUser
                    if (!item.details) return false
                    const userName = item.details.firstName + item.details.lastName
                    return userName.toLowerCase().trim().includes(e.target.value.toLowerCase().trim())
                }
                case SearchEntities.ORGANISATIONS:
                case SearchEntities.DEPARTMENTS: {
                    item = item as IDepartment
                    return item.name.toLowerCase().trim().includes(e.target.value.toLowerCase().trim())
                }
            }
        })
        setItems(filtered)
    }

    return (
        <div className={`${className} group relative`}>
            <input
                onInput={handleFilter}
                className="appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                id="search"
                type="text"
                placeholder={GlobalLsi.searchStart[locale]}
            />
            <SearchCircleIcon className="h-5 text-gray-500 group-focus-within:text-blue-600 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
    )
}

export default Search
