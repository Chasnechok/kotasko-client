import IDepartment from '../../../models/department'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DialogModal from '../../dialog-modal'
import ButtonCountdown from '../../button-countdown'
import { BarLoader } from 'react-spinners'
import Input from '../../input'
import SwitchGroup from '../../switch'

interface DepEditFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    department: IDepartment
}

const DepEditForm: React.FC<DepEditFormProps> = ({ formOpened, setFormOpened, department }) => {
    const [targetDep, setTargetDep] = useState<IDepartment>(null)
    const [removeTriggered, setRemoveTriggered] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleUpdate() {
        setIsLoading(true)
        setIsLoading(false)
    }

    async function handleRemove() {}

    useEffect(() => {
        if (department && formOpened) {
            setTargetDep(department)
        }
        if (removeTriggered) setRemoveTriggered(false)
    }, [formOpened])

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={setFormOpened}
            title="Редактировать департамент"
            maxWidth="max-w-2xl"
        >
            <div className="block md:flex gap-x-6">
                <form className="py-3 flex-1">
                    <div className="flex flex-col mb-3 ">
                        <Input
                            label="Название"
                            id="name"
                            required
                            value={targetDep ? targetDep.name : ''}
                            onChange={(value) =>
                                setTargetDep((d) => ({
                                    ...d,
                                    name: value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col mb-3 ">
                        <Input
                            label="Адрес"
                            id="address"
                            required
                            value={targetDep ? targetDep.address : ''}
                            onChange={(value) =>
                                setTargetDep((d) => ({
                                    ...d,
                                    address: value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col mb-3 ">
                        <SwitchGroup
                            className="justify-between"
                            checked={targetDep && targetDep.isServiceAllowed}
                            onChange={(value) =>
                                setTargetDep((d) => ({
                                    ...d,
                                    isServiceAllowed: value,
                                }))
                            }
                            label="Квота на файлы"
                            required
                        />
                    </div>
                </form>
                <div className="flex-1 py-3">
                    <fieldset className="border rounded-md border-red-900 p-2">
                        <legend className="text-red-900 px-2 select-none">Зона невозврата</legend>
                        <ButtonCountdown
                            countdown={3500}
                            label="Сбросить пароль"
                            onFire={handleRemove}
                            triggered={removeTriggered}
                            setTriggered={setRemoveTriggered}
                            accent="red"
                        />
                    </fieldset>
                </div>
            </div>

            <div className="mt-4 flex justify-center sm:block">
                <button
                    disabled={!targetDep || targetDep.name.length < 3 || targetDep.address.length < 3}
                    type="button"
                    className={`transition  ${
                        isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                    } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                                    disabled:cursor-default disabled:text-gray-900 disabled:bg-gray-100`}
                    onClick={handleUpdate}
                >
                    {!isLoading && 'Сохранить'}
                    <BarLoader css="display: block; margin: 0 auto;" loading={isLoading} color="rgba(30, 58, 138)" />
                </button>
                {!isLoading && (
                    <button
                        type="button"
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={() => setFormOpened(false)}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </DialogModal>
    )
}

export default DepEditForm
