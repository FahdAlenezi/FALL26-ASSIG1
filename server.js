// CYSE 411 - Assignment 1: Secure Status Portal
// Minimal Express server. You do NOT need to modify this file.
//
// Run:  npm install   (only once)
//       npm start
// Open: http://localhost:3000

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve the frontend (public/index.html, public/js/*.js, public/css/*.css)
app.use(express.static(path.join(__dirname, "public")));

// The "backend" is not perfect. Some entries are malformed on purpose.
// Remember Unit 1.3: JSON is data, not truth.
const services = [
  { name: "Patriot Web", status: "up", online: true, latencyMs: 120 },
  { name: "Canvas Gateway", status: "degraded", online: true, latencyMs: 870 },
  { name: "Mail Relay", status: "down", online: false, latencyMs: 0 },
  { name: "VPN Concentrator", status: "up", online: "false", latencyMs: 95 },
  { name: "<img src=x onerror=document.body.classList.add('pwned')>", status: "up", online: true, latencyMs: 40 },
  { name: "Lab Printers", status: "UP", online: true, latencyMs: 300 },
  { name: "   ", status: "up", online: true, latencyMs: 10 },
  { name: "Research Cluster", status: "up", online: true, latencyMs: "120" },
  { name: "Library Proxy", status: "up", online: true },
  { status: "down", online: false, latencyMs: 0 },
  { name: "DNS Resolver", status: "up", online: true, latencyMs: 15, isAdmin: true },
  null
];

app.get("/api/status", (req, res) => {
  const mode = req.query.simulate;

  // Artificial network delay so you can SEE asynchronous behavior
  setTimeout(() => {
    if (mode === "error") {
      // A real HTTP error. Question: does fetch() reject on a 503?
      return res.status(503).json({ error: "Status service under maintenance" });
    }
    if (mode === "garbage") {
      // A 200 OK whose body is NOT valid JSON
      return res.type("text/html").send("<html><body>Proxy error page</body></html>");
    }
    res.json({ generatedAt: new Date().toISOString(), services });
  }, 800);
});

app.listen(PORT, () => {
  console.log(`Secure Status Portal running at http://localhost:${PORT}`);
});
