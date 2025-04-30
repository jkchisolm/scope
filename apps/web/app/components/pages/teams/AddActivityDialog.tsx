import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PlusCircleIcon } from "lucide-react";
import { BatchActivityForm } from "./BatchActivityForm";
import { SingleActivityForm } from "./SingleActivityForm";

type Props = {
  teamId: string;
};

export const AddActivityDialog = ({ teamId }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircleIcon /> Add Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Add a new activity</DialogTitle>
          <DialogDescription>
            Add one at a time, or add a batch.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-auto grid-cols-2 mx-3 mb-3">
            <TabsTrigger value="single">Add single</TabsTrigger>
            <TabsTrigger value="batch">Add batch</TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <SingleActivityForm teamId={teamId} />
          </TabsContent>
          <TabsContent value="batch">
            <BatchActivityForm teamId={teamId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
