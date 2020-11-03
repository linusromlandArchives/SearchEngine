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
    link: String,
    top: Boolean
  });

const link = mongoose.model('Link', linkSchema);    
function createLink(nameIN, linkIN, topIN){
  let tmp = new link({
    name: nameIN, 
    link: linkIN, 
    top: topIN
   })
   return tmp
}

app.get('/', async (req, res) => {
    res.render('index',{
        data : await topDB()
    }  )
}) 
app.get('/about', async (req, res) => {
  res.render('about')
}) 
app.get('/insertNewLink', (req, res) => res.sendFile(clientdir + "/insert.html"))
app.post('/newLink', (req, res) => {
    if(req.body.auth ==  "coolerPassword"){
      let top = false;
      if(req.body.top == "on") top = true
      dbModule.saveToDB(createLink(req.body.name, req.body.link, top))
  } 
   res.redirect('/insertNewLink')
 })

app.listen(port, () => console.log(`Server listening on port ${port}!`))

async function topDB(limit){
  
  let mdl = await dbModule.findTopinDB(link)
  console.log(mdl)
  let topResults = []
  limit--
  for (let index = 0; index < mdl.length; index++) {
     if(mdl[index].top){
       if(topResults.length < limit) topResults.push(mdl[index])
     }
  }
}