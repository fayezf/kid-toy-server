const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dt6wk0t.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('eduLearn').collection('categories');
    const addCollection = client.db('eduLearn').collection('categories');

    // Sub category
    // app.get('allToys/:subCategory', async(req, res) => {
    //     const result = await toyCollection.find({subCategory: req.params.subCategory}).toArray();
    //     res.send(result)
    // })

    // all-toys
    app.get('/allToys', async(req, res) => {
        const result = await toyCollection.find().toArray();
        res.send(result);
    })

    app.get('/allToys/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const options = {
            // Include only the `title` and `imdb` fields in the returned document
            projection: { _id: 1, toyName: 1, sellerName: 1, subCategory:1, price: 1, availableQuantity: 1,  pictureURL: 1, detailDescription: 1, rating: 1, sellerEmail:1},
          };

        const result = await toyCollection.findOne(query, options);
        res.send(result)
    })

    // my toys
    app.get('/myToys/:email', async(req, res) => {
        const result = await addCollection.find({sellerEmail: req.params.email}).toArray();
        res.send(result)
    })

    // add toys
    app.post('/addToys', async(req, res) =>{
        const body = req.body;
        if(!body){
            return res.status(404).send({message: "body data not found"})
        }

        const result = await addCollection.insertOne(body)
        console.log(result)
        res.send(result)
    })

    // Update Toys
    app.patch('/myToys/:id', async(req, res) => {
        const id  = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const updateToys = req.body;
        console.log(updateToys);
        const updateDoc = {
            $set: {
                status: updateToys.status
            },
        }
        const result = await addCollection.updateOne(filter, updateDoc);
        res.send(result)
    })

    // Delete Toys
    app.delete('/myToys/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await addCollection.deleteOne(query);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('kids is running')
});


app.listen(port, () => {
    console.log(`Edulearn server is running on port: ${port}`)
})