console.log("Let's get 'er done!");

const express = require('express');
const bodyParser = require('body-parser');
const exp = require('constants');
const { query, response } = require('express');
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://adriendorce:adrii305@cluster0.k4t0s6h.mongodb.net/?retryWrites=true&w=majority'

//MongoClient.connect(connectionString, (err, client) => {
    //if (err) return console.error(err)
   // console.log('Connected to Database')
//})
//the code above and below are the same, above uses a callback, below uses  a promise
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('crud-app-tasks')
    const tasksCollection = db.collection('tasks')
    app.set('view engine','ejs')
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.get('/', (req, res) =>{
        tasksCollection.find().toArray()
            .then(results => {
                console.log(results); 
                res.render('index.ejs',{tasks: results})
            })
            .catch(error => console.error(error)) 
    })    
    app.post('/tasks', (req, res) => {
        tasksCollection.insertOne(req.body)
        .then(result => {
            console.log(result);
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.put('/tasks', (req, res) => {
        //console.log(req.body);
       tasksCollection.findOneAndUpdate(
            {name: 'to-do'},
            {
                $set: {
                    task: req.body.task
                }
            },
            {
                upsert: true
            }
       )
       .then(result => {
        console.log(result);
        res.json('Success')
       })
        .catch(error => console.error(error))
    })
    app.delete('/tasks', (req,res) =>{
        tasksCollection.deleteOne(
            { name: req.body.name}
          )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json('No task to delete')
                }
                res.json(`Deleted task`)
            })
            .catch(error => console.error(error))
    })
    app.listen(3000, function() {
        console.log('listening on 3000');
    })
})
  .catch(error => console.error(error))  
