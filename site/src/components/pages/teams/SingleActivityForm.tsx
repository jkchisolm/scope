import { CategoryQueries } from "@/lib/queries/CategoryQueries";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type CreateActivityBody } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  category: z
    .string({
      required_error: "Please select a category",
    })
    .nullable()
    .optional(),
  createdAt: z
    .date({
      required_error: "Please select a date",
    })
    .nullable()
    .optional(),
});

type Props = {
  teamId: string;
};

export const SingleActivityForm = ({ teamId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const addActivity = useMutation({
    mutationFn: (body: CreateActivityBody) => {
      return fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/activities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).then((res) => res.json());
    },
  });

  const { data } = useQuery(CategoryQueries.getCategories);

  if (!data) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const category = data.filter(
      (category) => category.id === values.category
    )[0];
    if (!category) {
      return;
    }

    console.log(values.createdAt?.toISOString());

    const body: CreateActivityBody = {
      name: category.name,
      points: category.points,
      date: values.createdAt ? values.createdAt.toISOString() : "",
      teamId,
      categoryId: category.id,
      // members: category.members.map((member) => ({
      //   memberId: member.id,
      //   points: member.points,
      // })),
    };

    console.log(body);
    addActivity.mutate(body, {
      // onSuccess: () => {
      //   client.invalidateQueries("getActivitiesForTeam");
      // },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    className="w-full"
                    mode="single"
                    selected={field.value ?? undefined}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Add event
        </Button>
      </form>
    </Form>
  );
};
