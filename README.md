# Idellicious

Culinary companion — recipe discovery, meal prep, and waste-smart shopping.

Built on [Base44](https://base44.com) with Vite, React, Tailwind CSS, and the Base44 SDK.

## Features

- **Discover feed** — Recipe cards with high-res Unsplash photography, Like / Dislike controls
- **Recipe detail** (`/recipe/:id`) — Ingredients, step-by-step instructions, large-batch meal prep with container counts
- **Pairs well with** — Related recipes highlighting shared ingredients
- **Waste-reduction toasts** — Suggest complementary recipes when adding to the shopping list
- **Shopping list** — Merged multi-recipe ingredients, check-off, clear checked
- **Favorites** — Saved recipes at `/favorites`

## Data

| Entity | Purpose |
|--------|---------|
| `RecipePreference` | `recipe_key` + `liked` / `disliked` for feed personalization |
| `ShoppingItem` | Ingredient lines with amounts, units, cross-recipe names, checked state |

Recipe catalog lives in `src/data/recipes.js` (local constants with Unsplash image URLs). Preferences and shopping persist via Base44 entities when signed in, or `localStorage` when anonymous.

## Local development

```bash
npm install
npx base44 login   # if needed
npx base44 dev     # or npm run dev
```

App is linked to Base44 project **Idellicious** (`base44/.app.jsonc`).

## Deploy

```bash
npm run build
npx base44 entities push
npx base44 deploy -y
```

## Design

- Emerald / lime warm palette, mobile-first Tailwind layouts
- Custom `Image` component (Wix Media Platform) for optimized delivery
- WCAG-minded contrast, keyboard focus, and ARIA labels on controls
