import { Fragment, Dispatch, SetStateAction, useState, useEffect } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { MutatorCallback } from 'swr/dist/types'
import $api from '../../../http'
import IDepartment from '../../../models/department'
import IOrganisation from '../../../models/organisation'
import DepartmentService from '../../../services/departments.service'
import DialogModal from '../../dialog-modal'
import Input from '../../input'
import Search, { SearchEntities } from '../../search'
import SwitchGroup from '../../switch'

interface DepCreateFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    organisations: IOrganisation[]
    updateDepList: (
        data?: IDepartment[] | Promise<IDepartment[]> | MutatorCallback<IDepartment[]>,
        shouldRevalidate?: boolean
    ) => Promise<IDepartment[]>
}

const DepCreateForm: React.FC<DepCreateFormProps> = ({ formOpened, setFormOpened, updateDepList, organisations }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [depName, setDepName] = useState('')
    const [depAddress, setDepAddress] = useState('')
    const [assignedOrg, setAssignedOrg] = useState<IOrganisation>(null)
    const [orgList, setOrgList] = useState<IOrganisation[]>(organisations)
    const [serviceAllowed, setServiceAllowed] = useState(true)

    function handleClose() {
        setFormOpened(false)
    }

    function assignOrg(assign: boolean, org: IOrganisation) {
        if (assign) {
            setAssignedOrg(org)
            if (org.address) {
                setDepAddress(org.address)
            }
        } else {
            setAssignedOrg(null)
            setDepAddress('')
        }
    }

    useEffect(() => {
        setOrgList(organisations)
    }, [organisations])

    useEffect(() => {
        return () => {
            setDepName('')
            setAssignedOrg(null)
            setDepAddress('')
            setServiceAllowed(true)
        }
    }, [formOpened])

    async function handleCreate() {
        setIsLoading(true)
        const created = await DepartmentService.create(depName, depAddress, serviceAllowed, assignedOrg)
        updateDepList((depList) => {
            return [created, ...depList]
        }, false)
        setIsLoading(false)
        setFormOpened(false)
    }

    return (
        <DialogModal
            title="Создание департамента"
            description="Департамент входит в Структуру и состоит из пользователей"
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            <form className="pl-1 pr-4 py-3">
                <div className="flex flex-col mb-3">
                    <Input
                        label="Название"
                        required
                        id="depName"
                        value={depName}
                        onChange={(value) => setDepName(value)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <SwitchGroup
                        label="Сервис разрешен"
                        className="justify-between"
                        checked={serviceAllowed}
                        onChange={(toggled) => setServiceAllowed(toggled)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label className="select-none" htmlFor="assignedOrg">
                        Организация<sup className="text-red-500 font-bold text-md">*</sup>
                    </label>
                </div>
                <Fragment>
                    {organisations && organisations.length && (
                        <Search
                            className="mb-3"
                            searchBy={SearchEntities.ORGANISATIONS}
                            setItems={setOrgList}
                            items={organisations}
                        />
                    )}
                    <div className={`relative w-full max-h-40 overflow-auto px-1 select-none`}>
                        <ul className="w-full">
                            {orgList &&
                                orgList.map((org) => (
                                    <li key={org._id}>
                                        <SwitchGroup
                                            label={org.name}
                                            onBg
                                            className="pb-0 pt-0 justify-between"
                                            checked={assignedOrg && assignedOrg._id === org._id}
                                            onChange={(value) => assignOrg(value, org)}
                                        />
                                    </li>
                                ))}
                        </ul>
                    </div>
                </Fragment>
                {assignedOrg && (
                    <div className="flex flex-col mb-3">
                        <Input
                            label="Адрес"
                            required
                            id="depAddress"
                            value={depAddress}
                            onChange={(value) => setDepAddress(value)}
                        />
                    </div>
                )}
            </form>

            <div className="mt-4 flex justify-center sm:block">
                <button
                    disabled={depName.length < 3 || depAddress.length < 3 || !assignOrg}
                    type="button"
                    className={`transition  ${
                        isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                    } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                                    disabled:cursor-default disabled:text-gray-900 disabled:bg-gray-100`}
                    onClick={handleCreate}
                >
                    {!isLoading && 'Cоздать'}
                    <BarLoader css="display: block; margin: 0 auto;" loading={isLoading} color="rgba(30, 58, 138)" />
                </button>
                {!isLoading && (
                    <button
                        type="button"
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={handleClose}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </DialogModal>
    )
}

export default DepCreateForm
