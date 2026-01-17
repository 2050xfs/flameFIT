# Font Configuration

## Google Fonts

Add these fonts to your project (e.g., in `layout.tsx` or `index.html`):

- **Outfit**: Headings (Weights: 400, 500, 700)
- **Inter**: Body (Weights: 400, 500, 600)
- **JetBrains Mono**: Code/Data (Weights: 400)

## Usage Guidelines

- **Headings**: Use Outfit for section titles, KPI labels, and card headers.
- **Body**: Use Inter for paragraph text, instructions, and helper text.
- **Mono**: Use JetBrains Mono for numeric stats, IDs, and time-based data.

## Accessibility Notes

- Avoid using font weight alone to convey meaning.
- Ensure body text size ≥ 14px and line-height ≥ 1.4.

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
