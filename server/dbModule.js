const mongoose = require('mongoose');
let db;

exports.cnctDB = (collectionname) =>{
  let dbLink = `mongodb://localhost/${collectionname}`
  mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () {
});

}

exports.findInDB = async (Model) => {
  return await Model.find({})
}

exports.saveToDB = (input) => {
     input.save(()=>{
       console.log(`Successfully saved ${input} to the database!`)
     })
}