import { config } from "dotenv";
config({ path: ".env.local" });

import { runAgent } from "./lib/agent";

const userPrompt =
  process.argv[2] || "Write a Python script to compute factorial(5)";

runAgent(userPrompt).catch(console.error);
