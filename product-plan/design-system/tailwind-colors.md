# Tailwind Color Configuration

Configure your `tailwind.config.ts` to use these colors:

```typescript
import colors from 'tailwindcss/colors'

export default {
  theme: {
    extend: {
      colors: {
        primary: colors.orange,
        secondary: colors.rose,
        neutral: colors.stone, // Used as 'gray'
      }
    }
  }
}
```
