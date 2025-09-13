import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public","data", "expenses.json");

async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
}

async function writeData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const expenses = await readData();
  return new Response(JSON.stringify(expenses), { status: 200 });
}

export async function POST(req) {
  try {
    const { OwnerID, date, detail, amount, category } = await req.json();
    const expenses = await readData();

    const lastExpense = expenses[expenses.length - 1];
    const lastIDNumber = lastExpense ? parseInt(lastExpense.ExpenseID.slice(1)) : 0;
    const newExpenseID = `E${(lastIDNumber + 1).toString().padStart(4, "0")}`;

    const newExpense = {
      ExpenseID: newExpenseID,
      OwnerID,
      date,
      detail,
      amount,
      category,
    };

    expenses.push(newExpense);
    await writeData(expenses);

    return new Response(JSON.stringify({ message: "เพิ่มสำเร็จ", newExpense }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "ไม่สามารถเพิ่มข้อมูลได้" }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { originalIndex, date, detail, amount, category } = await req.json();
    const expenses = await readData();

    if (originalIndex < 0 || originalIndex >= expenses.length) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลที่ต้องการแก้ไข" }), {
        status: 404,
      });
    }
    expenses[originalIndex] = {
      ...expenses[originalIndex],
      date,
      detail,
      amount,
      category,
    };

    await writeData(expenses);

    return new Response(JSON.stringify({ message: "แก้ไขสำเร็จ", updatedExpense: expenses[originalIndex] }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "ไม่สามารถแก้ไขได้" }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const index = parseInt(searchParams.get("index"), 10);

    const expenses = await readData();
    if (isNaN(index) || index < 0 || index >= expenses.length) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลที่ต้องการลบ" }), {
        status: 404,
      });
    }

    const deletedExpense = expenses.splice(index, 1);
    await writeData(expenses);

    return new Response(JSON.stringify({ message: "ลบสำเร็จ", deletedExpense }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถลบได้" }), {
      status: 500,
    });
  }
}
