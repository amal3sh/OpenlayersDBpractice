import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Draw, Modify, Snap} from 'ol/interaction';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import {get} from 'ol/proj';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon'
import LineString from 'ol/geom/LineString';
//import click from 'ol/events/condition/click';
//import { pointFeature, polygonFeature } from '../server/Model/Feature';

let saved =[];
let savedPolygon = [];//for fetching data
let savedPoint = [];
let savedLinstring = [];



//post
const postServer = (data)=>
{
  fetch('http://127.0.0.1:5000/api/geoData',{
    method :'POST',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response=>response.json())
  .then(data=>{
    console.log('Successs:',data);
  })
  .catch((error)=>{
    console.log('Error:',error);
  });
}

//get
const getServer = async ()=>{
  saved =  await fetch('http://127.0.0.1:5000/api/geoData').then(response=>response.json());
  savedPolygon = saved[0];
  savedPoint = saved[1];
 // console.log(saved);
}

//put

const updateServer = async(data)=>{
  await fetch('http://127.0.0.1:5000/api/geoData',
  {
    method :'PUT',
    headers: {
      'Content-Type':'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response=>response.json())
  .then(data=>{
    console.log('Successs:',data);
  })
  .catch((error)=>{
    console.log('Error:',error);
  });

}




const tile = new TileLayer({
  source:new OSM(),
});
const source = new VectorSource();
const sourceIcon = new VectorSource();


//fucntion for icons
const changeIcon = (cords)=>{
const iconFeature = new Feature({
  geometry:new Point(cords),
    
    });
    const iconStyle =  new Style(
      {
        image: new Icon({
          anchor:[0.5,45],
          anchorXUnits:'fraction',
          anchorYUnits:'pixels',
          src:"./icons/icon.png",
        })
      }
    )
    iconFeature.setStyle(iconStyle);
 
    sourceIcon.addFeature(iconFeature);
    }
//event
source.on('addfeature',(evt)=>{
  const feature = evt.feature;
  const cords = feature.getGeometry().getCoordinates();
  const writer = new GeoJSON();  
  const data = writer.writeFeatureObject(feature);
  console.log("hi")
  changeIcon(cords);
 
 if(!data.properties)//prevent duplication while loading
  postServer(data);
  //console.log(cords);
})

//updation

source.on('changefeature',(evt)=>{  //change to modifyend
  const feature = evt.feature;
  const writer = new GeoJSON();
  const data= writer.writeFeatureObject(feature);
  updateServer(data);
 // let uid = data.properties._id;
  
 // 
  //const id = feature.getId(); 
  
  //console.log(uid);
})



















const typeSelect = document.getElementById('type');




  
    


const vector = new VectorLayer({
  source: sourceIcon,
})

// style: new Style({
//   fill: new Fill({
//     color: 'rgba(255, 255, 255, 0.2)',
//   }),
const map = new Map({
  target: 'map',
  layers: [tile,vector],
  style: new Style({
    fill: new Fill({
      color:'rgba(255,255,255,0.2)',
    })
  }),
  
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
const modify = new Modify({source:source});
map.addInteraction(modify);
let draw,snap;


//interactions function
const addInteractions = ()=>{
  draw = new Draw({
    source:source,
    type:typeSelect.value,
   
  });
  map.addInteraction(draw);
  snap = new Snap({source:source});
  map.addInteraction(snap);
}

//handling change event
typeSelect.onchange = ()=>{
  map.removeInteraction(draw);
  map.removeInteraction(snap);
  addInteractions();
}
addInteractions();
window.addEventListener("load",async (evt)=>{
  await getServer();
  let feature;
  savedPolygon.forEach(element => {    
      feature = new Feature({
      geometry:new Polygon(element.geometry.coordinates),
      type:element.type,
      _id:element._id
    })
    
    source.addFeature(feature);
  });
  savedPoint.forEach(element => {    
    feature = new Feature({
    geometry:new Point(element.geometry.coordinates),
    type:element.type,
    _id:element._id
  })
  
  source.addFeature(feature);
});

})

