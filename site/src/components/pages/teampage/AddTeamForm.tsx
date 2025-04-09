import { z } from "zod";

const formSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  teamColor: z.string(),
  teamMeb,
});
