const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./Config/mongoose");
const authRouter = require("./Routers/AuthRouter");
const profileRouter = require("./Routers/ProfileRouter");
const postRouter = require("./Routers/PostRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173", // Cho phép front-end từ origin cụ thể này
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", profileRouter);
app.use("/api/post", postRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
