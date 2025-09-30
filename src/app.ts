import express, {Application} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cookieParser from "cookie-parser";

// Config

import {getInfrastructureConfig} from "./config/infrastructure.config";
import {config} from "./config/config";

dotenv.config();

const app: Application = express();
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Load Swagger file from public folder
const swaggerPath = path.resolve(__dirname, "../public/swagger.yaml");
console.log("Swagger path:", swaggerPath);

let swaggerDocument: any;
try {
  swaggerDocument = YAML.load(swaggerPath);
} catch (error) {
  console.error("Failed to load Swagger file:", error);
}

// Swagger route
if (swaggerDocument) {
  app.use("/v1/users/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.warn("Swagger docs not loaded. Check swagger.yaml file path.");
}

//========== Infrastructure Configuration ==========
const infrastructure = getInfrastructureConfig();

// Register routes
app.use("/v1/users", infrastructure.userRouter.router);


app.get("/", (_req, res) => {
  res.send("Server is running!");
});

// Connect to MongoDB and start server
const PORT = config.server.port || 3000;

const MONGO_URI = config.database.uri;


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/v1/users/api-docs`
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

export default app;
