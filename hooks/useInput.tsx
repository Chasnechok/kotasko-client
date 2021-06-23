import { useState } from 'react'
/**
 *
 * @param initialValue initial input value
 * @returns cartage of [value, onChange]
 */
export default function useInput<T>(initialValue: T): Array<any> {
    const [value, setValue] = useState<T>(initialValue)

    const onChange = (e) => {
        return setValue(e.target.value)
    }

    return [value, onChange]
}
