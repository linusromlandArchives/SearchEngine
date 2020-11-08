const express = require("express");
const dbModule = require("./dbModule");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

var url = require("url");
const app = express();
const port = 3003;
const clientdir = __dirname + "/client";

app.use(express.static(clientdir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set("view engine", "ejs");
dbModule.cnctDB("RomlandSpaceLandingPageLinks");
security();

const linkSchema = new mongoose.Schema({
  name: String,
  link: String,
  top: Boolean,
});

const link = mongoose.model("Link", linkSchema);
function createLink(nameIN, linkIN, topIN) {
  let tmp = new link({
    name: nameIN,
    link: linkIN,
    top: topIN,
  });
  return tmp;
}

app.get("/", async (req, res) => {
  console.log(await topDB(1))
  res.render("index", {
    data: await topDB(10),
  });
});
app.get("/about", async (req, res) => {
  res.render("about");
});
app.get("/getSearch", async (req, res) => {
  let url_parts = url.parse(req.url, true);
  let urlquery = url_parts.query;
  let search = urlquery.search ? urlquery.search : "";

  res.setHeader("Content-Type", "application/json");
  let searchThing = await dbModule.getInDB(link, search);
  console.log(searchThing);
  res.send(searchThing);
});
app.get("/insertNewLink", (req, res) =>
  res.sendFile(clientdir + "/insert.html")
);
app.post("/newLink", (req, res) => {
  if (req.body.auth == fs.readFileSync("security/security.txt")) {
    let top = false;
    if (req.body.top == "on") top = true;
    dbModule.saveToDB(createLink(req.body.name, req.body.link, top));
  }
  res.redirect("/insertNewLink");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

async function topDB(limit) {
  let mdl = await dbModule.findTopinDB(link);
  let topResults = [];
  limit--;
  for (let index = 0; index < mdl.length; index++) {
    if (mdl[index].top) {
      if (topResults.length < limit) topResults.push(mdl[index]);
    }
  }
  return topResults;
}

function security() {
  if (!fs.existsSync("security/security.txt")) {
    console.log("File doesn't exist");

    fs.writeFile("security/security.txt", generateP(), function (err) {
      if (err) return console.log(err);
      console.log("Created authentication string");
    });
  }
}

function generateP() {
  var pass = "";
  var str =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 1; i <= 32; i++) {
    var char = Math.floor(Math.random() * str.length + 1);

    pass += str.charAt(char);
  }

  return pass;
}
