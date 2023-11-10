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


app.post('/getDocumentsForUser', async (req, res) => {

    let conn;

    const { ownerId } = req.body;

    try {
        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        // await conn.beginTransaction()
        const [rows, fields] = await conn.query(
            'SELECT docview.documents.id, docview.documents.document, docview.documents.document_name, docview.documents.image, docview.documents.custom_name ' +
            'FROM docview.documents ' +
            'WHERE docview.documents.owner = ?',
            [ownerId] // This should be the variable holding the owner's ID
        );

// Convert each image Buffer to a base64 string
        const modifiedRows = rows.map(row => {
            if (row.image) {
                // Assuming 'image' is a Buffer containing the binary image data
                row.image = row.image.toString('utf-8');
            }
            return row;
        });

        res.json(modifiedRows);

    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occured trying to execute a Database query')
        //await conn.rollback();
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})

app.post('/getSharedDocumentsForUser', async (req, res) => {

    let conn;

    const { ownerId } = req.body;

    try {
        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        // await conn.beginTransaction()
        const [rows, fields] = await conn.query(
            'SELECT ' +
            '    d.id, ' +
            '    d.document, ' +
            '    d.document_name, ' +
            '    d.image, ' +
            '    d.custom_name ' +
            'FROM ' +
            '    documents d ' +
            'INNER JOIN ' +
            '    documents_users du ON d.id = du.document_id ' +
            'WHERE ' +
            '    du.user_id = ?',
            [ownerId] // This should be the variable holding the owner's ID
        );

// Convert each image Buffer to a base64 string
        const modifiedRows = rows.map(row => {
            if (row.image) {
                // Assuming 'image' is a Buffer containing the binary image data
                row.image = row.image.toString('utf-8');
            }
            return row;
        });

        res.json(modifiedRows);

    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occured trying to execute a Database query')
        //await conn.rollback();
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})

app.post('/getDocument', async (req, res) => {
    let conn;

    const { documentId } = req.body;

    try {
        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        // await conn.beginTransaction()
        const [rows, fields] = await conn.query(
            'SELECT docview.documents.document, docview.documents.document_name ' +
            'FROM docview.documents ' +
            'WHERE docview.documents.id = ?',
            [documentId] // This should be the variable holding the owner's ID
        );

// Convert each image Buffer to a base64 string
        const base64String = rows[0].document.toString('utf-8')
        res.json({ document: base64String, documentName: rows[0].document_name});

    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occured trying to execute a Database query')
        //await conn.rollback();
        res.status(500).send('Error getting documents')
    } finally {
        if (conn) conn.release(); // release the connection back to the pool

    }
})

app.post('/searchDocuments', async (req, res) => {
    let conn;

    const { userId, searchTags } = req.body;
    const numberOfTags = searchTags.length;

    try {
        conn = await db.getConnection();

        let query = '';
        let queryParams = [];

        if (numberOfTags > 0) {
            // If there are tags specified, search for documents with those tags
            query = 'SELECT d.* ' +
                'FROM documents d ' +
                'INNER JOIN documents_tags dt ON dt.document_id = d.id ' +
                'INNER JOIN tags t ON t.id = dt.tag_id ' +
                'LEFT JOIN documents_users du ON d.id = du.document_id ' +
                'WHERE t.tag_name IN (?) ' +
                'AND (d.owner = ? OR du.user_id = ?) ' +
                'GROUP BY d.id ' +
                'HAVING COUNT(DISTINCT t.id) = ?;';
            queryParams = [searchTags, userId, userId, numberOfTags];
        } else {
            // If no tags are specified, return all documents with any tags
            query = 'SELECT d.* ' +
                'FROM documents d ' +
                'INNER JOIN documents_tags dt ON dt.document_id = d.id ' +
                'LEFT JOIN documents_users du ON d.id = du.document_id ' +
                'WHERE d.owner = ? OR du.user_id = ? ' +
                'GROUP BY d.id;';
            queryParams = [userId, userId];
        }

        const [rows, fields] = await conn.query(query, queryParams);

        console.log(rows);

        // Handle the response based on the number of documents returned
        if (rows.length > 0) {
            const modifiedRows = rows.map(row => {
                if (row.image) {
                    // Assuming 'image' is a Buffer containing the binary image data
                    row.image = row.image.toString('utf-8');
                }
                return row;
            });

            res.json(modifiedRows);
        }

    } catch (err) {
        console.error('An Error occurred trying to execute a Database query', err);
        res.status(500).send('Error getting documents');
    } finally {
        if (conn) conn.release(); // release the connection back to the pool
    }
});

app.post('/login', async (req, res) => {
    let conn;

    const { username, password } = req.body;

    try {
        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        // await conn.beginTransaction()
        const [rows, fields] = await conn.query(
            'SELECT id, user_password ' +
            'FROM docview.users ' +
            'WHERE user_name = ?',
            [username]
        );

        if (rows.length > 0 && rows[0]['user_password'] === password) {
            res.json({ loginGranted: true, user_id: rows[0]['id'] });
        } else {
            // This will handle both no results and incorrect passwords
            res.json({ loginGranted: false });
        }


    } catch (err) {
        // error logging + wait for rollback in case of query failure
        console.error('An Error occurred trying to execute a Database query')
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

        const { owner, document, document_name, tags, users, image, customName } = req.body;

        //validation code tbd

        // get a connection from the pool and begin a transaction
        // using transactions for data integrity
        conn = await db.getConnection();
        await conn.beginTransaction()

        // Insert document
        const [docResult] = await conn.execute(
            'INSERT INTO docview.documents (owner, document, document_name, image, custom_name) VALUES (?, ?, ?, ?, ?)',
            [owner, document, document_name, image, customName]
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