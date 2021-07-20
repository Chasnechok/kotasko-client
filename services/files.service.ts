import $api, { API_URL } from '../http'
import IFile from '@models/file'
import ITask from '@models/task'
import IUser from '@models/user'
import { AlertsService } from './alerts.service'
import router from 'next/router'
import UploadFormLsi from '@lsi/files/upload-form.lsi'

export default class FilesService {
    static async uploadFiles(files: File[], shareWith?: IUser[], linkedTasks?: ITask[]) {
        try {
            if (!files || !files.length) return
            const dtoIn = new FormData()
            if (shareWith) shareWith.forEach((u) => dtoIn.append('shared', u._id))
            if (linkedTasks) linkedTasks.forEach((t) => dtoIn.append('linkedTasks', t._id))
            files.forEach((vf) => dtoIn.append('files', vf))
            const uploaded = await $api.post<IFile[]>('/files/upload', dtoIn)
            AlertsService.addAlert({ content: UploadFormLsi.onUpload[router.locale], theme: 'success' })
            return uploaded.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async shareFile(file: IFile, shareWith: IUser[]) {
        try {
            await $api.patch<IFile>('/files/setSharedUsers', {
                fileId: file._id,
                userIds: shareWith.map((u) => u._id),
            })
            AlertsService.addAlert({ content: UploadFormLsi.onAccessChange[router.locale], theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async deleteFile(file: IFile) {
        try {
            await $api.delete(`/files?fileId=${file._id}`)
            AlertsService.addAlert({ content: UploadFormLsi.onDelete[router.locale], theme: 'info' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async downloadFile(file: IFile) {
        try {
            await $api.get(`/files/preDownload/${file._id}`)
            const link = document.createElement('a')
            link.href = `${API_URL}/files/download/${file._id}`
            link.setAttribute('download', file.originalname)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            AlertsService.alertFromError(error, UploadFormLsi.onDownloadFailed[router.locale])
        }
    }
}
