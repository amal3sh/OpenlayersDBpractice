const Feature = require("../Model/Feature");

let polygonFeature;
let pointFeature;
exports.postData = async (req,res,next)=>{
    const type = req.body.geometry.type;
    let feature ;
    switch(type)
    {
        
        case 'Polygon':feature = await Feature.polygonFeature.create(req.body);
                      res.status(200).json(feature);
                       break;
        case 'Point':feature = await Feature.pointFeature.create(req.body);
                     res.status(200).json(feature);
                     break;
        default: console.log(`unexpected type ${type}`)
    }
}

const getPoly = async()=>{
     polygonFeature = await Feature.polygonFeature.find();
    

     //console.log(polygonFeature)
}
const getPoint = async()=>{
     pointFeature = await Feature.pointFeature.find();
     
     //console.log(pointFeature);
}
getPoly();
getPoint();

exports.getData = (req,res,next)=>{   
   ; 
   // const polygonfeatures=  Feature.polygonFeature.find();
  // const pointfeatures =  Feature.pointFeature.find();
    const features = [polygonFeature, pointFeature];
    console.log("exportdata")
    console.log(features)
    res.status(200).json(features);
}
//module.exports = postData;
//module.exports = getData;