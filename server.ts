import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("expenses.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/expenses", (req, res) => {
    try {
      const expenses = db.prepare("SELECT * FROM expenses ORDER BY date DESC").all();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", (req, res) => {
    const { amount, category, description, date } = req.body;
    if (!amount || !category || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const info = db.prepare(
        "INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)"
      ).run(amount, category, description, date);
      res.status(201).json({ id: info.lastInsertRowid, amount, category, description, date });
    } catch (error) {
      res.status(500).json({ error: "Failed to add expense" });
    }
  });

  app.put("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    try {
      const result = db.prepare(
        "UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?"
      ).run(amount, category, description, date, id);
      if (result.changes === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json({ id, amount, category, description, date });
    } catch (error) {
      res.status(500).json({ error: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", (req, res) => {
    const { id } = req.params;
    try {
      const result = db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
      if (result.changes === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
