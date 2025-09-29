import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "@workspace/utils";
import { authRouter } from "./routes/authRouter";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();
const PORT = process.env.PORT || 4002;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
// app.use("/api/photon", proxyRoutes(photon));

app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info("Guard service started.", {
    meta: { PORT: PORT, GUARD_URL: `http://localhost:${PORT}` },
  });
});
