import { TrashIcon } from '@heroicons/react/outline'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import DragArea from './filesPage/dragarea'
import filesize from 'filesize'
import IFile, { InputAttachments } from '../models/file'
import Disclosure from './disclosure'
import SwitchGroup from './switch'
import IUser from '../models/user'
import InfiniteList from './infinite-list/index'
import FilesLsi from '@lsi/files/index.lsi'
import useLocale from '@hooks/useLocale'
import GlobalLsi from '@lsi/global.lsi'

interface AttachFilesProps {
    setInputAttachments: Dispatch<SetStateAction<InputAttachments>>
    single?: boolean
    initial: InputAttachments
    userFromSession: IUser
}

const AttachFiles: React.FC<AttachFilesProps> = ({ single, initial, setInputAttachments, userFromSession }) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileList>()
    const [error, setError] = useState('')
    const { locale } = useLocale()
    useEffect(() => {
        if (!uploadedFiles || !uploadedFiles.length) return
        if (error) setError('')
        const candidates = Array.from(uploadedFiles)
        if (
            candidates.some(
                (f) => f.size + userFromSession.spaceUsed > userFromSession.quota && userFromSession.quota !== -1
            )
        ) {
            setError(FilesLsi.quotaFull[locale] + ' ' + filesize(userFromSession.quota))
            return
        }
        setInputAttachments((v) => ({
            onServer: v && !single ? v.onServer : [],
            toUpload: candidates,
        }))
    }, [uploadedFiles])

    useEffect(() => {
        let timer
        if (error) {
            timer = setTimeout(() => setError(''), 2500)
        }
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [error])

    function manageServerAttachments(file: IFile, attach: boolean) {
        if (attach) {
            if (single) {
                setInputAttachments(() => ({
                    onServer: [file],
                    toUpload: [],
                }))
            } else {
                setInputAttachments((v) => ({
                    onServer: v ? v.onServer.concat(file) : [],
                    toUpload: v ? v.toUpload : [],
                }))
            }
        } else {
            setInputAttachments((v) => ({
                onServer: v ? v.onServer.filter((f) => f._id !== file._id) : [],
                toUpload: v ? v.toUpload : [],
            }))
        }
    }

    function handleUnattach(file) {
        setInputAttachments((v) => ({
            onServer: v ? v.onServer : [],
            toUpload: v ? v.toUpload.filter((f) => f.name !== file.name && f.size !== file.size) : [],
        }))
    }

    function shouldRender(file: IFile) {
        if (!file) return false
        return file.owner._id === userFromSession._id
    }

    function fileComponent() {
        if (!initial || !initial.toUpload) return
        const files = initial.toUpload
        return (
            <div className="max-h-40 overflow-auto">
                {files.map((file, i) => (
                    <div key={i} className="rounded-md pt-5 px-2 flex">
                        <div className="flex-1">
                            <p>{file.name}</p>
                            <p>{filesize(file.size)}</p>
                        </div>
                        <button
                            onClick={() => handleUnattach(file)}
                            className="pl-2 group rounded-md focus:ring-0 focus:border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400"
                        >
                            <TrashIcon className="h-5 text-gray-600 hover:text-red-600 group-focus:text-red-600" />
                        </button>
                    </div>
                ))}
            </div>
        )
    }

    function isLinked(file) {
        return initial && initial.onServer.some((f) => f._id === file._id)
    }

    function uploadedDate(file) {
        const a = new Date(file.createdAt)
        return a.toLocaleString()
    }

    const rootRef = useRef()

    return (
        <div className="w-full overflow-hidden text-left align-middle transition-all transform bg-transparent">
            {error && (
                <p className="my-2 select-none py-2 px-4 text-sm font-medium text-red-900 bg-red-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500">
                    {error}
                </p>
            )}
            <Disclosure label={FilesLsi.filesFromServer[locale]}>
                <div ref={rootRef} className="max-h-40 overflow-y-auto">
                    <InfiniteList<IFile & React.FC>
                        rootRef={rootRef}
                        shouldRender={shouldRender}
                        pageSize={5}
                        fetchUrl="/files/list"
                    >
                        {(file) => {
                            if (!file) return null
                            return (
                                <SwitchGroup
                                    checked={isLinked(file)}
                                    onBg
                                    className="justify-between"
                                    label={
                                        <>
                                            <p className="font-medium truncate">{file.originalname}</p>
                                            <p>
                                                {FilesLsi.size[locale]}: {filesize(file.size)}
                                            </p>
                                            <p className="hidden text-xs md:block">
                                                {FilesLsi.uploaded[locale]}: {uploadedDate(file)}
                                            </p>
                                        </>
                                    }
                                    onChange={(value) => manageServerAttachments(file, value)}
                                />
                            )
                        }}
                    </InfiniteList>
                </div>
            </Disclosure>
            <p className="text-gray-500 py-2 text-center select-none">
                {single ? GlobalLsi.or[locale] : GlobalLsi.xor[locale]}
            </p>
            <DragArea single={single} forceRerender={uploadedFiles} setFiles={setUploadedFiles} />
            {fileComponent()}
        </div>
    )
}

export default AttachFiles
