require('dotenv').config();
const express = require('express');
const app = express();
const port = 5500;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/public/js'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});