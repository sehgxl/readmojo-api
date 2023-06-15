import express from "express";
import morgan from "morgan";
import router from "./router.js";
const app = express();
app.use(morgan("dev"));
app.use(express.json()); //allows client to send us json basically or else you would have to manually put the bits together
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

app.listen(3000, () => {
  console.log("serverrrrrr up at http://localhost:3000");
});
