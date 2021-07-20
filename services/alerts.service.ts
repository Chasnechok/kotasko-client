import IAlert from '@models/alert.model'
import { addAlert, removeAlert } from '@components/alerts/alerts.slice'
import { store } from '../redux.store'
import { AxiosError } from 'axios'
import Router from 'next/router'
import AlertsLsi from '@lsi/alerts/index.lsi'
export class AlertsService {
    static addAlert(alert: Partial<IAlert>) {
        const toCreate: IAlert = {
            content: alert.content || AlertsLsi.unknown[Router.locale],
            closeAfterMS: alert.closeAfterMS || 4500,
            theme: alert.theme || 'info',
        }
        store.dispatch(addAlert(toCreate))
    }

    static removeAlert(alert: IAlert) {
        store.dispatch(removeAlert(alert))
    }

    static alertFromError(error: AxiosError, content?: string) {
        if (!error?.response?.status) {
            return this.addAlert(new Alert(content || AlertsLsi.unknown[Router.locale], 'danger'))
        }
        let alert: IAlert
        switch (error.response.status) {
            case 400:
                alert = new Alert(content || AlertsLsi[400][Router.locale], 'danger')
                break
            case 401:
            case 403:
                alert = new Alert(content || AlertsLsi[401][Router.locale], 'danger')
                break
            case 500:
            default:
                alert = new Alert(content || AlertsLsi[500][Router.locale], 'danger')
                break
        }
        this.addAlert(alert)
    }
}

class Alert implements IAlert {
    content: string
    closeAfterMS: number
    theme: 'danger' | 'success' | 'info'
    constructor(content: string, theme: 'danger' | 'success' | 'info', closeAfterMS?: number) {
        this.closeAfterMS = closeAfterMS || 4500
        this.content = content
        this.theme = theme
    }
}
