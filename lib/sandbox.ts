import { Sandbox } from "@vercel/sandbox";
import * as fs from "fs";

export async function createSandbox() {
  return await Sandbox.create({
    runtime: "python3.13"
  });
}

export async function executeCode(sandbox: Sandbox, code: string) {
  // Save generated code locally for inspection
  fs.writeFileSync("latest_code.py", code);

  await sandbox.runCommand("bash", [
    "-c",
    `cat << 'EOF' > main.py
${code}
EOF`
  ]);

  const result = await sandbox.runCommand("python3", ["main.py"], {
    timeout: 5000
  });

  const stdout = await result.stdout();
  const stderr = await result.stderr();

  return stdout || stderr;
}
