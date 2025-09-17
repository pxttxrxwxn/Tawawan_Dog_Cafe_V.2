import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ordersFilePath = path.join(process.cwd(), "public/data/orders.json");
const incomeFilePath = path.join(process.cwd(), "public/data/income.json");
const orderIncomeFilePath = path.join(process.cwd(), "public/data/Order_Income.json");
const orderMenuFilePath = path.join(process.cwd(), "public/data/Order_menu.json");

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

    if (body.OrderID) {
      const orders = await readFile(ordersFilePath);
      const income = await readFile(incomeFilePath);
      const orderIncome = await readFile(orderIncomeFilePath);

      const index = orders.findIndex(o => o.OrderID === body.OrderID);
      if (index === -1) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      orders[index].OrderStatus = "complete";

      const lastIncomeId = income.length
        ? income[income.length - 1].IncomeId
        : "R1000";
      const nextIncomeId =
        "R" + (parseInt(lastIncomeId.substring(1)) + 1).toString().padStart(4, "0");

      const Total= orders[index].OrderDescription.reduce(
        (sum, item) => sum + (item.TotalPrice || 0),
        0
      );

      const newIncome = {
        IncomeId: nextIncomeId,
        OrderDescription: orders[index].OrderDescription,
        OrderDateTime: orders[index].OrderDateTime,
        TableNumber: orders[index].TableNumber,
        Total,
      };

      income.push(newIncome);

      const newOrderIncome = {
        OrderID: orders[index].OrderID,
        IncomeId: nextIncomeId,
      };

      orderIncome.push(newOrderIncome);

      await writeFile(orderIncomeFilePath, orderIncome);
      await writeFile(incomeFilePath, income);
      await writeFile(ordersFilePath, orders);

      return NextResponse.json({ 
        success: true, 
        income: newIncome, 
        orderIncome: newOrderIncome
      });
    }
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
    const { tableNumber, Customerid, cart } = await req.json();

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: false, error: "No orders to process" });
    }

    const orders = await readFile(ordersFilePath);

    const lastOrderID = orders.length
      ? orders[orders.length - 1].OrderID
      : "O1000";
    const nextOrderID =
      "O" + (parseInt(lastOrderID.substring(1)) + 1).toString().padStart(4, "0");

    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0];

    const newOrderGroup = {
      OrderID: nextOrderID,
      OrderDescription: cart.map(item => ({
        MenuID: item.code,
        MenuName: item.name,
        Type: item.type,
        SugarLevel: item.sugarLevel,
        Quantity: item.quantity,
        TotalPrice: item.totalPrice,
        Note: item.note,
      })),
      OrderDateTime: `${date} ${time}`,
      TableNumber: tableNumber || "ไม่ระบุ",
      Total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
      OrderStatus: "Pending",
      CustomerID: Customerid || "ไม่ระบุ",
    };

    orders.push(newOrderGroup);
    await writeFile(ordersFilePath, orders);

    const orderMenu = await readFile(orderMenuFilePath);
    const newOrderMenuEntries = cart.map(item => ({
      OrderID: nextOrderID,
      MenuID: item.code,
      Quantity: item.quantity,
    }));
    orderMenu.push(...newOrderMenuEntries);
    await writeFile(orderMenuFilePath, orderMenu);

    return NextResponse.json({ success: true, order: newOrderGroup });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
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
