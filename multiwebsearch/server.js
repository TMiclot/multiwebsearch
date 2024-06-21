const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/search_engines', (req, res) => {
    const filePath = path.join(__dirname, 'bin', 'search_engime.txt');
    
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        const engines = data.split('\n').map(line => {
            const [name, url] = line.replace(/"/g, '').split(' ');
            return { name, url };
        }).filter(engine => engine.name && engine.url);

        res.json(engines);
    });
});

app.get('/website_lists', (req, res) => {
    const directoryPath = path.join(__dirname, 'bin', 'websites_lists');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }

        const lists = files.filter(file => file.endsWith('.txt')).map(file => file.replace('.txt', ''));
        res.json(lists);
    });
});

app.get('/website_list', (req, res) => {
    const listName = req.query.name;
    const filePath = path.join(__dirname, 'bin', 'websites_lists', `${listName}.txt`);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }

        const websites = data.split('\n').filter(line => line.trim() !== "").join('\n');
        res.send(websites);
    });
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

