const colorPalette = {
  // Primary Color Variations
  primary: {
    main: '#00b96b', // Original primary color
    light: '#4ade80', // Lighter shade for hover states
    dark: '#008c56', // Darker shade for active states
    contrast: '#ffffff' // Contrasting text color
  },

  // Secondary Colors (Complementary and Analogous)
  secondary: {
    main: '#0077be', // Complementary blue
    light: '#4fb3ff', // Lighter blue
    dark: '#005c8f' // Darker blue
  },

  // Neutral Colors (Grayscale)
  neutral: {
    white: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    black: '#000000'
  },

  // Semantic Colors
  semantic: {
    success: {
      main: '#10b981', // Green for success
      light: '#6ee7b7',
      dark: '#047857'
    },
    warning: {
      main: '#f59e0b', // Amber for warnings
      light: '#fcd34d',
      dark: '#b45309'
    },
    error: {
      main: '#ef4444', // Red for errors
      light: '#fca5a5',
      dark: '#b91c1c'
    },
    info: {
      main: '#3b82f6', // Blue for info
      light: '#93c5fd',
      dark: '#1d4ed8'
    }
  },

  // Background and Surface Colors
  background: {
    default: '#f6ffed', // Light green background from original theme
    paper: '#ffffff', // White surface color
    subtle: '#f9fafb' // Very light gray for subtle backgrounds
  }
}

export default colorPalette
