import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

const formSchema = z.object({
  teamColor: z.string().nonempty(),
  teamName: z.string().nonempty(),
  teamLeads: z.string().nonempty(),
  teamMembers: z.string().nonempty(),
});

export const AddTeamDialog = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const leads = values.teamLeads.split(/,|\n/).map((lead) => lead.trim());
    const members = values.teamMembers
      .split(/,|\n/)
      .map((member) => member.trim());
    // for members, we need to create an array with the names and a property role that can be "EBOARD" for the leads or "MEMBER" for the members
    // all under the same object
    const body = {
      name: values.teamName,
      active: true,
      color: values.teamColor,
      members: [
        ...leads.map((lead) => ({ name: lead, role: "EBOARD" })),
        ...members.map((member) => ({ name: member, role: "MEMBER" })),
      ],
    };

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/api/teams`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      console.log("Team created");
      const team = await response.json();
      toast.success("Team created");
      console.log(team);
    } else {
      console.error("Failed to create team");
      toast.error("Failed to create team");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new team</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new team</DialogTitle>
          <DialogDescription>
            Create a new Scope Cup team for this semester.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jeborah" {...field} />
                  </FormControl>
                  <FormDescription>Enter your team name.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Team Color</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger>
                        <div
                          className="w-6 h-6 rounded-sm border-[1px] border-black cursor-pointer"
                          style={{ backgroundColor: field.value }}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        <HexColorPicker
                          color={field.value}
                          onChange={field.onChange}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamLeads"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Leads</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Jeborah" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your team leads, names separated by a comma or a
                    newline
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Jeborah" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your team members, names separated by a comma or a
                    newline
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit">Create team</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
