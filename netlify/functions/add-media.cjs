exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle OPTIONS request (CORS preflight)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("Received data:", data); // Debug log

    // בדיקת תקינות הנתונים
    if (!data.url || !data.title || !data.category) {
      throw new Error("Missing required fields");
    }

    console.log("Fetching from GitHub..."); // לוג לבדיקה

    // קריאת הקובץ הקיים מ-GitHub
    const response = await fetch(
      "https://api.github.com/repos/MotiWolff/Havlin-Web/contents/src/data/galleryData.json",
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("GitHub API Response status:", response.status); // לוג לבדיקה

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API Error:", errorText); // לוג לבדיקה
      throw new Error(`GitHub API returned ${response.status}: ${errorText}`);
    }

    const fileData = await response.json();
    console.log("File data received"); // לוג לבדיקה

    const content = Buffer.from(fileData.content, "base64").toString("utf8");
    console.log("Content decoded"); // לוג לבדיקה

    // Parse JSON safely (no eval)
    const galleryData = JSON.parse(content);
    console.log("Gallery data parsed"); // לוג לבדיקה

    // הוספת הפריט החדש
    if (!galleryData[data.category]) {
      galleryData[data.category] = [];
    }

    galleryData[data.category].push({
      type: data.type,
      url: data.url,
      title: data.title,
      description: data.description || "",
    });

    console.log("Updating GitHub..."); // לוג לבדיקה

    // Update file on GitHub (JSON)
    const newContent = JSON.stringify(galleryData, null, 2);
    const updateResponse = await fetch(
      "https://api.github.com/repos/MotiWolff/Havlin-Web/contents/src/data/galleryData.json",
      {
        method: "PUT",
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update gallery data",
          content: Buffer.from(newContent, "utf8").toString("base64"),
          sha: fileData.sha,
        }),
      }
    );

    console.log("GitHub update response status:", updateResponse.status); // לוג לבדיקה

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("GitHub Update Error:", errorText); // לוג לבדיקה
      throw new Error(`GitHub update failed: ${errorText}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Function error:", error.message); // לוג לבדיקה
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to add media",
        details: error.message,
      }),
    };
  }
};


