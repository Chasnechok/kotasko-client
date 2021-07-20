import { Dispatch, SetStateAction, useState, useEffect, MouseEvent } from 'react'
import IUser, { UserRoleTypes } from '@models/user'
import fileSize from 'filesize'
import { ClipboardCopyIcon } from '@heroicons/react/outline'
import SwitchGroup from '@components/switch'
import ButtonCountdown from '@components/button-countdown'
import DialogModal, { DialogButtons } from '@components/dialog-modal'
import Input from '@components/input'
import UserStructures from './user-structure-select'
import IDepartment from '@models/department'
import UsersService from '@services/users.service'
import useLocale from '@hooks/useLocale'
import UserEditLsi from '@lsi/admin/user-edit.lsi'
import GlobalLsi from '@lsi/global.lsi'
import UserCreateLsi from '@lsi/admin/user-create.lsi'
import AdminLsi from '@lsi/admin/index.lsi'

interface UserEditFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    user: IUser
    adminUser: IUser
}

const UserEditForm: React.FC<UserEditFormProps> = ({ formOpened, setFormOpened, user, adminUser }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [targetUser, setTargetUser] = useState<IUser>(null)
    const [selectedDep, setSelectedDep] = useState<IDepartment>(null)
    const [removeTriggered, setRemoveTriggered] = useState(false)
    const [resetTriggered, setResetTriggered] = useState(false)
    const [structureChoose, setStructureChoose] = useState(false)
    const { locale } = useLocale()

    useEffect(() => {
        if (user && formOpened) {
            setTargetUser(user)
            setSelectedDep(user.department)
        }
        if (structureChoose) setStructureChoose(false)
        if (removeTriggered) setRemoveTriggered(false)
        if (resetTriggered) setResetTriggered(false)
    }, [formOpened])

    async function handleRemoveUser() {
        await UsersService.deleteUser(user)
        setFormOpened(false)
    }

    async function handleResetUser() {
        const updated = await UsersService.resetUser(user)
        setTargetUser((u) => ({ ...u, password: updated.password }))
        setResetTriggered(false)
    }

    async function handleDepartmentChange() {
        await UsersService.changeDepartment(user, selectedDep ? selectedDep._id : null, !!selectedDep)
        setStructureChoose(false)
    }

    async function handleUpdate() {
        setIsLoading(true)
        await UsersService.updateUser(targetUser)
        setIsLoading(false)
    }

    function handleEditRoles(shouldAdd: boolean, roleType: UserRoleTypes) {
        if (shouldAdd) {
            setTargetUser((u) => ({ ...u, roles: [roleType, ...u.roles] }))
        } else {
            setTargetUser((u) => {
                const filtered = u.roles.filter((r) => r !== roleType)
                if (!filtered.length) return { ...u, roles: [UserRoleTypes.USER] }
                return { ...u, roles: filtered }
            })
        }
    }

    function copyToClipboard(event: MouseEvent<HTMLInputElement, globalThis.MouseEvent>) {
        event.currentTarget.select()
        try {
            document.execCommand('copy')
        } catch (err) {
            console.error(err)
        }
    }

    function getOtp(user: IUser): string {
        if (!user) return ''
        return user.password || UserEditLsi.passwordEncrypted[locale]
    }

    return (
        <DialogModal
            formOpened={formOpened}
            setFormOpened={setFormOpened}
            title={UserEditLsi.title[locale]}
            maxWidth="max-w-2xl"
        >
            {user && adminUser._id === user._id && (
                <p className="pt-1 select-none text-sm text-red-500 underlinem">{UserEditLsi.warningSelf[locale]}</p>
            )}
            {!structureChoose && (
                <div className="block md:flex gap-x-6">
                    <form className="py-3 flex-1">
                        <div className="flex flex-col mb-3 ">
                            <Input
                                label={GlobalLsi.firstName[locale]}
                                id="firstName"
                                required
                                value={targetUser ? targetUser.details.firstName : ''}
                                onChange={(value) =>
                                    setTargetUser((u) => ({
                                        ...u,
                                        details: {
                                            firstName: value,
                                            lastName: targetUser.details.lastName,
                                            mobile: targetUser.details.mobile,
                                        },
                                    }))
                                }
                            />
                        </div>
                        <div className="flex flex-col mb-3 ">
                            <Input
                                label={GlobalLsi.lastName[locale]}
                                id="lastName"
                                required
                                value={targetUser ? targetUser.details.lastName : ''}
                                onChange={(value) =>
                                    setTargetUser((u) => ({
                                        ...u,
                                        details: {
                                            firstName: u.details.firstName,
                                            lastName: value,
                                            mobile: targetUser.details.mobile,
                                        },
                                    }))
                                }
                            />
                        </div>
                        <div className="flex flex-col mb-3 ">
                            <SwitchGroup
                                className="justify-between"
                                checked={targetUser && targetUser.quota !== -1}
                                onChange={(value) =>
                                    setTargetUser((u) => ({
                                        ...u,
                                        quota: !value ? -1 : u.quota !== -1 ? u.quota : 524288000,
                                    }))
                                }
                                label={UserCreateLsi.quota[locale]}
                                required
                            />
                            <input
                                className="rounded-md overflow-hidden appearance-none bg-gray-400 h-3"
                                type="range"
                                min={0}
                                max={10737412742}
                                step={1000}
                                disabled={targetUser && targetUser.quota == -1}
                                value={targetUser ? targetUser.quota : 0}
                                onChange={(e) =>
                                    setTargetUser((u) => ({
                                        ...u,
                                        quota: parseInt(e.target.value),
                                    }))
                                }
                            />
                            <p className="text-xs pt-1 select-none">
                                {!targetUser || targetUser.quota == -1 ? '∞' : fileSize(targetUser.quota)}
                            </p>
                        </div>
                        <div className="flex flex-col mb-3 ">
                            <Input
                                label={GlobalLsi.phone[locale]}
                                id="mobile"
                                value={
                                    targetUser
                                        ? targetUser.details?.mobile
                                            ? targetUser.details.mobile
                                            : '+380'
                                        : '+380'
                                }
                                onChange={(value) =>
                                    setTargetUser((u) => {
                                        if (value.length < 4 || value.length == 14) return u
                                        return {
                                            ...u,
                                            details: {
                                                firstName: u.details.firstName,
                                                lastName: u.details.lastName,
                                                mobile: value,
                                            },
                                        }
                                    })
                                }
                            />
                        </div>
                        <div className="flex flex-col mb-3 ">
                            <p className="select-none">{GlobalLsi.login[locale]}</p>
                            <div className="relative">
                                <input
                                    value={targetUser ? targetUser.login : ''}
                                    readOnly
                                    onClick={copyToClipboard}
                                    className={`cursor-pointer border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none`}
                                />
                                <ClipboardCopyIcon
                                    className={`h-5 w-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2`}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mb-3 ">
                            <p className="select-none">{GlobalLsi.password[locale]}</p>
                            <div className="relative">
                                <input
                                    value={getOtp(targetUser)}
                                    readOnly
                                    onClick={copyToClipboard}
                                    className={`${
                                        targetUser && targetUser.password ? 'cursor-pointer' : 'cursor-default'
                                    } border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none`}
                                />
                                <ClipboardCopyIcon
                                    className={`${
                                        targetUser && targetUser.password ? '' : 'hidden'
                                    } h-5 w-5 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2`}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="flex-1 py-3">
                        <fieldset className="flex flex-col mb-3 border border-gray-900 rounded-md py-2 px-1">
                            <legend className="text-gray-900 px-2 select-none">{UserEditLsi.userRoles[locale]}</legend>
                            <ul className="px-2">
                                {Object.values(UserRoleTypes).map((role) => (
                                    <li key={role}>
                                        <SwitchGroup
                                            className="justify-between"
                                            checked={targetUser && targetUser.roles.includes(role)}
                                            onChange={(shouldAdd) => handleEditRoles(shouldAdd, role)}
                                            label={UsersService.getRoleName(role)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </fieldset>

                        <fieldset className="flex flex-col mb-3 border border-gray-900 rounded-md py-2 px-2">
                            <legend className="text-gray-900 px-2 select-none">{AdminLsi.structure[locale]}</legend>
                            <button
                                style={{ maxWidth: '282px' }}
                                onClick={() => setStructureChoose(true)}
                                className="px-4 w-full overflow-hidden md:truncate mx-auto select-none py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                            >
                                {selectedDep?.name || UserEditLsi.setStructure[locale]}
                            </button>
                        </fieldset>

                        <fieldset className="border rounded-md border-red-900 p-2">
                            <legend className="text-red-900 px-2 select-none">{GlobalLsi.dangerZone[locale]}</legend>
                            <ButtonCountdown
                                countdown={3500}
                                label={GlobalLsi.delete[locale]}
                                onFire={handleRemoveUser}
                                triggered={removeTriggered}
                                setTriggered={setRemoveTriggered}
                                disabled={resetTriggered}
                                accent="red"
                            />
                            <ButtonCountdown
                                countdown={3500}
                                label={UserEditLsi.resetPassword[locale]}
                                onFire={handleResetUser}
                                triggered={resetTriggered}
                                setTriggered={setResetTriggered}
                                disabled={removeTriggered}
                                accent="red"
                            />
                        </fieldset>
                    </div>
                </div>
            )}

            {structureChoose && (
                <div>
                    <UserStructures setStructure={setSelectedDep} initial={selectedDep} />
                </div>
            )}
            <DialogButtons
                onSave={structureChoose ? handleDepartmentChange : handleUpdate}
                saveDisabled={
                    !targetUser || targetUser.details.firstName.length < 3 || targetUser.details.lastName.length < 3
                }
                isLoading={isLoading}
                onCancel={structureChoose ? () => setStructureChoose(false) : () => setFormOpened(false)}
            />
        </DialogModal>
    )
}

export default UserEditForm
