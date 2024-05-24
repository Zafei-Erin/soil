import express from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, GET, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to use sOIL backend.");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
