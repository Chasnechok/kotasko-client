import { useState, SetStateAction, Dispatch, useEffect } from 'react'
import { PuffLoader } from 'react-spinners'
import { useDepList, useOrgList } from '../../../hooks/useFetchCollection'
import IDepartment from '../../../models/department'
import IOrganisation from '../../../models/organisation'
import Disclosure from '../../disclosure'
import SwitchGroup from '../../switch'

interface UserDepsProps {
    setStructure: Dispatch<SetStateAction<IDepartment>>
    initial?: IDepartment
}

const UserStructures: React.FC<UserDepsProps> = ({ initial: selectedDep, setStructure: setSelectedDep }) => {
    const { loading: orgsLoading, data: orgs } = useOrgList()
    const { loading: depsLoading, data: deps } = useDepList()
    const [selectedOrg, setSelectedOrg] = useState<IOrganisation>(selectedDep?.organisation)

    useEffect(() => {
        if (selectedDep && selectedDep.organisation?._id !== selectedOrg._id) {
            setSelectedOrg(selectedDep?.organisation)
        }
    }, [selectedDep])

    function handleSetOrg(org: IOrganisation, shouldAdd: boolean) {
        if (shouldAdd) {
            setSelectedOrg(org)
        } else setSelectedOrg(null)
        setSelectedDep(null)
    }
    function handleSetDep(dep: IDepartment, shouldAdd: boolean) {
        if (shouldAdd) {
            setSelectedDep(dep)
        } else setSelectedDep(null)
    }

    return (
        <fieldset className="flex flex-col mb-3 border relative border-gray-900 rounded-md py-2 px-4">
            <legend className="text-gray-900 px-2 select-none">Структура и департамент</legend>
            <Disclosure label={selectedOrg ? selectedOrg.name : 'Выберите структуру'}>
                <PuffLoader loading={orgsLoading} color="rgb(37, 99, 235)" css="display: block; margin: 0 auto;" />
                <ul className="max-h-40 overflow-y-auto">
                    {orgs &&
                        orgs.map((org) => (
                            <li key={org._id}>
                                <SwitchGroup
                                    onBg
                                    className="pb-0 pt-0 justify-between px-1"
                                    label={org.name}
                                    onChange={(checked) => handleSetOrg(org, checked)}
                                    checked={selectedOrg && selectedOrg._id === org._id}
                                />
                            </li>
                        ))}
                </ul>
            </Disclosure>
            <Disclosure label={selectedDep ? selectedDep.name : 'Выберите департамент'}>
                <PuffLoader loading={depsLoading} color="rgb(37, 99, 235)" css="display: block; margin: 0 auto;" />
                {!selectedOrg && <p className="select-none text-gray-500 text-center">Сперва выберите структуру</p>}
                <ul className="max-h-40 overflow-y-auto">
                    {deps &&
                        deps
                            .filter(
                                (dep) => selectedOrg && dep.organisation && dep.organisation._id === selectedOrg._id
                            )
                            .map((dep) => (
                                <li key={dep._id}>
                                    <SwitchGroup
                                        label={dep.name}
                                        onBg
                                        className="pb-0 pt-0 justify-between px-1"
                                        onChange={(checked) => handleSetDep(dep, checked)}
                                        checked={selectedDep && selectedDep._id === dep._id}
                                    />
                                </li>
                            ))}
                </ul>
            </Disclosure>
        </fieldset>
    )
}

export default UserStructures
