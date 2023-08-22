import { promises as fsPromises } from "fs";
import path from "path";

export class ProductManager {
  constructor(fileName) {
    this.filePath = path.join(fileName);
  }

  async readProductsFile() {
    try {
      const data = await fsPromises.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("500 - Internal Server Error");
    }
  }

  async getProducts() {
    try {
      const products = await this.readProductsFile();
      return products;
    } catch (error) {
      return { status: 500, message: "Internal Server Error" };
    }
  }

  async getProductsById(id) {
    try {
      const products = await this.readProductsFile();
      const product = products.find((p) => p.id === id);

      if (!product) {
        return { status: 404, message: "Product not found" };
      }

      return product;
    } catch (error) {
      return { status: 500, message: "Internal Server Error" };
    }
  }
}
