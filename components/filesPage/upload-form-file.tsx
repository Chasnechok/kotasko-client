import { ChevronUpIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'
import filesize from 'filesize'

interface UploadFormFileProps {
    file: File
    canUpload?: boolean
}

const UploadFormFile: React.FC<UploadFormFileProps> = ({ file, canUpload }) => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={`flex justify-between w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75
                    ${
                        canUpload
                            ? 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                            : 'text-red-900 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500 line-through'
                    }`}
                    >
                        <span className="select-none">{file.name}</span>
                        <ChevronUpIcon
                            className={`${open ? 'transform rotate-180' : ''} w-5 h-5 ${
                                canUpload ? 'text-blue-500' : 'text-red-500'
                            } `}
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <p className="select-none">
                            Размер: {filesize(file.size)} {canUpload ? '' : ' - превышает допустимый.'}
                        </p>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default UploadFormFile
