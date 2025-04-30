import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/authenticatedLayout.tsx", [
    route("dashboard", "routes/authenticated/dashboard.tsx"),
    ...prefix("teams", [
      index("routes/authenticated/teams/index.tsx"),
      ...prefix(":teamId", [
        index("routes/authenticated/teams/[teamId]/index.tsx"),
        route(
          "attendance",
          "routes/authenticated/teams/[teamId]/attendance.tsx"
        ),
      ]),
    ]),
    route("rules", "routes/authenticated/rules.tsx"),
  ]),
] satisfies RouteConfig;
