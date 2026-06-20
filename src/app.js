import express from "express";
import authRoutes from "../src/module/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import groupRoutes from "./module/group/groups.routes.js";
import expenseRoutes from "./module/expense/expense.routes.js";
import ApiError from "./common/utils/api_errors.js";
import errorHandler from "./common/middleware/error.middleware.js";

import { sendVerificationEmail } from "./common/config/email.js";
import dns from "node:dns/promises";
import net from "node:net";

// added swagger docs on 18-june-2026
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./common/config/swagger.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expense", expenseRoutes);

// 18-june-2026----------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//-----------------------------

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Split Share API is running",
  });
});

app.get("/smtp-port-test", async (req, res) => {
  const socket = net.createConnection({
    host: "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT),
  });

  socket.setTimeout(10000);

  socket.on("connect", () => {
    res.json({
      success: true,
      message: "TCP connection successful",
    });

    socket.destroy();
  });

  socket.on("timeout", () => {
    res.status(500).json({
      success: false,
      message: "TCP timeout",
    });

    socket.destroy();
  });

  socket.on("error", (err) => {
    res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  });
});

//testing for email sending service bugs

app.get("/test-email", async (req, res) => {
  try {
    await sendVerificationEmail("sagarshankar444@gmail.com", "test-token");

    res.json({
      success: true,
      message: "Email sent",
    });
  } catch (error) {
    console.error("TEST EMAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
      response: error.response,
    });
  }
});

// invalid routes
app.use((req, res, next) => {
  next(ApiError.notFound("Route Not Found"));
});

// global error handler
app.use(errorHandler);

export default app;
