import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "register-data.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const users = JSON.parse(fileContents);

  const latestUser = users[users.length - 1];
  return new Response(JSON.stringify({ name: latestUser.username }), {
    headers: { "Content-Type": "application/json" },
  });
}
