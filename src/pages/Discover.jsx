import RecipeCard from "@/components/RecipeCard";
import { useGainGo } from "@/hooks/useGainGo";

export default function Discover() {
  const { loading, feedRecipes, prefMap, like, dislike, addToShopping } = useGainGo();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950">Discover</h1>
        <p className="text-sm text-stone-600">
          Like recipes you love, hide the rest. Add to shopping to get waste-smart pairings.
        </p>
      </header>

      {loading && !feedRecipes.length ? (
        <p className="text-sm text-stone-500" role="status">
          Loading recipes…
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              preference={prefMap[recipe.key]}
              onLike={like}
              onDislike={dislike}
              onAddShopping={addToShopping}
            />
          ))}
        </div>
      )}

      {!loading && !feedRecipes.length && (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center">
          <p className="font-medium text-emerald-900">No recipes in your feed</p>
          <p className="text-sm text-stone-500 mt-1">
            Everything was disliked. Clear preferences in Favorites or try again later.
          </p>
        </div>
      )}
    </div>
  );
}
