// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Serve static files (JS, CSS, images)
app.use(express.static(path.join(__dirname, "dist")));

// Serve pre-generated static HTML for each slug
app.get("/resource/:slug", (req, res) => {
  const slug = req.params.slug;
  const staticFilePath = path.join(__dirname, "dist", `resource-${slug}.html`);

  // Check if the static HTML file exists for the given slug
  if (fs.existsSync(staticFilePath)) {
    res.sendFile(staticFilePath); // Serve the generated static HTML file
  } else {
    // If no static file exists, fallback to SPA
    res.sendFile(path.join(__dirname, "dist/index.html"));
  }
});

// Fallback for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
