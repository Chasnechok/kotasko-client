import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import $api from '../../http'
import IUser from '@models/user'
import DialogModal, { DialogButtons } from '../dialog-modal'
import Input from '../input'
import { MutatorCallback } from 'swr/dist/types'
import UserStructures from '../adminPage/user/user-structure-select'
import UsersService from '@services/users.service'
import FinishRegLsi from '@lsi/layout/finish-reg.lsi'

interface FinishRegProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    targetUser: IUser
    mutateCurrUser: (
        data?: IUser | Promise<IUser> | MutatorCallback<IUser>,
        shouldRevalidate?: boolean
    ) => Promise<IUser>
}

const FinishReg: React.FC<FinishRegProps> = ({ formOpened, setFormOpened, targetUser, mutateCurrUser }) => {
    const [password, setPassword] = useState('')
    const [room, setRoom] = useState(targetUser.room || '')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const locale = router.locale
    const [passwordWarning, setPasswordWarning] = useState('')
    const [selectedDep, setSelectedDep] = useState(targetUser.department)
    const [mobile, setMobile] = useState('+380')

    function handleSetMobile(value: string) {
        if (value.length < 4 || value.length == 14) return
        setMobile(value)
    }

    function warningPassword(password: string): string {
        if (password.length < 6) return FinishRegLsi.passwordShort[locale]
        if (!password.match(/^(?=.*[A-Z]).{6,}$/)) return FinishRegLsi.oneUpper[locale]
        if (!password.match(/^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z]).{6,}$/)) return FinishRegLsi.threeLetters[locale]
        if (!password.match(/^(?=.*[0-9].*[0-9]).{6,}$/)) return FinishRegLsi.twoDigits[locale]
        return ''
    }

    useEffect(() => {
        setRoom(targetUser.room || '')
        setSelectedDep(targetUser.department)
        setMobile(targetUser.details?.mobile || '+380')
    }, [targetUser])

    useEffect(() => {
        let t
        if (passwordWarning) setPasswordWarning('')
        if (password) t = setTimeout(() => setPasswordWarning(warningPassword(password)), 600)
        return () => {
            if (t) clearTimeout(t)
        }
    }, [password])

    async function handleLogout() {
        try {
            await $api.get('auth/logout')
            router.replace('/login')
        } catch (error) {
            console.log(error)
        }
    }

    async function handleFinishReg() {
        setIsLoading(true)
        const updated = await UsersService.finishRegistration(password, selectedDep, room, mobile)
        setIsLoading(false)
        mutateCurrUser(() => updated, false)
    }

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={setFormOpened}
            title={FinishRegLsi.title[locale]}
            description={FinishRegLsi.description[locale]}
            maxWidth="max-w-xl"
        >
            <form className="py-3 relative">
                <div className="flex flex-col mb-7 relative">
                    <Input
                        id="password"
                        label={FinishRegLsi.setPassword[locale]}
                        required
                        placeholder={FinishRegLsi.passwordPlaceholder[locale]}
                        value={password}
                        onChange={(value) => setPassword(value)}
                    />
                    <p className="text-sm px-1 select-none absolute -bottom-7 left-0 p-1 text-red-600">
                        {passwordWarning}
                    </p>
                </div>
                <div className="flex flex-col mb-7">
                    <Input
                        id="mobile"
                        label={FinishRegLsi.setPhone[locale]}
                        value={mobile}
                        onChange={(value) => handleSetMobile(value)}
                    />
                </div>
                <UserStructures setStructure={setSelectedDep} initial={selectedDep} />
                {selectedDep && (
                    <div className="mb-3 flex flex-col">
                        <Input
                            label={FinishRegLsi.roomNumber[locale]}
                            id="roomNumber"
                            value={room}
                            onChange={(value) => setRoom(value)}
                        />
                    </div>
                )}
                <DialogButtons
                    saveDisabled={!!warningPassword(password)}
                    saveButtonName={FinishRegLsi.done[locale]}
                    isLoading={isLoading}
                    onCancel={handleLogout}
                    onSave={handleFinishReg}
                />
            </form>
        </DialogModal>
    )
}

export default FinishReg
