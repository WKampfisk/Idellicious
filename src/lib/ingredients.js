import { RECIPES, normalizeIngredientName } from "@/data/recipes";

export function ingredientKey(name) {
  return normalizeIngredientName(name);
}

/** Overlap score between two recipes (count of shared normalized ingredients) */
export function overlapScore(recipeA, recipeB) {
  if (!recipeA || !recipeB || recipeA.id === recipeB.id) return 0;
  const setA = new Set(recipeA.ingredients.map((i) => ingredientKey(i.name)));
  let n = 0;
  const shared = [];
  for (const ing of recipeB.ingredients) {
    const k = ingredientKey(ing.name);
    if (setA.has(k)) {
      n += 1;
      shared.push(ing.name);
    }
  }
  return { score: n, shared };
}

/** Best complementary recipes for a given recipe */
export function getRelatedRecipes(recipe, { limit = 4, excludeKeys = [] } = {}) {
  if (!recipe) return [];
  const exclude = new Set([recipe.key, recipe.id, ...excludeKeys]);
  return RECIPES.filter((r) => !exclude.has(r.key) && !exclude.has(r.id))
    .map((r) => {
      const { score, shared } = overlapScore(recipe, r);
      return { recipe: r, score, shared };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Merge recipe ingredients into shopping-shaped lines */
export function mergeIngredientsIntoLines(existingLines, recipe, scale = 1) {
  const lines = [...(existingLines || [])].map((l) => ({ ...l }));
  for (const ing of recipe.ingredients || []) {
    const key = ingredientKey(ing.name);
    const amount = Math.round(ing.amount * scale * 100) / 100;
    const found = lines.find((l) => ingredientKey(l.ingredient) === key);
    if (found) {
      found.amount = Math.round((Number(found.amount) + amount) * 100) / 100;
      const names = new Set([...(found.recipe_names || []), recipe.title]);
      found.recipe_names = [...names];
      const keys = new Set([...(found.recipe_keys || []), recipe.key]);
      found.recipe_keys = [...keys];
    } else {
      lines.push({
        ingredient: ing.name,
        amount,
        unit: ing.unit,
        recipe_names: [recipe.title],
        recipe_keys: [recipe.key],
        checked: false,
      });
    }
  }
  return lines;
}

/** Container needs for large batch (scale servings) */
export function containerNeeds(recipe, multiplier = 2) {
  const servings = Math.max(1, (recipe.servings || 1) * multiplier);
  return (recipe.containers || []).map((c) => ({
    ...c,
    count: Math.ceil(servings * (c.countPerServing || 1)),
  }));
}
