const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const Product = require("./models/Product")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(()=> console.log("MongoDB Connected"))

app.get("/", (req,res)=>{
    res.send("Inventory API Running")
})

app.post("/products", async (req,res)=>{
    const product = new Product(req.body)
    await product.save()
    res.send(product)
})

app.get("/products", async (req,res)=>{
    const products = await Product.find()
    res.json(products)
})

app.listen(5000, ()=>{
    console.log("Server running on port 5000")
})

app.post("/receipts", async (req,res)=>{
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)

    if(!product){
        return res.status(404).send("Product not found")
    }

    product.stock = product.stock + quantity
    await product.save()

    res.json(product)
})
app.post("/deliveries", async (req,res)=>{
    const { productId, quantity } = req.body

    const product = await Product.findById(productId)

    if(!product){
        return res.status(404).send("Product not found")
    }

    if(product.stock < quantity){
        return res.status(400).send("Not enough stock")
    }

    product.stock = product.stock - quantity
    await product.save()

    res.json(product)
})
app.get("/lowstock", async (req,res)=>{
    const products = await Product.find({ stock: { $lt: 20 } })
    res.json(products)
})

app.get("/dashboard", async (req,res)=>{

    const products = await Product.find()

    const totalProducts = products.length
    const lowStockItems = products.filter(p => p.stock < 20).length

    const totalStock = products.reduce((sum,p)=> sum + p.stock ,0)

    res.json({
        totalProducts,
        lowStockItems,
        totalStock
    })

})