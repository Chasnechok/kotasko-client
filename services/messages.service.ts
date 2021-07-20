import $api from '../http'
import { InputAttachments } from '../models/file'
import { IMessage, MessagesTypes } from '../models/message'
import { AlertsService } from './alerts.service'
import FilesService from './files.service'

export default class MessagesService {
    static async sendMessage(
        content: string,
        type: MessagesTypes,
        attachments: InputAttachments,
        referencedEntityId: string
    ) {
        try {
            let uploadedFiles
            if (attachments && attachments.toUpload && attachments.toUpload.length) {
                uploadedFiles = await FilesService.uploadFiles(attachments.toUpload)
            }
            if (attachments && !attachments.onServer) attachments.onServer = []
            const attachmentsToLink = attachments
                ? attachments.onServer.map((f) => f._id).concat(uploadedFiles ? uploadedFiles.map((f) => f._id) : [])
                : []
            await $api.post<IMessage>('/messages/create', {
                referencedEntity: referencedEntityId,
                content,
                type,
                attachments: attachmentsToLink,
            })
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }
}
