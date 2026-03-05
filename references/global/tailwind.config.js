/** @type {import('tailwindcss').Config} */

let customConfig = {};
try {
    customConfig = require('./tailwind.custom.config.json');
} catch (e) {
    console.log('No custom config found')
}
const { toOklch, buildOklchScale, colorToOklchString } = require('./tailwind.utility');

const defaultThemeColors = {
    body: '#000000',
    primary: '#ff5500',
    secondary: '#303940',
    light: '#f8fafc',
    dark: '#303940',
    form: '#e4e6eb',
};

const effectiveColors = { ...defaultThemeColors, ...customConfig?.color };

module.exports = {
    content: [
        './layout/*.twig',
        './layout/components/*.twig',
        './templates/**/*.twig',
        './snippets/**/*.twig',
        './snippets/*.twig',
        './assets/js/common.js',
    ],
    future: {
        hoverOnlyWhenSupported: true
    },
    theme: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1440px'
        },
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem'
            },
        },
        fontFamily: {
            sans: [`${customConfig?.typography?.font?.family || 'Inter'}`, '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Helvetica', 'Arial', 'sans-serif'],
            secondary: [`${customConfig?.typography?.secondaryFont?.family || customConfig?.typography?.font?.family || 'Inter'}`, '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Helvetica', 'Arial', 'sans-serif'],
            rtl: [`${customConfig?.typography?.rtlFont?.family || customConfig?.typography?.font?.family || 'Inter'}`, '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Helvetica', 'Arial', 'sans-serif'],
        },
        extend: {
            borderRadius: {
                'custom': 'var(--radius)',
                'form': 'var(--form-radius)',
            },
            colors: {
                'body': buildOklchScale(toOklch(effectiveColors.body)),
                'primary': buildOklchScale(toOklch(effectiveColors.primary)),
                'secondary': buildOklchScale(toOklch(effectiveColors.secondary)),
                'dark': buildOklchScale(toOklch(effectiveColors.dark)),
                'light': buildOklchScale(toOklch(effectiveColors.light)),
                'form': buildOklchScale(toOklch(effectiveColors.form)),
            },
            height: {
                'form': 'var(--form-height)',
            }
        },
    },
    safelist: [
        'animate-spin',
        'mx-auto',
        'md:mx-auto',
        'lg:mx-auto',
        'text-primary',
        'bg-primary',
        'grid',
        'flex',
        'relative',
        'block',
        'hidden',
        'inline-block',
        'flex-wrap',
        'flex-col',
        'w-full',
        'h-full',
        'h-auto',
        'cursor-pointer',
        'order-last',
        'rounded-custom',
        'rounded-full',
        'object-cover',
        'flag',
        'selection-dropdown',
        'modal',
        'notify',
        'drawer',
        'dropdown',
        'border-custom',
        'btn',
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'text-red-500',
        'text-green-500',
        {
            pattern: /swiper-.*/,
        },
        {
            pattern: /col-span-(1|2|3|4|5|6|7|8|9|10|11|12)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /container/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /px-(1|2|3|4|5|6|7|8|9|10)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /gap-(1|2|3|4|5|6|7|8|9|10)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /justify-(center|between|stretch)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        {
            pattern: /items-(center|start|end)/,
            variants: ['sm', 'md', 'lg', 'xl', '2xl']
        },
        ...Array.from({ length: 12 }, (_, i) => i + 1).flatMap(x =>
            Array.from({ length: 12 }, (_, j) => j + 1).flatMap(y => [
                `w-${x}/${y}`,      // Normal class
                `sm:w-${x}/${y}`,   // Responsive
                `md:w-${x}/${y}`,
                `lg:w-${x}/${y}`,
                `xl:w-${x}/${y}`,
                `2xl:w-${x}/${y}`
            ])
        )
    ],
    plugins: [
        function({ addBase }) {
            addBase({
                ':root': {
                    '--body': colorToOklchString(effectiveColors.body),
                    '--primary': colorToOklchString(effectiveColors.primary),
                    '--secondary': colorToOklchString(effectiveColors.secondary),
                    '--light': colorToOklchString(effectiveColors.light),
                    '--dark': colorToOklchString(effectiveColors.dark),
                    '--form': colorToOklchString(effectiveColors.form),
                },
            });
        },
        require("@tailwindcss/typography"),
        function({ addUtilities }) {
            addUtilities({
                '.aspect-product': {
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'aspect-ratio': `1 / ${customConfig?.imageHeightWidthRatio || 1.5}`,
                },
            });
        }
    ]
}