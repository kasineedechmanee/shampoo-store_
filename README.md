# HAIRÉ — Shampoo Store (พร้อม Deploy บน Vercel)

เว็บไซต์ตัวอย่างร้านแชมพูภาษาไทย มี 2 SKU, ตะกร้าสินค้า, Checkout, หน้าจัดการคำสั่งซื้อ, ใบหยิบสินค้า, CSV และใบจ่าหน้าพัสดุ

## ไฟล์สำคัญ
- `index.html`, `style.css`, `app.js` — หน้าร้าน
- `admin.html`, `admin.js` — หน้าจัดการคำสั่งซื้อและเอกสารคลังสินค้า
- `google-apps-script.gs` — API เชื่อม Google Sheets
- `public/images/` — โฟลเดอร์รูปสินค้า (เพิ่มไฟล์ภาพจริงได้)

## ทดลองในเครื่อง
เปิด `index.html` ด้วย browser ได้ทันที หรือใช้ VS Code Live Server
ก่อนเชื่อม Google Sheets คำสั่งซื้อจะเก็บใน localStorage ของ browser เพื่อทดลองเท่านั้น (ไม่ใช่ฐานข้อมูลออนไลน์และไม่แชร์ข้ามอุปกรณ์)

## เชื่อม Google Sheets
1. สร้าง Google Spreadsheet ใหม่ แล้วคัดลอก Spreadsheet ID จาก URL
2. เปิด https://script.google.com/ สร้างโปรเจกต์ใหม่
3. วางโค้ดจาก `google-apps-script.gs` และใส่ Spreadsheet ID ใน `SPREADSHEET_ID`
4. เลือกฟังก์ชัน `setup` แล้ว Run และอนุญาตสิทธิ์ จะสร้างชีต Products, Orders, OrderItems พร้อมสินค้าเริ่มต้น
5. Deploy > New deployment > Web app; Execute as: Me; Who has access: Anyone (สำหรับโปรเจกต์สาธิตในชั้นเรียน)
6. คัดลอก Web app URL
7. ใส่ URL ใน `app.js` ที่ `CONFIG.SHEETS_WEB_APP_URL` และใน `admin.js` ที่ `ENDPOINT`
8. Deploy เวอร์ชันใหม่ของ Apps Script หลังแก้โค้ดทุกครั้ง

**หมายเหตุ:** การเปิด API ให้ Anyone เหมาะกับงานสาธิตเท่านั้น เพราะยังไม่มีระบบล็อกอินผู้ดูแล/ป้องกันสแปม ควรเพิ่มการยืนยันตัวตนก่อนใช้งานจริง และอย่าเก็บข้อมูลบัตรเครดิต

## Deploy GitHub + Vercel
1. สร้าง GitHub repository ชื่อ `shampoo-store`
2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้ (รวม `public/`)
3. เข้า https://vercel.com/ แล้ว Sign up / Log in ด้วย GitHub
4. Add New > Project > Import repository `shampoo-store`
5. Framework Preset: Other; Build Command และ Output Directory เว้นว่าง (หรือ Output Directory `.`)
6. กด Deploy จะได้ URL `*.vercel.app`
7. หากแก้ไฟล์ ให้ push ขึ้น GitHub แล้ว Vercel จะ deploy อัตโนมัติ

## หน้าระบบ
- หน้าร้าน: `/`
- หลังบ้าน: `/admin.html`

## รูปสินค้า
สร้างโฟลเดอร์ `public/images/` แยกเก็บรูปตามโจทย์ สามารถเพิ่ม `shampoo-01.jpg`, `shampoo-02.jpg` ได้ ภาพขวดในเวอร์ชันเริ่มต้นวาดด้วย CSS จึงไม่ต้องพึ่งภาพภายนอก

## ขอบเขต
โค้ดนี้เป็นโปรเจกต์พร้อมนำไป deploy แต่ยังไม่สามารถสร้าง Google Sheet, อัปโหลดเข้า GitHub หรือ Deploy เข้า Vercel ในบัญชีของนักศึกษาแทนได้โดยไม่มีสิทธิ์เข้าถึงบัญชี ต้องทำขั้นตอนเชื่อมต่อด้านบนก่อนจึงจะรับออเดอร์ออนไลน์ลง Google Sheets ได้จริง
