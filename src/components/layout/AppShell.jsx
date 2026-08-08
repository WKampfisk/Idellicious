import { NavLink, Outlet } from "react-router-dom";
import { Heart, Home, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Discover", icon: Home, end: true },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/shopping", label: "Shopping", icon: ShoppingCart },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-emerald-50/40 text-stone-900 flex flex-col max-w-5xl mx-auto">
      <header className="sticky top-0 z-30 border-b border-emerald-100/80 bg-white/90 backdrop-blur px-4 py-3 flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center text-white shadow-sm">
          <UtensilsCrossed className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight text-emerald-950 leading-none">
            Idellicious
          </p>
          <p className="text-[11px] text-emerald-700/70">Culinary companion</p>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-28">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-emerald-100 bg-white/95 backdrop-blur safe-bottom"
        aria-label="Main"
      >
        <div className="max-w-3xl mx-auto flex justify-around py-2 px-2">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 min-w-[4.5rem] py-1.5 px-3 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "text-emerald-700 bg-emerald-50"
                    : "text-stone-500 hover:text-emerald-800"
                )
              }
            >
              <Icon className="w-6 h-6" strokeWidth={1.75} aria-hidden />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
