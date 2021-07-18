import ITask, { TaskStates } from '../../models/task'
import Link from 'next/link'
import SimpleSpinner from '../simple-spinner'
import { useState, Fragment } from 'react'
import MenuDropdown from '../dropdown'
import { Menu } from '@headlessui/react'
import { ThumbDownIcon, TrashIcon, PaperClipIcon, ThumbUpIcon, UserCircleIcon } from '@heroicons/react/outline'
import IUser from '../../models/user'
import ExecutansManageForm from './executans-manage'
import TasksService from '../../services/tasks.service'
import { MUTATE_TASK_LIST as mutateList } from '../../pages/tasks'
import ConfirmDialog from '../confirm-dialog'
import UsersService from '../../services/users.service'
import downloadFile from '../../http/download-file'
import fileSize from 'filesize'
import IFile from '../../models/file'
import { useRouter } from 'next/router'

export interface TaskComponentProps {
    task: ITask
    currUser: IUser
}

const TaskComponent: React.FC<TaskComponentProps> = ({ task, currUser }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [executansFormOpened, setExecutansFormOpened] = useState(false)
    const [deleteTriggered, setDeleteTriggered] = useState(false)

    const router = useRouter()
    const isSelected = router.query.taskId === task._id

    function isCreator() {
        if (!currUser || !task) return
        return currUser._id === task.creator._id
    }

    function openExecutansForm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setExecutansFormOpened(true)
    }

    function openDeleteConfirm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        setDeleteTriggered(true)
    }

    async function updateExecutans(executans: IUser[]) {
        setIsLoading(true)
        setExecutansFormOpened(false)
        await TasksService.setExecutans(task, executans)
        if (mutateList) mutateList()
        setIsLoading(false)
    }

    async function setState(e: React.MouseEvent<HTMLButtonElement>, state: TaskStates) {
        e.preventDefault()
        setIsLoading(true)
        await TasksService.setTaskState(task, state)
        if (mutateList) mutateList()
        setIsLoading(false)
    }

    async function deleteTask() {
        setIsLoading(true)
        setDeleteTriggered(false)
        await TasksService.deleteTask(task)
        if (mutateList) mutateList()
        setIsLoading(false)
    }

    function download(e: React.MouseEvent<HTMLLIElement>, file: IFile) {
        e.preventDefault()
        downloadFile(file)
    }

    function executansList(): string {
        if (!task.assignedTo || !task.assignedTo.length) return 'не назначены'
        let string = ''
        task.assignedTo.forEach((u, i) => {
            string += i == task.assignedTo.length - 1 ? UsersService.formatName(u) : `${UsersService.formatName(u)}, `
        })
        return string
    }

    return (
        <Fragment>
            <ExecutansManageForm
                currUser={currUser}
                executans={task.assignedTo}
                formOpened={executansFormOpened}
                setFormOpened={setExecutansFormOpened}
                onSave={updateExecutans}
            />
            <ConfirmDialog
                title="Подтвердите удаление"
                onFire={deleteTask}
                opened={deleteTriggered}
                setOpened={setDeleteTriggered}
                description={`Вы собираетесь удалить "${task.name}"`}
            />
            <Link replace href={`/tasks?shared=${router.query.shared === 'true'}&taskId=${task._id}`}>
                <a
                    className={`mx-2 my-6 lg:my-4 shadow hover:shadow-md relative rounded-lg p-5 block focus-visible:outline-none focus-visible:ring-2 ring-offset-blue-300 ring-offset-2 ring-white
                ${isSelected ? 'bg-gradient-to-l from-blue-50 to-white' : 'bg-white'}
                `}
                >
                    <div className="flex justify-between items-center ">
                        <SimpleSpinner className={`w-3 h-3 absolute top-2 left-2 text-gray-500`} loading={isLoading} />

                        <p className="leading-none text-xs text-left py-2">
                            {new Date(task.createdAt).toLocaleString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                day: '2-digit',
                            })}
                        </p>

                        <MenuDropdown
                            type="dots"
                            buttonClassName="bg-transparent"
                            chevronClassName="text-gray-500 hover:text-gray-400"
                            width="w-56"
                        >
                            {!isCreator() && (
                                <div className="px-1 py-1">
                                    <Menu.Item disabled={task.state !== TaskStates.CREATED}>
                                        {({ active }) => (
                                            <button
                                                disabled={task.state == TaskStates.PENDING_REVIEW}
                                                onClick={(e) => setState(e, TaskStates.PENDING_REVIEW)}
                                                className={`${
                                                    active ? 'bg-yellow-500 text-white' : 'text-gray-900'
                                                } flex rounded-md select-none items-center w-full px-2 py-2 text-xs lg:text-sm relative`}
                                            >
                                                <ThumbUpIcon
                                                    className={`"h-5 w-5 mr-2 ${
                                                        !active ? 'text-yellow-500' : 'text-white'
                                                    }`}
                                                />
                                                {task.state == TaskStates.PENDING_REVIEW
                                                    ? 'На ревизии'
                                                    : task.state == TaskStates.FINISHED
                                                    ? 'Поручение исполненно'
                                                    : 'На проверку'}
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            )}
                            {isCreator() && task.state == TaskStates.PENDING_REVIEW && (
                                <div className="px-1 py-1">
                                    <Fragment>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-green-500 text-white' : 'text-gray-900'
                                                    } flex text-xs lg:text-sm rounded-md select-none items-center w-full px-2 py-2 relative`}
                                                    onClick={(e) => setState(e, TaskStates.FINISHED)}
                                                >
                                                    <ThumbUpIcon
                                                        className={`"h-5 w-5 mr-2 ${
                                                            !active ? 'text-green-500' : 'text-white'
                                                        }`}
                                                    />
                                                    Поручение исполненно
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-yellow-500 text-white' : 'text-gray-900'
                                                    } flex rounded-md select-none items-center w-full px-2 py-2 text-xs lg:text-sm relative`}
                                                    onClick={(e) => setState(e, TaskStates.CREATED)}
                                                >
                                                    <ThumbDownIcon
                                                        className={`"h-5 w-5 mr-2 ${
                                                            !active ? 'text-yellow-500' : 'text-white'
                                                        }`}
                                                    />
                                                    На доработку
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </Fragment>
                                </div>
                            )}
                            {isCreator() && (
                                <div className="px-1 py-1 ">
                                    {task.state !== TaskStates.FINISHED && (
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    className={`${
                                                        active ? 'bg-gray-500 text-white' : 'text-gray-900'
                                                    } flex rounded-md select-none items-center w-full px-2 py-2 text-xs lg:text-sm relative`}
                                                    onClick={openExecutansForm}
                                                >
                                                    <UserCircleIcon
                                                        className={`"h-5 w-5 mr-2 ${
                                                            !active ? 'text-gray-500' : 'text-white'
                                                        }`}
                                                    />
                                                    Исполнители
                                                </button>
                                            )}
                                        </Menu.Item>
                                    )}
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ? 'bg-red-500 text-white' : 'text-gray-900'
                                                } flex rounded-md select-none items-center w-full px-2 py-2 text-xs lg:text-sm relative`}
                                                onClick={openDeleteConfirm}
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
                    </div>
                    <p
                        className={`select-none flex items-center before:mr-2 font-medium text-lg before:block before:w-2 before:h-2 before:rounded-full
                            ${
                                task.state == TaskStates.PENDING_REVIEW
                                    ? 'before:bg-yellow-500'
                                    : task.state == TaskStates.CREATED
                                    ? 'before:bg-blue-500 before:animate-pulse'
                                    : 'before:bg-green-500'
                            }
                            `}
                    >
                        {task.name}
                    </p>

                    <div className="divide-y divide-gray-100">
                        <p className="text-gray-600 py-2 max-h-40 overflow-y-auto">{task.details || 'Описания нет'}</p>
                        <p className="text-gray-600 py-2 text-sm">
                            Поручитель: {UsersService.formatName(task.creator)}
                        </p>
                        <p className="text-gray-600 py-2 text-sm">Исполнители: {executansList()}</p>
                        {task.attachments && (
                            <ul className="py-2 flex gap-2 flex-wrap">
                                {task.attachments.map((at) => (
                                    <li
                                        onClick={(e) => download(e, at)}
                                        key={at._id}
                                        className="pt-2 mt-2 px-2 flex hover:text-blue-600"
                                    >
                                        <div>
                                            <PaperClipIcon className="h-4 w-4 mr-2 block" />
                                        </div>
                                        <div className="select-none overflow-x-auto">
                                            <button className="text-xs block font-medium underline cursor-pointer">
                                                {at.originalname}
                                            </button>
                                            <p className="text-xs text-right">{fileSize(at.size)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </a>
            </Link>
        </Fragment>
    )
}

export default TaskComponent
