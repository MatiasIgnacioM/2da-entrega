import  ProductManager  from "./productosManager.js"; 
import express from 'express'

const app = express()
const productManager = new ProductManager("./data/products.json")

app.get('/products', async (req,res)=>{
    const result = await productManager.getProducts()
    const limit = req.query.limit
    if (typeof result === 'object' && 'status' in result) {
        return res.status(result.status).json({ error: result.message });
    }
    res.status(200).json({ payload: result.slice(0, limit) });
})

app.get('/products/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await productManager.getProductsById(id);
    
    if (typeof result === 'object' && 'status' in result) {
        return res.status(result.status).json({ error: result.message });
    }

    res.status(200).json({ payload: result });
});

app.listen(8080, () => console.log("Server Up!!"))