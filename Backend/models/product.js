const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  category: String,
  stock: Number
})

module.exports = mongoose.model("Product", productSchema)