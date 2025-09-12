import { promises as fs } from "fs";
import path from "path";

const cartFilePath = path.join(process.cwd(), "public", "data", "cart.json");
const ordersFilePath = path.join(process.cwd(), "public", "data", "orders.json");

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req) {
  const newOrder = await req.json();
  let cart = await readFile(cartFilePath);

  const index = cart.findIndex(
    (o) =>
      o.code === newOrder.code &&
      o.type === newOrder.type &&
      o.sugarLevel === newOrder.sugarLevel &&
      (newOrder.note ? o.note === newOrder.note : true)
  );

  if (index > -1) {
    cart[index].quantity += newOrder.quantity || 1;
    cart[index].totalPrice =
      (cart[index].basePrice + (cart[index].typePrice || 0)) *
      cart[index].quantity;
  } else {
    const basePrice = Number(newOrder.basePrice || newOrder.price || 0);
    const typePrice = Number(newOrder.typePrice || 0);
    const quantity = Number(newOrder.quantity || 1);
    const totalPrice = (basePrice + typePrice) * quantity;

    cart.push({
      ...newOrder,
      basePrice,
      typePrice,
      quantity,
      totalPrice,
    });
  }

  await writeFile(cartFilePath, cart);
  return new Response(JSON.stringify({ success: true, cart }), { status: 200 });
}

export async function DELETE(req) {
  try {
    const { all, code, removeAll, type, sugarLevel, note, tableNumber } =
      await req.json();

    let cart = await readFile(cartFilePath);
    let orders = await readFile(ordersFilePath);

    if (all && cart.length > 0) {
      let lastOrderNumber = orders.length
        ? orders[orders.length - 1].ordernumber
        : "O1000";
      let nextOrderNumber =
        "O" +
        (parseInt(lastOrderNumber.substring(1)) + 1)
          .toString()
          .padStart(4, "0");

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];

      const newOrderGroup = {
        ordernumber: nextOrderNumber,
        tableNumber: tableNumber || "ไม่ระบุ",
        date,
        time,
        items: cart.map((item) => ({
          name: item.name,
          type: item.type,
          sugarLevel: item.sugarLevel,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          note: item.note,
        })),
        status: "Pending",
      };

      orders.push(newOrderGroup);
      await writeFile(ordersFilePath, orders);

      cart = [];
    }

    if (code) {
      const index = cart.findIndex(
        (o) =>
          o.code === code &&
          o.type === type &&
          o.sugarLevel === sugarLevel &&
          (note ? o.note === note : true)
      );

      if (index > -1) {
        if (removeAll) {
          cart.splice(index, 1);
        } else {
          cart[index].quantity -= 1;
          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          } else {
            cart[index].totalPrice =
              (cart[index].basePrice + (cart[index].typePrice || 0)) *
              cart[index].quantity;
          }
        }
      }
    }

    await writeFile(cartFilePath, cart);

    return new Response(JSON.stringify({ success: true, cart }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("DELETE order error:", err);
    return new Response(JSON.stringify({ success: false, cart: [] }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  const cart = await readFile(cartFilePath);
  return new Response(JSON.stringify(cart), { status: 200 });
}
