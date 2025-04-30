import { QueryClient } from "@tanstack/react-query";
import type { Rule } from "@workspace/shared";
import { useLoaderData } from "react-router";
import { DataTable } from "~/components/table/DataTable";
import { CategoryColumns } from "~/components/table/DataTableColumns";
import { CategoryQueries } from "~/lib/queries/RuleQueries";

export async function clientLoader(): Promise<Rule[]> {
  const queryClient = new QueryClient();
  const rules = await queryClient.ensureQueryData(
    CategoryQueries.getCategories
  );

  return rules;
}

export default function Rules() {
  const rules = useLoaderData<typeof clientLoader>();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Scope Cup Rules</h1>
      <DataTable columns={CategoryColumns} data={rules} pagination={false} />
    </div>
  );
}
