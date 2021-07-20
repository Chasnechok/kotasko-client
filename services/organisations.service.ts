import $api from '../http'
import IOrganisation from '@models/organisation'
import { AlertsService } from './alerts.service'
import Router from 'next/router'
import OrgCreateLsi from '@lsi/admin/org-create.lsi'

export default class OrganisationsService {
    static async create(name: string, address: string) {
        try {
            const created = await $api.post<IOrganisation>('/organisation/create', {
                name,
                address,
            })
            AlertsService.addAlert({ content: OrgCreateLsi.onSuccess[Router.locale], theme: 'success' })
            return created.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async update() {}
}
