const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors({ origin: 'http://localhost:5174' }))

const controllerDevice = require("./controller/controllerDevice");
const controllerRevision = require("./controller/controllerRevision");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Revisio is running!')
})

app.use("/device", controllerDevice);
app.use("/revision", controllerRevision);

app.listen(port, () => {
    console.log(`Revisio v. 0.1.0 listening on port ${port}`)
})
