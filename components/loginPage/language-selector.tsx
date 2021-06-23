import LsiComponent from '../../models/lsi-component'

export interface LanguageSelectorProps extends LsiComponent {
    onChange: () => void
    classNames?: string
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    language,
    onChange,
    classNames,
}) => {
    return (
        <a
            onClick={onChange}
            className={`underline cursor-pointer text-gray-500 hover:text-gray-400 ${classNames}`}
        >
            {language === 'ru' ? 'UA' : 'RU'}
        </a>
    )
}

export default LanguageSelector
