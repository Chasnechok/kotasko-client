import IOrganisation from '../../../models/organisation'

interface OrgComponentProps {
    organisation: IOrganisation
}

const OrgComponent: React.FC<OrgComponentProps> = ({ organisation }) => {
    return (
        <li className="bg-gray-100 shadow-md py-2 px-2 mb-5 mx-1 rounded select-none">
            <h1 className="font-medium py-2 leading-none">{organisation.name}</h1>
            <p className="pt-1 text-sm text-gray-500">{organisation.address || 'Адрес не указан'}</p>
        </li>
    )
}

export default OrgComponent
