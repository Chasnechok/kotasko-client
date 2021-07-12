import { Fragment } from 'react'

interface InputProps {
    label?: string
    required?: boolean
    id: string
    placeholder?: string
    value: string
    onChange: (value: string) => void
    readonly?: boolean
    textArea?: boolean
}
/**
 * @returns React.Fragment of label and text input
 */
const Input: React.FC<InputProps> = ({ label, required, id, placeholder, value, onChange, readonly, textArea }) => {
    return (
        <Fragment>
            {label && (
                <label className="select-none" htmlFor={id}>
                    {label}
                    {required && <sup className="text-red-500 font-bold text-md">*</sup>}
                </label>
            )}
            {textArea ? (
                <textarea
                    className="mt-1 appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
                    id={id}
                    placeholder={placeholder || ''}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readonly}
                ></textarea>
            ) : (
                <input
                    className="mt-1 appearance-none border border-gray-500 text-gray-500 focus:text-gray-600 rounded-md w-full py-2 px-3 leading-tight focus:border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-1"
                    id={id}
                    type="text"
                    placeholder={placeholder || ''}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readonly}
                />
            )}
        </Fragment>
    )
}

export default Input
