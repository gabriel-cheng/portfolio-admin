import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
    end: true,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: "▤",
    end: false,
  },
  {
    label: "Experiences",
    path: "/experiences",
    icon: "▣",
    end: false,
  },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-zinc-800 bg-zinc-950 md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex h-20 items-center gap-3 border-b border-zinc-800 px-6">
        <div className="flex size-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 font-semibold text-white">
          GH
        </div>

        <div>
          <p className="font-semibold tracking-tight text-zinc-100">
            GH Carvalho
          </p>
          <p className="text-xs text-zinc-500">Content management</p>
        </div>
      </div>

      <nav
        aria-label="Navegação administrativa"
        className="flex gap-2 overflow-x-auto p-3 md:flex-1 md:flex-col md:gap-1 md:p-4"
      >
        <p className="hidden px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-widest text-zinc-600 md:block">
          Workspace
        </p>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              [
                "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              ].join(" ")
            }
          >
            <span
              aria-hidden="true"
              className="flex size-5 items-center justify-center text-base"
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden border-t border-zinc-800 p-4 md:block">
        <p className="text-xs text-zinc-600">Portfolio Administration</p>
      </div>
    </aside>
  );
}
