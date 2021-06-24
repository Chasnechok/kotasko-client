import FileAccess from './file-access'
import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'

import IUser from '../../models/user'
import IFile, { FileFetchResponse } from '../../models/file'
import $api from '../../http'
import { mutate } from 'swr'

interface ShareFormProps {
    formOpened: boolean
    setFormOpened: Dispatch<SetStateAction<boolean>>
    user: IUser
    file: IFile
}

const ShareForm: React.FC<ShareFormProps> = ({ formOpened, user, file, setFormOpened }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>(file.shared)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [saveSuccess, setSaveSuccess] = useState(false)

    function handleClose() {
        if (error) setError(null)
        if (saveSuccess) setSaveSuccess(false)
        setFormOpened(false)
    }

    async function handleManageAccess() {
        try {
            setIsLoading(true)
            if (error) setError(null)
            await mutate(
                '/files/listForUser',
                async (files: FileFetchResponse): Promise<FileFetchResponse> => {
                    const updatedFile = await $api.patch<IFile>('/files/shareFile', {
                        fileId: file._id,
                        userIds: usersAccess.map((u) => u._id),
                        rewrite: true,
                    })
                    const filteredFiles = files.owns.filter((file) => file._id !== updatedFile.data._id)
                    return {
                        owns: [...filteredFiles, updatedFile.data].sort((a, b) => {
                            const d1 = new Date(a.createdAt)
                            const d2 = new Date(b.createdAt)
                            return d2.getTime() - d1.getTime()
                        }),
                        hasAccess: files.hasAccess,
                    }
                },
                false
            )
            setSaveSuccess(true)
        } catch (error) {
            setError('Ошибка сервера')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Transition appear show={formOpened} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={handleClose}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child as={Fragment}>
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-40" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 select-none">
                                Доступ к файлу {file.originalname}
                            </Dialog.Title>
                            <Dialog.Description>
                                <p className="pt-1 text-sm text-gray-500 select-none">
                                    {!usersAccess.length
                                        ? 'Доступ есть только у вас'
                                        : `Доступ есть у вас и еще у ${usersAccess.length}
                                        ${usersAccess.length == 1 ? 'сотрудника' : 'сотрудников'}`}
                                </p>
                            </Dialog.Description>
                            <div className="">
                                <FileAccess user={user} usersWithAccess={usersAccess} setUsersAccess={setUsersAccess} />
                            </div>
                            {error && (
                                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                                    {error}
                                </p>
                            )}
                            {saveSuccess && (
                                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-green-900 bg-green-100 border border-transparent rounded-md hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
                                    Права доступа обновлены
                                </p>
                            )}
                            <div className="mt-4 flex justify-center sm:block">
                                <button
                                    type="button"
                                    className={`transition disabled:cursor-default ${
                                        isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                                    } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                                    onClick={handleManageAccess}
                                >
                                    {!isLoading && 'Сохранить'}
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
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ShareForm
