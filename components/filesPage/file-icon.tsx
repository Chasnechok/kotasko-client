import Image from 'next/image'
import audioIcon from '../../public/icons/files/audio.svg'
import excelIcon from '../../public/icons/files/excel.svg'
import genericIcon from '../../public/icons/files/generic.svg'
import imageIcon from '../../public/icons/files/image.svg'
import pdfIcon from '../../public/icons/files/pdf.svg'
import powerpointIcon from '../../public/icons/files/powerpoint.svg'
import rarIcon from '../../public/icons/files/rar.svg'
import zipIcon from '../../public/icons/files/zip.svg'
import videoIcon from '../../public/icons/files/video.svg'
import wordIcon from '../../public/icons/files/word.svg'

interface FileIconProps {
    mimetype: string
}

const FileIcon: React.FC<FileIconProps> = ({ mimetype }) => {
    function resolveIconType(): StaticImageData {
        if (mimetype.includes('audio')) {
            return audioIcon
        }
        if (mimetype.includes('excel')) {
            return excelIcon
        }
        if (mimetype.includes('image')) {
            return imageIcon
        }
        if (mimetype.includes('pdf')) {
            return pdfIcon
        }
        if (mimetype.includes('powerpoint')) {
            return powerpointIcon
        }
        if (mimetype.includes('rar')) {
            return rarIcon
        }
        if (mimetype.includes('zip')) {
            return zipIcon
        }
        if (mimetype.includes('video')) {
            return videoIcon
        }
        if (
            mimetype.includes('msword') ||
            mimetype ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
            return wordIcon
        }
        return genericIcon
    }

    return <Image src={resolveIconType()} />
}

export default FileIcon
