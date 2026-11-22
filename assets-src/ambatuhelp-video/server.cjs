// Static server for the video renderer; POST /save?name=x.webm writes the body to ./out.
const http = require("http"), fs = require("fs"), path = require("path");
const root = __dirname, types = { ".html": "text/html", ".png": "image/png", ".ttf": "font/ttf", ".js": "text/javascript", ".wav": "audio/wav", ".json": "application/json" };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (req.method === "POST" && u.pathname === "/save") {
    const name = path.basename(u.searchParams.get("name") || "out.webm");
    const chunks = []; req.on("data", c => chunks.push(c));
    req.on("end", () => { fs.writeFileSync(path.join(root, "out", name), Buffer.concat(chunks)); res.end("ok " + Buffer.concat(chunks).length); });
    return;
  }
  const f = path.join(root, path.normalize(u.pathname === "/" ? "/index.html" : u.pathname));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.statusCode = 404; return res.end(); }
  res.setHeader("Content-Type", types[path.extname(f)] || "application/octet-stream");
  fs.createReadStream(f).pipe(res);
}).listen(+process.env.PORT || 4391, () => console.log("video server up"));
