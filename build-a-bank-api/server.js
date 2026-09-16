import express from "express";
import { getAccounts, saveAccounts } from "./db.js";

const app = express();
const PORT = 9000;

app.get("/", (req, res) => {
  res.send("Tiny Bank API running...");
});

app.use(express.json());

// GET /accounts without try/catch
app.get("/accounts", async (req, res) => {
  const accounts = await getAccounts();
  res.json(accounts);
});

// GET /accounts/:id without try/catch
app.get("/accounts/:id", async (req, res) => {
  const accounts = await getAccounts();
  const account = accounts.find((a) => a.id === parseInt(req.params.id));

  if (!account) {
    const err = new Error("Account not found");
    err.status = 404;
    throw err;
  }

  res.json(account);
});

// POST /transfer without try/catch
app.post("/transfer", async (req, res) => {
  const { fromId, toId, amount } = req.body;

  if (!fromId || !toId || !amount) {
    const err = new Error("Missing required fields: fromId, toId, amount");
    err.status = 400;
    throw err;
  }

  if (amount <= 0) {
    const err = new Error("Transfer amount must be positive");
    err.status = 400;
    throw err;
  }

  const accounts = await getAccounts();
  const sender = accounts.find((a) => a.id === fromId);

  if (!sender) {
    const err = new Error("Sender account not found");
    err.status = 404;
    throw err;
  }

  const recipient = accounts.find((a) => a.id === toId);

  if (!recipient) {
    const err = new Error("Recipient account not found");
    err.status = 404;
    throw err;
  }

  if (sender.balance < amount) {
    const err = new Error("Insufficient funds");
    err.status = 409;
    throw err;
  }

  sender.balance -= amount;
  recipient.balance += amount;

  await saveAccounts(accounts);

  res.json({
    message: "Transfer successful",
    senderName: sender.owner,
    recipientName: recipient.owner,
    amountTransferred: amount,
    senderNewBalance: sender.balance,
    recipientNewBalance: recipient.balance,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
  });
});

app.set("json spaces", 2);

// 4-argument error-handling middleware registered after all routes
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ error: message });
});

const server = app.listen(PORT, () => {
  console.log(`Tiny Bank API running on http://localhost:${PORT}...`);
});

// Graceful shutdown helper function
const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

// Handle process signal listeners
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));