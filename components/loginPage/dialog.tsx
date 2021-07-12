import { Dispatch, SetStateAction } from 'react'
import Lsi from '../../lsi/login-page.lsi'
import LsiComponent from '../../models/lsi-component'
import DialogModal from '../dialog-modal'

export interface LoginDialogProps extends LsiComponent {
    isDialogOpen: boolean
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isDialogOpen, setIsDialogOpen, language }) => {
    return (
        <DialogModal
            title={Lsi.detailsSummary[language]}
            description={Lsi.details[language]}
            formOpened={isDialogOpen}
            setFormOpened={setIsDialogOpen}
        >
            <div className="mt-4">
                <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => setIsDialogOpen(false)}
                >
                    {Lsi.detailsClose[language]}
                </button>
            </div>
        </DialogModal>
    )
}

export default LoginDialog
