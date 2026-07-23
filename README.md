## <img src="public/logo.png" alt="หน้าแรกของโปรเจค" width="60" style="vertical-align: middle; margin-right: 8px;"/> Tawawan Dog Café

โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา **Fundamental of Database System** และ **Software Process** พัฒนาโดย กลุ่มUP14 จากสาขาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยพะเยา ปีการศึกษา 2568 เพื่อมุ่งเน้นการพัฒนาซอฟต์แวร์ที่ตอบโจทย์การใช้งานจริงและเสริมสร้างทักษะด้านวิศวกรรมซอฟต์แวร์ให้กับนักศึกษา

## รายละเอียดโครงการ
**Tawawan Dog Café** พัฒนาขึ้นเพื่อเพิ่มประสิทธิภาพการจัดการร้านกาแฟสุนัข โดยระบบสามารถจัดการโต๊ะลูกค้า เมนูอาหารและเครื่องดื่ม ติดตามสถานะออเดอร์ และจัดทำรายงานสรุปยอดขาย ช่วยให้เจ้าของร้านและพนักงานบริหารจัดการร้านได้ง่ายและสะดวกยิ่งขึ้น

---
## ที่มาและความสำคัญ
ปัจจุบันร้านคาเฟ่ได้รับความนิยมสูง แต่กลับเผชิญปัญหาการจัดการ คำสั่งซื้อ เช่น การจดออเดอร์ผิดพลาด ลูกค้ารอคิวนาน และการชำระเงินล่าช้า ส่งผลให้ประสบการณ์ของลูกค้าลดลง เพื่อแก้ไขปัญหาเหล่านี้จึงได้พัฒนา “ระบบสั่งอาหารและเครื่องดื่มผ่านเว็บไซต์” ที่ช่วยให้ลูกค้าสามารถดูเมนู สั่ง และชำระเงินได้ด้วยตนเอง ลดข้อผิดพลาดในการรับออเดอร์ เพิ่มความรวดเร็วในการให้บริการ และเปิดโอกาสให้เจ้าของร้านจัดการเมนูหรือโปรโมชั่นได้อย่างสะดวก ทั้งยังรองรับการใช้งานผ่าน QR Code ในร้านหรือใช้งานล่วงหน้านอกสถานที่ เพื่อยกระดับมาตรฐานการให้บริการของคาเฟ่ในยุคดิจิทัล.

---
## วัตถุประสงค์
- เพื่อให้ลูกค้าสามารถเข้าถึงร้านค้าได้โดยง่ายโดยไม่ต้องไปสั่งหน้าร้านมีเว็ปไซต์เป็นตัวกลาง
-   เพิ่มยอดขายให้กับผู้ประกอบการร้านอาหารตามสั่ง
-   เว็ปไซตจะช่วยสร้างเสริมภาพลักษณ์ที่น่าเชื่อถือให้กับร้านค้าและดึงดูดลูกค้าเข้ามา

---
## กลุ่มผู้ใช้งานหลัก
**Customer**
-   นักศึกษา
-   ผู้ปกครอง
-  ผู้ใช้บริการร้าน Tawawan Dog Café

**Owner**
-   เจ้าของร้านTawawan Dog Café
---


## Table of Contents
- [Tawawan Dog Café](#tawawan-dog-café)
- [รายละเอียดโครงการ](#รายละเอียดโครงการ)
- [ที่มาและความสำคัญ](#ที่มาและความสำคัญ)
- [วัตถุประสงค์](#วัตถุประสงค์)
- [กลุ่มผู้ใช้งานหลัก](#กลุ่มผู้ใช้งานหลัก)
- [ฟีเจอร์เด่นของระบบ](#ฟีเจอร์เด่นของระบบ)
- [Team Job position](#team-job-position)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [Figma](#figma)
- [Demo](#demo)
- [Contact](#contact)

---

## ฟีเจอร์เด่นของระบบ

ระบบถูกแบ่งหน้าการทำงานหลักตามบทบาทของผู้ใช้งานเป็น 2 กลุ่ม ได้แก่:

### 1. หน้าสั่งอาหารสำหรับลูกค้า (Customer Features)
- **การเลือกโต๊ะอาหาร (Table Selection):** ลูกค้าสามารถระบุหมายเลขโต๊ะก่อนเข้าทำรายการเพื่อเชื่อมต่อข้อมูลการสั่งซื้อกับตำแหน่งโต๊ะอาหาร
- **การแสดงรายการเมนูแบบแบ่งหมวดหมู่ (Menu Catalog):** จัดแสดงเมนูอาหาร เครื่องดื่ม ขนมหวาน และอาหารทานเล่นได้อย่างชัดเจน
- **ระบบเมนูแนะนำยอดฮิต (Dynamic Recommendations):** ระบบคำนวณและดึงเมนูขายดีที่สุด 3 อันดับแรก (Top 3 Best Sellers) มาแสดงโดยประมวลผลจากข้อมูลรายรับจริงในระบบหลังบ้าน
- **การเลือกปรับแต่งรายการเครื่องดื่ม (Customizations):** ลูกค้าปรับแต่งประเภทความร้อน/เย็น/ปั่น (ปรับเปลี่ยนตามราคาที่ตั้งไว้), ความหวาน (0% ถึง 100%) และเพิ่มหมายเหตุพิเศษได้
- **ตะกร้าสินค้า (Shopping Cart):** แสดงราคารวม คำนวณราคาแต่ละรายการ และรองรับการเพิ่ม/ลดจำนวน หรือลบออกจากตะกร้าก่อนสั่งซื้อ
- **การชำระเงินจำลอง (QR Code Payment Simulator):** แสดง PromptPay QR Code จำลองตามยอดชำระเงินจริง พร้อมตัวเลขนับถอยหลังในการทำรายการ 120 วินาที เพื่อเพิ่มความปลอดภัยและป้องกันออเดอร์ค้าง
- **ประวัติการแจ้งเตือนสถานะอาหาร (Real-time Notifications):** ตรวจสอบสถานะการปรุงอาหารและการจัดส่งได้แบบเรียลไทม์จากระบบแจ้งเตือน พร้อมฟังก์ชันการจัดการลบกล่องข้อความแจ้งเตือน

### 2. หน้าจัดการหลังบ้านสำหรับเจ้าของร้าน (Owner Features)
- **ระบบยืนยันตัวตนเจ้าของร้าน (Authentication):** สมัครสมาชิกและเข้าสู่ระบบเจ้าของร้านอย่างปลอดภัย ด้วยการตรวจสอบเงื่อนไขรหัสผ่านขั้นสูง (Password Criteria validation)
- **ระบบจัดการเมนูคาเฟ่ (Menu Management - CRUD):** ค้นหา เพิ่ม ลบ แก้ไข รายละเอียด เมนูอาหาร เครื่องดื่ม รูปภาพ ตลอดจนการจัดการราคาของแต่ละประเภทเมนูผ่าน Pop-up Modal
- **การติดตามคำสั่งซื้อเรียลไทม์ (Live Order Monitoring):** มอนิเตอร์รายการออเดอร์ใหม่ๆ ที่เข้ามาทางหน้าโต๊ะพร้อมระบบการดึงข้อมูลอัตโนมัติทุกๆ 3 วินาที (Auto-polling) รองรับปุ่มยืนยัน "ออเดอร์เสร็จสิ้น"
- **รายงานประวัติการขาย (Completed Order History):** แสดงตารางบันทึกการขาย ประวัติการสั่งซื้อ และยอดรวมชำระเงินของลูกค้าทุกโต๊ะที่ทำเสร็จแล้ว
- **ระบบบัญชีการเงินและงบกำไรขาดทุน (Financial Accounting):**
  - **ตารางสรุปรายรับ (Income Tracking):** ตรวจสอบยอดขายรวมรายวัน/สัปดาห์/เดือน/ปี
  - **ตารางจัดการรายจ่าย (Expense Management):** บันทึกรายการรายจ่ายและต้นทุนของร้านค้าแบบแยกหมวดหมู่
  - **สรุปรายงานรายรับ-รายจ่าย (Statement Summary):** คำนวณยอดสุทธิ (Net Total) กำไร/ขาดทุนตามตัวกรองช่วงเวลา พร้อมรหัสสี (สีเขียวยอดสุทธิเป็นบวก / สีแดงยอดสุทธิเป็นลบ)

---

## Team Job position
| **Student ID** | **Name**               | **Position**            |
|-----------------|------------------------|--------------------------|
| 67023008        | Apinya Sanghong        | UX/UI Designer           |
| 67023109        | Inthitanan Pankaew     | Front-End Developer      |
| 67026427        | Pattarawin Rungpanarat | Front-End Developer      |
| 67026449        | Mutsaya Hwangji        | Functional Tester        |

---


## เทคโนโลยีที่ใช้

- **Design:**
  - **Figma** <a href="https://www.figma.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/figma-colored.svg" alt="Figma" title="Figma" width="20" height="20" style="vertical-align: middle;" /></a>

- **Frontend:**
  - **Next.js 13+ (App Router)** <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nextjs-colored-dark.svg" alt="NextJs" title="NextJs" width="20" height="20" style="vertical-align: middle;" /></a>
  - **React** <a href="https://reactjs.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" alt="React" title="React" width="20" height="20" style="vertical-align: middle;" /></a>
  - **JavaScript** <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" alt="JavaScript" title="JavaScript" width="20" height="20" style="vertical-align: middle;" /></a>
  - **TailwindCSS** <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" alt="TailwindCSS" title="TailwindCSS" width="20" height="20" style="vertical-align: middle;" /></a>

- **Database:**
  - **Supabase** <a href="https://supabase.io/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/supabase-colored.svg" alt="Supabase" title="Supabase" width="20" height="20" style="vertical-align: middle;" /></a>

---
## Figma
[Fig Tawawan_Dog_Cafe_V.2](https://www.figma.com/design/2wJkQzfOfAY033oJN8Ofo9/Project-G.UP14?node-id=1-2&t=66GEXJLVoQ84awMg-1)

---
## Demo
[https://tawawan-dog-cafe-v-2.vercel.app/](https://tawawan-dog-cafe-v-2-omega.vercel.app/)

---

## Contact
**หากมีคำถาม สามารถติดต่อผู้ดูแลโปรเจคคนที่1ได้ที่:**
  -  อีเมล: naysasatadur5555@gmail.com
  -  GitHub: [https://github.com/pxttxrxwxn](https://github.com/pxttxrxwxn)
  
**หากมีคำถาม สามารถติดต่อผู้ดูแลโปรเจคคนที่2ได้ที่:**
  -  อีเมล: 67023008@up.ac.th
  -  GitHub: [https://github.com/Pookpikkkkk](https://github.com/Pookpikkkkk)
