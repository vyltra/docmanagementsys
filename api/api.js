const express = require('express');
const app = express();
const port = 3001; // Choose a port number
const mysql = require('mysql')
const cors = require('cors');

// use cors middleware to enable cross-origin requests
app.use(cors());



const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'docview'
})
db.connect()


// Middleware to parse JSON data
app.use(express.json());

// Define your API endpoints
app.get('/', (req, res) => {
    res.send('Hello, this is your REST API!');
});

// Sample data
const data = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
];

// Create a route to get a list of items
app.get('/items', (req, res) => {
    res.json(data);
});

// Create a route to get a single item by ID
app.get('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = data.find(item => item.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item not found' });
    }
});






app.get('/getAllDocuments', (req, res) => {
    db.query(
        'SELECT docview.documents.id, docview.documents.document, docview.documents.document_name\n' +
        'FROM docview.documents\n' +
        'WHERE docview.documents.owner = 1'
    , (err, rows, fields) => {
            if (err) throw err


            res.json(rows)
        })
})




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});