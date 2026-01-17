# Font Configuration

## Google Fonts

Add these fonts to your project (e.g., in `layout.tsx` or `index.html`):

- **Outfit**: Headings (Weights: 400, 500, 700)
- **Inter**: Body (Weights: 400, 500, 600)
- **JetBrains Mono**: Code/Data (Weights: 400)

## Tailwind Configuration

```typescript
theme: {
  extend: {
    fontFamily: {
      heading: ['Outfit', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    }
  }
}
```
