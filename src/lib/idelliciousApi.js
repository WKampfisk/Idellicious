import { base44 } from "@/api/base44Client";

const Pref = () => base44.entities.RecipePreference;
const Shop = () => base44.entities.ShoppingItem;

const LOCAL_PREF = "idellicious_prefs_v1";
const LOCAL_SHOP = "idellicious_shop_v1";

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export async function getCurrentUser() {
  try {
    return await base44.auth.me();
  } catch {
    return null;
  }
}

/** Preferences: Base44 when authed, else localStorage */
export async function listPreferences() {
  const user = await getCurrentUser();
  if (user) {
    try {
      return await Pref().list("-updated_date", 500);
    } catch (e) {
      console.warn("pref list failed", e);
    }
  }
  return readLocal(LOCAL_PREF, []);
}

export async function setPreference(recipe_key, preference) {
  const user = await getCurrentUser();
  if (user) {
    try {
      const existing = await Pref().filter({ recipe_key });
      if (existing?.[0]) {
        return Pref().update(existing[0].id, { preference });
      }
      return Pref().create({ recipe_key, preference });
    } catch (e) {
      console.warn("pref write failed, local fallback", e);
    }
  }
  const list = readLocal(LOCAL_PREF, []);
  const i = list.findIndex((p) => p.recipe_key === recipe_key);
  const row = { id: `local_${recipe_key}`, recipe_key, preference };
  if (i >= 0) list[i] = row;
  else list.push(row);
  writeLocal(LOCAL_PREF, list);
  return row;
}

export async function listShopping() {
  const user = await getCurrentUser();
  if (user) {
    try {
      return await Shop().list("-created_date", 500);
    } catch (e) {
      console.warn("shop list failed", e);
    }
  }
  return readLocal(LOCAL_SHOP, []);
}

export async function replaceShoppingFromMerge(mergedLines) {
  const user = await getCurrentUser();
  if (user) {
    try {
      const existing = await Shop().list("-created_date", 500);
      // Update or create by ingredient name
      for (const line of mergedLines) {
        const match = existing.find(
          (e) => e.ingredient?.toLowerCase() === line.ingredient.toLowerCase() && !e.checked
        );
        if (match) {
          await Shop().update(match.id, {
            amount: line.amount,
            unit: line.unit,
            recipe_names: line.recipe_names,
            recipe_keys: line.recipe_keys,
            checked: false,
          });
        } else {
          await Shop().create({
            ingredient: line.ingredient,
            amount: line.amount,
            unit: line.unit,
            recipe_names: line.recipe_names || [],
            recipe_keys: line.recipe_keys || [],
            checked: false,
          });
        }
      }
      return Shop().list("-created_date", 500);
    } catch (e) {
      console.warn("shop merge failed", e);
    }
  }
  writeLocal(LOCAL_SHOP, mergedLines.map((l, i) => ({ ...l, id: l.id || `local_shop_${i}` })));
  return readLocal(LOCAL_SHOP, []);
}

export async function updateShoppingItem(id, patch) {
  const user = await getCurrentUser();
  if (user && !String(id).startsWith("local_")) {
    try {
      return await Shop().update(id, patch);
    } catch (e) {
      console.warn(e);
    }
  }
  const list = readLocal(LOCAL_SHOP, []).map((x) => (x.id === id ? { ...x, ...patch } : x));
  writeLocal(LOCAL_SHOP, list);
  return list.find((x) => x.id === id);
}

export async function clearCheckedShopping() {
  const user = await getCurrentUser();
  if (user) {
    try {
      const all = await Shop().list("-created_date", 500);
      await Promise.all(all.filter((x) => x.checked).map((x) => Shop().delete(x.id)));
      return Shop().list("-created_date", 500);
    } catch (e) {
      console.warn(e);
    }
  }
  const list = readLocal(LOCAL_SHOP, []).filter((x) => !x.checked);
  writeLocal(LOCAL_SHOP, list);
  return list;
}

export async function saveFullShoppingList(lines) {
  const user = await getCurrentUser();
  if (user) {
    try {
      const existing = await Shop().list("-created_date", 500);
      await Promise.all(existing.map((x) => Shop().delete(x.id)));
      if (lines.length) {
        await Shop().bulkCreate(
          lines.map((l) => ({
            ingredient: l.ingredient,
            amount: Number(l.amount) || 0,
            unit: l.unit || "",
            recipe_names: l.recipe_names || [],
            recipe_keys: l.recipe_keys || [],
            checked: !!l.checked,
          }))
        );
      }
      return Shop().list("-created_date", 500);
    } catch (e) {
      console.warn(e);
    }
  }
  const withIds = lines.map((l, i) => ({
    ...l,
    id: l.id || `local_shop_${Date.now()}_${i}`,
  }));
  writeLocal(LOCAL_SHOP, withIds);
  return withIds;
}
