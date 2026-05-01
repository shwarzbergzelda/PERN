import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello from the Cars API!");
});

app.get('/api/v1/cars', (req, res) => {
    res.send('All cars');
});

app.post('/api/v1/cars', (req, res) => {
    res.send('New car');
});

app.put('/api/v1/cars/:id', (req, res) => {
    req.send('Update car');
});

app.delete('/api/v1/cars/:id', (req, res) => {
    res.send('Delete car');
});

app.get('/api/v1/cars/:id', (req, res) => {
    res.send('Get car');
});

app.listen(port, () => {
    console.log(`Server is running on port https://localhost:${port}`)
});