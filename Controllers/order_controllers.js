const mongoose = require (`mongoose`)

const Order = require(`../Models/order.js`)

const Product = require(`../Models/product.js`)

const OrderItem = require("../Models/order_items.js");


exports.allOrders = async(req, res, next) =>{
    try {
        const orders = await Order.find()
     if (!orders ) { return res.status(404).json({
        status: false,
        message:'no orders'})
     }

     res.status(200).json({orders})
        
    } catch (error) {
        console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  
}

exports.newOrder = async (req, res, next) => {
  const { orderItems, shippingAddress1, shippingAddress2, city, zip, country, phone, status, user, totalPrice } = req.body;

  try {
      // Save order items to database and collect their IDs
      const orderItemsIds = await Promise.all(orderItems.map(async (orderItem) => {
          let newOrderItem = new OrderItem({
              quantity: orderItem.quantity,
              product: orderItem.product
          });
          newOrderItem = await newOrderItem.save();
          return newOrderItem._id;
      }));

      console.log("orderItemsIds:", orderItemsIds); // Debug output

      // Create new order object with associated orderItems
      const order = new Order({
          orderItem: orderItemsIds,
          shippingAddress1,
          shippingAddress2,
          city,
          user,
          totalPrice,
          zip,
          country,
          phone,
          status
      });

      // Save the order
      const savedOrder = await order.save();

      console.log("Saved order:", savedOrder); // Debug output

      if (!savedOrder) {
          return res.status(400).json({ message: 'Unable to create new order' });
      }

      res.status(200).json({ message: 'New order created', order: savedOrder });
  } catch (error) {
      console.error('Error in creating new order:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

  

 exports.getOrder = async(req, res, next) => {
  const orderId = req.params.id
  try {
    const order = await Order.findById(orderId).populate(`user`, `name`)
    .populate(`orderItem`)
    if (!order) { 
      return res.status(404).json({message:`id does not exist`})
    }
    
    return res.status(200).json({order})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message:'an internal error occured'})}
  } 
 

  exports.updateOrder = async (req, res, next) => {
   const orderId = req.params.id
   const {status} = req.body

   try {
    const order = await Order.findByIdAndUpdate(orderId, {status}, {new:true})
    if (!order) { 
      return res.status(404).json({message:'unable to update'})
    }
    
    return res.status(200).json({order})
    
   } catch (error) {
    console.log(error)
    return res.status(500).json({message:'an internal error occured'})}
  }

  exports.deleteOrder = async (req, res, next) => {
    const orderId = req.params.id
    
    try {
      const order = await Order.findByIdAndDelete(orderId)

      if (!order) { 
        return res.status(404).json({message:'unable to delete'})
      }
      
      return res.status(200).json({message:`order deleted`})
      
    } catch (error) {
      return res.status(500).json({message:'an internal error occured'})
    }
  }

  exports.total = async (req, res, next) =>  {
    const totalSales = await Order.aggregate([{
      $group: {_id: null, totalsales: {$sum: `$totalprice`}}
    }])

    if (!totalSales) {   return res.status(404).json({message:'unable to calculate'}) }

    return res.status(400).json({totalSales:totalSales.pop().totalsales })
  }


  exports.countOrders = async (req, res, next) => {

    try {
      count = await Order.countDocuments()

      if (!count) {   return res.status(404).json({message:'unable to count'}) }

      return res.status(200).json({count})

    } catch (error) {
      return res.status(500).json({message:'an internal error occured'})
    }
  
    
  }

  exports.getorderUser = async (req, res, next) => {
    const userId = req.params.id

    try {
      const userOrder = await Order.find({userId})
      if (!userOrder) { return res.status(404).json({message:'incorerct'})  
      }

      return res.status(200).json({message:`it worked`, userOrder})
    } catch (error) {
      return res.status(500).json({message:'an internal error occured'})
    }

  }