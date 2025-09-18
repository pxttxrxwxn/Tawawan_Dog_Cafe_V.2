import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const { OwnerID, ExpenseDateTime, Detail, Amount, CategoryExpense } = await req.json();

    const { data: lastRow } = await supabaseAdmin
      .from("expenses")
      .select("expense_id")
      .order("expense_id", { ascending: false })
      .limit(1);

    let nextExpenseID = "E0001";
    if (lastRow && lastRow.length > 0 && lastRow[0].expense_id) {
      const lastNum = parseInt(lastRow[0].expense_id.replace(/^E/, "")) || 0;
      nextExpenseID = `E${(lastNum + 1).toString().padStart(4, "0")}`;
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .insert([{
        expense_id: nextExpenseID,
        owner_id: OwnerID,
        expense_datetime: ExpenseDateTime,
        detail: Detail,
        amount: Amount,
        category_expense: CategoryExpense
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: "เพิ่มสำเร็จ", newExpense: data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ไม่สามารถเพิ่มข้อมูลได้", details: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { ExpenseID, ExpenseDateTime, Detail, Amount, CategoryExpense } = await req.json();

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .update({
         expense_datetime: ExpenseDateTime,
         detail: Detail,
         amount: Amount,
         category_expense: CategoryExpense
      })
      .eq("expense_id", ExpenseID)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: "แก้ไขสำเร็จ", updatedExpense: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "ไม่สามารถแก้ไขได้", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const expenseID = searchParams.get("expenseID");

    if (!expenseID) {
      return NextResponse.json({ error: "expenseID required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("expenses")
      .delete()
      .eq("expense_id", expenseID)
      .select();

    if (error) throw error;
    return NextResponse.json({ message: "ลบสำเร็จ", deleted: data });
  } catch (error) {
    return NextResponse.json({ error: "ไม่สามารถลบได้", details: error.message }, { status: 500 });
  }
}