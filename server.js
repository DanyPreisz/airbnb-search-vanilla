const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, "public");
const DB = path.join(ROOT, "data", "stays.json");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function send(res, status, body, type = TYPES[".json"]) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function stays() {
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}

function file(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, "No encontrado", "text/plain; charset=utf-8");
    send(res, 200, data, TYPES[path.extname(filePath)] || "application/octet-stream");
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/healthz")) {
    return send(res, 200, { ok: true });
  }

  if (req.method === "GET" && url.pathname === "/api/stays") {
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const max = Number(url.searchParams.get("max") || 9999);
    const guests = Number(url.searchParams.get("guests") || 1);
    const list = stays().filter((s) => {
      const text = `${s.title} ${s.city} ${s.type}`.toLowerCase();
      return (!q || text.includes(q)) && s.price <= max && s.guests >= guests;
    });
    return send(res, 200, list);
  }

  const one = url.pathname.match(/^\/api\/stays\/([^/]+)$/);
  if (req.method === "GET" && one) {
    const item = stays().find((s) => s.id === one[1]);
    return item ? send(res, 200, item) : send(res, 404, { error: "no" });
  }

  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  file(res, path.join(PUBLIC, safe));
});

server.listen(PORT, HOST, () => {
  console.log(`listening on http://${HOST}:${PORT}`);
});
