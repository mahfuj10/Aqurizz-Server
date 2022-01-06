const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors');
var admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
// const port = 5000;
const port = process.env.PORT || 5000;


// firebase admin initialization 

// var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });


//middlewire
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.korjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith('Bearer ')) {
//       const idToken = req.headers.authorization.split('Bearer ')[1];
//       try {
//           const decodedUser = await admin.auth().verifyIdToken(idToken);
//           req.decodedUserEmail = decodedUser.email;
//       }
//       catch {

//       }
//   }
//   next();
// }

app.get("/", (req, res) => {
  res.send("Aqurizzzzz Server connected");
});

client.connect((err) => {
  const productsCollection = client.db("aqorizz").collection("products");
  const usersCollection = client.db("aqorizz").collection("users");
  const ordersCollection = client.db("aqorizz").collection("orders");
  const reviewCollection = client.db("aqorizz").collection("review");

  //add A Product
  app.post("/addProducts", async (req, res) => {
    const result = await productsCollection.insertOne(req.body);
    res.send(result);
  });

  // get all Product
  app.get("/allProducts", async (req, res) => {
    const result = await productsCollection.find({}).toArray();
    res.send(result);
  });

  // Product Details 

  app.get("/singleProduct/:id", async (req, res) => {
    const result = await productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(result[0]);
  });

  // insert order 

  app.post("/addOrders", async (req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.send(result);
  });

  
  /// all order
  app.get("/allOrders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.send(result);
  });

  // //  my order

  // app.get("/myOrder/:email", async (req, res) => {

  //   const email = req.query.email;
  //           if (req.decodedUserEmail === email) {
  //               const query = { email: email };
  //               const cursor = ordersCollection.find(query);
  //               const orders = await cursor.toArray();
  //               res.json(orders);
  //           }
  //           else {
  //               res.status(401).json({ message: 'User not authorized' })
  //           }
  // });

    //  my order

    app.get("/myOrder/:email", async (req, res) => {
      const result = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

  //Delete Order 

  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.json(result);
  });


  //Delete Product 

  app.delete("/pdelete/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.json(result);
  });


  // Add review
  app.post("/addSReview", async (req, res) => {
    const result = await reviewCollection.insertOne(req.body);
    res.send(result);
  });


  //get review 
  app.get("/addSReview", async (req, res) => {
    const result = await reviewCollection
      .find({})
      .toArray();
    res.send(result);
  });


  //Make user 
  app.post("/addUserInfo", async (req, res) => {
    console.log("req.body");
    const result = await usersCollection.insertOne(req.body);
    res.send(result);
    console.log(result);
  });


  // //  make admin
  // app.put("/makeAdmin", async (req, res) => {
  //   const filter = { email: req.body.email };
  //   const result = await usersCollection.find(filter).toArray();
  //   if (result) {
  //     const documents = await usersCollection.updateOne(filter, {
  //       $set: { role: "admin" },
  //     });
  //   }
  //   const updated = await usersCollection.updateOne(filter, updateDoc);
  //           res.send(updated);
  // });

//  make admin
app.put("/makeAdmin", async (req, res) => {
  const filter = { email: req.body.email };
const updateDoc = {
              $set: {
                  role: 'admin'
              },
          };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.send(result);
      })


  /// all User
  app.get("/allUsers", async (req, res) => {
    const result = await usersCollection.find({}).toArray();
    res.send(result);
  });

  // check admin or not
  app.get("/checkAdmin/:email", async (req, res) => {
    const result = await usersCollection
      .find({ email: req.params.email })
      .toArray();
    res.send(result);
  });

 //update order status
 app.put('/statusUpdate/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      status: "Shipped",
    },
  };
  const result = await ordersCollection.updateOne(filter, updateDoc, options);
  res.json(result);
});


  // // status update
  // app.put("/statusUpdate/:id", async (req, res) => {
  //   const filter = { _id: ObjectId(req.params.id) };
  //   console.log(req.params.id);
  //   const result = await ordersCollection.updateOne(filter, {
  //     $set: {
  //       status: req.body.status,
  //     },
  //   });
  //   res.send(result);
  //   console.log(result);
  // });
});




app.listen(process.env.PORT || port);

