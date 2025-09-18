import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("income")
      .select("*")
      .order("order_datetime", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
