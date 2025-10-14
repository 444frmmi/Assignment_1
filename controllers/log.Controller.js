const axios = require('axios');

const DRONE_LOG_URL = process.env.DRONE_LOG_URL;
const DRONE_LOG_API_TOKEN = process.env.DRONE_LOG_API_TOKEN;

// GET /logs/:droneId
exports.getLogs = async (req, res) => {
  try {
    const { droneId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    if (!DRONE_LOG_URL || !DRONE_LOG_API_TOKEN) {
      console.error("!!! ERROR: DRONE_LOG_URL or DRONE_LOG_API_TOKEN is not defined.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${DRONE_LOG_API_TOKEN}`
      },
      params: {
        page: page,
        perPage: limit,
        sort: '-created',
        filter: `drone_id=${droneId}`
      },
      timeout: 20000 
    };

    const response = await axios.get(DRONE_LOG_URL, config);

    const result = response.data.items.map(log => ({
        drone_id: log.drone_id,
        drone_name: log.drone_name,
        created: log.created,
        country: log.country,
        celsius: log.celsius
    }));

    res.json(result);

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error("!!! Timeout Error: Drone Log Server took too long to respond.");
      return res.status(504).json({ error: "Gateway Timeout: The Drone Log Server is not responding." });
    }

    console.error("!!! Detailed Error Fetching Logs:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// +++ เพิ่มฟังก์ชันนี้เข้าไป +++
// POST /logs 
exports.createLog = async (req, res) => {
  try {
    const { drone_id, drone_name, country, celsius } = req.body;

    if (!drone_id || !drone_name || !country || celsius === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!DRONE_LOG_URL || !DRONE_LOG_API_TOKEN) {
        console.error("!!! ERROR: DRONE_LOG_URL or DRONE_LOG_API_TOKEN is not defined.");
        return res.status(500).json({ error: "Server configuration error." });
    }

    const logData = { drone_id, drone_name, country, celsius };
    const config = {
      headers: {
        'Authorization': `Bearer ${DRONE_LOG_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    const response = await axios.post(DRONE_LOG_URL, logData, config);

    res.status(201).json(response.data);

  } catch (error) {
    console.error("!!! Detailed Error Creating Log:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to create log" });
  }
};