const express = require('express');

const app = express();

app.use((req, res) => {
    console.log('Received request:', req.method, req.url);
    res.send('Hello, World!');
});

app.listen(3000,() => {
    console.log('Server is running on port 3000');
})