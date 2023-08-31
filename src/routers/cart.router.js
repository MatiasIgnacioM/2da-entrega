import { Router } from "express"
import { CartManager } from "../cartManager.js"
import router from "./product.router.js"


const router = Router()
const cartManager = new CartManager('./dat/carts.json')

router.post('/',async(req,res)=>{
    const result = await cartManager.createCart()
    if(typeof result == 'string'){
        const error = result.split('')
        return res.status(parseInt(error[0].slice(1,4))).json({error: result.slice(6)})
    }
    res.status(201).json({status: 'success', payload: result})
})

router.get('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    
    // Aquí deberías llamar a la función que obtiene el producto específico del carrito con el cartId y productId proporcionados.
    const result = await cartManager.getProductFromCart(cartId, productId);
    
    if (typeof result === 'string') {
        const error = result.split('');
        return res.status(parseInt(error[0].slice(1, 4))).json({ error: result.slice(6) });
    }
    
    res.status(200).json({ status: 'success', payload: result });
});

export default router;


