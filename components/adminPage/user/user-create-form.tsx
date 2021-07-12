import { Dispatch, SetStateAction, useState, useEffect, MouseEvent } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import IUser from '../../../models/user'
import CyrillicToTranslit from 'cyrillic-to-translit-js'
import fileSize from 'filesize'
import { ClipboardCopyIcon } from '@heroicons/react/outline'
import DialogModal from '../../dialog-modal'
import SwitchGroup from '../../switch'
import Input from '../../input'
import UsersService from '../../../services/users.service'
const ToTranslit = new CyrillicToTranslit({ preset: 'uk' })

interface UserCreateFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
}

const UserCreateForm: React.FC<UserCreateFormProps> = ({ formOpened, setFormOpened }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [login, setLogin] = useState('')
    const [createdUser, setCreatedUser] = useState<IUser>()
    // 500 MB
    const [quota, setQuota] = useState(524288000)

    function handleClose() {
        setFormOpened(false)
    }

    useEffect(() => {
        if (firstName) setFirstName('')
        if (lastName) setLastName('')
        if (quota) setQuota(524288000)
        return () => {
            if (createdUser) setCreatedUser(null)
        }
    }, [createdUser, formOpened])

    useEffect(() => {
        const t = firstName + '_' + lastName.slice(0, 2)
        const login = ToTranslit.transform(t.toLowerCase())
        setLogin(login)
    }, [firstName, lastName])

    async function handleCreate() {
        setIsLoading(true)
        const created = await UsersService.register(login, firstName, lastName, quota)
        setCreatedUser(created)
        setIsLoading(false)
    }

    function copyToClipboard(event: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) {
        event.currentTarget.select()
        try {
            document.execCommand('copy')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <DialogModal
            title={createdUser ? 'Пользователь создан' : 'Создание пользователя'}
            description={createdUser ? 'Реквизиты для входа' : 'Пользователь - структурная единица департамента'}
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            {createdUser && (
                <div>
                    <div className="flex flex-col mb-3">
                        <p className="select-none">Имя и фамилия</p>
                        <div className="relative">
                            <input
                                value={UsersService.formatName(createdUser)}
                                readOnly
                                onClick={copyToClipboard}
                                className="border cursor-pointer z-10 border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                            />
                            <ClipboardCopyIcon className="h-5 w-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <p className="select-none">Логин</p>
                        <div className="relative">
                            <input
                                value={createdUser.login}
                                readOnly
                                onClick={copyToClipboard}
                                className="border cursor-pointer z-10 border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                            />
                            <ClipboardCopyIcon className="h-5 w-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <div className="flex flex-col mb-3">
                        <p className="select-none">Пароль</p>
                        <div className="relative">
                            <input
                                value={createdUser.password}
                                readOnly
                                onClick={copyToClipboard}
                                className="border cursor-pointer z-10 border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                            />
                            <ClipboardCopyIcon className="h-5 w-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="px-4 select-none py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            onClick={handleClose}
                        >
                            Хорошо
                        </button>
                    </div>
                </div>
            )}

            {!createdUser && (
                <form className="pl-1 pr-4 py-3">
                    <div className="flex flex-col mb-3">
                        <Input
                            label="Имя"
                            id="firstName"
                            required
                            value={firstName}
                            onChange={(value) => setFirstName(value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <Input
                            label="Фамилия"
                            id="lastName"
                            required
                            value={lastName}
                            onChange={(value) => setLastName(value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <SwitchGroup
                            label="Квота на файлы"
                            required
                            checked={quota !== -1}
                            onChange={(value) => setQuota(!value ? -1 : 524288000)}
                        />
                        <input
                            className="rounded-md overflow-hidden appearance-none bg-gray-400 h-3"
                            type="range"
                            min={0}
                            max={10737412742}
                            step={1000}
                            disabled={quota == -1}
                            value={quota}
                            onChange={(e) => setQuota(parseInt(e.target.value))}
                        />
                        <p className="text-xs pt-1 select-none">{quota == -1 ? '∞' : fileSize(quota)}</p>
                    </div>
                </form>
            )}

            {!createdUser && (
                <div className="mt-4 flex justify-center sm:block">
                    <button
                        disabled={firstName.length < 3 || lastName.length < 3}
                        type="button"
                        className={`transition  ${
                            isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                        } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
                                    disabled:cursor-default disabled:text-gray-900 disabled:bg-gray-100`}
                        onClick={handleCreate}
                    >
                        {!isLoading && 'Cоздать'}
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
                            onClick={handleClose}
                        >
                            Отменить
                        </button>
                    )}
                </div>
            )}
        </DialogModal>
    )
}

export default UserCreateForm
