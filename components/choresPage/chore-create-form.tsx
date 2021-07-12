import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DialogModal from '../dialog-modal'
import BarLoader from 'react-spinners/BarLoader'
import ChoresService from '../../services/chores.service'
import Input from '../input'
import { MUTATE_CHORE_LIST as mutateList } from '../../pages/chores'

interface ChoreCreateFormProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

const ChoreCreateForm: React.FC<ChoreCreateFormProps> = ({ opened, setOpened }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [details, setDetails] = useState('')

    async function createChore() {
        setIsLoading(true)
        await ChoresService.createChore(details)
        if (mutateList) mutateList()
        setIsLoading(false)
        setOpened(false)
    }

    useEffect(() => {
        setDetails('')
    }, [opened])

    return (
        <DialogModal
            title="Запросить сервис"
            description="Техники вашей организации получат ваши контактные данные и помогут как только смогут"
            formOpened={opened}
            setFormOpened={setOpened}
        >
            <div className="mt-1 flex flex-col">
                <Input
                    label="Опишите проблему"
                    textArea
                    required
                    id="details"
                    value={details}
                    onChange={(value) => setDetails(value)}
                />
            </div>
            <div className="mt-4 flex justify-center sm:block">
                <button
                    type="button"
                    disabled={!details}
                    className={`transition disabled:bg-gray-100 disabled:text-gray-900 disabled:hover:bg-gray-100 disabled:cursor-default ${
                        isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                    } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                    onClick={createChore}
                >
                    {!isLoading && 'Отправить'}
                    <BarLoader css="display: block; margin: 0 auto;" loading={isLoading} color="rgba(30, 58, 138)" />
                </button>
                {!isLoading && (
                    <button
                        type="button"
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={() => setOpened(false)}
                    >
                        Отменить
                    </button>
                )}
            </div>
        </DialogModal>
    )
}

export default ChoreCreateForm
