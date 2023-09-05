import express from "express";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";
import { Server } from "socket.io";

const app = express();
app.use(express.static("./src/public"));
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

const httpServer = app.listen(8080, () => console.log("server up"));
const socketServer = new Server(httpServer);
