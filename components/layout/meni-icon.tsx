interface MenuIconProps {
    menuOpened: boolean
    handleMenu: (menuOpened: boolean) => void
}

const MenuIcon: React.FC<MenuIconProps> = ({ menuOpened, handleMenu }) => {
    return (
        <div
            className="menu-icon relative w-5 h-5 flex md:hidden flex-col justify-center gap-y-1"
            onClick={() => handleMenu(!menuOpened)}
        >
            <div
                style={{ height: '2px' }}
                className={`line w-full bg-black transition-transform transform rounded-md ${
                    menuOpened ? 'hidden' : ''
                }`}
            ></div>
            <div
                style={{ height: '2px' }}
                className={`line w-full bg-black transition-transform transform rounded-md ${
                    menuOpened ? 'rotate-45 translate-y-1' : ''
                }`}
            ></div>
            <div
                style={{ height: '2px' }}
                className={`line w-full bg-black transition-transform transform rounded-md ${
                    menuOpened ? '-rotate-45 -translate-y-0.5' : ''
                }`}
            ></div>
        </div>
    )
}

export default MenuIcon
