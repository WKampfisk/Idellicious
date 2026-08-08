import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, ShoppingBasket, ThumbsDown, ThumbsUp } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { getRecipeById, scaleIngredients } from "@/data/recipes";
import { containerNeeds, getRelatedRecipes } from "@/lib/ingredients";
import { useIdellicious } from "@/hooks/useIdellicious";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function RecipeDetail() {
  const { id } = useParams();
  const recipe = getRecipeById(id);
  const { prefMap, like, dislike, addToShopping } = useIdellicious();
  const [batch, setBatch] = useState(false);

  if (!recipe) {
    return (
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-emerald-700">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>
        <p className="text-stone-600">Recipe not found.</p>
      </div>
    );
  }

  const multiplier = batch ? 2 : 1;
  const ingredients = scaleIngredients(recipe.ingredients, multiplier);
  const related = getRelatedRecipes(recipe, { limit: 4 });
  const containers = containerNeeds(recipe, multiplier);
  const preference = prefMap[recipe.key];
  const liked = preference === "liked";
  const disliked = preference === "disliked";

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-900"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Discover
      </Link>

      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-emerald-100">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fittingType="fill"
          className="!block w-full h-full absolute inset-0"
          originWidth={1400}
          originHeight={900}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h1 className="text-2xl sm:text-3xl font-semibold drop-shadow">{recipe.title}</h1>
          <p className="text-sm text-white/90 mt-1">
            {recipe.timeMinutes} min · {recipe.servings * multiplier} servings
            {batch ? " (large batch)" : ""}
          </p>
        </div>
      </div>

      <p className="text-stone-700 leading-relaxed">{recipe.description}</p>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={liked ? "default" : "outline"}
          className={cn("rounded-full", liked && "bg-emerald-600 hover:bg-emerald-700")}
          aria-label={liked ? `${recipe.title} liked` : `Like ${recipe.title}`}
          aria-pressed={liked}
          onClick={() => like(recipe)}
        >
          <ThumbsUp className="w-4 h-4" />
          Like
        </Button>
        <Button
          type="button"
          size="sm"
          variant={disliked ? "secondary" : "outline"}
          className="rounded-full"
          aria-label={disliked ? `${recipe.title} disliked` : `Dislike ${recipe.title}`}
          aria-pressed={disliked}
          onClick={() => dislike(recipe)}
        >
          <ThumbsDown className="w-4 h-4" />
          Dislike
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full border-lime-300 text-emerald-800"
          aria-label={`Add ${recipe.title} to shopping list`}
          onClick={() => addToShopping(recipe, { scale: multiplier })}
        >
          <ShoppingBasket className="w-4 h-4" />
          Add to shopping
        </Button>
      </div>

      <section
        className="rounded-2xl border border-emerald-100 bg-white p-4 space-y-3"
        aria-labelledby="meal-prep-heading"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id="meal-prep-heading" className="font-semibold text-emerald-950 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" aria-hidden />
            Meal prep
          </h2>
          <Button
            type="button"
            size="sm"
            variant={batch ? "default" : "outline"}
            className={cn("rounded-full", batch && "bg-emerald-600 hover:bg-emerald-700")}
            aria-pressed={batch}
            onClick={() => setBatch((v) => !v)}
          >
            {batch ? "Large batch ×2" : "Standard"}
          </Button>
        </div>
        <p className="text-sm text-stone-600">
          {batch
            ? "Quantities doubled for batch cooking. Use the storage containers below."
            : "Toggle large batch for doubled quantities and container counts."}
        </p>
        {containers.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Storage containers">
            {containers.map((c) => (
              <li
                key={c.type}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-lime-50 text-emerald-900 border border-lime-200"
              >
                {c.label}: {c.count}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading" className="font-semibold text-emerald-950 text-lg">
          Ingredients
        </h2>
        <ul className="rounded-2xl border border-emerald-100 bg-white divide-y divide-emerald-50">
          {ingredients.map((ing) => (
            <li key={ing.name} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
              <span className="capitalize text-stone-800">{ing.name}</span>
              <span className="text-stone-500 tabular-nums shrink-0">
                {ing.amount} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="font-semibold text-emerald-950 text-lg">
          Instructions
        </h2>
        <ol className="space-y-3">
          {(recipe.steps || []).map((step, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-emerald-100 bg-white p-4">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                {batch && i === 0
                  ? `${step} (large batch: prepare ${recipe.servings * 2} servings).`
                  : step}
              </p>
            </li>
          ))}
          {batch && (
            <li className="flex gap-3 rounded-2xl border border-lime-200 bg-lime-50/60 p-4">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lime-200 text-emerald-900 text-sm font-semibold"
                aria-hidden
              >
                +
              </span>
              <p className="text-sm text-stone-700 leading-relaxed pt-0.5">
                Cool completely, then portion into labeled containers. Refrigerate 3–4 days or freeze
                up to 2 months.
              </p>
            </li>
          )}
        </ol>
      </section>

      {related.length > 0 && (
        <section className="space-y-3" aria-labelledby="pairs-heading">
          <h2 id="pairs-heading" className="font-semibold text-emerald-950 text-lg">
            Pairs well with
          </h2>
          <p className="text-sm text-stone-600">
            Complementary recipes that share ingredients — cook once, waste less.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map(({ recipe: r, shared }) => (
              <Link
                key={r.id}
                to={`/recipe/${r.id}`}
                className="group rounded-2xl overflow-hidden border border-emerald-100 bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={r.imageUrl}
                    alt={r.title}
                    fittingType="fill"
                    className="!block w-full h-full absolute inset-0"
                    originWidth={800}
                    originHeight={500}
                  />
                </div>
                <div className="p-3 space-y-2">
                  <p className="font-medium text-emerald-950 group-hover:text-emerald-700">
                    {r.title}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {shared.slice(0, 4).map((name) => (
                      <span
                        key={name}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-lime-100 text-emerald-900 capitalize"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
