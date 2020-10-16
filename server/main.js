const express = require('express')
const dbModule = require('./dbModule')
const mongoose = require('mongoose');
const app = express()
const port = 3000
const clientdir = __dirname + "/client"

app.use(express.static(clientdir))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
dbModule.cnctDB("RomlandSpaceLandingPageLinks");

const linkSchema = new mongoose.Schema({
    name: String,
    link: String
  });

const link = mongoose.model('Link', linkSchema);    
function createLink(nameIN, linkIN){
  let tmp = new link({
    name: nameIN, 
    link: linkIN, 
   })
   return tmp
}

app.get('/', async (req, res) => {
    res.render('index',{
        data : await dbModule.findTopinDB(link, 100)
    }  )
}) 
app.get('/insertNewLink', (req, res) => res.sendFile(clientdir + "/insert.html"))
app.post('/newLink', (req, res) => {
    //if(req.body.auth ==  "auth"){
        dbModule.saveToDB(createLink(req.body.name, req.body.link))
 //   } 
   res.redirect('/insertNewLink')
 })

app.listen(port, () => console.log(`Server listening on port ${port}!`))