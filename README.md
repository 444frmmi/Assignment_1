# Drone API Server

API Server สำหรับจัดการข้อมูลโดรน สร้างด้วย Node.js และ Express.js

## Live API Endpoint

**Base URL:** `https://drone-api-a43n.onrender.com`

---

## Features & Test

- **GET `/configs/:droneId`** → ดึงข้อมูล Config ของโดรน
  ```bash
  curl https://drone-api-a43n.onrender.com/configs/66010727
  ```

- **GET `/status/:droneId`** → ดึงสถานะ ของโดรน
  ```bash
  curl https://drone-api-a43n.onrender.com/status/66010727
  ```

- **GET `/logs/:droneId`** → ดึง Logs การทำงานของโดรน
  ```bash
  curl https://drone-api-a43n.onrender.com/logs/66010727
  ```

- **POST `/logs`** → สร้าง Log record ใหม่
  ```bash
  curl -X POST https://drone-api-a43n.onrender.com/logs\
    -H "Content-Type: application/json" \
    -d '{"drone_id":66010727,"drone_name":"MyDrone","country":"TH","celsius":35}'
  ```

---

## การติดตั้งและรัน (Local)

1.  **Clone & Install:**
    ```bash
    git clone https://github.com/Noeywanat/Assignment1.git
    cd Assignment1
    npm install
    ```

2.  **Setup Environment:**
    สร้างไฟล์ `.env`
    ```
    DRONE_CONFIG_URL=https://script.google.com/macros/s/AKfycbzwclqJRodyVjzYyY-NTQDb9cWG6Hoc5vGAABVtr5-jPA_ET_2IasrAJK4aeo5XoONiaA/exec
    DRONE_LOG_URL=https://app-tracking.pockethost.io/api/collections/drone_logs/records
    DRONE_LOG_API_TOKEN=20250101efx
    PORT=3000
    ```

3.  **Run Server:**
    ```bash
    npm start
    ```