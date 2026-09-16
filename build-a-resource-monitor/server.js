import http from "http";
import fs from "fs";
import { WebSocketServer } from "ws";
import os from "os";

const PORT = 9000;

const server = http.createServer((req, res) => {
  if (req.url === "/" || req.url === "/index.html") {
    fs.readFile("./public/index.html", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (req.url === "/script.js") {
    fs.readFile("./public/script.js", "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(data);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

const wss = new WebSocketServer({ server });

wss.on("connection", (socket) => {
  console.log("Client connected");

  const interval = setInterval(() => {
    socket.send(JSON.stringify(getMetrics()));
  }, 1000);

  socket.on("message", (data) => {
    console.log(data.toString());
  });

  socket.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

function getMetrics() {
  return {
    loadAvg: os.loadavg(),
    freeMemMB: (os.freemem() / 1024 / 1024).toFixed(0),
    totalMemMB: (os.totalmem() / 1024 / 1024).toFixed(0),
    memUsagePct: (
      ((os.totalmem() - os.freemem()) / os.totalmem()) *
      100
    ).toFixed(1),
  };
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});