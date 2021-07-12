module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    corePlugins: {
        flex: true,
        textOverflow: true,
        ringOffsetColor: true,
        ringOffsetWidth: true,
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            body: ['Inter', 'system-ui', '-apple-system', 'Segoe\\ UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        },
        extend: {
            maxWidth: {
                '3xs': '10rem',
                '2xs': '15rem',
            },
            animation: {
                'delete-bar': 'moveright 2600ms linear',
            },
            keyframes: {
                moveright: {
                    '0%': { transform: 'translateX(-100%)' },
                },
            },
        },
    },
    variants: {
        extend: {},
        scrollbar: ['rounded'],
    },
    plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms'), require('tailwind-scrollbar')],
}
