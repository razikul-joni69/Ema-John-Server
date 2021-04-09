const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0ilw.mongodb.net/${process.env.DB_Database}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
client.connect((err) => {
    const productsCollection = client.db("Ema-John").collection("Products");
    const orderCollection = client.db("Ema-John").collection("orders");

    app.post("/addProduct", (req, res) => {
        const product = req.body;
        console.log(product);
        productsCollection.insertOne(product)
        .then((result) => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        });
    });

    app.get("/products", (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.get("/product/:key", (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0])
        })
    });

    app.post("/productsByKeys", (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    });

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        orderCollection.insertOne(order)
        .then((result) => {
            res.send(result.insertedCount > 0)
        });
    });

    app.get("/", (req, res) => {
        res.send('Database working successfully!');
    })
});

app.listen(process.env.PORT || port);
