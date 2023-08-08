import fs from "fs" 



class ProductManager {
  #path

    constructor(path) {
      this.#path = path;
      this.#init() 
    }

    async #init(){
      if (!fs.existsSync(this.#path)){
        await fs.promises.writeFile(this.#path, JSON.stringify([],null, 2))
      }
    }

    #generateID(products){
      return (products.length === 0) ? 1 : products[products.length - 1].id + 1
    }

    async addProduct(product) {      
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) 
          return 'Todos los campos son obligatorios para agregar un producto.'
        if (!fs.existsSync(this.#path)) 
        return 'error'

        let data = await fs.promises.readFile(this.#path, 'utf-8')

        let products = JSON.parse(data)

        const found = products.find(item =>item.code === product.code)

        if (found) 
        return 'error, codigo existente.'

        const productAdd = {id: this.#generateID(products), ...product}

        products.push(productAdd)

        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))

        return productAdd

    }

    async getProducts() {
      if (!fs.existsSync(this.#path)) return ' error'
      let data = await fs.promises.readFile(this.#path, 'utf-8')
      const products = JSON.parse(data)
      return products

    }

    async getProductsById(id){
      if (!fs.existsSync(this.#path)) return ' error'
      let data = await fs.promises.readFile(this.#path, 'utf-8')
      const products = JSON.parse(data)
      let product = products.find(item => item.id === id)
      if (!product) return "error not found"
      return product

    }
    async updateProduct(id, upgradeProduct){
      if (!fs.existsSync(this.#path)) return ' error'
      let isFound = false
      let data = await fs.promises.readFile(this.#path, 'utf-8')
      const products = JSON.parse(data)
      let newProducts = products.map(item =>{
        if (item.id === id){
        isFound = true
        return {
          ...item,
          ...upgradeProduct
        }
      }else return item
      
    })
    if (!isFound) return 'error , no exist'
    await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
    return newProducts.find(item => item.id === id)

    }

    async deleteProduct(id){
      if (!fs.existsSync(this.#path)) return ' error'
      let isFound = false 
      let data = await fs.promises.readFile(this.#path, 'utf-8')
      let products = JSON.parse(data)
      let newProducts = products.filter(item => item.id !== id)
      if (products.length !== newProducts.length) isFound = true
      if (!isFound) return 'error, product no exist'
      await fs.promises.writeFile(this.#path, JSON.stringify(newProducts, null, 2))
      return newProducts

    }


    }

    export default ProductManager