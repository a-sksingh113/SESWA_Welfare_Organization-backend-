require('dotenv').config();
const express = require('express');
const connectDB = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
const {logRequest} = require("./middleware/logMiddleware");



const adminRoute = require('./routes/adminRoute');



const app = express();
PORT = process.env.PORT || 8001;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(logRequest);

app.use('/api/admin', adminRoute);

app.listen(PORT,() =>{
    console.log(`Server is listening on port ${PORT}`);
})



