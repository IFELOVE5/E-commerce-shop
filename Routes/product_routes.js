const express = require('express')

const router = express.Router()

const fs = require('fs');

const path = require('path');

const multer = require(`multer`)

const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error ('invalid image type')

        if(isValid){uploadError = null}
        
      cb(uploadError,path.join(__dirname, '..', 'public', 'uploads'));
    },
    
    filename: function (req, file, cb) {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
  
  const upload = multer({ storage: storage         
    })




const { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct, dProduct, count, getFeatured, getFeaturedC, getFeature, updateProductGallery } = require('../Controllers/product_controller');

router.post('/add', upload.single('image'), addProduct);

router.get('/all', getAllProducts);

router.get('/get/:id', getProduct)

router.put('/update/:id', updateProduct)

router.put('/update', updateProduct)

router.delete('/delete/:id', deleteProduct)

router.delete('/delete', dProduct)

router.get('/count', count)

router.get('/getFeatured', getFeatured)

router.get('/getFeature/:count', getFeature)

router.put(`/gallery-images/:id`, upload.array(`images`, 10), updateProductGallery)

module.exports = router

