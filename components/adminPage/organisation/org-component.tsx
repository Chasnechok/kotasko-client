import useLocale from '@hooks/useLocale'
import GlobalLsi from '@lsi/global.lsi'
import IOrganisation from '@models/organisation'

interface OrgComponentProps {
    organisation: IOrganisation
}

const OrgComponent: React.FC<OrgComponentProps> = ({ organisation }) => {
    const { locale } = useLocale()
    return (
        <li className="bg-gray-100 shadow-md py-2 px-2 mb-5 mx-1 rounded select-none">
            <h1 className="font-medium py-2 leading-none">{organisation.name}</h1>
            <p className="pt-1 text-sm text-gray-500">{organisation.address || GlobalLsi.noAdress[locale]}</p>
        </li>
    )
}

export default OrgComponent
