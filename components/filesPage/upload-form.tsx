import { Dialog, Transition } from '@headlessui/react'
import { Dispatch, Fragment, SetStateAction, useState } from 'react'
import BarLoader from 'react-spinners/BarLoader'
import { mutate } from 'swr'

import $api from '../../http'
import IUser from '../../models/user'
import FileAccess from './file-access'
import UploadFormFile from './upload-form-file'
export interface UploadFormProps {
    files: FileList
    setFiles: Dispatch<SetStateAction<FileList>>
    user: IUser
}

const ALLOWED_SIZE = 5e7 // 50mb

const UploadForm: React.FC<UploadFormProps> = ({ files, setFiles, user }) => {
    const [usersAccess, setUsersAccess] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const validFiles = files ? Array.from(files).filter((f) => user.role === 'admin' || f.size <= ALLOWED_SIZE) : []
    async function handleUploadFiles() {
        try {
            setIsLoading(true)
            if (error) setError(null)
            const dtoIn = new FormData()
            usersAccess.forEach((u) => dtoIn.append('shared', u._id))
            validFiles.forEach((vf) => dtoIn.append('files', vf))
            await $api.post('/files/upload', dtoIn).catch(console.log)
            setFiles(null)
            setUsersAccess([])
        } catch (error) {
            console.log(error)
            setError('Произошла ошибка при загрузке файлов')
        } finally {
            mutate('/files/listForUser')
            setIsLoading(false)
        }
    }

    return (
        <Transition appear show={files && files.length ? true : false} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-20 overflow-y-auto" onClose={() => null}>
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
                                Загрузка файлов
                            </Dialog.Title>
                            <Dialog.Description>
                                <span className="pt-4 pb-2 text-sm text-gray-500 select-none">
                                    Вы сможете поделиться файлами после загрузки
                                </span>
                            </Dialog.Description>
                            <ul className="py-2 px-1 max-h-64 lg:max-h-80 overflow-auto">
                                {files &&
                                    Array.from(files).map((file, i) => (
                                        <li key={i} className="mt-2 overflow-auto">
                                            <UploadFormFile
                                                file={file}
                                                canUpload={file.size <= ALLOWED_SIZE || user.role === 'admin'}
                                            />
                                        </li>
                                    ))}
                            </ul>
                            <div className="py-1">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 select-none">
                                    Доступ к файлу
                                </h3>
                                <p className="pt-1 text-sm text-gray-500 select-none">
                                    {!usersAccess.length
                                        ? 'Доступ будет только у вас'
                                        : `Доступ будет у вас и еще у ${usersAccess.length}
                                        ${usersAccess.length == 1 ? ' человека' : 'людей'}`}
                                </p>
                                <div className="">
                                    <FileAccess
                                        user={user}
                                        usersWithAccess={usersAccess}
                                        setUsersAccess={setUsersAccess}
                                    />
                                </div>
                            </div>
                            {error && (
                                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                                    {error}
                                </p>
                            )}
                            <div className="mt-4 flex justify-center sm:block">
                                {validFiles.length && (
                                    <button
                                        type="button"
                                        className={`transition disabled:cursor-default ${
                                            isLoading ? 'pointer-events-none py-4 w-full' : 'py-2 '
                                        } px-4 select-none text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500`}
                                        onClick={handleUploadFiles}
                                    >
                                        {!isLoading && 'Загрузить'}
                                        <BarLoader
                                            css="display: block; margin: 0 auto;"
                                            loading={isLoading}
                                            color="rgba(30, 58, 138)"
                                        />
                                    </button>
                                )}
                                {!isLoading && (
                                    <button
                                        type="button"
                                        className="px-4 ml-2 select-none py-2 text-sm font-medium text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                                        onClick={() => {
                                            setFiles(null)
                                            setUsersAccess([])
                                        }}
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

export default UploadForm
