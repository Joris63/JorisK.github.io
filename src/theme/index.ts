import { definePreset } from '@primevue/themes';
import Aura from '@primevue/themes/aura';

const MyTheme = definePreset(Aura, {
  primitive: {
    // Primary scale — anchor 500: oklch(34.41% .063176 221.179)
    brand: {
      50: 'oklch(97%    0.008    221.179)',
      100: 'oklch(93%    0.018    221.179)',
      200: 'oklch(86%    0.033    221.179)',
      300: 'oklch(73%    0.05     221.179)',
      400: 'oklch(55%    0.062    221.179)',
      500: 'oklch(34.41% 0.063176 221.179)',
      600: 'oklch(28%    0.057    221.179)',
      700: 'oklch(22%    0.047    221.179)',
      800: 'oklch(16%    0.035    221.179)',
      900: 'oklch(10%    0.022    221.179)',
      950: 'oklch(7%     0.013    221.179)',
    },

    // Info scale — anchor 500: oklch(57% .16 240) — clean blue, analogous to teal palette
    info: {
      50: 'oklch(97%    0.015  240)',
      100: 'oklch(93%    0.035  240)',
      200: 'oklch(87%    0.07   240)',
      300: 'oklch(78%    0.11   240)',
      400: 'oklch(68%    0.14   240)',
      500: 'oklch(57%    0.16   240)',
      600: 'oklch(47%    0.145  240)',
      700: 'oklch(37%    0.12   240)',
      800: 'oklch(27%    0.09   240)',
      900: 'oklch(18%    0.055  240)',
      950: 'oklch(12%    0.032  240)',
    },

    // Secondary scale — anchor 500: oklch(74.91% .0999 204.37)
    secondary: {
      50: 'oklch(98%    0.012  204.37)',
      100: 'oklch(96%    0.025  204.37)',
      200: 'oklch(92%    0.045  204.37)',
      300: 'oklch(87%    0.065  204.37)',
      400: 'oklch(82%    0.085  204.37)',
      500: 'oklch(74.91% 0.0999 204.37)',
      600: 'oklch(62%    0.092  204.37)',
      700: 'oklch(49%    0.08   204.37)',
      800: 'oklch(36%    0.062  204.37)',
      900: 'oklch(23%    0.042  204.37)',
      950: 'oklch(15%    0.025  204.37)',
    },
  },

  semantic: {
    primary: {
      50: '{brand.50}',
      100: '{brand.100}',
      200: '{brand.200}',
      300: '{brand.300}',
      400: '{brand.400}',
      500: '{brand.500}',
      600: '{brand.600}',
      700: '{brand.700}',
      800: '{brand.800}',
      900: '{brand.900}',
      950: '{brand.950}',
    },
  },

  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            secondary: {
              background: '{secondary.500}',
              hoverBackground: '{secondary.600}',
              activeBackground: '{secondary.700}',
              borderColor: '{secondary.500}',
              hoverBorderColor: '{secondary.600}',
              activeBorderColor: '{secondary.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{secondary.500}', shadow: 'none' },
            },
            info: {
              background: '{info.500}',
              hoverBackground: '{info.600}',
              activeBackground: '{info.700}',
              borderColor: '{info.500}',
              hoverBorderColor: '{info.600}',
              activeBorderColor: '{info.700}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: { color: '{info.500}', shadow: 'none' },
            },
          },
          outlined: {
            info: {
              hoverBackground: '{info.50}',
              activeBackground: '{info.100}',
              borderColor: '{info.300}',
              color: '{info.600}',
            },
            secondary: {
              hoverBackground: '{secondary.50}',
              activeBackground: '{secondary.100}',
              borderColor: '{secondary.300}',
              color: '{secondary.600}',
            },
          },
          text: {
            info: {
              hoverBackground: '{info.50}',
              activeBackground: '{info.100}',
              color: '{info.600}',
            },
            secondary: {
              hoverBackground: '{secondary.50}',
              activeBackground: '{secondary.100}',
              color: '{secondary.600}',
            },
          },
        },
      },
    },
  },
});

export default MyTheme;
