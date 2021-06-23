import { NextRouter } from 'next/router'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

interface ModeSelectorProps {
    router: NextRouter
    showShared: boolean
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ router, showShared }) => {
    const setRouteMode = (v) => {
        router.replace(v ? '/files?shared=true' : '/files', null, {
            shallow: true,
        })
    }
    return (
        <Listbox value={showShared} onChange={setRouteMode}>
            <div className="relative mx-auto md:ml-0 max-w-2xs">
                <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-blue-500 sm:text-sm">
                    <span className="block truncate">
                        {showShared ? 'Поделились с вами' : 'Ваши файлы'}
                    </span>
                    <SelectorIcon
                        className="absolute top-1/2 right-1 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {[true, false].map((mode, i) => (
                            <Listbox.Option
                                key={i}
                                className={({ active }) =>
                                    `${
                                        active
                                            ? 'text-blue-900 bg-blue-100'
                                            : 'text-gray-900'
                                    }
                          cursor-default relative py-2 pl-10 pr-4`
                                }
                                value={mode}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`${
                                                selected
                                                    ? 'font-medium'
                                                    : 'font-normal'
                                            } block truncate`}
                                        >
                                            {mode
                                                ? 'Поделились с вами'
                                                : 'Ваши файлы'}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`${
                                                    active
                                                        ? 'text-blue-600'
                                                        : 'text-blue-600'
                                                }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                            >
                                                <CheckIcon
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    )
}

export default ModeSelector
