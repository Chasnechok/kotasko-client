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
                '2xs': '15rem',
            },
            animation: {
                'delete-bar': 'moveright 5s linear',
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
    },
    plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
