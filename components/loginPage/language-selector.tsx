import useLocale from '@hooks/useLocale'

interface LanguageSelectorProps {
    classNames?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ classNames }) => {
    const { locale, setLocale } = useLocale()

    function setOppositeLocale() {
        if (['ru', 'ua'].includes(locale)) {
            return setLocale(locale == 'ru' ? 'ua' : 'ru')
        }
        setLocale('ru')
    }

    return (
        <a
            onClick={setOppositeLocale}
            className={`underline cursor-pointer text-gray-500 hover:text-gray-400 ${classNames}`}
        >
            {locale === 'ru' ? 'UA' : 'RU'}
        </a>
    )
}

export default LanguageSelector
