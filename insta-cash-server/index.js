const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
            const hashedPass = bcrypt.hashSync(newUser.password, 4);
            newUser.password = hashedPass
            const result = await userCollection.insertOne(newUser)
            res.send({ password: hashedPass, result })

        })
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            let result = null; // Initialize result with null

            // Check if the provided email includes '@' to determine if it's an email or phone number
            if (!email.includes('@')) {
                result = await userCollection.findOne({ phone: email });
            } else {
                result = await userCollection.findOne({ email: email });
            }

            if (result) {
                const isPasswordValid = bcrypt.compareSync(password, result.password);

                if (!isPasswordValid) {
                    return res.status(401).send({ message: "Invalid Password" });
                }

                return res.send({ message: "Login successful", password: result.password, email: result.email });
            } else {
                return res.status(400).send({ message: "User not found" });
            }
        });

        app.get('/users', async (req, res) => {
            console.log("Hit");
            const result = await userCollection.find().toArray()
            res.send(result)
        })
        app.patch('/user/update', async (req, res) => {
            const id = req.body
            const query = { _id: new ObjectId(id) }
            console.log(query);
            const cursor = {
                $set: {
                    status: 'active',
                    balance: 40
                }
            }
            const result = userCollection.updateOne(query, cursor, { upsert: true })
        })

        app.post('/send-money', async (req, res) => {
            const sendMoneyInfo = req.body
            // console.log(sendMoneyInfo);
            const senderEmail = sendMoneyInfo.senderInfo.email
            const userInfo = await userCollection.findOne({ email: senderEmail })
            if (userInfo) {
                if (userInfo.balance >= sendMoneyInfo.amount) {
                    if (sendMoneyInfo.amount > 100) {
                        const adminQuery = { email: "mkmamun031@gmail.com" }
                        const admin = await userCollection.findOne(adminQuery)
                        const adminPatch = {
                            $set: {
                                balance: admin.balance + 5
                            }
                        }
                        const adminResult = await userCollection.updateOne({ _id: new ObjectId(admin._id) }, adminPatch)
                        const receiverInfo = await userCollection.findOne({ phone: sendMoneyInfo.receiverInfo.phone })
                        const receiverQuery = { _id: new ObjectId(receiverInfo._id) }
                        const receiverBalance = receiverInfo.balance
                        const deductionQuery = {
                            $set: {
                                balance: receiverBalance + (sendMoneyInfo.amount - 5)
                            }
                        }
                        const deductionResult = await userCollection.updateOne(receiverQuery, deductionQuery)
                    }
                    const receiverInfo = await userCollection.findOne({ phone: sendMoneyInfo.receiverInfo.phone })
                    const receiverQuery = { _id: new ObjectId(receiverInfo._id) }
                    const receiverBalance = receiverInfo.balance
                    const deductionQuery = {
                        $set: {
                            balance: receiverBalance + (sendMoneyInfo.amount)
                        }
                    }
                    const deductionResult = await userCollection.updateOne(receiverQuery, deductionQuery)
                    const userAmount = await userCollection.updateOne({ _id: new ObjectId(userInfo._id) }, { $set: { balance: userInfo.balance - sendMoneyInfo.amount } })
                    res.status(200).send({ message: "Send Money Succesful" })
                }
                res.status(400).send({ message: "Insufficient Fund!" })
            }
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