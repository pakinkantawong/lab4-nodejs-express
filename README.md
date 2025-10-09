# 💬 Contact Form API & Frontend

ระบบตัวอย่างสำหรับจัดการ **ฟอร์มติดต่อ (Contact Form)** และ **ฟีดแบ็ก (Feedback)**  
พร้อม **middleware ตรวจสอบข้อมูล**, **บันทึกลงไฟล์ JSON**,  
และหน้าเว็บตัวอย่างสำหรับ **ทดสอบการทำงานแบบ Real-time ⚡**

---

## 🗂️ โครงสร้างหลัก
```contact-form-api/
├── package.json
├── server.js
├── routes/
│ ├── contact.js
│ └── feedback.js
├── middleware/
│ ├── validators.js
│ └── jsonStore.js
├── public/
│ ├── index.html
│ └── script.js<
├── data/
│ ├── contacts.json
│ └── feedback.json```


---

## ⚙️ ความต้องการระบบ
- 🟢 Node.js **v18 ขึ้นไป** (พัฒนาด้วย v20)
- 🔵 npm **v9 ขึ้นไป**

---

## 🚀 ขั้นตอนติดตั้งและรัน
ติดตั้ง dependencies:

`npm install
npm run dev`

## 💻 โหมดพัฒนา (แนะนำ)
บริการจะเริ่มที่ 👉 http://localhost:3000
และจะรีโหลดอัตโนมัติเมื่อมีการแก้ไขไฟล์ 🔁

## 🏁 โหมดรันปกติ
` npm start `
ใช้เมื่อ deploy หรือไม่ต้องการ watch ไฟล์

## 🧪 วิธีการทดสอบ
1️⃣ การรันโปรเจค
`npm install
npm run dev`

2️⃣ ทดสอบผ่าน Browser 🌐
เปิด http://localhost:3000
กรอกฟอร์มติดต่อและฟีดแบ็กให้ครบ
ทดสอบ validation ทั้งกรณีผ่านและไม่ผ่าน
ใช้ปุ่มในส่วน “API testing” เพื่อดูผลลัพธ์แบบเรียลไทม์

3️⃣ ทดสอบผ่าน cURL 🧰

# ทดสอบ Contact API
`curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ทดสอบ นามสกุล",
    "email": "test@email.com",
    "subject": "ทดสอบระบบ",
    "message": "นี่คือข้อความทดสอบระบบ"
  }'`

# ทดสอบ Feedback API
`curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "ระบบใช้งานง่ายมาก 👍"
  }'`

# ดูข้อมูลที่บันทึก
#curl http://localhost:3000/api/contact
#curl http://localhost:3000/api/feedback/stats
### 📊 ผลการทดลอง
---
## 🖥️ Terminal: npm run dev

<img width="559" height="387" alt="Screenshot 2025-10-09 191200" src="https://github.com/user-attachments/assets/59c7f19e-f796-4d4f-9895-d19bef297b8c" />

---

## 📬 Postman – GET Contact

<img width="1281" height="804" alt="image" src="https://github.com/user-attachments/assets/4251d02e-678d-4524-a1fd-a8ec6c7707ac" />

---

## 💬 Postman – POST Feedback

<img width="1278" height="800" alt="image" src="https://github.com/user-attachments/assets/efc1ee30-b759-49b9-8c3b-3390bcb223ff" />

---

## 📈 Postman – Feedback Stats

<img width="1276" height="798" alt="image" src="https://github.com/user-attachments/assets/0d2b4d23-516c-40e8-8a20-5135bd40e3d8" />

---

## 📩 Postman – POST Contact

<img width="1274" height="810" alt="image" src="https://github.com/user-attachments/assets/d00f6a84-c883-49c5-850a-94b786fa96d0" />

---
## 🔄 การรีเซ็ตข้อมูล
หากต้องการเริ่มใหม่หรือล้างข้อมูล JSON ทั้งหมดในโฟลเดอร์ data/
สามารถใช้คำสั่งต่อไปนี้ได้เลย 👇

`printf '[]\n' > data/contacts.json
printf '[]\n' > data/feedback.json`
