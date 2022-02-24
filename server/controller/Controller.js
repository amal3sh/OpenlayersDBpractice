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



exports.getData = async (req,res,next)=>{      
   
    const polygonfeatures=  await Feature.polygonFeature.find();
    const pointfeatures = await Feature.pointFeature.find();
    const features = [polygonfeatures, pointfeatures];
    //console.log("exportdata")
    //console.log(features)
    res.status(200).json(features);
}

exports.putData = async(req,res,next)=>{
    let feature;
    const type = req.body.geometry.type;
    switch(type)
    {
        case 'Point':console.log(req.body.properties,req.body.geometry.coordinates)
                    feature =  await Feature.pointFeature.updateOne({"_id":req.body.properties._id},{$set:{"geometry.coordinates":req.body.geometry.coordinates}})
                    //res.status(200).json(feature);                
                    
                    break;
        case 'Polygon': console.log(req.body)
        feature =  await Feature.polygonFeature.updateOne({"_id":req.body.properties._id},{$set:{"geometry.coordinates":req.body.geometry.coordinates}})
                        break;
        default: console.log(`unexpected type ${type}`)
    }

   // console.log(req.body);
    return res.status(200).json({"status":"success"});
}





