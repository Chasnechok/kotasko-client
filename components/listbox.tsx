import { Listbox as ListboxComponent, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { Fragment } from 'react'

interface ListboxProps {
    options: {
        label: string
        value: any
    }[]
    value: any
    setValue: (value: any) => void
    className?: string
}

const Listbox: React.FC<ListboxProps> = ({ className, options, value, setValue }) => {
    function getLabel() {
        const idx = options.findIndex((item) => item.value === value)
        return options[idx] ? options[idx].label : ''
    }

    return (
        <ListboxComponent value={value} onChange={setValue}>
            <div className={`${className || 'max-w-2xs'} relative md:ml-0 text-sm xl:text-base`}>
                <ListboxComponent.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-blue-300 focus-visible:ring-offset-2 focus-visible:border-blue-500 sm:text-sm">
                    <span className="block truncate">{getLabel()}</span>
                    <SelectorIcon
                        className="absolute top-1/2 right-1 -translate-y-1/2 w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </ListboxComponent.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxComponent.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {options.map((option, i) => (
                            <ListboxComponent.Option
                                key={i}
                                className={({ active }) =>
                                    `${active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'}
                          cursor-default relative py-2 pl-10 pr-4`
                                }
                                value={option.value}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`${
                                                selected ? 'font-medium' : 'font-normal'
                                            } text-sm xl:text-base block truncate`}
                                        >
                                            {option.label}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`${active ? 'text-blue-600' : 'text-blue-600'}
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                                            >
                                                <CheckIcon className="w-5 h-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ListboxComponent.Option>
                        ))}
                    </ListboxComponent.Options>
                </Transition>
            </div>
        </ListboxComponent>
    )
}

export default Listbox
