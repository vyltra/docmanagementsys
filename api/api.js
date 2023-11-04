const express = require('express');
const app = express();
const port = 3001; // Choose a port number
const mysql = require('mysql2/promise')
const cors = require('cors');

// use cors middleware to enable cross-origin requests
app.use(cors());
app.use(express.json({ limit: '25mb' }));


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'docview',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
})



// Middleware to parse JSON data
app.use(express.json());

// Define your API endpoints
app.get('/', (req, res) => {
    res.send('Hello, this is your REST API!');
});


app.get('/getAllDocuments', async (req, res) => {

    let conn;

    try {
        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        // await conn.beginTransaction()
        const [rows, fields] = await conn.query(
            'SELECT docview.documents.id, docview.documents.document, docview.documents.document_name\n' +
            'FROM docview.documents\n' +
            'WHERE docview.documents.owner = 1'
        )

        res.json(rows);

    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occured trying to execute a Database query')
        //await conn.rollback();
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})

app.get('/getAllUsers', async (req, res) => {

    let conn;

    try {
        conn = await db.getConnection();
        const [rows, fields] = await conn.query(
            'SELECT id, user_name FROM users'
        )

        res.json(rows);

    } catch (err) {
        console.error('An Error occured trying to execute a Database query')
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})


app.get('/getUserTags', async (req, res) => {

    let conn;

    try {
        conn = await db.getConnection();
        const [rows, fields] = await conn.query(
            'SELECT DISTINCT\n' +
            '    t.id AS tag_id,\n' +
            '    t.tag_name\n' +
            'FROM\n' +
            '    docview.documents d\n' +
            'JOIN\n' +
            '    docview.documents_tags dt ON d.id = dt.document_id\n' +
            'JOIN\n' +
            '    docview.tags t ON dt.tag_id = t.id\n' +
            'WHERE\n' +
            '    d.owner = 1;\n'
        )

        res.json(rows);

    } catch (err) {
        console.error('An Error occured trying to execute a Database query')
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})



app.post('/upload', async (req, res) => {

    let conn;

    try {

        const { owner, document, document_name, tags, users, image } = req.body;

        console.log(owner)
        console.log(document_name)
        console.log(tags)
        console.log(users)
        //console.log(document)

        //validation code tbd

        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        await conn.beginTransaction()

        // Insert document
        const [docResult] = await conn.execute(
            'INSERT INTO docview.documents (owner, document, document_name, image) VALUES (?, ?, ?, ?)',
            [owner, document, document_name, image]
        );
        const lastDocumentId = docResult.insertId;

        // Insert tags and associate them with the document
        for (const tagName of tags) {
            let tagId;
            // Check if the tag already exists
            const [existingTag] = await conn.execute(
                'SELECT id FROM docview.tags WHERE tag_name = ?',
                [tagName]
            );
            if (existingTag.length > 0) {
                // Use the existing tag ID
                tagId = existingTag[0].id;
            } else {
                // Insert new tag and get ID
                const [tagResult] = await conn.execute(
                    'INSERT INTO docview.tags (tag_name) VALUES (?)',
                    [tagName]
                );
                tagId = tagResult.insertId;
            }
            // Insert the document and tag relationship into documents_tags table
            await conn.execute(
                'INSERT INTO docview.documents_tags (document_id, tag_id) VALUES (?, ?)',
                [lastDocumentId, tagId]
            );
        }

        // Associate users with the document
        for (const userId of users) {
            await conn.execute(
                'INSERT INTO docview.documents_users (user_id, document_id) VALUES (?, ?)',
                [userId, lastDocumentId]
            );
        }

        // Commit the transaction
        await conn.commit();

        res.status(201).send({ message: 'File uploaded and saved to the database successfully.' });


    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occured trying to execute a Database query')
        await conn.rollback();
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release();
    }
})




// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});