import { Feature, Geolocation } from "ol";
import { Circle, Fill, Stroke, Style } from "ol/style";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import Map from "ol/Map";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import React, { useEffect, useState } from "react";
import { Heatmap as HeatmapLayer } from "ol/layer";
import "ol/ol.css";

export default function OlMapSample() {
  useEffect(() => {
    function init() {
      let initView = new View({
        center: [36, 127],
        zoom: 5,
      });

      var positionFeature = new Feature();
      let pfStyle = new Style({
        image: new Circle({
          radius: 3,
          fill: new Fill({
            color: "#3399CC",
          }),
          stroke: new Stroke({
            color: "#fff",
            width: 1,
          }),
        }),
      });
      positionFeature.setStyle(pfStyle);

      let geolocation = new Geolocation({
        trackingOptions: {
          enableHighAccuracy: false,
        },
        projection: initView.getProjection(),
      });

      let tempVectorSource = new VectorSource({
        features: [positionFeature],
      });

      let tempVectorLayer = new VectorLayer({
        source: tempVectorSource,
      });

      var heatMapVectorLayer = new HeatmapLayer({
        source: tempVectorSource,
        blur: parseInt(5, 10),
        radius: parseInt(15, 10),
        weight: function(feature) {
          return 0.1;
        }
      });

      let map = new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          
          heatMapVectorLayer,
          tempVectorLayer,
        ],
        view: initView,
      });

      geolocation.on("change:position", function () {
        var coordinates = geolocation.getPosition();
        if (coordinates) {
          let _pf = new Feature();
          _pf.setStyle(pfStyle);
          _pf.setGeometry(coordinates ? new Point(coordinates) : null);
          initView.setCenter(coordinates);

          tempVectorSource.addFeature(_pf);
        }
      });
      geolocation.setTracking(true);
    }

    init();
  }, []);

  return (
    <div
      id="map"
      style={{ width: window.innerWidth, height: window.innerHeight }}
    ></div>
  );
}
