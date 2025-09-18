import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("owners")
      .select("username")
      .eq("email", email)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ username: data.username });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}