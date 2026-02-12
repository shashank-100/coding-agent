import OpenAI from "openai";
import { Sandbox } from "@vercel/sandbox";
import { createSandbox, executeCode } from "./sandbox";

export async function runAgent(userPrompt: string) {
  const openai = new OpenAI();
  const sandbox = await createSandbox(); // Persistent

  const tools: any[] = [
    {
      type: "function",
      function: {
        name: "execute_code",
        description: "Execute Python code inside persistent sandbox",
        parameters: {
          type: "object",
          properties: {
            code: { type: "string" }
          },
          required: ["code"]
        }
      }
    }
  ];

  let messages: any[] = [
    {
      role: "system",
      content: `
You are a coding agent.
You have a persistent Python sandbox.
Always generate valid Python code.
Call execute_code when needed.
Do not explain before running.
`
    },
    {
      role: "user",
      content: userPrompt
    }
  ];

  let iteration = 0;
  const MAX_ITERATIONS = 6;

  try {
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      console.log("Iteration:", iteration);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools
      });

      const message = response.choices[0].message;

      if (message.tool_calls) {
        const toolCall = message.tool_calls[0];
        const args = JSON.parse(toolCall.function.arguments);

        console.log("Executing code inside persistent sandbox...");

        const output = await executeCode(sandbox, args.code);
        console.log("Sandbox output:", output);

        messages.push(message);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: output
        });

        if (output.includes("Traceback") || output.includes("Error")) {
          messages.push({
            role: "user",
            content: `The code failed with:
${output}
Fix and retry.`
          });
        }

        continue;
      }

      console.log("Final:", message.content);
      break;
    }

  } finally {
    console.log("Stopping persistent sandbox...");
    await sandbox.stop();
  }
}
