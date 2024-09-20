const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_PORT = process.env.BACKEND_PORT || 5000;
const BACKEND_PORT = process.env.FRONTEND_PORT || 3000;

// Proxy requests to the backend server
app.use(
  "/api",
  createProxyMiddleware({
    target: `http://localhost:${BACKEND_PORT}`, // Backend server
    changeOrigin: true,
  })
);

// Proxy requests to the frontend server
app.use(
  "/",
  createProxyMiddleware({
    target: `http://localhost:${FRONTEND_PORT}`, // Frontend server
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
