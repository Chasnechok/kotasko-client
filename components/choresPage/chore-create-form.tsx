import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DialogModal, { DialogButtons } from '../dialog-modal'
import ChoresService from '@services/chores.service'
import Input from '../input'
import { MUTATE_CHORE_LIST as mutateList } from '@pages/chores'
import ChatLsi from '@lsi/chat/index.lsi'
import ChoreCreateLsi from '@lsi/chores/chore-create.lsi'
import useLocale from '@hooks/useLocale'

interface ChoreCreateFormProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
}

const ChoreCreateForm: React.FC<ChoreCreateFormProps> = ({ opened, setOpened }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [details, setDetails] = useState('')
    const { locale } = useLocale()

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
            title={ChoreCreateLsi.title[locale]}
            description={ChoreCreateLsi.description[locale]}
            formOpened={opened}
            setFormOpened={setOpened}
        >
            <div className="mt-1 flex flex-col">
                <Input
                    label={ChoreCreateLsi.details[locale]}
                    textArea
                    required
                    id="details"
                    value={details}
                    onChange={(value) => setDetails(value)}
                />
            </div>
            <DialogButtons
                saveDisabled={!details}
                saveButtonName={ChatLsi.send[locale]}
                onSave={createChore}
                onCancel={() => setOpened(false)}
                isLoading={isLoading}
            />
        </DialogModal>
    )
}

export default ChoreCreateForm
