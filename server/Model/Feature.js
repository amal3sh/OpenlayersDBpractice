const mongoose = require('mongoose');
const polygonSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:['Polygon'],
        required: true
    },
    coordinates:{
        type:[[[Number]]],
        required:true
    }
});
const polySchema = new mongoose.Schema({
    name:String,
    geometry:polygonSchema
});
const Feature = mongoose.model("Feature",polySchema);
module.exports = Feature;
