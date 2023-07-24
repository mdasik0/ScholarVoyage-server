const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// server starts from here

app.get("/", (req, res) => {
  res.send("ScholarVoyage Server is running");
});

// mongodb start from here


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.llfgq6f.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Database Collection

    const allCollegesCollection = client.db("scholarVoyageDB").collection("colleges");
    const usersCollection = client.db("scholarVoyageDB").collection("users");

    // Database access

    // [[[[[[[[[[[[[[[[[[[[[ Get all Colleges Data ]]]]]]]]]]]]]]]]]]]]]
    app.get("/allColleges", async (req,res) => {
        const result = await allCollegesCollection.find().toArray();
        res.send(result)
    })

    // [[[[[[[[[[[[[[[[[[[[[ Get single College Data ]]]]]]]]]]]]]]]]]]]]]
    app.get("/allColleges/:id", async(req,res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allCollegesCollection.findOne(query);
        res.send(result)
    })



    // [[[[[[[[[[[[[[[[[[[[[ Post New User Data ]]]]]]]]]]]]]]]]]]]]]
    app.post("/userData", async (req,res) => {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
        if (existingUser) {
            return res.send((message = "user already exists"));
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })
    
    app.get("/userData", async(req,res) => {
        const result = await usersCollection.find().toArray();
        res.send(result)
    })

    // [[[[[[[[[[[[[[[[[[[[[ Get User Data ]]]]]]]]]]]]]]]]]]]]]
    app.get("/userData/:email", async (req,res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await usersCollection.findOne(query);
        res.send(result)
    })

    // [[[[[[[[[[[[[[[[[[[[ Update User Data ]]]]]]]]]]]]]]]]]]]]
    app.patch("/userData/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedoc = {
          $set: data,
        };
        const result = await usersCollection.updateOne(filter, updatedoc, options);
        res.send(result);
      });


    // [[[[[[[[[[[[[[[[[[[[ Selected College Data ]]]]]]]]]]]]]]]]]]]]


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`This server is running on Port:${port}`);
});
