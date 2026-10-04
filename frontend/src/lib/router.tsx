import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface RouterContextValue {
  pathname: string;
  search: Record<string, string>;
  navigate: (to: string, opts?: { replace?: boolean; search?: Record<string, string> }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function parseSearch(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  const q = hash.startsWith("?") ? hash.slice(1) : hash;
  if (!q) return params;
  for (const pair of q.split("&")) {
    const [k, v = ""] = pair.split("=");
    params[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return params;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [search, setSearch] = useState<Record<string, string>>(() =>
    parseSearch(window.location.search),
  );

  useEffect(() => {
    const handle = () => {
      setPathname(window.location.pathname);
      setSearch(parseSearch(window.location.search));
    };
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  const navigate = (to: string, opts?: { replace?: boolean; search?: Record<string, string> }) => {
    let url: URL;
    try {
      url = new URL(to, window.location.origin);
    } catch {
      url = new URL(window.location.origin + to);
    }
    if (opts?.search) {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(opts.search)) sp.set(k, v);
      url.search = sp.toString();
    }
    if (opts?.replace) {
      window.history.replaceState({}, "", url.pathname + url.search);
    } else {
      window.history.pushState({}, "", url.pathname + url.search);
    }
    setPathname(url.pathname);
    setSearch(parseSearch(url.search));
    window.dispatchEvent(new Event("popstate"));
  };

  return (
    <RouterContext.Provider value={{ pathname, search, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useNavigate must be used within RouterProvider");
  return ctx.navigate;
}

export function useRouterState<T>(selector: (s: RouterContextValue) => T): T {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouterState must be used within RouterProvider");
  return selector(ctx);
}

export function useSearch() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useSearch must be used within RouterProvider");
  return ctx.search;
}

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "to"> {
  to: string;
  search?: Record<string, string>;
  replace?: boolean;
  activeOptions?: { exact?: boolean };
  activeProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  inactiveProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: ReactNode;
}

export function Link({
  to,
  search,
  replace,
  activeOptions,
  activeProps,
  inactiveProps,
  onClick,
  className,
  ...rest
}: LinkProps) {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("Link must be used within RouterProvider");

  const isActive = activeOptions?.exact
    ? ctx.pathname === to
    : ctx.pathname === to || ctx.pathname.startsWith(to + "/");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.(e);
    if (rest.target === "_blank") return;
    ctx.navigate(to, { replace, search });
  };

  const mergedProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    ...rest,
    href: to,
    onClick: handleClick,
    className,
  };

  if (isActive && activeProps) {
    Object.assign(mergedProps, activeProps);
  } else if (!isActive && inactiveProps) {
    Object.assign(mergedProps, inactiveProps);
  }

  return <a {...mergedProps} />;
}

export function Outlet() {
  return null;
}