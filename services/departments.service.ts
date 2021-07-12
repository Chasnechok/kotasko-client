import $api from '../http'
import IDepartment from '../models/department'
import IOrganisation from '../models/organisation'
import { AlertsService } from './alerts.service'

export default class DepartmentService {
    static async create(name: string, address: string, serviceAllowed: boolean, organisation: IOrganisation) {
        try {
            const created = await $api.post<IDepartment>('/department/create', {
                name,
                address,
                organisation: organisation._id,
            })
            AlertsService.addAlert({ content: 'Департамент создан', theme: 'success' })
            return created.data
        } catch (error) {
            AlertsService.alertFromError(error)
        }
    }
}
