import { getAlerts } from './alerts-slice'
import { useSelector } from 'react-redux'
import AlertComponent from './alert-component'

interface AlertsListProps {}

const AlertsList: React.FC<AlertsListProps> = () => {
    const alerts = useSelector(getAlerts)
    if (!alerts || !alerts.length) return null
    return (
        <ul className="fixed z-40 top-0 py-2 px-4 max-w-md w-full left-1/2 -translate-x-1/2">
            {alerts.map((alert, i) => (
                <li key={i}>
                    <AlertComponent alert={alert} />
                </li>
            ))}
        </ul>
    )
}

export default AlertsList
