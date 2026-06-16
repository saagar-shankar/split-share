import express from "express";
import authRoutes from "../src/module/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import groupRoutes from "./module/group/groups.routes.js";
import expenseRoutes from "./module/expense/expense.routes.js";
import ApiError from "./common/utils/api_errors.js";
import errorHandler from "./common/middleware/error.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expense", expenseRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Split Share API is running",
  });
});

// invalid routes
app.use((req, res, next) => {
  next(ApiError.notFound("Route Not Found"));
});

// global error handler
app.use(errorHandler);

export default app;
