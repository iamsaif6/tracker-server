const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mal3t53.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollections = client.db('touristDB').collection('spotCollections');

    // Add Spot data via user form
    app.post('/add_spot', async (req, res) => {
      const spots = req.body;
      const result = await spotCollections.insertOne(spots);
      res.send(result);
    });

    // Load Spot data
    app.get('/', async (req, res) => {
      const cursor = spotCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Load single data
    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollections.findOne(query);
      res.send(result);
    });

    // Load data match with email
    app.get('/mylist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { email: id };
      const result = await spotCollections.find(query).toArray();
      console.log(result);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
