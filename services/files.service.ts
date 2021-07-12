import $api from '../http'
import IFile from '../models/file'
import ITask from '../models/task'
import IUser from '../models/user'
import { AlertsService } from './alerts.service'

export default class FilesService {
    static async uploadFiles(files: File[], shareWith?: IUser[], linkedTasks?: ITask[]) {
        try {
            if (!files || !files.length) return
            const dtoIn = new FormData()
            if (shareWith) shareWith.forEach((u) => dtoIn.append('shared', u._id))
            if (linkedTasks) linkedTasks.forEach((t) => dtoIn.append('linkedTasks', t._id))
            files.forEach((vf) => dtoIn.append('files', vf))
            const uploaded = await $api.post<IFile[]>('/files/upload', dtoIn)
            AlertsService.addAlert({ content: 'Файл(ы) успешно загружены на сервер', theme: 'success' })
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
            AlertsService.addAlert({ content: 'Права доступа к файлу обновлены', theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async deleteFile(file: IFile) {
        try {
            await $api.delete(`/files?fileId=${file._id}`)
            AlertsService.addAlert({ content: 'Файл удален', theme: 'success' })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }
}
