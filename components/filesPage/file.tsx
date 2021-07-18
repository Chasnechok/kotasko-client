import IFile from '../../models/file'
import { DownloadIcon, TrashIcon, ShareIcon } from '@heroicons/react/solid'
import { Fragment, useState, useEffect } from 'react'
import downloadFile from '../../http/download-file'
import filesize from 'filesize'
import FileIcon from './file-icon'
import ShareForm from './share-form'
import IUser from '../../models/user'
import FilesService from '../../services/files.service'
import { MUTATE_FILE_LIST as mutateList } from '../../pages/files'
import UsersService from '../../services/users.service'

interface FileComponentProps {
    file: IFile
    user: IUser
}

const FileComponent: React.FC<FileComponentProps> = ({ file, user }) => {
    const [shareFormOpened, setShareFormOpened] = useState(false)
    const [deleteTriggered, setDeleteTriggered] = useState(false)
    const isOwner = file.owner._id === user._id

    async function handleDelete() {
        await FilesService.deleteFile(file)
        if (mutateList) mutateList()
    }

    useEffect(() => {
        let deleteT
        if (deleteTriggered) {
            deleteT = setTimeout(handleDelete, 2500)
        }
        return () => {
            if (deleteT) clearTimeout(deleteT)
        }
    }, [deleteTriggered])

    const uploadedDate = () => {
        const a = new Date(file.createdAt)
        return a.toLocaleString()
    }

    return (
        <div
            className={`w-full ml-1 bg-white relative flex items-center overflow-hidden justify-between cursor-default my-3 py-5 px-5 lg:px-10 rounded-md shadow max-h-60 focus:outline-none sm:text-sm lg:hover:shadow-md`}
        >
            <div
                className={`w-full ${
                    deleteTriggered ? 'animate-delete-bar' : 'hidden'
                } left-0 absolute h-full bg-red-700 opacity-20`}
            ></div>
            <ShareForm user={user} formOpened={shareFormOpened} setFormOpened={setShareFormOpened} file={file} />
            <div className="relative w-1/2 md:w-max">
                <div className="hidden absolute md:block left-0 top-1/2 -translate-y-1/2">
                    <FileIcon mimetype={file.mimetype} />
                </div>
                <div className="pl-0 md:pl-16 w-full overflow-x-auto">
                    <h1
                        className={`${
                            deleteTriggered ? 'line-through' : ''
                        } w-full break-all text-sm md:text-base font-medium`}
                    >
                        {file.originalname}
                    </h1>
                    <h2 className="text-xs md:text-sm lg:text-base">Размер: {filesize(file.size)}</h2>
                    <h2 className="hidden md:block">Загружено: {uploadedDate()}</h2>
                    {user._id !== file.owner?._id && (
                        <h2 className="text-xs md:text-sm lg:text-base">
                            Поделился: {UsersService.formatName(file.owner)}
                        </h2>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-x-4">
                <div
                    onClick={() => downloadFile(file)}
                    className={`${
                        deleteTriggered ? 'hidden' : 'block'
                    } md:p-2 group flex items-center hover:text-blue-600 cursor-pointer`}
                >
                    <span className="hidden md:inline">Скачать</span>
                    <DownloadIcon className="h-5 md:h-6 md:ml-2 transform group-hover:translate-y-1 transition-all duration-50 group-active:translate-y-2" />
                </div>
                {isOwner && (
                    <Fragment>
                        <ShareIcon
                            onClick={() => setShareFormOpened(true)}
                            className={`${
                                deleteTriggered ? 'hidden' : 'block'
                            } h-5 md:h-6 transition-colors cursor-pointer text-gray-400 hover:text-blue-600`}
                        />
                        <div
                            onClick={() => setDeleteTriggered(!deleteTriggered)}
                            className={`${
                                deleteTriggered
                                    ? 'z-10 py-2 px-2 lg:px-4 text-xs sm:text-sm rounded-lg font-medium bg-red-100 text-red-900 border border-red-900'
                                    : ''
                            } cursor-pointer`}
                        >
                            {deleteTriggered && (
                                <>
                                    <span>Отменить</span>
                                    <span className="hidden md:inline">&nbsp;удаление</span>
                                </>
                            )}
                            {!deleteTriggered && (
                                <TrashIcon className={`h-5 transition-colors text-gray-400 hover:text-red-500`} />
                            )}
                        </div>
                    </Fragment>
                )}
            </div>
        </div>
    )
}

export default FileComponent
