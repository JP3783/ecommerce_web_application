import express from "express";
import fs from "fs";

const router = express.Router();

const ORDERS_FILE = "./data/orders.json";

function loadOrders() {
  const data = fs.readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(data);
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

function getNextOrderId(orders) {
  if (orders.length === 0) {
    return 1;
  }

  const highestId = Math.max(...orders.map((order) => order.id));
  return highestId + 1;
}

router.get("/", (req, res) => {
  const orders = loadOrders();

  res.json(orders);
});

router.post("/", (req, res) => {
  const orders = loadOrders();

  const newOrder = {
    id: getNextOrderId(orders),
    customer: req.body.customer,
    items: req.body.items,
    total: req.body.total,
  };

  orders.push(newOrder);

  saveOrders(orders);

  res.status(201).json(newOrder);
});

export default router;
