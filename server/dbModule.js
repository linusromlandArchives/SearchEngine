const mongoose = require('mongoose');
const mongAuth = require('./mongoauth.json')
let db;

exports.cnctDB = (collectionname) => {
  let dbLink = `mongodb://${mongAuth}@localhost/${collectionname}`
  mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function () { });

}

exports.getInDB = async (Model, search) => {
  const regex = new RegExp(escapeRegex(search), 'gi');
  return await Model.find({ 
    $and: [{ $or: [{ "name": regex }, { "link": regex }] }, ] }).limit(10)
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.findTopinDB = async (Model) => {
  return await Model.find({})
}

exports.saveToDB = (input) => {
  input.save(() => {
    console.log(`Successfully saved ${input} to the database!`)
  })
}