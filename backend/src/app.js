import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);
export default app;
