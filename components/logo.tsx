import Image from 'next/image'
import LogoTruck from '../public/icons/logo-truck.svg'

interface LogoProps {
    className?: string
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <div className={`logo flex items-end pointer-events-none ${className}`}>
            <h1
                style={{ textDecorationColor: 'black' }}
                className="text-blue-600 font-bold underline text-2xl cursor-default"
            >
                &nbsp;Kotasko&nbsp;
            </h1>
            <Image alt="logo" height="32px" width="32px" src={LogoTruck} />
        </div>
    )
}

export default Logo
