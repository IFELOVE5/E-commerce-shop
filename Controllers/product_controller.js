const mongoose = require('mongoose')

const fs = require('fs');

const path = require('path');


const Product = require('../Models/product.js')

const Category = require('../Models/category.js')

exports.addProduct = async (req, res, next) => {
 const {name, countInStore, description, category } = req.body

 const file = req.file
 if (!file) {
   return res.status(400).json({message:'no file'})
 }
    
  const nCategory = await Category.findById( category ).select('name')
   
  if (!nCategory) { return res.status(400).json({message:'invalid category id'})}
  const image = req.file.filename
  const basePath =`${req.protocol}://${req.get(`host`)}/public/upload/`

  //if (!image) {  return res.status(400).json({message:'product image doesnt exists'})
   
 // }

  if (!mongoose.isValidObjectId(category)) { return res.status(404).json({
   status: false,
   message:'category is invalid'
})}
   

   const checkName = await Product.findOne({ name })
   if (checkName) { return res.status(400).json({message:'product already exists'})}
      
   const product = new Product ({
        name,
        image: `${basePath}${image}`,
        countInStore,
        description,
        category: category
    })

 try {
   await product.save()
 } catch (err) {
     console.log(err)
     return res.status(500).json({message:'an internal error has occured'})
 }
 return res.status(200).json({product});

}

exports.getAllProducts = async(req, res, next) => {
   let products
   try {
      products = await Product.find()
   }catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
   }

   return res.status(200).json({products})
};

exports.getProduct = async(req, res, next) => {
   const productId = req.params.id

   try {
     const product = await Product.findById(productId).populate('category')

      if (!product) { return res.status(404).json({
         status: false,
         message:'product does not exist'})
      }

      return res.status(200).json({
         status: true,
         message:'product found', 
         product})
   }catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
   }

   
};


exports.updateProduct = async (req, res, next) => {
   const productIdd = req.params.id
   const {name, countInStore, image,description, isFeatured, id} = req.body


   try {

    const product = await Product.findByIdAndUpdate(productIdd, {
      name,
      countInStore,
      description,
      isFeatured,
      image,
      id
      },{new:true})

   
      if (!mongoose.isValidObjectId(product)) { return res.status(404).json({
         status: false,
         message:'product id is invalid'
      })}

      return res.status(200).json({message:'product updated', product})
   } catch (error) { console.log(error)
      return res.status(500).json({message:'an internal error occcured'})
      
   }
}

exports.deleteProduct = async (req, res, next) => {

  const productId = req.params.id
 
 try {
   const  productd =  await Product.findByIdAndDelete(productId)
  // if (!productd) { return res.status(404).json({message:'product does not exist'})}

  if (!mongoose.isValidd(productd)) { return res.status(404).json({
   status: false,
   message:'product id is invalid'
})}

   return res.status(200).json({message:'product deleted'})

   
 } catch (error) {
   console.log(error)
      return res.status(500).json({message:'an internal error occcured'})
 }
}

exports.dProduct = async (req, res, next) => {

   const {name} = req.body
 
  try {
    const  productd =  await Product.findOneAndDelete({name})
    if (!productd) { return res.status(404).json({message:'product does not exist'})}
 
    return res.status(200).json({message:'product deleted'})
 
    
  } catch (error) {
    console.log(error)
       return res.status(500).json({message:'an internal error occcured'})
  }
 }

 exports.count = async (req, res, next) => {
   try {
     const tCount = await Product.countDocuments()

     if (tCount === 0) {
      return res.status(404).json({message:'no product found'})}

      return res.status(200).json({tCount})
     

   } catch (error) {
      console.log(error)
       return res.status(500).json({message:'an internal error occcured'})
   }
 }

 exports.getFeatured = async (req, res, next) => {
   try {
     const tCount = await Product.find({isFeatured: true}).select('name')

     if (tCount === 0) {
      return res.status(404).json({message:'no product found'})}

      return res.status(200).json({tCount})
     

   } catch (error) {
      console.log(error)
       return res.status(500).json({message:'an internal error occcured'})
   }
 }

 exports.getFeature = async (req, res, next) => {

    const count = parseInt(req.params.count)
   
   try {
     const tCount = await Product.find({isFeatured: true}).limit(count).select('name')

     if (tCount === 0) {
      return res.status(404).json({message:'no product found'})}

      return res.status(200).json({tCount})
     

   } catch (error) {
      console.log(error)
       return res.status(500).json({message:'an internal error occcured'})
   }
 }

 exports.updateProductGallery = async (req, res, next) => {
   const productId = req.params.id;
   const files = req.files;
   const imagePaths = [];
   const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

   // Validate product ID
   if (!mongoose.isValidObjectId(productId)) {
       return res.status(400).json({
           status: false,
           message: 'Invalid product ID'
       });
   }

   // Check if files are uploaded and populate imagePaths array
   if (files && files.length > 0) {
       files.forEach(file => {
           imagePaths.push(`${basePath}${file.filename}`);
       });
   } else {
       return res.status(400).json({ message: 'No images uploaded' });
   }

   try {
       // Update product with new gallery images
       const product = await Product.findByIdAndUpdate(
           productId,
           { images: imagePaths },
           { new: true }
       );

       if (!product) {
           return res.status(404).json({ message: 'Product not found' });
       }

       return res.status(200).json({ message: 'Product updated', product });
   } catch (error) {
       console.error(error);
       return res.status(500).json({ message: 'An internal error occurred' });
   }
};