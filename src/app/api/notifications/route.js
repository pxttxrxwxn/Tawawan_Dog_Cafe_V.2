import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const customer_id = searchParams.get("customer_id");

    console.log("API GET /notifications, customer_id:", customer_id);

    let query = supabaseAdmin.from("notifications").select("*");

    if (customer_id) {
      query = query.eq("customer_id", customer_id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    let notificationID = body.NotificationID;
    if (notificationID === "AUTO1" || notificationID === "AUTO2") {
      const { data: lastRow } = await supabaseAdmin.from("notifications").select("notification_id").order("notification_id", { ascending: false }).limit(1);
      let lastNum = 1000;
      if (lastRow && lastRow.length > 0) lastNum = parseInt(lastRow[0].notification_id.replace(/^N/, ""), 10) || lastNum;
      notificationID = `N${lastNum + 1}`;
    }

    const newRow = {
      notification_id: notificationID,
      svgtitle: body.svgtitle || null,
      title: body.title || null,
      body: body.body || null,
      customer_id: body.customer_id || null,
      owner_id: body.owner_id || null,
      svgbin: body.svgbin || null
    };

    const { data, error } = await supabaseAdmin.from("notifications").insert([newRow]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, id: notificationID });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    if (body.all) {
      const { error } = await supabaseAdmin.from("notifications").delete().neq("notification_id", null);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    const { notificationID } = body;
    const { error } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("notification_id", notificationID);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

