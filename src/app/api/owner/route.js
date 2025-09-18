import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabaseServer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, Username, Email, Password } = body;

    if (!action) return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });

    if (action === "register") {
      if (!Username || !Email || !Password) 
        return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });

      const { data: exists } = await supabaseAdmin
        .from("owners")
        .select("owner_id")
        .eq("email", Email.toLowerCase())
        .limit(1);

      if (exists && exists.length > 0) 
        return NextResponse.json({ error: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 400 });

      const hashedPassword = await bcrypt.hash(Password, 10);

      const { data: lastRow } = await supabaseAdmin
        .from("owners")
        .select("owner_id")
        .order("owner_id", { ascending: false })
        .limit(1);

      let OwnerID = "OW1001";
      if (lastRow && lastRow.length > 0) {
        const lastNum = parseInt(lastRow[0].owner_id.replace(/^OW/, ""), 10) || 1000;
        OwnerID = `OW${lastNum + 1}`;
      }

      const { data, error } = await supabaseAdmin
        .from("owners")
        .insert([{ owner_id: OwnerID, username: Username, email: Email.toLowerCase(), password_hash: hashedPassword }])
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ", OwnerID }, { status: 201 });
    }

    if (action === "login") {
      if (!Email || !Password) 
        return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });

      const { data: user } = await supabaseAdmin
        .from("owners")
        .select("*")
        .eq("email", Email.toLowerCase())
        .limit(1);

      if (!user || user.length === 0) 
        return NextResponse.json({ error: "ไม่พบอีเมลนี้ในระบบ" }, { status: 401 });

      const passwordMatch = await bcrypt.compare(Password, user[0].password_hash);
      if (!passwordMatch) 
        return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });

      return NextResponse.json({ message: "ล็อกอินสำเร็จ", OwnerID: user[0].owner_id }, { status: 200 });
    }

    return NextResponse.json({ error: "action ไม่ถูกต้อง" }, { status: 400 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
