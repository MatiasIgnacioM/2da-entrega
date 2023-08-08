import ProductManager from "./productosManager";


const featureProd1 = {
    title: 'producto prueba',
    description:'Este es un producto prueba',
    price:200,
    thumbnail:'Sin imagen',
    code:'abc123',
    stock:25
}

const featureProd2 = {
    title: 'producto prueba',
    description:'Este es un producto prueba',
    price:200,
    thumbnail:'Sin imagen',
    code:'abc1234',
    stock:25
}

const featureProd3 = {
    title: 'producto prueba',
    description:'Este es un producto prueba',
    price:200,
    thumbnail:'Sin imagen',
    code:'abc12345',
    stock:25
}

const product1 = new ProductManager( 'products.json' )


const test = async() => {

    console.log( await product1.getProducts() ) 
    
    // await product1.addProduct( featureProd1 ) 
    
    // console.log( await product1.getProducts() ) 

    // await product1.addProduct( featureProd2 )
    // await product1.addProduct( featureProd3 )

    // console.log( await product1.getProducts() )
    
    // console.log( await product1.getProductsById( 1 ))
    
    // console.log( await product1.updateProduct( 2, {stock:34, price:333}) ) 

    // console.log( await product1.getProducts() )
    
    // console.log(await product1.deleteProduct(2))

    // console.log( await product1.getProducts() )
    
    // await product1.addProduct( featureProd2 )

    // console.log( await product1.getProducts() )
    
}
test()