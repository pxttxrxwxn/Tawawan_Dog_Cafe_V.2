import { promises as fs } from "fs";
import path from "path";

const notificationsFile = path.join(process.cwd(), "public/data/Notifications.json");

export async function POST(req) {
  try {
    const body = await req.json();

    let notifications = [];
    try {
      const data = await fs.readFile(notificationsFile, "utf-8");
      notifications = JSON.parse(data);
    } catch {
      notifications = [];
    }

    notifications.push(body);

    await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    if (body.all) {
      await fs.writeFile(notificationsFile, JSON.stringify([], null, 2));
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    const { id } = body;
    const data = await fs.readFile(notificationsFile, "utf-8");
    let notifications = JSON.parse(data);

    const updated = notifications.filter((item) => item.id !== id);

    await fs.writeFile(notificationsFile, JSON.stringify(updated, null, 2));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
