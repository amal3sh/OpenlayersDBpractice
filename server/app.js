const express = require("express");
const app = express();
const cors = require('cors');
const PORT = 5000;
const mongoose = require('mongoose');
const setRoute = require('./route/router');
app.use(cors());
app.use(express.json());

app.listen(PORT,()=>console.log(`server started on port : ${PORT}`));

mongoose.connect('mongodb://127.0.0.1:27017/geoData',()=>{console.log("Connection success")});

app.use('/api/geoData',setRoute);
/*

app.post('/api/geoData',(req,res,next)=>{
    console.log(req.body);
    res.status(200).json({"success":"ok"})
})
*/