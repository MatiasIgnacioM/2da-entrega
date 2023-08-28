import express from "express";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";

const app = express()
app.use(express.json())
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.listen(8080, () => console.log("server up"))