import useLocale from '@hooks/useLocale'
import GlobalLsi from '@lsi/global.lsi'
import IDepartment from '@models/department'

interface DepComponentProps {
    department: IDepartment
}

const DepComponent: React.FC<DepComponentProps> = ({ department }) => {
    const { locale } = useLocale()
    return (
        <li className="bg-gray-100 shadow-md py-2 px-2 mb-5 mx-1 rounded select-none">
            <p className="text-xs text-right leading-none truncate">
                {department.organisation ? department.organisation.name : ''}
            </p>
            <h1 className="font-medium py-2 leading-none">{department.name}</h1>
            <p className="pt-1 text-sm text-gray-500">{department.address || GlobalLsi.noAdress[locale]}</p>
        </li>
    )
}

export default DepComponent
