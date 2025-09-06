import fs from "fs";
import path from "path";
import cron from "node-cron";


const orderCompletedPath = path.join(process.cwd(), "public/data/Order_completed.json");
//* นาที (0 - 59) * ชั่วโมง (0 - 23) * วันในเดือน (1 - 31) * เดือน (0 - 11) * วันในสัปดาห์ (0 - 6)
cron.schedule("55 13 * * *", () => {
  try {
    fs.writeFileSync(orderCompletedPath, JSON.stringify([], null, 2), "utf8");
    console.log("clear_Order_completed.json");
  } catch (error) {
    console.error("error clear_Order_completed.json", error);
  }
});
