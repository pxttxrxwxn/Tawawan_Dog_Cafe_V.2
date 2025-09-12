import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const cartFilePath = path.join(process.cwd(), "public/data/cart.json");
const ordersFilePath = path.join(process.cwd(), "public/data/orders.json");
const incomeFilePath = path.join(process.cwd(), "public/data/income.json");

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    throw err;
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.ordernumber) {
      const orders = await readFile(ordersFilePath);
      const income = await readFile(incomeFilePath);

      const index = orders.findIndex(o => o.ordernumber === body.ordernumber);
      if (index === -1) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      orders[index].status = "complete";
      income.push(orders[index]);

      await writeFile(incomeFilePath, income);
      await writeFile(ordersFilePath, orders);

      return NextResponse.json({ success: true, order: orders[index] });
    }

    const newOrder = body;
    let cart = await readFile(cartFilePath);

    const index = cart.findIndex(
      o =>
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
    return NextResponse.json({ success: true, cart });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { all, code, removeAll, type, sugarLevel, note, tableNumber, customerid } = await req.json();

    let cart = await readFile(cartFilePath);
    let orders = await readFile(ordersFilePath);

    if (all && cart.length > 0) {
      const lastOrderNumber = orders.length
        ? orders[orders.length - 1].ordernumber
        : "O1000";
      const nextOrderNumber =
        "O" + (parseInt(lastOrderNumber.substring(1)) + 1).toString().padStart(4, "0");

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = now.toTimeString().split(" ")[0];

      const newOrderGroup = {
        ordernumber: nextOrderNumber,
        tableNumber: tableNumber || "ไม่ระบุ",
        customerid: customerid || "ไม่ระบุ",
        date,
        time,
        items: cart.map(item => ({
          name: item.name,
          type: item.type,
          sugarLevel: item.sugarLevel,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          note: item.note,
        })),
        status: "Pending",
      };

      console.log("Creating new order group:", newOrderGroup);
      orders.push(newOrderGroup);
      await writeFile(ordersFilePath, orders);

      cart = [];
    }

    if (code) {
      const index = cart.findIndex(
        o =>
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

    return NextResponse.json({ success: true, cart });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ success: false, cart: [], error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await readFile(ordersFilePath);
    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json([], { status: 500 });
  }
}
