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
  
  const initialLatitude = 0;
  const initialLongitude = 0;

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

    // Add new entities based on positions
    positions.forEach((p) => {
      cesiumViewer.current?.entities.add({
        position: CesiumJs.Cartesian3.fromDegrees(p.lng, p.lat),
        ellipse: {
          semiMinorAxis: 50000.0,
          semiMajorAxis: 50000.0,
          height: 0,
          material: CesiumJs.Color.RED.withAlpha(0.5),
          outline: true,
          outlineColor: CesiumJs.Color.BLACK,
        },
      });
    });

    // Move camera to first position if available
    if (positions.length > 0) {
      const { lat, lng } = positions[0];
      resetCamera(lat, lng);
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
