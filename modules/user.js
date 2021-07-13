'use strivt';
const mongoose = require('mongoose')


const bookSchema=new mongoose.Schema({
    name: String,
    description: String,
    status:String, 
    img:String
});
const uerSchema=new mongoose.Schema({
    email:String,
    books:[bookSchema]
})
const userModel=mongoose.model('user',uerSchema)

module.exports=userModel;