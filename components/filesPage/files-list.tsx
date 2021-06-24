import Image from 'next/image'
import IFile from '../../models/file'
import FileComponent from './file'
import EmptyIcon from '../../public/icons/empty.svg'
import IUser from '../../models/user'
import { Fragment } from 'react'

interface FilesListProps {
    files: IFile[]
    user: IUser
}

const FilesList: React.FC<FilesListProps> = ({ files, user }) => {
    console.log(files)

    return (
        <Fragment>
            {!files.length && (
                <div className="flex flex-col select-none align-middle mt-10 opacity-50">
                    <h1 className="text-center ">Здесь пока нет файлов</h1>
                    <Image className="pointer-events-none" src={EmptyIcon} />
                </div>
            )}
            <ul className="relative w-full py-3 select-none">
                {files.map((file) => (
                    <li key={file._id}>
                        <FileComponent file={file} user={user} />
                    </li>
                ))}
            </ul>
        </Fragment>
    )
}

export default FilesList
