import { Dialog, Transition } from '@headlessui/react'
import { Fragment, Dispatch, SetStateAction, useState, useEffect } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { MutatorCallback } from 'swr/dist/types'
import $api from '../../../http'
import IOrganisation from '../../../models/organisation'
import DialogModal from '../../dialog-modal'
import Input from '../../input'

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
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [orgName, setOrgName] = useState('')
    const [orgAddress, setOrgAddress] = useState('')
    function handleClose() {
        setFormOpened(false)
    }

    useEffect(() => {
        let timer
        if (isSuccess && formOpened) {
            timer = setTimeout(() => setFormOpened(false), 1500)
        }
        return () => {
            if (timer) clearTimeout(timer)
            if (isSuccess) setIsSuccess(false)
            if (orgName) setOrgName('')
            if (orgAddress) setOrgAddress('')
            if (error) setError(null)
        }
    }, [isSuccess, formOpened])

    async function handleCreate() {
        try {
            if (error) setError(null)
            setIsLoading(true)
            const created = await $api.post<IOrganisation>('/organisation/create', {
                name: orgName,
                address: orgAddress,
            })
            updateOrgList((orgList) => {
                return [created.data, ...orgList]
            }, false)
            setIsSuccess(true)
        } catch (error) {
            console.log(error)
            setError('Произошла ошибка')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={setFormOpened}
            title="Создание структуры"
            description="Структура является высшей структурной единицей организации и состоит из департаментов"
        >
            <form className="pl-1 pr-4 py-3">
                <div className="flex flex-col mb-3">
                    <Input
                        placeholder="Минимум 3 символа"
                        id="orgName"
                        label="Название"
                        required
                        value={orgName}
                        onChange={(value) => setOrgName(value)}
                    />
                </div>
                <div className="flex flex-col mb-3">
                    <Input
                        placeholder="Минимум 3 символа"
                        id="orgAddress"
                        label="Адрес"
                        required
                        value={orgAddress}
                        onChange={(value) => setOrgAddress(value)}
                    />
                </div>
            </form>

            {error && (
                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                    {error}
                </p>
            )}
            {isSuccess && (
                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                    Организация создана
                </p>
            )}
            <div className="mt-4 flex justify-center sm:block">
                <button
                    disabled={orgName.length < 3 || orgAddress.length < 3 || isSuccess}
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

export default OrgCreateForm
