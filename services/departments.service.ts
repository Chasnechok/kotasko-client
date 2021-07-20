import $api from '../http'
import IDepartment from '@models/department'
import IOrganisation from '@models/organisation'
import { AlertsService } from './alerts.service'
import Router from 'next/router'
import DepCreateLsi from '@lsi/admin/dep-create.lsi'

export default class DepartmentService {
    static async create(name: string, address: string, isServiceAllowed: boolean, organisation: IOrganisation) {
        try {
            const created = await $api.post<IDepartment>('/department/create', {
                name,
                address,
                isServiceAllowed,
                organisation: organisation._id,
            })
            AlertsService.addAlert({ content: DepCreateLsi.onSuccess[Router.locale], theme: 'success' })
            return created.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }

    static async update() {}
}
