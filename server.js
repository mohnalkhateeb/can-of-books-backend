'use strict';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const userModel = require('./modules/user')
console.log(userModel);

const server = express();
server.use(cors());
const PORT = process.env.PORT;

mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

// const bookSchema=new mongoose.Schema({
//     name: String,
//     description: String,
//     status:String, 
//     img:String
// });
// const uerSchema=new mongoose.Schema({
//     email:String,
//     books:[bookSchema]
// })
// const userModel=mongoose.model('user',uerSchema)

function seedUserCollection() {
    const Mohammad = new userModel({
        email: 'mhmmd.alkateeb@gmail.com', books: [
            { name: 'The Growth Mindset', description: 'Dweck coined the terms fixed mindset and growth mindset to describe the underlying beliefs people have about learning and intelligence. When students believe they can get smarter, they understand that effort makes them stronger. Therefore they put in extra time and effort, and that leads to higher achievement.', status: 'FAVORITE FIVE', img: 'https://m.media-amazon.com/images/I/61bDwfLudLL._AC_UL640_QL65_.jpg' },
            { name: 'The Momnt of Lift', description: 'Melinda Gates shares her how her exposure to the poor around the world has established the objectives of her foundation.', status: 'RECOMMENDED TO ME', img: 'https://m.media-amazon.com/images/I/71LESEKiazL._AC_UY436_QL65_.jpg' }
        ]
    })
    Mohammad.save();

}
// seedUserCollection();

server.get('/', handelProofOfLifeRoute)
//http://localhost:3003/books?e_mail=sehammalkawi92@gmail.com
server.get('/books', getBooksData)


function handelProofOfLifeRoute(request, response) {
    response.send('every thing is working')
}
function getBooksData(request, response) {

    let e_mail = request.query.e_mail;
    
    userModel.find({ email: e_mail }, function (error, userData) {
        console.log(userData)
        if (error) { response.send(error, 'did not work') }
        else { response.send(userData[0].books) }
    
})}


server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})