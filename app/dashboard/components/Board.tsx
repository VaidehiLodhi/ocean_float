"use client";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { className } from "cesium";
import { useState } from "react";

interface BoardProps {
  onPositionChange: (pos: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
}

export const Board = ({ onPositionChange, initialPosition }: BoardProps) => {
  // store input as strings
  const [lat, setLat] = useState(initialPosition?.lat.toString() || "");
  const [lng, setLng] = useState(initialPosition?.lng.toString() || "");
  const [pressure, setPressure] = useState<number[]>([0])
  const [chloro, setChloro] = useState<number[]>([0]);
  const [flourine, setFlourine] = useState<number[]>([0]);

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLat(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) onPositionChange({ lat: parsed, lng: parseFloat(lng) || 0 });
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLng(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) onPositionChange({ lat: parseFloat(lat) || 0, lng: parsed });
  };

  const handlePressure = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if(!isNaN(newValue)) {
        setPressure([newValue])
    }  
  }

    const handleChloro = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
        setPressure([newValue]);
        }
    };

    const handleFlourine = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      if (!isNaN(newValue)) {
        setPressure([newValue]);
      }
    };

  return (
    <div className="max-w-2xl flex flex-col items-start justify-center p-4 m-2">
      <label htmlFor="latitude" className="block text-sm font-bold mb-1 mr-4">
        01 Latitude
      </label>
      <Input
        type="text"
        id="latitude"
        name="latitude"
        onChange={handleLatChange}
        placeholder="Enter latitude"
        value={lat}
        className="w-xs border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
      />

      <label htmlFor="longitude" className="block text-sm font-bold mb-1 mr-4">
        02 Longitude
      </label>
      <Input
        type="text"
        id="longitude"
        name="longitude"
        onChange={handleLngChange}
        placeholder="Enter longitude"
        value={lng}
        className="w-xs border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
      />

      {/*pressure*/}
      <label htmlFor="pressure" className="block text-sm font-bold mb-1">
        03 Pressure
      </label>
      <div className="flex items-center justify-start w-full h-full">
        <Slider
          defaultValue={[0]}
          min={0}
          max={2000}
          step={0.1}
          className={cn("w-[50%] mr-4", className)}
          onValueChange={(newPressure) => setPressure(newPressure)}
        />
        <Input
          type="number"
          id="pressure"
          name="pressure"
          onChange={handlePressure}
          value={pressure[0]}
          className="w-20 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
        />
      </div>

      {/*cholorophyll*/}
      <label htmlFor="chloro" className="block text-sm font-bold mb-1">
        04 Chlorophyll
      </label>
      <div className="flex items-center justify-start w-full h-full">
        <Slider
          defaultValue={[0]}
          min={0}
          max={2000}
          step={0.1}
          className={cn("w-[50%] mr-4", className)}
          onValueChange={(newChloro) => setChloro(newChloro)}
        />
        <Input
          type="number"
          id="chloro"
          name="chloro"
          onChange={handleChloro}
          value={chloro[0]}
          className="w-20 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
        />
      </div>

      {/*flourine*/}
      <label htmlFor="flourine" className="block text-sm font-bold mb-1">
        05 Flourine
      </label>
      <div className="flex items-center justify-start w-full h-full">
        <Slider
          defaultValue={[0]}
          min={0}
          max={2000}
          step={0.1}
          className={cn("w-[50%] mr-4", className)}
          onValueChange={(newFlourine) => setFlourine(newFlourine)}
        />
        <Input
          type="number"
          id="flourine"
          name="flourine"
          onChange={handleFlourine}
          value={flourine[0]}
          className="w-20 border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-offset-blue-950"
        />
      </div>
    </div>
  );
};
