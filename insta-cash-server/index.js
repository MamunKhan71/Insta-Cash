const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const bcrypt = require('bcrypt')
require('dotenv').config()
const app = express()
app.use(express.json())
const cors = require('cors')
const port = process.env.PORT || 5000
app.use(cors({
    origin: [
        "http://localhost:5173"
    ]
}))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3zjxg2.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('InstaCash')
        const userCollection = db.collection('users')
        app.get('/', async (req, res) => {
            res.send("running");
        })
        app.post('/register', async (req, res) => {
            const newUser = req.body
            const hashedPass = await bcrypt.hash(newUser.password, 4);
            newUser.password = hashedPass
            const result = await userCollection.insertOne(newUser)
            res.send({ password: hashedPass, result })

        })
        app.post('/decrypt', async (req, res) => {
            const password = req.query.password
            console.log(password);
            const hashedPassword = await bcrypt.hash(password, 4);
            res.send(hashedPassword)
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Running on : ", port);
})