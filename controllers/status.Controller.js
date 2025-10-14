const axios = require('axios');
const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL; 

exports.getStatus = async (req, res) => {
  try {
    const { droneId } = req.params;

    if (!DRONE_CONFIG_URL) {
      console.error("!!! ERROR: DRONE_CONFIG_URL is not defined in .env file.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const response = await axios.get(DRONE_CONFIG_URL);
    const allConfigs = response.data.data;
    const config = allConfigs.find((c) => c.drone_id == droneId);

    if (!config) {
      return res.status(404).json({ error: "Drone not found" });
    }
    
    res.json({ condition: config.condition });

  } catch (error) {
    console.error("!!! Detailed Error Fetching Status:", error); 
    res.status(500).json({ error: "Failed to fetch status" });
  }
};