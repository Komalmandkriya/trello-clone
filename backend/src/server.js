import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log(`🚀 Server Running`);
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(`📚 Swagger Docs`);
      console.log(`🌐 http://localhost:${PORT}/api-docs`);
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();
