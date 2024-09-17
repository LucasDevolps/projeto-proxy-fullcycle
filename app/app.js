const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'fullcycle'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS people (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
    `;
    db.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
        } else {
            console.log('Tabela "people" pronta');
        }
    });
});

app.get('/', (req, res) => {
    const insertQuery = 'INSERT INTO people (name) VALUES (?)';
    const name = 'Full Cycle Rocks!';

    db.query(insertQuery, [name], (err, result) => {
        if (err) {
            console.error('Erro ao inserir registro:', err);
            res.status(500).send('Erro no servidor');
            return;
        }

        const selectQuery = 'SELECT name FROM people';
        db.query(selectQuery, (err, results) => {
            if (err) {
                console.error('Erro ao buscar registros:', err);
                res.status(500).send('Erro no servidor');
                return;
            }

            const names = results.map(row => row.name);
            res.send(`
                <h1>Full Cycle Rocks!</h1>
                <ul>
                    ${names.map(name => `<li>${name}</li>`).join('')}
                </ul>
            `);
        });
    });
});

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
});
