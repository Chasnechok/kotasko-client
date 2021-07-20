import IChore, { ChoreStates, ChoreTypes } from '@models/chore'
import Link from 'next/link'
import IUser, { UserRoleTypes } from '@models/user'
import MenuDropdown from '../dropdown'
import { Menu } from '@headlessui/react'
import React, { useState, Fragment, useEffect } from 'react'
import { HandIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/outline'
import SimpleSpinner from '../simple-spinner'
import DialogModal, { DialogButtons } from '../dialog-modal'
import SwitchGroup from '../switch'
import ChoreTypeIcon from './chore-type-icon'
import UsersService from '@services/users.service'
import ChoresService from '@services/chores.service'
import ConfirmDialog from '../confirm-dialog'
import { useRouter } from 'next/router'
import ChoresLsi from '@lsi/chores/index.lsi'
import GlobalLsi from '@lsi/global.lsi'

interface ChoreComponentProps {
    chore: IChore
    currUser: IUser
    mutateList: () => void
}

const ChoreComponent: React.FC<ChoreComponentProps> = ({ chore, currUser, mutateList }) => {
    const [solveFormOpened, setSolveFormOpened] = useState(false)
    const [types, setChoreTypes] = useState(chore.types)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteTriggered, setDeleteTriggered] = useState(false)
    const inSolvers = chore.solvers.some((s) => s._id === currUser._id)
    const isTechnician = currUser && currUser.roles.includes(UserRoleTypes.TECHNICIAN)
    const router = useRouter()
    const locale = router.locale
    const isSelected = router.query.choreId === chore._id

    useEffect(() => {
        setChoreTypes(chore.types)
    }, [solveFormOpened])

    function onSolveClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setSolveFormOpened(true)
    }

    async function becomeSolver() {
        setIsLoading(true)
        await ChoresService.becomeSolver(chore)
        if (mutateList) mutateList()
        setIsLoading(false)
    }

    async function deleteChore() {
        setIsLoading(true)
        setDeleteTriggered(false)
        await ChoresService.deleteChore(chore)
        if (mutateList) mutateList()
        setIsLoading(false)
    }

    async function handleSolve() {
        setIsLoading(true)
        await ChoresService.finishChore(chore, types)
        if (mutateList) mutateList()
        setIsLoading(false)
        setSolveFormOpened(false)
    }

    function triggerDelete(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setDeleteTriggered(true)
    }

    return (
        <Fragment>
            <ConfirmDialog
                title={ChoresLsi.confirmDelete[locale]}
                description={ChoresLsi.confirmDeleteDesc[locale]}
                onFire={deleteChore}
                opened={deleteTriggered}
                setOpened={setDeleteTriggered}
            />
            <DialogModal
                title={ChoresLsi.solveChore[locale]}
                description={ChoresLsi.solveChoreDesc[locale]}
                setFormOpened={setSolveFormOpened}
                formOpened={solveFormOpened}
            >
                <ul className="pt-3">
                    {Object.values(ChoreTypes).map((t) => (
                        <li key={t}>
                            <SwitchGroup
                                className="justify-between"
                                onChange={(isToggled) => {
                                    if (isToggled && !types.includes(t)) return setChoreTypes((prev) => [t, ...prev])
                                    setChoreTypes((prev) => prev.filter((v) => v !== t))
                                }}
                                checked={types.includes(t)}
                                label={
                                    <div className="flex items-center">
                                        <div className="mr-2 h-5 w-5">
                                            <ChoreTypeIcon type={t} />
                                        </div>
                                        {ChoresService.formatTypeName(t)}
                                    </div>
                                }
                            />
                        </li>
                    ))}
                </ul>
                <DialogButtons
                    isLoading={isLoading}
                    saveButtonName={ChoresLsi.confirmSolve[locale]}
                    onSave={handleSolve}
                    onCancel={() => setSolveFormOpened(false)}
                />
            </DialogModal>
            <Link href={`/chores?active=${router.query.active == 'true' || !router.query.active}&choreId=${chore._id}`}>
                <a
                    className={`mx-2 my-4 shadow hover:shadow-md relative rounded-lg p-5 block focus-visible:outline-none focus-visible:ring-2 ring-offset-blue-300 ring-offset-2 ring-white
                ${isSelected ? 'bg-gradient-to-l from-blue-50 to-white' : 'bg-white'}
                `}
                >
                    <div className="flex justify-between items-center ">
                        <SimpleSpinner className={`w-3 h-3 absolute top-2 left-2 text-gray-500`} loading={isLoading} />
                        <p className="leading-none text-xs">
                            {new Date(chore.createdAt).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                day: '2-digit',
                            })}
                        </p>
                        {chore.state !== ChoreStates.SOLVED && (
                            <MenuDropdown
                                type="dots"
                                buttonClassName="bg-transparent"
                                chevronClassName="text-gray-500 hover:text-gray-400"
                                width="w-56"
                            >
                                {isTechnician && (
                                    <div className="px-1 py-1 ">
                                        {!inSolvers && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${
                                                            active ? 'bg-blue-500 text-white' : 'text-gray-900'
                                                        } flex rounded-md select-none items-center w-full px-2 py-2 text-sm relative`}
                                                        onClick={becomeSolver}
                                                    >
                                                        <HandIcon
                                                            className={`"h-5 w-5 mr-2 ${
                                                                !active ? 'text-blue-500' : 'text-white'
                                                            }`}
                                                        />
                                                        {ChoresLsi.takeChore[locale]}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}
                                        {inSolvers && (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        type="button"
                                                        className={`${
                                                            active ? 'bg-green-500 text-white' : 'text-gray-900'
                                                        } flex rounded-md items-center w-full px-2 py-2 text-sm relative`}
                                                        onClick={onSolveClick}
                                                    >
                                                        <ShieldCheckIcon
                                                            className={`"h-5 w-5 mr-2 ${
                                                                !active ? 'text-green-500' : 'text-white'
                                                            }`}
                                                        />
                                                        {ChoresLsi.solveChore[locale]}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}
                                    </div>
                                )}
                                {chore.creator._id === currUser._id && (
                                    <div className="px-1 py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-red-500 text-white' : 'text-gray-900'
                                                    } flex rounded-md select-none items-center w-full px-2 py-2 text-sm relative`}
                                                    onClick={triggerDelete}
                                                >
                                                    <TrashIcon
                                                        className={`"h-5 w-5 mr-2 ${
                                                            !active ? 'text-red-500' : 'text-white'
                                                        }`}
                                                    />
                                                    {GlobalLsi.delete[locale]}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </div>
                                )}
                            </MenuDropdown>
                        )}
                    </div>
                    <div className="divide-y divide-gray-100">
                        <p
                            className={`select-none flex items-center before:mr-2 font-medium text-lg before:block before:w-2 before:h-2 before:rounded-full
                            ${
                                chore.state == ChoreStates.CREATED
                                    ? 'before:bg-yellow-500'
                                    : chore.state == ChoreStates.SOLVING
                                    ? 'before:bg-blue-500 before:animate-pulse'
                                    : 'before:bg-green-500'
                            }
                            `}
                        >
                            {UsersService.formatName(chore.creator)}
                        </p>
                        {chore.creator.department && (
                            <p className="text-sm">
                                {chore.creator.department.name},&nbsp;
                                {chore.creator.department.address || GlobalLsi.noAdress[locale]}
                            </p>
                        )}
                        <p className="text-sm">
                            {GlobalLsi.room[locale]}:{' '}
                            {chore.creator.room || GlobalLsi.notSpecified[locale].toLowerCase()}
                        </p>
                        <p className="text-sm">
                            {GlobalLsi.phone[locale]}:{' '}
                            {UsersService.formatMobile(chore.creator.details?.mobile) ||
                                GlobalLsi.notSpecified[locale].toLowerCase()}
                        </p>
                        <p className="text-gray-600 pt-2">{chore.details || GlobalLsi.noDesc[locale]}</p>
                    </div>
                </a>
            </Link>
        </Fragment>
    )
}

export default ChoreComponent
