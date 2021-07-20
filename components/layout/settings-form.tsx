import IUser from '@models/user'
import DialogModal, { DialogButtons } from '../dialog-modal'
import { Dispatch, SetStateAction, useState } from 'react'
import LocaleSelector from './language-selector'
import useLocale from '@hooks/useLocale'
import Lsi from '@lsi/layout/settings.lsi'

interface SettingsFormProps {
    opened: boolean
    setOpened: Dispatch<SetStateAction<boolean>>
    currUser: IUser
}

const SettingsForm: React.FC<SettingsFormProps> = ({ opened, setOpened }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { locale } = useLocale()
    return (
        <DialogModal title={Lsi.label[locale]} formOpened={opened} setFormOpened={setOpened}>
            <div className="py-3">
                <h1 className="text-gray-900 mb-1 select-none">{Lsi.localeChoose[locale]}</h1>
                <LocaleSelector />
            </div>
            <DialogButtons isLoading={isLoading} onSave={() => setOpened(false)} onCancel={() => setOpened(false)} />
        </DialogModal>
    )
}

export default SettingsForm
