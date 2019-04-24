const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool, Client } = require('pg');
const path = require('path');

const port = process.env.port || 9999;

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'UserManagement',
    password: 'postgres',
    port: '5432',
});

let users = [];

let newUsers = [];

function getUsers() {
    newUsers = new Promise((resolve, reject) => {
        users = [];
        pool.query('SELECT * FROM users', (err, res) => {
            if (err) throw err;
            for (let i = 0; i < res.rows.length; i++) {
                users.push(res.rows[i]);
            }
            users.sort();
            resolve();
        });
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let successMessage = '';
let errorMessage = '';

app.get('/', (req, res) => {
    getUsers();
    newUsers.then(() => {
        res.render('index', {
            users: users,
            successMessage: successMessage,
            errorMessage: errorMessage
        });
        successMessage = '';
        errorMessage = '';
    });

});

app.get('/addUser', (req, res) => {
    res.render('adduser');
});

app.get('/*.css/', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles', req.url));
});

app.get('/*.js/', (req, res) => {
    res.sendFile(path.join(__dirname, 'scripts', req.url));
});

app.post('/addUser', (req, res) => {
    let user = req.body;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === user.username) {
            errorMessage = "User ID is taken!";
            res.redirect('/');
            return;
        }
    }

    pool.query(`INSERT INTO users (id, firstname, lastname, email, age) VALUES('${user.username}', '${user.firstname}', '${user.lastname}', '${user.email}', ${user.age})`).then(() => {
        successMessage = 'User successfully added';
        res.redirect('/');
    });
});

app.post('/deleteUser', (req, res) => {
    pool.query(`DELETE FROM users WHERE id = '${req.body.username}'`).then(() => {
        successMessage = `'${req.body.username}' has been deleted`;
        res.redirect('/');
    });
});

app.post('/editUser', (req, res) => {
    let username = req.body.username;
    let user = {};
    for(let i = 0; i < users.length; i++) {
        if(users[i].id === username) {
            user = users[i];
        }
    }
    res.render('editUser', {
        user: user
    });
});

app.post('/edit', (req, res) => {
    let newUser = req.body;

    pool.query(`UPDATE users SET id='${newUser.username}', firstname='${newUser.firstname}', lastname='${newUser.lastname}', email='${newUser.email}', age=${newUser.age} WHERE id='${newUser.userid}'`).then(() => {
        successMessage = 'Changes have been saved...';
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
