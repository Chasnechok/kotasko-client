import { useEffect, useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { InputAttachments } from '../../../models/file'
import IUser from '../../../models/user'
import { MUTATE_TASK_LIST as mutateList } from '../../../pages/tasks'
import TasksService from '../../../services/tasks.service'
import AttachFiles from '../../attach-files'
import DialogModal from '../../dialog-modal'
import UsersAccess from '../../filesPage/users-access'
export interface TaskCreateFormProps {
    formOpened: boolean
    user: IUser
    setFormOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const TaskCreateForm: React.FC<TaskCreateFormProps> = ({ formOpened, user, setFormOpened }) => {
    const [step, setStep] = useState(0)
    const [taskName, setTaskName] = useState<string>('')
    const [taskDetails, setTaskDetails] = useState<string>('')
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [inputAttachments, setInputAttachments] = useState<InputAttachments>()

    useEffect(() => {
        if (formOpened) {
            if (step) setStep(0)
            if (taskName) setTaskName('')
            if (taskDetails) setTaskDetails('')
            if (inputAttachments) setInputAttachments(null)
            if (usersAccess.length) setUsersAccess([])
        }
    }, [formOpened])

    async function handleCreateTask() {
        setIsLoading(true)
        await TasksService.createTask(taskName, taskDetails, usersAccess, inputAttachments)
        if (mutateList) mutateList()
        setIsLoading(false)
        setFormOpened(false)
    }

    function nameAndDetails() {
        return (
            <div className={` ${step == 0 ? 'block' : 'hidden'}`}>
                <form className="pl-1 pr-4 py-3">
                    <div className="flex flex-col mb-3">
                        <label htmlFor="taskName">
                            Название<sup className="text-red-500 font-bold text-md">*</sup>
                        </label>
                        <input
                            className="appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                            id="taskName"
                            type="text"
                            placeholder="Введите название задания"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <label htmlFor="taskDetails">Описание</label>
                        <textarea
                            style={{ minHeight: '5rem' }}
                            className="resize-y appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:outline-none"
                            id="taskDetails"
                            value={taskDetails}
                            onChange={(e) => setTaskDetails(e.target.value)}
                        />
                    </div>
                </form>
                <button
                    className="disabled:text-gray-900 disabled:cursor-default disabled:bg-gray-100 disabled:hover:bg-gray-100 px-4 ml-2 select-none py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setStep(1)}
                    disabled={!taskName || taskName.length < 3}
                >
                    Дальше
                </button>
            </div>
        )
    }

    function assignedUsers() {
        return (
            <div className={` ${step == 1 ? 'block' : 'hidden'}`}>
                <UsersAccess
                    className="max-h-80"
                    user={user}
                    setUsersAccess={setUsersAccess}
                    usersWithAccess={usersAccess}
                />
                <div className="flex gap-x-2 mt-3">
                    <button
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={() => setStep(0)}
                    >
                        Назад
                    </button>
                    <button
                        className="disabled:text-gray-900 disabled:cursor-default disabled:bg-gray-100 disabled:hover:bg-gray-100 px-4 ml-2 select-none py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={() => setStep(2)}
                        disabled={!usersAccess.length}
                    >
                        Дальше
                    </button>
                </div>
            </div>
        )
    }

    return (
        <DialogModal
            title="Создание задания"
            description={
                !step
                    ? 'Задайте базовую информацию о задании'
                    : step == 1
                    ? 'Выберите хотя бы 1 исполнителя'
                    : 'Можете прикрепить к заданию файлы. Исполнители получат к ним доступ.'
            }
            formOpened={formOpened}
            setFormOpened={setFormOpened}
        >
            {nameAndDetails()}
            {assignedUsers()}
            <div className={`${step == 2 ? 'block' : 'hidden'}`}>
                <AttachFiles
                    userFromSession={user}
                    initial={inputAttachments}
                    setInputAttachments={setInputAttachments}
                />
                <div className="flex gap-x-2 mt-5">
                    <button
                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                        onClick={() => setStep(1)}
                        hidden={isLoading}
                    >
                        Назад
                    </button>
                    <button
                        type="button"
                        className={`transition disabled:cursor-default ${
                            isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                        } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                        onClick={handleCreateTask}
                    >
                        {!isLoading && 'Сохранить'}
                        <BarLoader
                            css="display: block; margin: 0 auto;"
                            loading={isLoading}
                            color="rgba(30, 58, 138)"
                        />
                    </button>
                </div>
            </div>

            <div className="mt-4 flex justify-center sm:block"></div>
        </DialogModal>
    )
}

export default TaskCreateForm
