import { Disclosure as DisclosureComponent } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/outline'

interface DisclosureProps {
    label: string
    className?: string
}

const Disclosure: React.FC<DisclosureProps> = ({ label, children, className }) => {
    return (
        <div className={`w-full p-2 bg-white rounded-2xl ${className || ''}`}>
            <DisclosureComponent>
                {({ open }) => (
                    <>
                        <DisclosureComponent.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                            <span className="select-none">{label}</span>
                            <ChevronUpIcon className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`} />
                        </DisclosureComponent.Button>
                        <DisclosureComponent.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            {children}
                        </DisclosureComponent.Panel>
                    </>
                )}
            </DisclosureComponent>
        </div>
    )
}

export default Disclosure
