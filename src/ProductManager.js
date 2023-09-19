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
    // Validación de campos requeridos y nombres en inglés (como mencionaste anteriormente)
    if (!product.title || !product.description || !product.price || !product.category || !product.image) {
      return '[400] Missing required fields: title, description, price, category, image';
    }
  
    // Leer productos existentes
    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);
  
    // Verificar si el código ya existe en la lista
    const codeExists = products.some(item => item.code === product.code);
    if (codeExists) {
      return '[400] Product code already exists';
    }
  
    // Resto del código para agregar el producto
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
    if (!product) {
      return { error: 'Product not found' };
    }
    return product;
  }

  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#fileName)) return '[500] Error';

    let isFound = false;
    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);

    let newProducts = products.map(item => {
      if (item.id === id) {
        isFound = true;
        return {
          ...item,
          ...updateProduct
        };
      } else {
        return item;
      }
    });
    if (!isFound) {
      return '[error]';
    }

    await fs.promises.writeFile(this.#fileName, JSON.stringify(newProducts, null, 2));
    return newProducts.find(item => item.id === id);
  }

  async deleteProduct(id) {
    if (!fs.existsSync(this.#fileName)) {
      return 'The file does not exist in the database.';
    }

    let isFound = false;
    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);
    let newProducts = products.filter(item => item.id !== id);

    if (products.length !== newProducts.length) {
      isFound = true;
    }

    if (!isFound) {
      return 'The product does not exist.';
    }

    await fs.promises.writeFile(this.#fileName, JSON.stringify(newProducts, null, 2));

    return newProducts;
  }
}

export default ProductManager;
