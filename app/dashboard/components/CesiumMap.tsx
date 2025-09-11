"use client";

import React, { useCallback, useEffect } from "react";
import type { CesiumType } from "../types/cesium";
import { Cesium3DTileset, type Entity, type Viewer } from "cesium";
import type { Position } from "../types/position";
//NOTE: It is important to assign types using "import type", not "import"
import { dateToJulianDate } from "../example_utils/date";
//NOTE: This is required to get the stylings for default Cesium UI and controls
import "cesium/Build/Cesium/Widgets/widgets.css";

export const CesiumComponent: React.FunctionComponent<{
  CesiumJs: CesiumType;
  positions: Position[];}> = ({ CesiumJs, positions }) => {
  const cesiumViewer = React.useRef<Viewer | null>(null);
  const cesiumContainerRef = React.useRef<HTMLDivElement>(null);
  const addedScenePrimitives = React.useRef<Cesium3DTileset[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const initialLatitude = -10; // Center on Indian Ocean
  const initialLongitude = 80;

  // Set initial camera view over Earth
  const resetCamera = React.useCallback(
    (lat: number, lng: number) => {
      if (cesiumViewer.current !== null) {
        cesiumViewer.current.scene.camera.setView({
          destination: CesiumJs.Cartesian3.fromDegrees(lng, lat, 20000000), // 20,000 km altitude
          orientation: {
            heading: CesiumJs.Math.toRadians(0),
            pitch: CesiumJs.Math.toRadians(-30),
            roll: 0.0,
          },
        });
      }
    },
    [CesiumJs]
  );

  // Remove all primitives from the scene
  const cleanUpPrimitives = useCallback(() => {
    addedScenePrimitives.current.forEach((scenePrimitive) => {
      if (cesiumViewer.current !== null) {
        cesiumViewer.current.scene.primitives.remove(scenePrimitive);
      }
    });
    addedScenePrimitives.current = [];
  }, []);

  // Initialize Cesium with primitives and camera constraints
  const initializeCesiumJs = useCallback(async () => {
    if (cesiumViewer.current !== null) {
      const osmBuildingsTileset = await CesiumJs.createOsmBuildingsAsync();
      cleanUpPrimitives();
      const osmBuildingsTilesetPrimitive =
        cesiumViewer.current.scene.primitives.add(osmBuildingsTileset);
      addedScenePrimitives.current.push(osmBuildingsTilesetPrimitive);
      setIsLoaded(true);

      // ✅ Configure camera controller to restrict zooming and panning
      const controller = cesiumViewer.current.scene.screenSpaceCameraController;
      controller.minimumZoomDistance = 500000; // Can't zoom in closer than 500 km
      controller.maximumZoomDistance = 25000000; // Can't zoom out further than 25,000 km
      controller.enableTranslate = false; // Disable panning off the Earth
      controller.enableTilt = false; // Disable tilting below the surface
      controller.enableRotate = true; // Allow rotation
      controller.enableZoom = true; // Allow zooming within limits

      resetCamera(initialLatitude, initialLongitude);
    }
  }, [CesiumJs, cleanUpPrimitives]);

  // Initialize Cesium viewer once when the component mounts
  useEffect(() => {
    if (cesiumViewer.current === null && cesiumContainerRef.current) {
      CesiumJs.Ion.defaultAccessToken = `${process.env.NEXT_PUBLIC_CESIUM_TOKEN}`;
      cesiumViewer.current = new CesiumJs.Viewer(cesiumContainerRef.current, {
        terrain: CesiumJs.Terrain.fromWorldTerrain(),
      });
      cesiumViewer.current.clock.clockStep =
        CesiumJs.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
      initializeCesiumJs();
    }
  }, [CesiumJs, initializeCesiumJs]);

  // Update entities and camera whenever positions change
  useEffect(() => {
    if (!isLoaded || !cesiumViewer.current) return;

    // Remove all old entities
    cesiumViewer.current.entities.removeAll();

    // Add new entities based on positions with ocean-themed styling
    positions.forEach((p, index) => {
      // Create different colors for different ocean regions
      const colors = [
        CesiumJs.Color.CYAN,      // Indian Ocean - Arabian Sea
        CesiumJs.Color.LIGHTBLUE, // Indian Ocean - Bay of Bengal
        CesiumJs.Color.BLUE,      // Indian Ocean - Central/Southern
        CesiumJs.Color.DEEPSKYBLUE, // Pacific Ocean - Western
        CesiumJs.Color.STEELBLUE, // Pacific Ocean - Central
        CesiumJs.Color.ROYALBLUE, // Pacific Ocean - Eastern
        CesiumJs.Color.MIDNIGHTBLUE, // Pacific Ocean - Southern
        CesiumJs.Color.TEAL,      // Transition zones
      ];
      
      const colorIndex = Math.floor(index / 5) % colors.length;
      const color = colors[colorIndex];
      
      cesiumViewer.current?.entities.add({
        position: CesiumJs.Cartesian3.fromDegrees(p.lng, p.lat),
        point: {
          pixelSize: 12,
          color: color.withAlpha(0.8),
          outlineColor: CesiumJs.Color.WHITE,
          outlineWidth: 2,
          heightReference: CesiumJs.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: `P${index + 1}`,
          font: '12pt sans-serif',
          fillColor: CesiumJs.Color.WHITE,
          outlineColor: CesiumJs.Color.BLACK,
          outlineWidth: 2,
          style: CesiumJs.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new CesiumJs.Cartesian2(0, -30),
          heightReference: CesiumJs.HeightReference.CLAMP_TO_GROUND,
        },
        // Add a small circle on the ocean surface
        ellipse: {
          semiMinorAxis: 100000.0, // 100km radius
          semiMajorAxis: 100000.0,
          height: 0,
          material: color.withAlpha(0.3),
          outline: true,
          outlineColor: color.withAlpha(0.8),
          heightReference: CesiumJs.HeightReference.CLAMP_TO_GROUND,
        },
      });
    });

    // Set camera to show all ocean points with a good overview
    if (positions.length > 0) {
      // Calculate bounding box of all points
      const lats = positions.map(p => p.lat);
      const lngs = positions.map(p => p.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      // Center the view on the ocean points
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      
      resetCamera(centerLat, centerLng);
    }
  }, [positions, isLoaded, CesiumJs, resetCamera]);

  // Example function using CesiumJs
  const entities: Entity[] = [];
  const julianDate = dateToJulianDate(CesiumJs, new Date());

  return (
    <div
      ref={cesiumContainerRef}
      id="cesium-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default CesiumComponent;
