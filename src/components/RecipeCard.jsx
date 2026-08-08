import { Link } from "react-router-dom";
import { Heart, HeartOff, ShoppingBasket, ThumbsDown, ThumbsUp } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RecipeCard({
  recipe,
  preference,
  onLike,
  onDislike,
  onAddShopping,
  className,
}) {
  const liked = preference === "liked";
  const disliked = preference === "disliked";

  return (
    <article
      className={cn(
        "group rounded-2xl overflow-hidden border border-emerald-100 bg-white shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <Link to={`/recipe/${recipe.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fittingType="fill"
          className="!block w-full h-full absolute inset-0"
          originWidth={1200}
          originHeight={900}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h2 className="font-semibold text-lg leading-tight drop-shadow">{recipe.title}</h2>
          <p className="text-xs text-white/90 mt-0.5">
            {recipe.timeMinutes} min · {recipe.servings} servings
          </p>
        </div>
      </Link>

      <div className="p-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={liked ? "default" : "outline"}
          className={cn(
            "rounded-full",
            liked && "bg-emerald-600 hover:bg-emerald-700 text-white"
          )}
          aria-label={liked ? `${recipe.title} liked` : `Like ${recipe.title}`}
          aria-pressed={liked}
          onClick={() => onLike?.(recipe)}
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
          onClick={() => onDislike?.(recipe)}
        >
          <ThumbsDown className="w-4 h-4" />
          Dislike
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full ml-auto border-lime-300 text-emerald-800"
          aria-label={`Add ${recipe.title} to shopping list`}
          onClick={() => onAddShopping?.(recipe)}
        >
          <ShoppingBasket className="w-4 h-4" />
          Shop
        </Button>
        {liked && (
          <span className="sr-only">
            <Heart className="inline" /> Saved to favorites
          </span>
        )}
        {disliked && (
          <span className="sr-only">
            <HeartOff className="inline" /> Hidden from feed
          </span>
        )}
      </div>
    </article>
  );
}
