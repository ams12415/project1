export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://realtime.catabus.com/InfoPoint/GTFS-Realtime.ashx?&Type=VehiclePosition&debug=true"
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from transit API: ${response.status}`);
    }

    const data = await response.json();
    
    // sends the data  back to frontend
    res.status(200).json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    res.status(500).json({ error: "Failed to fetch bus data" });
  }
}