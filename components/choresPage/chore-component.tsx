import IChore, { ChoreStates, ChoreTypes } from '../../models/chore'
import Link from 'next/link'
import IUser, { UserRoleTypes } from '../../models/user'
import MenuDropdown from '../dropdown'
import { Menu } from '@headlessui/react'
import React, { useState, Fragment, useEffect } from 'react'
import { HandIcon, TrashIcon, ShieldCheckIcon } from '@heroicons/react/outline'
import SimpleSpinner from '../simple-spinner'
import DialogModal from '../dialog-modal'
import SwitchGroup from '../switch'
import ChoreService from '../../services/chores.service'
import ChoreTypeIcon from './chore-type-icon'
import BarLoader from 'react-spinners/BarLoader'
import UsersService from '../../services/users.service'
import ChoresService from '../../services/chores.service'
import ConfirmDialog from '../confirm-dialog'
import { useRouter } from 'next/router'

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
                title="Подтвердите удаление"
                description={`Вы собираетесь удалить этот сервисный запрос`}
                onFire={deleteChore}
                opened={deleteTriggered}
                setOpened={setDeleteTriggered}
            />
            <DialogModal
                title="Решить запрос"
                description="Можете присвоить запросу категории. Пользователь "
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
                                        {ChoreService.formatTypeName(t)}
                                    </div>
                                }
                            />
                        </li>
                    ))}
                </ul>
                <div className="flex gap-x-2 mt-5">
                    <button
                        type="button"
                        disabled={isLoading}
                        className={`transition disabled:w-full disabled:cursor-default disabled:hover:bg-blue-100 py-2 px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                        onClick={handleSolve}
                    >
                        {!isLoading && 'Подтвердить решение'}
                        <BarLoader
                            css="display: block; margin: 0 auto; padding: 8px 0;"
                            loading={isLoading}
                            color="rgba(30, 58, 138)"
                        />
                    </button>
                    <button
                        type="button"
                        hidden={isLoading}
                        className={`transition py-2 px-4 disabled:cursor-default disabled:hover:bg-gray-100 select-none text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500`}
                        onClick={() => setSolveFormOpened(false)}
                    >
                        Отменить
                    </button>
                </div>
            </DialogModal>
            <Link href={`/chores?active=${router.query.active == 'true'}&choreId=${chore._id}`}>
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
                                                        Взять запрос
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
                                                        Решить запрос
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
                                                    Удалить
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
                                {chore.creator.department.address || 'адрес не указан'}
                            </p>
                        )}
                        <p className="text-sm">Комната: {chore.creator.room || 'не указана'}</p>
                        <p className="text-sm">
                            Телефон: {UsersService.formatMobile(chore.creator.details?.mobile) || 'не указан'}
                        </p>
                        <p className="text-gray-600 pt-2">{chore.details || 'Описания нет'}</p>
                    </div>
                </a>
            </Link>
        </Fragment>
    )
}

export default ChoreComponent
