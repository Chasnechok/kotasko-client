import { useRef, Fragment, Dispatch, SetStateAction } from 'react'

interface DragAreaProps {
    setFiles: Dispatch<SetStateAction<FileList>>
}

const DragArea: React.FC<DragAreaProps> = ({ setFiles }) => {
    const inputRef = useRef<HTMLInputElement>()
    function handleOnDrop() {
        setFiles(inputRef.current.files)
    }
    return (
        <Fragment>
            <div className="border-dashed border-2 group relative focus-within:border-blue-900 hover:border-blue-900 rounded border-gray-400 w-full h-full">
                <input
                    className="focus:outline-none h-full w-full cursor-pointer opacity-0"
                    type="file"
                    name="fileDrop"
                    id="fileDrop"
                    ref={inputRef}
                    multiple
                    onInput={handleOnDrop}
                    onDrop={handleOnDrop}
                />
                <p className="absolute w-full text-center text-gray-400 pointer-events-none cursor-pointer group-focus-within:text-blue-900 group-hover:text-blue-900 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    Загрузить файлы
                </p>
            </div>
        </Fragment>
    )
}

export default DragArea
