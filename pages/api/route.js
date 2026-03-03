// pages/api/route.js
export default async function handler(req, res) {
  const { start_lon, start_lat, end_lon, end_lat } = req.query;

  if (!start_lon || !start_lat || !end_lon || !end_lat) {
    return res.status(400).json({ error: "Missing coordinates" });
  }

  const apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjRjNGVlMmE5YjY3MzQwMGM4MTFhY2ExYjFhNmJjNmIxIiwiaCI6Im11cm11cjY0In0="; 
  
  const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${start_lon},${start_lat}&end=${end_lon},${end_lat}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch routing data");

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Routing API Error:", error);
    res.status(500).json({ error: "Failed to calculate walking route" });
  }
}