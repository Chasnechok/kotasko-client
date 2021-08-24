import Image from 'next/image'
import { ChoreTypes } from '@models/chore'
import VirusIcon from '../../public/icons/chores/virus.svg'
import OtherIcon from '../../public/icons/chores/service.svg'
import PrineterMaintenanceIcon from '../../public/icons/chores/printer-maintenance.svg'
import HelpIcon from '../../public/icons/chores/help.svg'
import SWInstallIcon from '../../public/icons/chores/software-installer.svg'
import BadConnectionIcon from '../../public/icons/chores/without-internet.svg'
import NoFilesIcon from '../../public/icons/chores/file-missing.svg'
import OSReinstallIcon from '../../public/icons/chores/system-reinstall.svg'
import OSSlowIcon from '../../public/icons/chores/system-slow.svg'

interface ChoreTypeIconProps {
    type: ChoreTypes
}

const ChoreTypeIcon: React.FC<ChoreTypeIconProps> = ({ type }) => {
    function resolveIconType(): StaticImageData {
        switch (type) {
            case ChoreTypes.APP_HELP:
                return HelpIcon
            case ChoreTypes.APP_INSTALL:
                return SWInstallIcon
            case ChoreTypes.CONNECTION:
                return BadConnectionIcon
            case ChoreTypes.FILES_MISSING:
                return NoFilesIcon
            case ChoreTypes.OS_REINSTALL:
                return OSReinstallIcon
            case ChoreTypes.OS_SLOW:
                return OSSlowIcon
            case ChoreTypes.PRINTER_BROKE:
                return PrineterMaintenanceIcon
            case ChoreTypes.VIRUS:
                return VirusIcon
            case ChoreTypes.OTHER:
            default:
                return OtherIcon
        }
    }

    return <Image src={resolveIconType()} />
}

export default ChoreTypeIcon
