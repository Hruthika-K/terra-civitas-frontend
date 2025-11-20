import supabase from "./supabase";

export async function getAlerts() {
  try {
    // Check if supabase is configured before trying to use it
    if (!supabase) {
      console.warn("Supabase not configured");
      return [];
    }

    // Query the 'verified_alerts' table. Adjust column names if your schema differs.
    const { data, error } = await supabase
      .from("verified_alerts")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.warn("Supabase getAlerts error:", error);
      return [];
    }

    if (!data || !Array.isArray(data) || data.length === 0) return [];

    console.log("Fetched from Supabase:", data);

    // Map DB rows to the UI's expected shape. Support common column names.
    const mapped = await Promise.all(data.map(async (row: any) => {
      let image_url = "";
      
      // Extract metadata first to get image_file path
      let tempMetadata: any = {};
      try {
        tempMetadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata || {};
      } catch (e) {
        console.warn("Failed to parse metadata for image:", e);
      }
      
      // Fetch image from Supabase storage
      if (row.alert_id && supabase) {
        try {
          let imagePath = "";
          
          // Check if metadata has image_file path (like "CRIME_20251115_165805_658.jpg")
          if (tempMetadata.image_file) {
            imagePath = tempMetadata.image_file.replace(/^.*[\\\/]/, ''); // Remove any path, keep just filename
            console.log(`Using image_file from metadata: ${imagePath}`);
          } else {
            // Fallback to alert_id.jpg format
            imagePath = `${row.alert_id}.jpg`;
            console.log(`Using alert_id format: ${imagePath}`);
          }
          
          // Prepend the folder path
          const fullPath = `verified_alerts/images/${imagePath}`;
          
          const { data: imageData } = supabase
            .storage
            .from("alert-images")
            .getPublicUrl(fullPath);
          image_url = imageData?.publicUrl || "";
          console.log(`Generated image URL with folder path:`, image_url);
        } catch (err) {
          console.error(`Failed to fetch image for alert ${row.alert_id}:`, err);
        }
      }

      // Extract metadata fields if available
      let metadata: any = {};
      try {
        metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata || {};
      } catch (parseErr) {
        console.warn("Failed to parse metadata:", parseErr);
        metadata = {};
      }

      const alert_type = metadata.alert_type || row.alert_type || "Crime Detection Alert";
      
      // Build description from detection_details object
      let description = "Alert detected by system";
      if (metadata.detection_details && typeof metadata.detection_details === 'object') {
        const details = metadata.detection_details;
        const parts = [];
        if (details.weapons_detected !== undefined) parts.push(`Weapons: ${details.weapons_detected}`);
        if (details.crime_score !== undefined) parts.push(`Crime Score: ${(details.crime_score * 100).toFixed(1)}%`);
        if (details.motion_score !== undefined) parts.push(`Motion Score: ${(details.motion_score * 100).toFixed(1)}%`);
        if (details.cluster_score !== undefined) parts.push(`Cluster Score: ${(details.cluster_score * 100).toFixed(1)}%`);
        description = parts.length > 0 ? parts.join(', ') : description;
      } else if (typeof metadata.detection_details === 'string') {
        description = metadata.detection_details;
      }

      return {
        id: row.id?.toString() ?? row.alert_id ?? String(Math.random()).slice(2, 10),
        type: row.threat_score ? (row.threat_score > 0.8 ? "critical" : row.threat_score > 0.5 ? "warning" : "info") : "info",
        title: alert_type,
        location: "Detection Zone",
        timestamp: row.timestamp || row.created_at || new Date().toISOString(),
        description: description,
        status: "verified", // alerts from verified_alerts table are pre-verified
        confidence: typeof row.confidence === "number" ? row.confidence : Number(row.confidence) || 0,
        threat_score: typeof row.threat_score === "number" ? row.threat_score : Number(row.threat_score) || 0,
        weapons_detected: typeof row.weapons_detected === "number" ? row.weapons_detected : Number(row.weapons_detected) || 0,
        image_base64: row.image_base64 || "",
        image_url,
      };
    }));

    console.log("Mapped alerts returned:", mapped);
    
    // Log image URLs for debugging
    mapped.forEach(alert => {
      console.log(`Alert ${alert.id}: image_url="${alert.image_url}", image_base64="${alert.image_base64 ? 'present' : 'empty'}"`);
    });
    
    return mapped;
  } catch (err) {
    console.warn("getAlerts caught error:", err);
    return [];
  }
}

export default { getAlerts };
