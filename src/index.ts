import express from "express";

import router from "./routes";

import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App ready and listening in "http://localhost:${PORT}"`);
});
