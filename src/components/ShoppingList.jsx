import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function ShoppingListView({
  items = [],
  onToggle,
  onClearChecked,
  loading,
}) {
  const open = items.filter((i) => !i.checked);
  const done = items.filter((i) => i.checked);

  if (loading) {
    return <p className="text-sm text-stone-500">Loading shopping list…</p>;
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center">
        <p className="font-medium text-emerald-900">List is empty</p>
        <p className="text-sm text-stone-500 mt-1">
          Add recipes from Discover to build a smart multi-recipe list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-600">
          {open.length} open · {done.length} checked
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={!done.length}
          onClick={onClearChecked}
          aria-label="Clear checked shopping items"
        >
          Clear checked
        </Button>
      </div>

      <ul className="space-y-2" aria-label="Shopping items">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border bg-white",
              item.checked ? "border-stone-100 opacity-70" : "border-emerald-100"
            )}
          >
            <Checkbox
              id={`shop-${item.id}`}
              checked={!!item.checked}
              onCheckedChange={() => onToggle?.(item)}
              className="mt-1"
              aria-label={`Mark ${item.ingredient} as ${item.checked ? "not purchased" : "purchased"}`}
            />
            <label htmlFor={`shop-${item.id}`} className="flex-1 cursor-pointer min-w-0">
              <p
                className={cn(
                  "font-medium capitalize",
                  item.checked && "line-through text-stone-400"
                )}
              >
                {item.ingredient}
              </p>
              <p className="text-xs text-stone-500">
                {item.amount} {item.unit}
                {item.recipe_names?.length
                  ? ` · ${item.recipe_names.join(", ")}`
                  : ""}
              </p>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
