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

let saved = [];//for fetching data

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
const getServer = async ()=>{
  saved =  await fetch('http://127.0.0.1:5000/api/geoData').then(response=>response.json())
}



const tile = new TileLayer({
  source:new OSM(),
});
const source = new VectorSource();

//event
source.on('addfeature',(evt)=>{
  const feature = evt.feature;
  const cords = feature.getGeometry().getCoordinates();
  const writer = new GeoJSON();
  const data = writer.writeFeatureObject(feature);
  console.log(data);
  postServer(data);
  console.log(cords);
})



const vector = new VectorLayer({
  source: source,
})


const map = new Map({
  target: 'map',
  layers: [tile,vector],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
const modify = new Modify({source:source});
map.addInteraction(modify);
let draw,snap;
const typeSelect = document.getElementById('type');

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
  saved.forEach(element => {
    const feature = new Feature({
      geometry:new Polygon(element.geometry.coordinates),
      type:element.type,
      _id:element._id
    })
    source.addFeature(feature);
  });

})