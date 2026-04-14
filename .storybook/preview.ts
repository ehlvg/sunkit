import '../src/styles/globals.css'
import type { Preview } from '@storybook/react'

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f7f6f3' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#222222' },
      ],
    },
    layout: 'centered',
  },
}

export default preview
