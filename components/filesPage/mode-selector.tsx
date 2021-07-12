import { useRouter } from 'next/router'
import Listbox from '../listbox'

interface ModeSelectorProps {}

const ModeSelector: React.FC<ModeSelectorProps> = () => {
    const router = useRouter()
    const path = router.pathname
    const showShared = router.query.hasOwnProperty('shared')
    const setRouteMode = (v: string) => {
        router.replace(v ? path + '?shared=true' : path, null, {
            shallow: true,
        })
    }

    function getValues() {
        if (path === '/files') {
            return [
                {
                    value: true,
                    label: 'Поделились с вами',
                },
                {
                    value: false,
                    label: 'Ваши файлы',
                },
            ]
        }
        if (path === '/tasks') {
            return [
                {
                    value: true,
                    label: 'Порученные вам',
                },
                {
                    value: false,
                    label: 'Созданные вами',
                },
            ]
        }
    }

    return <Listbox value={showShared} options={getValues()} setValue={setRouteMode} />
}

export default ModeSelector
