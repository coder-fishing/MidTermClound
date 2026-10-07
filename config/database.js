import "dotenv/config";
import mongoose from "mongoose";

export const readConnection = mongoose.createConnection(
  process.env.MONGO_READ_URI
);

export const writeConnection = mongoose.createConnection(
  process.env.MONGO_WRITE_URI
);

readConnection.on("connected", () => {
  console.log(" READ database connected");
});

readConnection.on("error", (error) => {
  console.error(" READ database error:", error.message);
});

writeConnection.on("connected", () => {
  console.log(" WRITE database connected");
});

writeConnection.on("error", (error) => {
  console.error(" WRITE database error:", error.message);
});