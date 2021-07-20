import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { MutatorCallback } from 'swr/dist/types'
import IOrganisation from '@models/organisation'
import DialogModal, { DialogButtons } from '@components/dialog-modal'
import Input from '@components/input'
import useLocale from '@hooks/useLocale'
import OrgCreateLsi from '@lsi/admin/org-create.lsi'
import OrganisationsService from '@services/organisations.service'

interface OrgCreateFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    updateOrgList: (
        data?: IOrganisation[] | Promise<IOrganisation[]> | MutatorCallback<IOrganisation[]>,
        shouldRevalidate?: boolean
    ) => Promise<IOrganisation[]>
}

const OrgCreateForm: React.FC<OrgCreateFormProps> = ({ formOpened, setFormOpened, updateOrgList }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [orgName, setOrgName] = useState('')
    const [orgAddress, setOrgAddress] = useState('')
    const { locale } = useLocale()

    useEffect(() => {
        return () => {
            if (orgName) setOrgName('')
            if (orgAddress) setOrgAddress('')
        }
    }, [formOpened])

    async function handleCreate() {
        setIsLoading(true)
        const created = await OrganisationsService.create(orgName, orgAddress)
        updateOrgList((orgs) => [created, ...orgs], false)
        setIsLoading(false)
        setFormOpened(false)
    }

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={!isLoading ? setFormOpened : () => null}
            title={OrgCreateLsi.title[locale]}
            description={OrgCreateLsi.description[locale]}
        >
            <form className="pl-1 pr-4 py-3">
                <div className="flex flex-col mb-3">
                    <Input
                        placeholder={OrgCreateLsi.min3PlaceHolder[locale]}
                        id="orgName"
                        label={OrgCreateLsi.orgName[locale]}
                        required
                        value={orgName}
                        onChange={(value) => setOrgName(value)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <Input
                        placeholder={OrgCreateLsi.min3PlaceHolder[locale]}
                        id="orgAddress"
                        label={OrgCreateLsi.orgAddress[locale]}
                        required
                        value={orgAddress}
                        onChange={(value) => setOrgAddress(value)}
                    />
                </div>
            </form>
            <DialogButtons
                saveButtonName={OrgCreateLsi.create[locale]}
                isLoading={isLoading}
                saveDisabled={orgName.length < 3 || orgAddress.length < 3}
                onSave={handleCreate}
                onCancel={() => setFormOpened(false)}
            />
        </DialogModal>
    )
}

export default OrgCreateForm
