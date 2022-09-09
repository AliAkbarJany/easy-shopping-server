const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j3inftf.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        // console.log('database connected')
        const productsCollection = client.db('easy_shopping').collection('products')
        const cartsCollection = client.db('easy_shopping').collection('carts')
        

        // get/Read  (all) Products........
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = productsCollection.find(query)
            const products = await cursor.toArray()
            // console.log(products)
            res.send(products)
        })

        // ..Read/get  (single) product

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log('get single id', id)
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query)
            res.send(product)
        })



        // Add/Post.... for (handleAddToCart)
        app.post('/cart', async (req, res) => {
            const cartProduct = req.body
            console.log("server body", cartProduct)

            // const id = req.body._id
            // console.log(id)

            const query = {_id:cartProduct._id}
            const exists=await cartsCollection .findOne(query)
            if (exists) {
                return res.send({ success: false })
            }

            
                const result = await cartsCollection.insertOne(cartProduct)
                console.log(result)
                res.send({success:true,result})
                
            
            

        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Hello From Easy-Shopping')
})

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})