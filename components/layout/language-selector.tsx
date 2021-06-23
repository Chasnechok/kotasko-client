import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import LsiComponent from '../../models/lsi-component'

export interface LanguageSelectorProps extends LsiComponent {
    setLanguage: () => void
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    language,
    setLanguage,
}) => {
    return (
        <Listbox value={language} onChange={setLanguage}>
            <div className="relative mt-1">
                <Listbox.Button className="relative shadow-md cursor-pointer w-full py-2 pl-3 pr-10 text-gray-800 text-left bg-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                    <span className="block truncate">
                        {language === 'ru' ? 'Русский' : 'Українська'}
                    </span>
                    <span className="absolute top-1/2 right-3 transform -translate-y-1/2">
                        <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {['ua', 'ru'].map((lang, langIdx) => (
                            <Listbox.Option
                                key={langIdx}
                                className={({ active }) =>
                                    `${
                                        active
                                            ? 'text-blue-900 bg-blue-100'
                                            : 'text-gray-900'
                                    }
                          cursor-default relative py-2 pl-10 pr-4`
                                }
                                value={lang}
                            >
                                {({ selected }) => (
                                    <Fragment>
                                        <span
                                            className={`${
                                                selected
                                                    ? 'font-medium'
                                                    : 'font-normal'
                                            } block truncate`}
                                        >
                                            {lang === 'ru'
                                                ? 'Русский'
                                                : 'Українська'}
                                        </span>
                                        {selected ? (
                                            <span className="text-blue-600 absolute inset-y-0 left-0 flex items-center pl-3">
                                                <CheckIcon
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </Fragment>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default LanguageSelector
