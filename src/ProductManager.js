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
      return '[400] Required fields missing'
    if (!fs.existsSync(this.#fileName)) return '[500] Error'
    let data = await fs.promises.readFile(this.#fileName, 'utf-8')
    let products = JSON.parse(data)
    const found = products.find(item => item.id === product.id)    
    if (found) return '[400] ID already exists'    
    const productAdd = { id: this.#generateID(products), status: true, thumbnails: [], ...product }
    products.push(productAdd)
    await fs.promises.writeFile(this.#fileName, JSON.stringify(products, null, 2))
    return productAdd
  }

  async getProducts() {   
    if (!fs.existsSync(this.#fileName))
      return '[500] Error'
    let data = await fs.promises.readFile(this.#fileName, 'utf-8')
    const products = JSON.parse(data)
    return products
  }

  async getProductById(id) {
    if (!fs.existsSync(this.#fileName))
      return '[500] Error';

    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    const products = JSON.parse(data);
    let product = products.find(item => item.id === id);
    if (!product){
      return {error: 'product not found'}
    }
    return product;
  }

  async updateProduct(id, updateProduct) {
    if (!fs.existsSync(this.#fileName)) return '[500] Error';

    let isFound = false 
    let data = await fs.promises.readFile(this.#fileName, 'utf-8');
    let products = JSON.parse(data);

    let newProducts = products.map(item =>{
      if (item.id === id) {
        isFound = true

        return {
          ...item,
          ...updateProduct
        }

      } else {
        return item
      }      
    })
    if (!isFound) {
      return '[error]'
    }

    await fs.promises.writeFile(this.#fileName, JSON.stringify(newProducts, null, 2))
    return newProducts.find(item => item.id === id)    
  }

  async deleteProduct(id) {
    if (!fs.existsSync(this.#fileName)) {
        return 'El archivo no existe en la base de datos.'
    }
    
    let isFound = false
    let data = await fs.promises.readFile(this.#fileName, 'utf-8')
    let products = JSON.parse(data)
    let newProducts = products.filter(item => item.id !== id)

    if (products.length !== newProducts.length) {
        isFound = true
    }

    if (!isFound) {
        return 'El producto no existe.'
    }

    await fs.promises.writeFile(this.#fileName, JSON.stringify(newProducts, null, 2))
    
    return newProducts

}
}

export default ProductManager;