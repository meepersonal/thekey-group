import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/lib/router", () => ({
  useNavigate: () => vi.fn(),
  useRouterState: () => ({}),
  useSearch: () => ({}),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  RouterProvider: ({ children }: any) => children,
}));
