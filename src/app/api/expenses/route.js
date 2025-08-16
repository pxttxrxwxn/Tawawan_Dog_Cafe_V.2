import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "expenses.json");

// อ่านข้อมูลจากไฟล์
async function readData() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    return [];
  }
}

// เขียนข้อมูลลงไฟล์
async function writeData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// ดึงข้อมูลรายจ่ายทั้งหมด
export async function GET() {
  const expenses = await readData();
  return new Response(JSON.stringify(expenses), { status: 200 });
}

// เพิ่มข้อมูลรายจ่าย
export async function POST(req) {
  try {
    const newExpense = await req.json();
    const expenses = await readData();
    expenses.push(newExpense);
    await writeData(expenses);

    return new Response(JSON.stringify({ message: "เพิ่มสำเร็จ", newExpense }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถเพิ่มข้อมูลได้" }), {
      status: 500,
    });
  }
}

// แก้ไขข้อมูลรายจ่าย
export async function PUT(req) {
  try {
    const { originalIndex, ...updatedExpense } = await req.json();
    const expenses = await readData();

    if (originalIndex < 0 || originalIndex >= expenses.length) {
      return new Response(JSON.stringify({ error: "ไม่พบข้อมูลที่ต้องการแก้ไข" }), {
        status: 404,
      });
    }

    expenses[originalIndex] = updatedExpense;
    await writeData(expenses);

    return new Response(JSON.stringify({ message: "แก้ไขสำเร็จ", updatedExpense }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "ไม่สามารถแก้ไขได้" }), {
      status: 500,
    });
  }
}

// ลบข้อมูลรายจ่าย
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
