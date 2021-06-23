import { API_URL } from '.'
import IFile from '../models/file'

export default async function downloadFile(file: IFile) {
    let error
    try {
        const link = document.createElement('a')
        link.href = `${API_URL}/files/download/${file._id}`
        link.setAttribute('download', file.originalname)
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (err) {
        error = err.response || err
    }

    return { error }
}
