import swaggerJSDoc from "swagger-jsdoc";
import { schemas } from "../docs/components/schemas.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trello Clone API",
      version: "1.0.0",
      description: "API documentation for the Trello Clone backend",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.APP_URL
            : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production Server"
            : "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas,
    },
  },
  apis: ["./src/docs/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
