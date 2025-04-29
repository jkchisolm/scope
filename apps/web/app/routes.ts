import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/authenticatedLayout.tsx", [
    route("dashboard", "routes/authenticated/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
