import express from "express";
import authRoutes from "../src/module/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import groupRoutes from "./module/group/groups.routes.js";
import expenseRoutes from "./module/expense/expense.routes.js";
import ApiError from "./common/utils/api_errors.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/expense", expenseRoutes);

// default for invalid routes
app.use((req, res, next) => {
  next(ApiError.notFound("Route Not Found"));
});

export default app;
