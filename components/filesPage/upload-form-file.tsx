import { ChevronUpIcon } from '@heroicons/react/outline'
import { Disclosure } from '@headlessui/react'
import filesize from 'filesize'
import FilesLsi from '@lsi/files/index.lsi'
import UploadFormLsi from '@lsi/files/upload-form.lsi'
import useLocale from '@hooks/useLocale'

interface UploadFormFileProps {
    file: File
    canUpload?: boolean
}

const UploadFormFile: React.FC<UploadFormFileProps> = ({ file, canUpload }) => {
    const { locale } = useLocale()
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={`justify-between relative w-full px-4 py-2 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-opacity-75
                    ${
                        canUpload
                            ? 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                            : 'text-red-900 bg-red-100 hover:bg-red-200 focus-visible:ring-red-500 line-through'
                    }`}
                    >
                        <p className="select-none max-w-full break-all pr-4">{file.name}</p>
                        <ChevronUpIcon
                            className={`${
                                open ? 'transform rotate-180' : ''
                            } w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 ${
                                canUpload ? 'text-blue-500' : 'text-red-500'
                            } `}
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <p className="select-none">
                            {FilesLsi.size[locale]} {filesize(file.size)}{' '}
                            {canUpload ? '' : ` ${UploadFormLsi.fileExceesQuota[locale]}`}
                        </p>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default UploadFormFile
