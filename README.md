# Persistent Coding Agent with Vercel Sandbox

A small, working application featuring a coding agent that lives inside a persistent Vercel Sandbox. Built for the Questom assignment.

## Features
- **Persistent Sandbox**: Spawns a remote Vercel Sandbox that maintains state (files, variables) across multiple agent turns.
- **Agentic Loop**: Uses GPT-4o to reason, write code, and execute it via tool calling.
- **Self-Correction**: Automatically detects runtime errors and Tracebacks, allowing the agent to fix and retry its own code.
- **Local Mirroring**: Saves the latest agent-generated code to `latest_code.py` for audit and inspection.

## Architecture
- `index.ts`: The entry point for the CLI application.
- `lib/agent.ts`: Orchestrates the OpenAI interaction and the reasoning loop.
- `lib/sandbox.ts`: Manages the lifecycle and command execution of the Vercel Sandbox.

## Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file in the `my-sandbox-app` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   ```

## Usage

Run the agent with a prompt:
```bash
npx tsx index.ts "Solve the 8-Queens problem using backtracking"
```

To verify persistence:
```bash
npx tsx index.ts "First, write 'hello world' to a file called test.txt. Then, in a separate turn, read that file and print it."
```

## How it Works
1. **Host**: The TypeScript app runs on your local machine.
2. **Brain**: OpenAI GPT-4o generates Python code based on your prompt.
3. **Execution**: The code is sent to a remote, secure container on Vercel's infrastructure.
4. **Loop**: The agent observes the output, handles any errors, and continues until the task is complete.
