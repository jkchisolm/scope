import { DataTable } from "@/components/table/DataTable";
import { CategoryColumns } from "@/components/table/DataTableColumns";
import { CategoryQueries } from "@/lib/queries/CategoryQueries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/rules")({
  component: RouteComponent,
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(CategoryQueries.getCategories),
  pendingComponent: () => <div>Loading...</div>,
  pendingMs: 200,
});

function RouteComponent() {
  const { data: categories } = useSuspenseQuery(CategoryQueries.getCategories);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Scope Cup Rules</h1>
      <DataTable
        columns={CategoryColumns}
        data={categories}
        pagination={false}
      />
    </div>
  );
}
