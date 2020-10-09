const express = require('express')
const app = express()
const port = 3000
const clientdir = __dirname + "/client"

app.use(express.static(clientdir))


app.get('/', (req, res) => res.sendFile(clientdir + "/index.html"))
app.listen(port, () => console.log(`Server listening on port ${port}!`))