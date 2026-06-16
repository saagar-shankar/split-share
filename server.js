import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server is running on  port : ${PORT} in ${process.env.NODE_ENV} Mode`,
    );
  });
};

startServer().catch((error) => {
  console.log("Failed to load the server... : ", error);
  process.exit(1);
});
