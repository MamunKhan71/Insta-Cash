const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const bcrypt = require('bcrypt')
const generateUniqueId = require('generate-unique-id');
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
// const uri = `mongodb://localhost:27017`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const getTransactionId = () => {
    const id = generateUniqueId()
    return id;
}
async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        const db = client.db('InstaCash')
        const userCollection = db.collection('users')
        const transactionCollection = db.collection('transactions')

        const transactionRecord = async (senderInfo, receiverInfo, transactionAmount, transactionType, transactionFee, transactionTime) => {
            const transactionId = getTransactionId().toUpperCase()
            const transactionInfo = {
                transactionId,
                senderInfo,
                receiverInfo,
                transactionType,
                transactionAmount,
                transactionFee,
                transactionTime
            }
            const result = await transactionCollection.insertOne(transactionInfo)
            return result;
        }
        const verifyPin = async (req, res, next) => {
            const userPassword = req.body.senderInfo?.password
            const dbUserPassword = await userCollection.findOne({ email: req.body.senderInfo?.email }).then(res => { return res.password })
            const passwordMatcher = bcrypt.compareSync(userPassword, dbUserPassword)
            if (!passwordMatcher) {
                return { message: "Incorrect Password" };
            }
            next()
        }
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

        // app.post('/verify-pin', async (req, res) => {
        //     const { email, password } = req.body
        //     console.log(email, password);
        // })

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

        app.post('/send-money', verifyPin, async (req, res) => {
            const sendMoneyInfo = req.body;
            const senderEmail = sendMoneyInfo.senderInfo.email;
            const userInfo = await userCollection.findOne({ email: senderEmail });
            const receiverInfo = await userCollection.findOne({ phone: sendMoneyInfo.receiverInfo.phone });

            if (userInfo) {
                if (userInfo.balance >= sendMoneyInfo.amount) {
                    if (sendMoneyInfo.amount > 100) {
                        const adminQuery = { email: "mkmamun031@gmail.com" };
                        const admin = await userCollection.findOne(adminQuery);
                        const adminPatch = {
                            $set: {
                                balance: admin.balance + 5
                            }
                        };
                        await userCollection.updateOne({ _id: new ObjectId(admin._id) }, adminPatch);

                        const receiverQuery = { _id: new ObjectId(receiverInfo._id) };
                        const receiverBalance = receiverInfo.balance;
                        const deductionQuery = {
                            $set: {
                                balance: receiverBalance + (sendMoneyInfo.amount - 5)
                            }
                        };
                        await userCollection.updateOne(receiverQuery, deductionQuery);
                    } else {
                        const receiverInfo = await userCollection.findOne({ phone: sendMoneyInfo.receiverInfo.phone });
                        const receiverQuery = { _id: new ObjectId(receiverInfo._id) };
                        const receiverBalance = receiverInfo.balance;
                        const deductionQuery = {
                            $set: {
                                balance: receiverBalance + sendMoneyInfo.amount
                            }
                        };
                        await userCollection.updateOne(receiverQuery, deductionQuery);
                    }

                    const result = await userCollection.updateOne({ _id: new ObjectId(userInfo._id) }, { $set: { balance: userInfo.balance - sendMoneyInfo.amount } });
                    // senderInfo, receiverInfo, transactionAmount, transactionType, transactionFee, transactionTime
                    if (result.acknowledged) {
                        const trxTime = new Date()
                        const trxRecord = transactionRecord(userInfo.phone, receiverInfo.phone, sendMoneyInfo.amount, "Send Money", Number(5.00), trxTime)
                        if ((await trxRecord).acknowledged) {
                            return res.status(200).send({ message: "Send Money Successful" });
                        }
                    }
                } else {
                    return res.status(400).send({ message: "Insufficient Fund!" });
                }
            } else {
                return res.status(400).send({ message: "Sender not found" });
            }
        });

        app.post('/cashout', verifyPin, async (req, res) => {
            const cashoutInfo = req.body
            const phone = cashoutInfo.receiverInfo.phone
            const agentInfo = await userCollection.findOne({ phone: phone })
            if (agentInfo.accType !== 'agent') {
                res.status(401).send("This is not an agent number")
            }
            const receiverInfo = await userCollection.findOne({ email: cashoutInfo.senderInfo.email })
            const agentInfoUpdate = await userCollection.updateOne({ _id: new ObjectId(agentInfo._id) }, { $set: { balance: Number(agentInfo.balance + cashoutInfo.cashoutCharge + cashoutInfo.amount) } })
            if (!agentInfoUpdate.acknowledged) {
                res.status(402).send("Something went wrong")
            }
            const result = await userCollection.updateOne({ _id: new ObjectId(receiverInfo._id) }, { $set: { balance: Number(receiverInfo.balance - (cashoutInfo.amount + cashoutInfo.cashoutCharge)) } })
            if (result.acknowledged) {
                const trxTime = new Date()
                const trxRecord = transactionRecord(agentInfo.phone, receiverInfo.phone, cashoutInfo.amount, "Cash Out", Number(cashoutInfo.cashoutCharge), trxTime)
                if ((await trxRecord).acknowledged) {
                    return res.status(200).send({ message: "Cash out Successful" });
                }
                return res.status(402).send({ message: "Cash out Failed" });
            }

        })
        app.post('/cashin', verifyPin, async (req, res) => {
            const cashInInfo = req.body
            const phone = cashInInfo.receiverInfo.phone
            const agentInfo = await userCollection.findOne({ phone: phone })
            const receiverInfo = await userCollection.findOne({ email: cashInInfo.senderInfo.email })
            if (agentInfo.accType !== 'agent') {
                res.status(401).send("This is not an agent number")
            }
            const agentAccountUpdate = await userCollection.updateOne({ _id: new ObjectId(agentInfo._id) }, { $set: { balance: Number(agentInfo.balance - cashInInfo.amount) } })
            if (!agentAccountUpdate.acknowledged) {
                res.status(402).send("Something went wrong")
            }
            const result = await userCollection.updateOne({ _id: new ObjectId(receiverInfo._id) }, { $set: { balance: Number(receiverInfo.balance + (cashoutInfo.amount)) } })
            if (result.acknowledged) {
                const trxRecord = transactionRecord(agentInfo.phone, receiverInfo.phone, cashInInfo.amount, "Cash In", 0)
                if ((await trxRecord).acknowledged) {
                    return res.status(200).send({ message: "Cash out Successful" });
                }
            }
            res.send(result)
        })
        app.get('/transactions', async (req, res) => {
            const result = await transactionCollection.find().toArray()
            res.status(200).send(result)
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