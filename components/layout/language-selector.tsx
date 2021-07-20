import useLocale from '../../hooks/useLocale'
import Listbox from '../listbox'

interface LocaleSelectorProps {}

const LocaleSelector: React.FC<LocaleSelectorProps> = ({}) => {
    const { locale, locales, setLocale } = useLocale()

    function getLocaleName(locale: string): string {
        switch (locale) {
            case 'ru':
                return 'Русский'
            case 'ua':
                return 'Українська'
            case 'en':
                return 'English'
            default:
                return locale
        }
    }

    const options = locales.map((l) => ({
        label: getLocaleName(l),
        value: l,
    }))

    return (
        <Listbox
            shadow="none"
            className="max-w-full ring-1 ring-gray-900 rounded-lg"
            options={options}
            value={locale}
            setValue={setLocale}
        ></Listbox>
    )
}

export default LocaleSelector
