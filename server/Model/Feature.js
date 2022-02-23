const mongoose = require('mongoose');

//polygon
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

//point
const point = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }

});
const pointSchema = new mongoose.Schema({
    name:String,
    geometry:point,
});

exports.polygonFeature = mongoose.model("polygonfeature",polySchema);
exports.pointFeature = mongoose.model("pointfeature",pointSchema);
/*module.exports = Feature;
module.exports = pointFeature;*/
