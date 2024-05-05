const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

// setting header security
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTION') {
        res.header('Access-Control-Allow-Method', 'GET, POST, PUT, PATCH, DELETE');
        return res.json({});
    }
    next();
});

// Import routes
app.use("/", routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});