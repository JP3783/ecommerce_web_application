import express from "express";
import fs from "fs";

const router = express.Router();

function loadProducts() {
  const data = fs.readFileSync("./data/products.json");
  return JSON.parse(data);
}

router.get("/", (req, res) => {
  let products = loadProducts();

  const { search, category, sort } = req.query;

  // search
  if (search) {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // category
  if (category && category !== "all") {
    products = products.filter((product) => product.category === category);
  }

  // sorting
  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  }

  res.json(products);
});

router.get("/categories", (req, res) => {
  const products = loadProducts();

  const categories = [...new Set(products.map((p) => p.category))];

  res.json(categories);
});

router.get("/:id", (req, res) => {
  const products = loadProducts();

  const product = products.find((p) => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
});

export default router;
