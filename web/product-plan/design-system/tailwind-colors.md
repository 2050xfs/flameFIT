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

## Usage Guidelines

- **Primary (orange)**: primary CTAs, progress highlights, active states.
- **Secondary (rose)**: protein macro, alerts that indicate intensity.
- **Neutral (stone)**: backgrounds, borders, muted labels.

## State Tokens

Recommend defining semantic tokens in addition to base palettes:
- `success`: green
- `warning`: amber
- `danger`: red
- `info`: blue

Use semantic tokens in components so palette changes do not require refactoring.
