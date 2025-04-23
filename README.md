# Scope Cup Tracker

A simple web app for managing and tracking Scope Cup progress. Made for my own interest but hey maybe it'll be useful.

## Tech

- Express.js
- React + TanStack router
- Prisma ORM

## Running this locally

- Clone the repo
- You'll need to add your own environment variables for API keys & stuff like that. Follow the `.env.example` in both the `server` & `site` directories (found under the `apps` directory). **Don't start the app before doing this!**
- Start the app by running `pnpm dev` at the top level! Alternatively, run the server by going into `apps/server` and running `pnpm dev`, or start the website by going into `apps/site` and running `pnpm dev`

## To-Do/Checklist

<details>
<summary>✅ Completed</summary>
<ul>
  <li>
    Create a new team
  </li>
  <li>
    Adding activities (hangout, bounty, etc)
  </li>
  <li>Attendance tracking</li>
  <li>Viewing and adding rules</li>
</ul>
</details>

<details>
<summary>⌛ In progress</summary>
<ul>
<li>Editing rules (updating point values, deleting, etc)</li>
<li>Update team names, members, colors</li>
<li>Bounty generator/decider</li>
<li>Linking activities to members to view each member's impact</li>
<li>Optimizations</li>
</ul>
</details>

<details>
<summary>✋ Backlog</summary>
<ul>
<li>Team draft manager</li>
</ul>
</details>
