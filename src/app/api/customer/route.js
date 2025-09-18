import { supabaseAdmin } from "../../../lib/supabaseServer";

export async function POST(req) {
  try {
    const { table_number } = await req.json();
    console.log("ได้รับ table_number:", table_number);

    if (!table_number) {
      return new Response(JSON.stringify({ error: "table_number required" }), { status: 400 });
    }

    const { data: allCustomers, error } = await supabaseAdmin
      .from("customers")
      .select("customer_id");

    if (error) throw error;

    let lastId = 1000;
    if (allCustomers && allCustomers.length > 0) {
      const ids = allCustomers.map(c => parseInt(c.customer_id.replace("C", ""), 10));
      lastId = Math.max(...ids);
    }

    const newCustomer = {
      customer_id: `C${lastId + 1}`,
      table_number,
    };

    console.log("กำลัง insert:", newCustomer);

    const { error: insertError } = await supabaseAdmin.from("customers").insert([newCustomer]);
    if (insertError) throw insertError;

    return new Response(JSON.stringify(newCustomer), { status: 201 });
  } catch (err) {
    console.error("POST /customers:", err.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
