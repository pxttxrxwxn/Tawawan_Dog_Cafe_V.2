import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.OrderID) {
      const { data: order, error: e1 } = await supabaseAdmin
        .from("orders")
        .select("*")
        .eq("order_id", body.OrderID)
        .limit(1)
        .single();
      if (e1 || !order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      await supabaseAdmin
        .from("orders")
        .update({ order_status: "complete" })
        .eq("order_id", body.OrderID);

      const { data: lastIncome } = await supabaseAdmin
        .from("income")
        .select("income_id")
        .order("income_id", { ascending: false })
        .limit(1);

      let nextIncomeId = "R1001";
      if (lastIncome && lastIncome.length > 0) {
        const lastNum = parseInt(lastIncome[0].income_id.replace(/^R/, ""), 10) || 1000;
        nextIncomeId = `R${lastNum + 1}`;
      }

      const Total = (order.order_description || []).reduce(
        (s, it) => s + (it.TotalPrice || 0),
        0
      );

      const newIncome = {
        income_id: nextIncomeId,
        order_description: order.order_description,
        order_datetime: order.order_datetime,
        table_number: order.table_number,
        total: Total,
      };

      await supabaseAdmin.from("income").insert([newIncome]);
      await supabaseAdmin
        .from("order_income")
        .insert([{ order_id: order.order_id, income_id: nextIncomeId }]);

      return NextResponse.json({ success: true, income: newIncome });
    }

    const { tableNumber, Customerid, cart } = body;
    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { success: false, error: "No orders to process" },
        { status: 400 }
      );
    }

    const { data: lastOrder } = await supabaseAdmin
      .from("orders")
      .select("order_id")
      .order("order_id", { ascending: false })
      .limit(1);

    let nextOrderID = "O1001";
    if (lastOrder && lastOrder.length > 0) {
      const lastNum = parseInt(lastOrder[0].order_id.replace(/^O/, ""), 10) || 1000;
      nextOrderID = `O${lastNum + 1}`;
    }

    const now = new Date().toISOString();
    const totalSum = cart.reduce((s, item) => s + (item.totalPrice || 0), 0);

    const newOrderGroup = {
      order_id: nextOrderID,
      order_description: cart.map((item) => ({
        MenuID: item.code,
        MenuName: item.name,
        Type: item.type,
        SugarLevel: item.sugarLevel,
        Quantity: item.quantity,
        TotalPrice: item.totalPrice,
        Note: item.note,
      })),
      order_datetime: now,
      table_number: tableNumber || "ไม่ระบุ",
      total: totalSum,
      order_status: "Pending",
      customer_id: Customerid || "ไม่ระบุ",
    };

    await supabaseAdmin.from("orders").insert([newOrderGroup]);

    const orderMenuEntries = cart.map((item) => ({
      order_id: nextOrderID,
      menu_id: item.code,
      quantity: item.quantity,
    }));
    await supabaseAdmin.from("order_menu").insert(orderMenuEntries);

    return NextResponse.json({ success: true, order: newOrderGroup });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin.from("orders").select("*").order("order_datetime", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}