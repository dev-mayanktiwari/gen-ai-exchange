import express from "express";
import cors from "cors";
import { initFirebase } from "./lib/firebase";
import { productsRouter } from "./routes/products";
import { usersRouter } from "./routes/users";
import { storageRouter } from "./routes/storage";

initFirebase();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/storage", storageRouter);

app.listen(process.env.PORT || 4001, () =>
  console.log("data-service listening")
);
