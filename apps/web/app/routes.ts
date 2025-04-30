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
    route("teams", "routes/authenticated/teams.tsx"),
    route("rules", "routes/authenticated/rules.tsx"),
  ]),
] satisfies RouteConfig;
