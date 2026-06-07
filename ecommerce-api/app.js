import express from "express";
import cors from "cors";

import productsRouter from "./resources/products.js";
import ordersRouter from "./resources/orders.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.get("/", (req, res) => {
  res.send("Ecommerce API running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
