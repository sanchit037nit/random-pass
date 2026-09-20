import express from "express";
import dotenv from "dotenv";
import { connectdb } from "./src/lib/db.js";
import useroutes from "./src/routes/user.routes.js";
import passroutes from "./src/routes/pass.routes.js";
import webauthnRoutes from "./src/routes/webauthn.routes.js";
import grouproutes from "./src/routes/group.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "https://ranpass.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/auth", useroutes);
app.use("/api/pass", passroutes);
app.use("/api/groups", grouproutes);
app.use("/api/webauthn", webauthnRoutes);

app.listen(port, () => {
  console.log("running on port:" + port);
  connectdb();
});
