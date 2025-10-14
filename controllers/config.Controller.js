const axios = require('axios'); 
const DRONE_CONFIG_URL = process.env.DRONE_CONFIG_URL;

exports.getConfig = async (req, res) => {
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
    
    const result = {
        drone_id: config.drone_id,
        drone_name: config.drone_name,
        light: config.light,
        country: config.country,
        weight: config.weigh,
    };

    res.json(result);
  } 
  catch (error) {
    console.error("!!! Detailed Error Fetching Config:", error); 
    res.status(500).json({ error: "Failed to fetch config" });
  }
};