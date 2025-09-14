import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "public", "data", "customer.json");

export async function POST(req) {
  try {
    const body = await req.json();
    const { tableNumber } = body;

    if (!tableNumber) {
      return new Response(JSON.stringify({ error: "tableNumber is required" }), {
        status: 400,
      });
    }

    let customers = [];
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      customers = data ? JSON.parse(data) : [];
    }

    let lastId = 1000;
    if (customers.length > 0) {
      const lastCustomer = customers[customers.length - 1];
      lastId = parseInt(lastCustomer.CustomerID.replace("C", ""));
    }

    const newCustomer = {
      CustomerID: `C${lastId + 1}`,
      TableNumber: tableNumber.toString(),
    };

    customers.push(newCustomer);

    fs.writeFileSync(filePath, JSON.stringify(customers, null, 2));

    return new Response(JSON.stringify(newCustomer), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
