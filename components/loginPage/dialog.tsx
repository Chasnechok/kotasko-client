import useLocale from '@hooks/useLocale'
import { Dispatch, SetStateAction } from 'react'
import Lsi from '@lsi/login/index.lsi'
import DialogModal from '../dialog-modal'

export interface LoginDialogProps {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isDialogOpen, setIsDialogOpen }) => {
    const { locale } = useLocale()
    return (
        <DialogModal
            title={Lsi.detailsSummary[locale]}
            description={Lsi.details[locale]}
            formOpened={isDialogOpen}
            setFormOpened={setIsDialogOpen}
        >
            <div className="mt-4">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsDialogOpen(false)}
                >
                    {Lsi.detailsClose[locale]}
                </button>
            </div>
        </DialogModal>
    )
}

export default LoginDialog
