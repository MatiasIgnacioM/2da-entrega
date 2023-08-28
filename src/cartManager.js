import fs from 'fs'
import { ProductManager } from './productManager'


const productManager = new ProductManager ('./data/pr4oducts.json')

export class CartManager {
    #path

    constructor(path){
        this.#path = path
        this.#init()
    }
    
    async #init(){
        if (!fs.existsSync(this.path)){
            await fs.promises.writeFile(this.#path, JSON.stringify([],null,2))
        }
    }

    #generateID(data) {
        return(data.length === 0) ? 1: data[data.length - 1].id + 1

    }
    
    async createCart(){
        if (!fs.existsSync(this.#path)) return '[666] DB file does not exists.'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        const cartAdd = {id: this.#generateID(carts), products: []}
        carts.push(cartAdd)
        await fs.promises.writeFile(this.#path, JSON.stringify(carts,null,2))
        return cartAdd
    }

    async getProductsFromCart(id){
        if (!fs.existsSync(this.#path)) return '[666] DB file does not exists.'
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        let cart = carts.find(item=>item.id === id)
        if(!cart) return '[666] Not Found'
        return cart
    }

    async addProductToCart (cid, pid) {
        if (!fs.existsSync(this.#path)) return '[666] DB file does not exists.'
        const result = await productManager.getProductbyId(pid)
        if (typeof result =='string') return '[666] Product with ID=${pid} was not found'
        const cart = await this.getProductsFromCart(cid)
        if (typeof result =='string') return '[666] Cart with ID=${cid} was not found'
        const productIndex = cart.products.findIndex(item=>item.product === pid)
        if (productIndex > -1){
            cart.products[productIndex].quantity += 1
        } else {
            cart.products.push({product: pid, quantity: 1 })
        }
        let data = await fs.promises.readFile(this.#path, 'utf-8')
        let carts = JSON.parse(data)
        carts = carts.map(item =>{
            if(item.id === cid){
                return cart
            } else {
                return item
            }
        })
        await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2))
        return cart


    }
}