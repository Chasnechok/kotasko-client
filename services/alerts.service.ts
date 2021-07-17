import IAlert from '../components/alerts/alert.type'
import { addAlert, removeAlert } from '../components/alerts/alerts.slice'
import { store } from '../redux.store'
import { AxiosError } from 'axios'

export class AlertsService {
    static addAlert(alert: Partial<IAlert>) {
        const toCreate: IAlert = {
            content: alert.content || 'Произошла неизвестная ошибка',
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
            return this.addAlert(new Alert(content || 'Произошла неизвестная ошибка', 'danger'))
        }
        let alert: IAlert
        switch (error.response.status) {
            case 400:
                alert = new Alert(content || 'Ошибка валидации данных', 'danger')
                break
            case 401:
            case 403:
                alert = new Alert(content || 'Нет доступа', 'danger')
                break
            case 500:
            default:
                alert = new Alert(content || 'Ошибка сервера, попробуйте позже', 'danger')
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
