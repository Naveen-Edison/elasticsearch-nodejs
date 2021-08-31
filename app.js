const express = require("express")
const bodyParser = require("body-parser")
const elasticsearch = require("elasticsearch")
const app = express()
app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => {
    console.log("connected")
})

const esClient = elasticsearch.Client({
    host: "http://127.0.0.1:9200",
})

app.post("/products", (req, res) => {
    esClient.index({
        index: 'products',
        id:req.body.id,
        body: {
            "name": req.body.name,
            "price": req.body.price,
            "description": req.body.description,
        }
    })
    .then(response => {

        return res.json({"message": "Indexing successful"})
    })
    .catch(err => {
         return res.status(500).json({"message": "Error"})
    })
})

app.get("/products", (req, res) => {
    const searchText = req.query.text
    esClient.search({
        index: "products",
        body: {
            query: {
                match: {"name": searchText.trim()}
            }
        }
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        return res.status(500).json({"message": "Error"})
    })
})

app.post("/products/update", (req, res) => {
    esClient.update({
        index: "products",
        id:req.body.id,
        body: {
            doc: {
                "name": req.body.name,
                "price": req.body.price,
                "description": req.body.description,
            }
            
        }
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({"message": "Error"})
    })
})

app.get("/products/:id", (req, res) => {
    esClient.get({
        index: "products",
        id:req.params.id,
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({"message": "Error"})
    })
})


app.delete("/products/:id", (req, res) => {
    esClient.delete({
        index: "products",
        id:req.params.id,
    })
    .then(response => {
        return res.json(response)
    })
    .catch(err => {
        console.log(err)
        return res.status(500).json({"message": "Error"})
    })
})