const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS Middleware (manual)
const cors = require('cors');

// เปิดกว้าง (เหมาะตอนพัฒนา)
app.use(cors());

// —หรือ— กำหนดชัดเจน (แนะนำเมื่อขึ้นโปรดักชัน)
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));


// Config URLs from environment variables
const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL;
const LOG_URL = process.env.LOG_URL;
const LOG_API_TOKEN = process.env.LOG_API_TOKEN;

// GET /configs/{droneId}
app.get('/configs/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;
    const u = new URL(DRONE_CONFIG_URL);
    u.searchParams.set('id', String(droneId));  // ✅ ใส่พารามิเตอร์

    const response = await fetch(u);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // เช็คว่า response เป็น Array หรือ Object
    let allConfigs = data;
    if (data.data && Array.isArray(data.data)) {
      allConfigs = data.data;
    } else if (!Array.isArray(data)) {
      // ถ้าเป็น Object ให้แปลงเป็น Array
      allConfigs = Object.values(data);
    }
    
    // หา config ของ drone id ที่ต้องการ
    const droneConfig = allConfigs.find(
      config => config.drone_id === parseInt(droneId)
    );
    
    if (!droneConfig) {
      return res.status(404).json({ error: 'Drone not found' });
    }
    
    // ส่งกลับเฉพาะข้อมูลที่ต้องการ
    res.json({
      drone_id: droneConfig.drone_id,
      drone_name: droneConfig.drone_name,
      light: droneConfig.light,
      country: droneConfig.country,
      weight: droneConfig.weight
    });
  } catch (error) {
    console.error('Error fetching config:', error.message);
    res.status(500).json({ error: 'Failed to fetch drone config' });
  }
});

// GET /status/{droneId}
app.get('/status/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;
    
    const response = await fetch(DRONE_CONFIG_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // เช็คว่า response เป็น Array หรือ Object
    let allConfigs = data;
    if (data.data && Array.isArray(data.data)) {
      allConfigs = data.data;
    } else if (!Array.isArray(data)) {
      allConfigs = Object.values(data);
    }
    
    const droneConfig = allConfigs.find(
      config => config.drone_id === parseInt(droneId)
    );
    
    if (!droneConfig) {
      return res.status(404).json({ error: 'Drone not found' });
    }
    
    res.json({
      condition: droneConfig.condition
    });
  } catch (error) {
    console.error('Error fetching status:', error.message);
    res.status(500).json({ error: 'Failed to fetch drone status' });
  }
});

// GET /logs/{droneId}
app.get('/logs/:droneId', async (req, res) => {
  try {
    const { droneId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = 12;
    
    // สร้าง URL พร้อม query parameters
    const url = new URL(LOG_URL);
    url.searchParams.append('filter', `drone_id=${droneId}`);
    url.searchParams.append('sort', '-created');
    url.searchParams.append('page', page);
    url.searchParams.append('perPage', perPage);
    
    // เรียก Drone Log Server
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${LOG_API_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const logs = data.items || [];
    
    // ส่งกลับเฉพาะข้อมูลที่ต้องการ
    const formattedLogs = logs.map(log => ({
      drone_id: log.drone_id,
      drone_name: log.drone_name,
      created: log.created,
      country: log.country,
      celsius: log.celsius
    }));
    
    res.json({
      items: formattedLogs,
      page: data.page,
      perPage: data.perPage,
      totalItems: data.totalItems,
      totalPages: data.totalPages
    });
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ error: 'Failed to fetch drone logs' });
  }
});

// POST /logs
app.post('/logs', async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;
    
    // ตรวจสอบข้อมูล
    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: drone_id, drone_name, country, celsius' 
      });
    }
    
    // สร้าง log record ใหม่
    const response = await fetch(LOG_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        drone_id,
        drone_name,
        country,
        celsius
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating log:', error.message);
    res.status(500).json({ error: 'Failed to create log record' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Drone API Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});