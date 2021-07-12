import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import $api from '../../http'
import IUser from '../../models/user'
import DialogModal from '../dialog-modal'
import Input from '../input'
import { MutatorCallback } from 'swr/dist/types'
import UserStructures from '../adminPage/user/user-structure-select'
import UsersService from '../../services/users.service'

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
    const [passwordWarning, setPasswordWarning] = useState('')
    const [selectedDep, setSelectedDep] = useState(targetUser.department)
    const [mobile, setMobile] = useState('+380')

    function handleSetMobile(value: string) {
        if (value.length < 4 || value.length == 14) return
        setMobile(value)
    }

    function warningPassword(password: string): string {
        if (password.length < 6) return 'Пароль слишком короткий'
        if (!password.match(/^(?=.*[A-Z]).{6,}$/)) return 'Хотя бы 1 буква верхнего регистра'
        if (!password.match(/^(?=.*[a-zA-Z].*[a-zA-Z].*[a-zA-Z]).{6,}$/)) return 'Хотя бы 3 буквы'
        if (!password.match(/^(?=.*[0-9].*[0-9]).{6,}$/)) return 'Хотя бы 2 цифры'
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
        const updated = await UsersService.finishRegistartion(password, selectedDep, room, mobile)
        mutateCurrUser((user) => updated, false)
        setIsLoading(false)
    }

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={setFormOpened}
            title="Закончите регистрацию"
            description="Похоже это ваш первый вход - заполните поля ниже"
            maxWidth="max-w-xl"
        >
            <form className="py-3 relative">
                <div className="flex flex-col mb-7 relative">
                    <Input
                        id="password"
                        label="Установите себе пароль"
                        required
                        placeholder="Минимум 6 символов"
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
                        label="Укажите контактый номер"
                        value={mobile}
                        onChange={(value) => handleSetMobile(value)}
                    />
                </div>
                <UserStructures setStructure={setSelectedDep} initial={selectedDep} />
                {selectedDep && (
                    <div className="mb-3 flex flex-col">
                        <Input
                            label="Номер комнаты в департаменте"
                            id="roomNumber"
                            value={room}
                            onChange={(value) => setRoom(value)}
                        />
                    </div>
                )}

                <div className="mt-4 flex justify-center sm:block">
                    <button
                        disabled={!!warningPassword(password)}
                        type="button"
                        className={`transition disabled:cursor-default ${
                            isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                        } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                        onClick={handleFinishReg}
                    >
                        {!isLoading && 'Готово'}
                        <BarLoader
                            css="display: block; margin: 0 auto;"
                            loading={isLoading}
                            color="rgba(30, 58, 138)"
                        />
                    </button>
                    {!isLoading && (
                        <button
                            type="button"
                            className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                            onClick={handleLogout}
                        >
                            Выйти
                        </button>
                    )}
                </div>
            </form>
        </DialogModal>
    )
}

export default FinishReg
