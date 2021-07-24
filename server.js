'use strict';
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();
const userModel = require('./modules/user')
console.log(userModel);

const server = express();
server.use(cors());
server.use(express.json());
// server.use(express.urlencoded());
const PORT = process.env.PORT;

// mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.DB_MONGO_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });

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
server.post('/addBook', addBookHandler)
server.delete('/deletebook/:bookId',deleteBookHandler)
server.put('/updatebook/:bookID',updateBookHandler);
function handelProofOfLifeRoute(request, response) {
    response.send('every thing is working')
}
function getBooksData(request, response) {

    let e_mail = request.query.e_mail;

    userModel.find({ email: e_mail }, function (error, userData) {
        console.log(userData)
        if (error) { response.send(error, 'did not work') }
        else { response.send(userData[0].books) }

    })
}
// let books2 = await axios.get(`${this.state.server}/addBook?
// bookName=${bookName}&bookImg=${catBreed}&bookDescription=${bookDescription}
// &bookStatus=${bookStatus}ownerName=${ownerName}`)
function addBookHandler(req, res) {
    console.log(req.body)
    let { bookName, bookImg, bookDescription, bookStatus, e_mail } = req.body;

    userModel.find({ email: e_mail }, (error, userData) => {
        if (error) { res.send('cant find user') }
        else {
            console.log('before adding', userData[0])
            userData[0].books.push({
                name: bookName,
                description: bookDescription,
                status: bookStatus,
                img: bookImg
            })
            console.log('after adding', userData[0])
            userData[0].save()
            res.send(userData[0].books)
        }
    })

}
function deleteBookHandler(req,res) {
    console.log(req.params)
    console.log(req.query)
    console.log(req.params.bookId)
    let index = Number(req.params.bookId);
    console.log(index)
    let user_mail = req.query.e_mail;
    userModel.find({email:user_mail},(error,userData)=>{
        if(error) {res.send('cant find user')}
        else{
           console.log('before deleting',userData[0])

           let newBooksArr = userData[0].books.filter((book,idx)=>{
               if(idx !== index) {return book}
            // return idx!==index
           })
           userData[0].books=newBooksArr
           console.log('after deleting',userData[0].books)
           userData[0].save();
           res.send(userData[0].books)
        }

    })
}
function updateBookHandler(req,res) {
    // console.log('aaaaaa',req.body);
    console.log('aaaaaa',req.params);
    // let numberCat = 10;
    // console.log('numberCat',numberCat)
    // console.log({numberCat})

    let {bookName, bookImg, bookDescription, bookStatus, e_mail} = req.body;
    let index = Number(req.params.bookID);

    userModel.findOne({email:e_mail},(error,userData)=>{
        if(error) res.send('error in finding the data')
        else {
            console.log(index)
            userData.books.splice(index,1,{
                name: bookName,
                description: bookDescription,
                status: bookStatus,
                img: bookImg
            })
            console.log(userData)
            userData.save();
            res.send(userData.books)
            
        }
    })


}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})