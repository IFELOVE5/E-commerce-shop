const mongoose = require('mongoose')

const Category = require('../Models/category.js')

exports.getAllCategories = async(req, res, next)=> {
    let category
    
    try {
        category = await Category.find()
    } catch (error) { return console.log(error)
        res.status(500).json({message:'an internal error has occured'})
    };

    if (!category || category === 0) { return res.status(404).json({message:'category not found'})}

    return res.status(200).json({category})
};


exports.addCategory = async(req, res, next) => {
    const {name, colour, icon, image} = req.body
    try{
      const existingCategory =  await Category.findOne({ name })  
    
     if (existingCategory) {
        return res.status(409).json({message: 'category already exists'})}
      
        const category = new Category ({
        name,
        colour,
        icon,
        image
     })
     
     const savedCategory = await category.save()

     if (!savedCategory) { return res.status(404).json({message:'category not created'})}
     
     return res.status(200).json({message:'category saved successfully', savedCategory})
    }
     
    catch (error) {
       return console.log(error)
        res.status(500).json({message:'an internal error has occured'})}
      
}

exports.deleteCat = async (req, res, next) => {
    const catId = req.params.id
    let category

    try {
         category = await Category.findByIdAndDelete(catId)

         if (!category) {return res.status(404).json({message:'category not found'})
            
         }

        
    } catch (error) {
        return console.log(error)
        res.status(500).json({status: false, message: 'an internal error occured'})
        
    }

    res.status(200).json({status: true,message:'id deleted'})
}


exports.catById = async(req, res, next) => {
    theId = req.params.id
     
    try {
      const existingCat = await Category.findById(theId)

        if (!existingCat) { return res.status(404).json(
          {  status: false,
            message:'id does not exist' })}

        return res.status(200).json({ 
            status: true,
            message:'succesful',
            existingCat
        })
    } catch (error) {
         console.log(error)
        return res.status(500).json({
            status: false,
            message:'an internal error occured'})
        
    }
}


exports.updateCat = async(req, res, next) => {
    const catId = req.params.id
    const {name, image, icon, colour} = req.body

    try {
        updateId = await Category.findByIdAndUpdate(catId, {
            name,
            image,
            icon,
            colour
        }, {new:true} )

        if (!updateId) {return res.status(404).json({message:'could not update the cat'})   
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:'an internal error occured'})
    }

    return res.status(200).json({updateId, message:'category updated'})
}
   