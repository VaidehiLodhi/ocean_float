"use client";

import { useState } from "react";
import CesiumWrapper from "./components/CesiumWrapper";
import { Board } from "./components/Board";
import Header from "./components/Header";

export default function DashboardHome() {
  const [position, setPosition] = useState({ lat: 0, lng: 0 });

  return (
    <div
      style={{ backgroundColor: "#393939", color: "#EBEBEB" }}
      className="w-full min-h-screen flex"
    >
      {/* Left side - Header and Board */}
      <div className="max-w-2xl flex flex-col p-4">
        <Header />
        <Board onPositionChange={setPosition} initialPosition={position} />
      </div>

      {/* Right side - Globe */}
      <div className="w-1/2 h-screen flex items-center justify-center">
        <div className="w-full h-full">
          <CesiumWrapper positions={[position]} />
        </div>
      </div>
    </div>
  );
}
