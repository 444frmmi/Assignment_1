# Drone API Server

ระบบ API สำหรับบริหารจัดการข้อมูลและบันทึกการทำงานของโดรน
พัฒนาโดยใช้ Node.js + Express.js เพื่อรองรับการเชื่อมต่อจากอุปกรณ์โดรนจริง และระบบบันทึกข้อมูลบน Cloud

## Live API Endpoint

**Base URL:** `https://assignment-1-1-1mvy.onrender.com`

API นี้ออกแบบมาเพื่อ:
- ดึงข้อมูลการตั้งค่าของโดรนแต่ละตัว
- ตรวจสอบสถานะปัจจุบันของโดรน
- บันทึกข้อมูล log อุณหภูมิ สถานที่ และชื่อโดรน

---

## Features & Test

- **GET `/configs/:droneId`** → ดึงข้อมูล Config ของโดรน
  ```bash
  curl https://assignment-1-1-1mvy.onrender.com/configs/66010262
  ```

- **GET `/status/:droneId`** → ดึงสถานะ ของโดรน
  ```bash
  curl https://assignment-1-1-1mvy.onrender.com/status/66010262
  ```

- **GET `/logs/:droneId`** → ดึง Logs การทำงานของโดรน
  ```bash
  curl https://assignment-1-1-1mvy.onrender.com/logs/66010262
  ```

- **POST `/logs`** → สร้าง Log record ใหม่
  ```bash
  curl -X POST https://assignment-1-1-1mvy.onrender.com/logs\
    -H "Content-Type: application/json" \
    -d '{"drone_id":66010262,"drone_name":"Dot Dot","country":"India","celsius":42}'
  ```

---

## การติดตั้งและรัน (Local)

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/444frmmi/Assignment_1.git
    cd Assignment_1
    npm install
    ```

2.  **Setup Environment:**
    สร้างไฟล์ `.env`
    ```
    PORT=3000
    DRONE_CONFIG_URL=https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec
    DRONE_LOG_URL=https://app-tracking.pockethost.io/api/collections/drone_logs/records
    DRONE_LOG_API_TOKEN=20250101efx
    ```

3.  **Run Server:**
    ```bash
    npm start
    ```
