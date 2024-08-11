const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./Config/mongoose");
const userRouter = require("./Routers/UserRouter");
const profileRouter = require("./Routers/ProfileRouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/auth", userRouter);
app.use("/api", profileRouter);

connectDB();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
