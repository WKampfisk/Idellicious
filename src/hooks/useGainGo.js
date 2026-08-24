import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  clearCheckedShopping,
  listPreferences,
  listShopping,
  saveFullShoppingList,
  setPreference,
  updateShoppingItem,
} from "@/lib/gainGoApi";
import { getRelatedRecipes, mergeIngredientsIntoLines } from "@/lib/ingredients";
import { RECIPES } from "@/data/recipes";

export function useGainGo() {
  const [prefs, setPrefs] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([listPreferences(), listShopping()]);
      setPrefs(Array.isArray(p) ? p : []);
      setShopping(Array.isArray(s) ? s : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const prefMap = useMemo(() => {
    const m = {};
    for (const p of prefs) {
      if (p?.recipe_key) m[p.recipe_key] = p.preference;
    }
    return m;
  }, [prefs]);

  const like = useCallback(async (recipe) => {
    const next = prefMap[recipe.key] === "liked" ? "liked" : "liked";
    await setPreference(recipe.key, next);
    setPrefs((prev) => {
      const rest = prev.filter((x) => x.recipe_key !== recipe.key);
      return [...rest, { id: `tmp_${recipe.key}`, recipe_key: recipe.key, preference: "liked" }];
    });
    toast({ title: "Saved to favorites", description: recipe.title });
  }, [prefMap]);

  const dislike = useCallback(async (recipe) => {
    await setPreference(recipe.key, "disliked");
    setPrefs((prev) => {
      const rest = prev.filter((x) => x.recipe_key !== recipe.key);
      return [...rest, { id: `tmp_${recipe.key}`, recipe_key: recipe.key, preference: "disliked" }];
    });
    toast({ title: "Hidden from feed", description: recipe.title });
  }, []);

  const addToShopping = useCallback(
    async (recipe, { scale = 1 } = {}) => {
      const related = getRelatedRecipes(recipe, { limit: 3 });
      const merged = mergeIngredientsIntoLines(shopping, recipe, scale);
      const saved = await saveFullShoppingList(merged);
      setShopping(saved);

      if (related.length) {
        const top = related[0];
        toast({
          title: `${recipe.title} added to shopping list`,
          description: `Waste less: also try ${top.recipe.title} (shares ${top.shared.slice(0, 3).join(", ")})`,
        });
      } else {
        toast({
          title: "Added to shopping list",
          description: recipe.title,
        });
      }
      return { related, shopping: saved };
    },
    [shopping]
  );

  const toggleShop = useCallback(async (item) => {
    const updated = await updateShoppingItem(item.id, { checked: !item.checked });
    setShopping((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, checked: !item.checked, ...updated } : x))
    );
  }, []);

  const clearChecked = useCallback(async () => {
    const next = await clearCheckedShopping();
    setShopping(next);
    toast({ title: "Checked items cleared" });
  }, []);

  const feedRecipes = useMemo(
    () => RECIPES.filter((r) => prefMap[r.key] !== "disliked"),
    [prefMap]
  );

  const favoriteRecipes = useMemo(
    () => RECIPES.filter((r) => prefMap[r.key] === "liked"),
    [prefMap]
  );

  return {
    loading,
    prefs,
    prefMap,
    shopping,
    feedRecipes,
    favoriteRecipes,
    like,
    dislike,
    addToShopping,
    toggleShop,
    clearChecked,
    refresh,
  };
}
