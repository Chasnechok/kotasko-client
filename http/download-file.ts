import { mutate } from 'swr'
import { API_URL } from '.'
import IFile from '../models/file'

export default async function downloadFile(file: IFile) {
    try {
        const link = document.createElement('a')
        link.href = `${API_URL}/files/download/${file._id}`
        link.setAttribute('download', file.originalname)
        document.body.appendChild(link)
        link.click()
        link.remove()
    } catch (err) {
        console.log(err)
        mutate('/files/listForUser')
    }
}
