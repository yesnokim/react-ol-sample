import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import React, { useEffect, useState } from "react";

export default function OlMapSample() {
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState([0, 0]);

  const [map, setMap] = useState(
    new Map({
      target: null,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: center,
        zoom: zoom,
      }),
    })
  );

  useEffect(() => {
    updateMap();
  }, [zoom, center]);

  useEffect(() => {
    console.log(map);
    map.setTarget("map");
    map.on("moveend", onMoveend);
    return () => {
      setMap(null);
    };
  }, []);

  let onMoveend = () => {
    console.log("onMoveend");
    setCenter(map.getView().getCenter());
    setZoom(map.getView().getZoom());
  };

  let updateMap = () => {
    console.log("updateMap()", center, zoom);
    map.getView().setCenter(center);
    map.getView().setZoom(zoom);
  };

  return (
    <React.Fragment>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      <span>OpenLayer map sample</span>
    </React.Fragment>
  );
}
