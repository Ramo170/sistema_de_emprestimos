const express = require('express');
const cors = require('cors');
const routes = require("./routes/clienteRoutes")
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes)
app.use(express.static(path.join(__dirname, '../frontend/app/page.tsx')));

module.exports = app;