import ENV from "./env.js";
import { connectDB } from "./lib/db.js";
import app from "./app.js";

const port = ENV.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server connected succesfully");
    });
  })
  .catch(() => {
    console.log("MongoDb Connection failed");
  });
