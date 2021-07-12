import { Children, Dispatch, SetStateAction } from 'react'
import SimpleSpinner from '../simple-spinner'

interface ColumnProps {
    name: string
    setFormOpened: Dispatch<SetStateAction<boolean>>
    loading: boolean
}

const Column: React.FC<ColumnProps> = ({ children, name, setFormOpened, loading }) => {
    return (
        <div className="flex-1 px-2 xl:px-4 pb-4 min-w-full h-full relative lg:min-w-0">
            <div className="bg-blue-100/50 rounded-xl h-full relative">
                <div className="absolute w-full">
                    <div className="flex justify-between px-4 py-4 select-none">
                        <h1 className="text-gray-900 font-medium">{name}</h1>
                        <div className="text-blue-800 leading-none p-1 rounded bg-blue-200">
                            {loading ? <SimpleSpinner /> : Children.count(children)}
                        </div>
                    </div>
                    <button
                        onClick={() => setFormOpened(true)}
                        className="text-blue-800 text-2xl block w-11/12 hover:bg-blue-300 text-center select-none leading-none mx-auto py-1 rounded bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    >
                        +
                    </button>
                </div>
                <div className="mx-auto my-5 lg:my-0 pt-28 lg:pb-4 w-11/12 h-full">
                    <ul className="max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-gray-200 scrollbar-track-gray-100">
                        {children}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Column
