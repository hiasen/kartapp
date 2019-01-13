import TileLayer from 'ol/layer/Tile';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';

export async function getKartverketLayer() {
    const parser = new WMTSCapabilities();
    const kartverketUrl = "https://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?Version=1.0.0&service=wmts&request=getcapabilities";
    const response = await fetch(kartverketUrl);
    const text = await response.text();
    const result = parser.read(text);
    const options = optionsFromCapabilities(result, {
        layer: "topo4",
        matrixSet: "EPSG:3857",
    });
    const wmts = new WMTS(options);
    return new TileLayer({
        source: wmts
    });
}