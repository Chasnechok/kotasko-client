import { Switch } from '@headlessui/react'

interface SwitchProps {
    label?: string | JSX.Element
    checked: boolean
    onChange: (isToggled: boolean) => void
    className?: string
    required?: boolean
    onBg?: boolean
    bgClassName?: string
}

const SwitchGroup: React.FC<SwitchProps> = ({ label, checked, onChange, className, required, onBg, bgClassName }) => {
    function switchComponent() {
        return (
            <Switch.Group>
                <div className={`flex pb-3 pt-1 flex-wrap items-center relative ${className}`}>
                    <Switch.Label className="mr-4 select-none w-8/12">
                        {label}
                        {required && <sup className="text-red-500 font-bold text-md">*</sup>}
                    </Switch.Label>
                    <Switch
                        checked={checked}
                        onChange={(isToggled) => onChange(isToggled)}
                        className={`
                        ${checked ? 'bg-blue-600' : 'bg-gray-200 group-hover:bg-gray-400'}
                        relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        <span
                            className={`${
                                checked ? 'translate-x-6' : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                        />
                    </Switch>
                </div>
            </Switch.Group>
        )
    }

    if (onBg) {
        return (
            <SwitchBackground bgClassName={bgClassName} checked={checked}>
                {switchComponent()}
            </SwitchBackground>
        )
    }

    return switchComponent()
}

interface SwitchBackgroundProps {
    checked: boolean
    bgClassName?: string
}
const SwitchBackground: React.FC<SwitchBackgroundProps> = ({ children, checked, bgClassName }) => {
    return (
        <div
            className={`cursor-default group my-3 ${
                checked
                    ? 'text-blue-900 bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500'
                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-500'
            } relative py-3 px-4 rounded-md max-h-60 focus:outline-none text-sm ${bgClassName || ''}`}
        >
            {children}
        </div>
    )
}

export default SwitchGroup
