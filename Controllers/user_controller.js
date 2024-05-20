const mongoose = require('mongoose')

const User = require('../Models/user.js')

const argon2 = require('argon2')

const jwt = require('jsonwebtoken')

exports.getUsers = async (req, res, next) => {
   try {
    const users = await User.find().select('-passwordHash')

    if (users === 0) {
     return res.status(404).json({message:'users empty'})   
    }

    res.status(200).json({users})
   } catch (error) {
    console.log(error)
    
   }
}

exports.addUser = async (req, res, next) => {
   const {name, email, passwordHash, phone} = req.body
   
   let existingUser

   const passwordHashed = await argon2.hash(passwordHash)
   
   try {
    existingUser = await User.findOne({$or:[ {email}, {phone}]})

    if (existingUser) { return res.status(400).json({message:'user already exists'})}

    const user = new User ({
      name,
      email,
      passwordHash: passwordHashed,
      phone,
    })

    const newUser = await user.save()
    
    if (!newUser) { return res.status(400).json({message:'unable to create new user'})}
    
    res.status(200).json({message:'new user created', newUser})
   

   } catch (error) { console.log(error)
      return res.status(500).json({message:'an internal error occured'})
      
   }
}

exports.getUser = async (req, res, next) => {
   const userId = req.params.id
   let user
   try {
      user = await User.findById(userId).select('name phone email')

      if (!user) { return res.status(404).json({message:'user with this id does not exist'})}

      return res.status(200).json({message:'user found', user})
         
      
   } catch (error) {
      console.log(error)
      return res.status(500).json({message:'an internal error occured'})
      
   }
}

exports.userLogin = async (req, res, next) => {
   const {email, passwordHash} = req.body
    let existingUser
    
    if (!email) { return res.status(400).json({message:'email is required'})}
    if (!passwordHash) { return res.status(400).json({message:'password is required'})}


    try {
      existingUser = await User.findOne({email})
      if (!existingUser) { return res.status(404).json({message:'user does not exist, kindly sign up'})}

      //res.status(200).json({message:'user found', existingUser})

     const isPasswordValid = await argon2.verify(existingUser.passwordHash, passwordHash)

     if (!isPasswordValid) { return res.status(400).json({message:'incorrect password'})
     }

     const token = jwt.sign({
      id: existingUser.id,
      isAdmin: existingUser.isAdmin,
      email: existingUser.email,
     }, process.env.JWT_SECRET,
     {expiresIn: 86400}
     )
     

     return res.status(200).json({
      status: true,
      token: token,
      expiresIn: 86400,
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      message:'login succesful'
   })
    
    } catch (error) {
      console.log(error)
      return res.status(500).json({message:'an internal error occured'})
    }

}

exports.dUser = async(req, res, next) => {
  const userId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(404).json({
   status: false,
   message:'id is invalid'
   })}
   try {   
     const user = await User.findByIdAndDelete(userId)
     if (!user) { return res.status(404).json({message: `unable to delete user`})
      
     }

     
     return res.status(200).json({message:`user deleted succesfully`})


   } catch (error) {
      console.log(error)
      return res.status(500).json({message:'an internal error occured'})  
   }
}

exports.countUsers = async(req, res, next) => {
   try {
      const  users = await User.countDocuments()
      if (!users) { return res.status(404).json({message:`users not found`})
      }
      res.status(200).json({ users})
   } catch (error) {
      console.log(error)
      return res.status(500).json({message:'an internal error occured'}) 
   }
  
}