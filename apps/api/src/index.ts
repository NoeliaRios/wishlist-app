import express from "express";
import cors from "cors";
import "express-async-errors";

import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { listsRouter } from "./routes/lists";
import { itemsRouter } from "./routes/items";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/lists", listsRouter);
app.use("/", itemsRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// El error handler siempre va último
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});