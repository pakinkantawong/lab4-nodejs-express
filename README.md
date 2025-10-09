<img width="559" height="387" alt="Screenshot 2025-10-09 191200" src="https://github.com/user-attachments/assets/31a15a5c-ec43-4b88-b460-3a1b1685e1eb" /># Contact Form API & Frontend

ระบบตัวอย่างสำหรับจัดการฟอร์มติดต่อและฟีดแบ็กพร้อม middleware ตรวจสอบข้อมูล, บันทึกลงไฟล์ JSON และหน้าเว็บตัวอย่างสำหรับทดสอบแบบ real-time

## โครงสร้างหลัก
- `server.js` – ตั้งค่า Express, rate limit, static files, routes และ endpoint `/api/status`
- `routes/` – รวม router สำหรับ `contact` (CRUD พื้นฐาน + pagination) และ `feedback` (บันทึกและสถิติ)
- `middleware/` – เก็บ validation middleware และตัวจัดการไฟล์ JSON
- `public/` – หน้าเว็บตัวอย่างและสคริปต์ client (`script.js`) สำหรับ validation, fetch API และส่วนทดสอบ
- `data/` – ไฟล์ JSON เก็บข้อมูล (`contacts.json`, `feedback.json`)
- `docs/screenshots/` – รวมภาพตัวอย่างขั้นตอนการทำงาน

## ความต้องการระบบ
- Node.js v18 ขึ้นไป (พัฒนาด้วย v20)
- npm v9 ขึ้นไป

## ขั้นตอนติดตั้งและรัน
```bash
npm install
```

### โหมดพัฒนา (แนะนำ)
```bash
npm run dev
```
บริการจะเริ่มที่ `http://localhost:3000` และ nodemon จะรีโหลดอัตโนมัติเมื่อแก้ไขไฟล์

### โหมดรันปกติ
```bash
npm start
```
ใช้เมื่อ deploy หรือไม่ต้องการ watch ไฟล์

## วิธีการทดสอบ
1. **การรันโปรเจค**  
   - `npm install`  
   - `npm run dev`
2. **ทดสอบผ่าน Browser**  
   - เปิด `http://localhost:3000`  
   - กรอกฟอร์มติดต่อและฟอร์มฟีดแบ็กให้ครบ  
   - ทดสอบ validation ทั้งกรณีผ่านและไม่ผ่าน  
   - ใช้ปุ่มในส่วน “API testing” เพื่อเรียกดูผลลัพธ์
3. **ทดสอบด้วย cURL**
   ```bash
   # ทดสอบ Contact API
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "ทดสอบ นามสกุล",
       "email": "test@email.com",
       "subject": "ทดสอบระบบ",
       "message": "นี่คือข้อความทดสอบระบบ"
     }'

   # ทดสอบ Feedback API
   curl -X POST http://localhost:3000/api/feedback \
     -H "Content-Type: application/json" \
     -d '{
       "rating": 5,
       "comment": "ระบบใช้งานง่ายมาก"
     }'

   # ดูข้อมูลที่บันทึก
   curl http://localhost:3000/api/contact
   curl http://localhost:3000/api/feedback/stats
   ```

## ตัวอย่างหน้าจอ
ไฟล์ทั้งหมดอยู่ใน `docs/screenshots/` และถูกอ้างอิงใน README เพื่อให้ดูตัวอย่างได้ทันที

![API Docs](<img width="559" height="387" alt="Screenshot 2025-10-09 191200" src="https://github.com/user-attachments/assets/59c7f19e-f796-4d4f-9895-d19bef297b8c" />
)
![Postman GET Contact](<img width="1281" height="804" alt="image" src="https://github.com/user-attachments/assets/4251d02e-678d-4524-a1fd-a8ec6c7707ac" />
)
![Postman POST Feedback](<img width="1278" height="800" alt="image" src="https://github.com/user-attachments/assets/efc1ee30-b759-49b9-8c3b-3390bcb223ff" />
)
![Postman Feedback Stats](<img width="1276" height="798" alt="image" src="https://github.com/user-attachments/assets/0d2b4d23-516c-40e8-8a20-5135bd40e3d8" />
)
![Postman POST Contact](<img width="1274" height="810" alt="image" src="https://github.com/user-attachments/assets/d00f6a84-c883-49c5-850a-94b786fa96d0" />
)
![Terminal npm run dev]()

## การรีเซ็ตข้อมูล
ลบหรือรีเซ็ตไฟล์ JSON ในโฟลเดอร์ `data/` เมื่อต้องการเริ่มใหม่ เช่น
```bash
printf '[]\n' > data/contacts.json
printf '[]\n' > data/feedback.json
```


