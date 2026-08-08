import ShoppingListView from "@/components/ShoppingList";
import { useIdellicious } from "@/hooks/useIdellicious";

export default function Shopping() {
  const { loading, shopping, toggleShop, clearChecked } = useIdellicious();

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-emerald-950">Shopping list</h1>
        <p className="text-sm text-stone-600">
          Ingredients merge across recipes so you buy once and waste less.
        </p>
      </header>

      <ShoppingListView
        items={shopping}
        loading={loading}
        onToggle={toggleShop}
        onClearChecked={clearChecked}
      />
    </div>
  );
}
