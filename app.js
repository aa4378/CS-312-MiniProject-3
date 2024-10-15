const express = require('express');
const app = express();
const path = require('path');

const { Pool } = require('pg');

// PostgreSQL
const pool = new Pool({
    // my PostgreSQL username
    user: 'postgres',
    // host
    host: 'localhost',
    // my database name
    database: 'BlogDB',
    // my password
    password: 'aa4378',
    // port
    port: 5432,
});

module.exports = pool;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    pool.query('SELECT * FROM blogs ORDER BY date_created DESC', (error, results) => {
        res.render('index', { posts: results.rows });
    });
});

// new post
app.post('/new-post', (req, res) => {
    const { title, author, content } = req.body;
    pool.query(
        'INSERT INTO blogs (creator_name, title, body, date_created) VALUES ($1, $2, $3, NOW())',
        [author, title, content],
        (error, results) => {
            res.redirect('/');
        }
    );
});

// edit page
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM blogs WHERE blog_id = $1', [id], (error, results) => {
        const post = results.rows[0];
        res.render('edit', { post });
    });
});

// edit Submission
app.post('/update-post/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, content } = req.body;

    pool.query(
        'UPDATE blogs SET title = $1, creator_name = $2, body = $3 WHERE blog_id = $4',
        [title, author, content, id],
        (error, results) => {
            res.redirect('/');
        }
    );
});

// Delete
app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const user_id = req.session.user_id;

    pool.query('DELETE FROM blogs WHERE blog_id = $1 AND creator_user_id = $2', [id, user_id], (error, results) => {
        res.redirect('/');
    });
});

// Start the server
app.listen(8080, () => 
    {
        console.log('Server is running on port 8080');
    });