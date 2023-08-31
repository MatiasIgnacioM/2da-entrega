import { router } from "express";
import { ProductManager } from "../productManager.js";

const router = router();
const ProductManager = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    const limit = parseInt(req.query.limit);

    if (products.length === 0) {
      return res.status(404).json({ error: "No products found in the database." });
    }

    if (!isNaN(limit) && limit >= 0) {
      res.status(200).json({ payload: products.slice(0, limit) });
    } else {
      res.status(200).json({ payload: products });
    }
  } catch (error) {
    console.log("Error getting products:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const product = await ProductManager.getProductById(id);

    if (!product || Object.keys(product).length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ payload: product });
  } catch (error) {
    console.log("Error getting product:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock } = req.body;
    const addedProduct = await ProductManager.addProduct(
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    );

    res.status(201).json({ message: "Product added successfully.", payload: addedProduct });
  } catch (error) {
    console.log("Error adding product:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const updatedProduct = req.body;

    const updated = await ProductManager.updateProductById(id, updatedProduct);
    if (!updated) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }

    res.status(200).json({ message: "Product updated successfully.", product: updated });
  } catch (error) {
    console.log("Error updating product:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const id = parseInt(req.params.pid);
    const deletedProduct = await ProductManager.deleteProductById(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }

    res.status(200).json({
      message: "Product deleted successfully.",
      productDeleted: deletedProduct,
    });
  } catch (error) {
    console.log("Error deleting product:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (deletedProduct) {
      console.log(`Product with ID ${deletedProduct.id} deleted:`);
      console.log(deletedProduct);
    }
  }
});

export default router;
