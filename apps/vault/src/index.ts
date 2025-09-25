import express from "express";
import cors from "cors";
import { initFirebase } from "./lib/firebase";
import { productsRouter } from "./routes/products";
import { usersRouter } from "./routes/users";
import { storageRouter } from "./routes/storage";
import { authRouter } from "./routes/auth";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { apiKeyAuth } from "./middlewares/apiKeyAuth";
import { httpResponse } from "@workspace/utils";
import { SuccessStatusCodes } from "@workspace/constants";

initFirebase();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  httpResponse(
    req,
    res,
    SuccessStatusCodes.OK,
    "Vault service is healthy"
  );
});

// Apply API key authentication to all routes except health
app.use(apiKeyAuth);

app.use("/auth", authRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/storage", storageRouter);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () =>
  console.log(`Vault service listening on port ${PORT}`)
);
