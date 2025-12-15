require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRouter');
const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');
const commonRoute = require('./routes/commonRoute');

const app = express();
const port = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



app.set('view engine', 'ejs');
app.set('views', './views');


// console.log(port);
app.use('/API', userRoute);
app.use('/API', authRoute);
app.use('/API/admin', adminRoute);
app.use('/API', commonRoute);


mongoose.connect(mongoURL)
    .then(() => { console.log(`Connected to mongodb`) })
    .catch((err) => { console.error(err) });


app.listen(port, () => {
    console.log(`Server Running on port no ${port}`);
});