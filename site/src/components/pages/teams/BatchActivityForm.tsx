import { CategoryQueries } from "@/lib/queries/CategoryQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type {
  ActivityCategory,
  CreateActivityBody,
  CreateBatchActivityBody,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { TeamQueries } from "@/lib/queries/TeamQueries";
import { toast } from "sonner";

const formSchema = z.object({
  list: z.string({ required_error: "Enter a batch!" }).nonempty(),
});

type Props = {
  teamId: string;
};

export const BatchActivityForm = ({ teamId }: Props) => {
  const client = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const addBatch = useMutation({
    mutationFn: (body: CreateBatchActivityBody) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/api/activities/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());
    },
  });

  const { data } = useQuery(CategoryQueries.getCategories);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const categories = data as ActivityCategory[];
    console.log(categories);

    console.log(values);
    // split the list into lines
    const lines = values.list.split("\n");
    // split each line into parts
    const events = lines.map((line) => {
      const [name, date, points] = line.split("\t");
      if (!name || !date || !points) {
        return null;
      }
      return {
        name,
        date,
        points: parseInt(points),
      };
    });
    const list: CreateActivityBody[] = events
      .filter((event) => event !== null)
      .map((event) => {
        return {
          name: event.name,
          points: event.points,
          date: new Date(event.date).toISOString(),
          teamId,
          categoryId:
            categories.find((category) => category.name === event.name)?.id ??
            "",
        };
      });
    // console.log(list);

    const body: CreateBatchActivityBody = {
      list,
    };

    addBatch.mutate(body, {
      onSuccess: () => {
        client.invalidateQueries(TeamQueries.getSingleTeam(teamId));
        toast.success("Batch added!");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 px-4 overflow-scroll"
      >
        <FormField
          control={form.control}
          name="list"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="overflow-y-scroll max-h-[400px]"
                />
              </FormControl>
              <FormDescription>
                Enter a list of events. The events should be formatted as such,
                without the brackets, and with tabs in between:{" "}
                <strong className=" whitespace-pre-line block">
                  [Name]{"  "}[Date in mm/dd/yyyy]{"  "}[Points].
                </strong>{" "}
                For the name, the name should match *exactly* with what's in the
                "Name" column on the{" "}
                <Link to="/rules" className="text-blue-500">
                  rules
                </Link>{" "}
                page.{" "}
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit">Add batch</Button>
      </form>
    </Form>
  );
};
