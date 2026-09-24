import type { Preview } from '@storybook/nextjs-vite'
import { themes } from 'storybook/theming'
import '../build/css/tokens.css'
import './preview.css'

const preview: Preview = {
  initialGlobals: {
    viewport: { value: 'mobile390', isRotated: false },
  },

  parameters: {
    backgrounds: { disable: true },

    docs: { theme: themes.dark },

    viewport: {
      options: {
        mobile390: {
          name: 'Mobile 390',
          styles: { width: '390px', height: '844px' },
        },
      },
    },

    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;