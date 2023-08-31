import fs from 'fs';
import path from 'path'; 

export class ProductManager {
  #fileName;

  constructor(fileName) {
    this.#fileName = path.join(fileName);
    this.#init();
  }

  async #init() {
    if (!fs.existsSync(this.#fileName)) {
      await fs.promises.writeFile(this.#fileName, JSON.stringify([], null, 2));
    }
  }

  #generateID(products) {
    return products.length === 0 ? 1 : products[products.length - 1].id + 1;
  }

  async addProduct(product) {
    if (!product.titulo || !product.descripcion || !product.precio || !product.categoria || !product.imagen || !product.id)
      return '[400] Required fields missing';

    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);

    const found = products.find(item => item.id === product.id);
    if (found) return '[400] ID already exists';

    const productAdd = { id: this.#generateID(products), status: true, thumbnails: [], ...product };
    products.push(productAdd);

    await fs.promises.writeFile(this.#fileName, JSON.stringify(products, null, 2));
    return productAdd;
  }

  async getProducts() {
    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    const products = JSON.parse(data);
    return products;
  }

  async getProductById(id) {
    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    const products = JSON.parse(data);
    let product = products.find(item => item.id === id);
    return product;
  }

  async updateProduct(id, updatedFields) {
    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);

    const productToUpdate = products.find(item => item.id === id);
    if (!productToUpdate) return '[404] Product not found';

    // Update the fields of the product
    Object.assign(productToUpdate, updatedFields);

    await fs.promises.writeFile(this.#fileName, JSON.stringify(products, null, 2));
    return productToUpdate;
  }

  async deleteProduct(id) {
    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);

    const productIndexToDelete = products.findIndex(item => item.id === id);
    if (productIndexToDelete === -1) return '[404] Product not found';

    // Remove the product from the array
    products.splice(productIndexToDelete, 1);

    await fs.promises.writeFile(this.#fileName, JSON.stringify(products, null, 2));
    return '[200] Product deleted successfully';
  }
}