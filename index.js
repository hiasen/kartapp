import 'ol/ol.css';
import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import {getKartverketLayer} from "./karverketLayer";
import Geolocation from 'ol/Geolocation';


const defaultPosition = [11, 62];

navigator.serviceWorker.register("/serviceWorker.js")

const theView = new View({
    center: [0, 0],
    zoom: 6,
    projection: "EPSG:3857",
});
theView.setCenter(fromLonLat(defaultPosition, theView.getProjection()));

const geolocation = new Geolocation({
    projection: theView.getProjection(),
    trackingOptions: {
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
    },
    tracking: true,
});

function createCurrentPositionLayer(geolocation) {
    const myPosition = new Point(
        fromLonLat(defaultPosition, geolocation.getProjection())
    );
    geolocation.on("change:position", 
        ev => myPosition.setCoordinates(ev.target.getPosition())
    );
    const feature = new Feature({
        geometry: myPosition
    });
    return new VectorLayer({
        source: new VectorSource({
            features: [feature]
        }),
        zIndex: 1,
    })
}

function createTrackLayer(geolocation) {
    const track = new LineString([]);
    geolocation.on("change:position", 
        _ => {
            track.appendCoordinate(geolocation.getPosition())
        }
    );
    return new VectorLayer({
        source: new VectorSource({
            features: [new Feature({geometry: track})]
        }),
        zIndex: 1
    });

}

const map = new Map({
    target: 'map',
    layers: [
        createTrackLayer(geolocation),
        createCurrentPositionLayer(geolocation),
    ],
    view: theView,
});
getKartverketLayer().then(layer => map.addLayer(layer));
