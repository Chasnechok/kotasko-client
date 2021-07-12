import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, DotsVerticalIcon } from '@heroicons/react/outline'
import { Fragment } from 'react'

type a = '48' | '52' | '56' | '60' | '64' | '72'
type width = `w-${a}`

interface MenuDropdownProps {
    label?: string
    type?: 'dots' | 'chevron'
    buttonClassName?: string
    chevronClassName?: string
    isStatic?: boolean
    width?: width
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({
    label,
    type = 'chevron',
    children,
    buttonClassName,
    chevronClassName,
    isStatic = false,
    width,
}) => {
    return (
        <Menu as="div" className={`relative inline-block ${width || 'w-48'}`}>
            <div>
                <Menu.Button
                    className={`inline-flex w text-right justify-end w-full py-2 text-sm font-medium rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${buttonClassName}`}
                >
                    {type === 'chevron' ? (
                        <Fragment>
                            {label || ''}
                            <ChevronDownIcon className={`w-5 h-5 ml-2 -mr-1 ${chevronClassName}`} aria-hidden="true" />
                        </Fragment>
                    ) : (
                        <DotsVerticalIcon className={`w-5 h-5 ml-2 -mr-1 ${chevronClassName}`} aria-hidden="true" />
                    )}
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    static={isStatic}
                    className="absolute z-20 overflow-hidden w-full right-0 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                    {children}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default MenuDropdown
