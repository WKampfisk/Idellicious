import { Link } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import { useIdellicious } from "@/hooks/useIdellicious";

export default function Favorites() {
  const { loading, favoriteRecipes, prefMap, like, dislike, addToShopping } = useIdellicious();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950">Favorites</h1>
        <p className="text-sm text-stone-600">Recipes you liked — ready for meal prep and shopping.</p>
      </header>

      {loading && !favoriteRecipes.length ? (
        <p className="text-sm text-stone-500" role="status">
          Loading favorites…
        </p>
      ) : favoriteRecipes.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteRecipes.map((recipe) => (
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
      ) : (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center">
          <p className="font-medium text-emerald-900">No favorites yet</p>
          <p className="text-sm text-stone-500 mt-1">
            Tap Like on recipes in{" "}
            <Link to="/" className="text-emerald-700 underline underline-offset-2">
              Discover
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
