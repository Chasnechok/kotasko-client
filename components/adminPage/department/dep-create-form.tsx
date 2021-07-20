import { Fragment, Dispatch, SetStateAction, useState, useEffect } from 'react'
import { MutatorCallback } from 'swr/dist/types'
import IDepartment from '@models/department'
import IOrganisation from '@models/organisation'
import DepartmentService from '@services/departments.service'
import DialogModal, { DialogButtons } from '@components/dialog-modal'
import Input from '@components/input'
import Search, { SearchEntities } from '@components/search'
import SwitchGroup from '@components/switch'
import useLocale from '@hooks/useLocale'
import DepCreateLsi from '@lsi/admin/dep-create.lsi'
import AdminLsi from '@lsi/admin/index.lsi'

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
    const { locale } = useLocale()

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
        updateDepList((depList) => [created, ...depList], false)
        setIsLoading(false)
        setFormOpened(false)
    }

    return (
        <DialogModal
            title={DepCreateLsi.title[locale]}
            description={DepCreateLsi.description[locale]}
            formOpened={formOpened}
            setFormOpened={!isLoading ? setFormOpened : () => null}
        >
            <form className="pl-1 pr-4 py-3">
                <div className="flex flex-col mb-3">
                    <Input
                        label={DepCreateLsi.depName[locale]}
                        required
                        id="depName"
                        value={depName}
                        onChange={(value) => setDepName(value)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <SwitchGroup
                        label={DepCreateLsi.serviceAllowed[locale]}
                        className="justify-between"
                        checked={serviceAllowed}
                        onChange={(toggled) => setServiceAllowed(toggled)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <label className="select-none" htmlFor="assignedOrg">
                        {AdminLsi.structure[locale]}
                        <sup className="text-red-500 font-bold text-md">*</sup>
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
                            label={DepCreateLsi.depAddress[locale]}
                            required
                            id="depAddress"
                            value={depAddress}
                            onChange={(value) => setDepAddress(value)}
                        />
                    </div>
                )}
            </form>
            <DialogButtons
                onSave={handleCreate}
                saveButtonName={DepCreateLsi.create[locale]}
                saveDisabled={depName.length < 3 || depAddress.length < 3 || !assignOrg}
                onCancel={() => setFormOpened(false)}
                isLoading={isLoading}
            />
        </DialogModal>
    )
}

export default DepCreateForm
