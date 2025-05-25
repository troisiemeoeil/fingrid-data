"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataOverview } from "./elements/DataOverview";
import useDialogStore from "./utils/store";
import axios from "axios";

export default function Home() {
  const [zoomed, setZoomed] = useState(false);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0); 
  const [selectedCard, setSelectedCard] = useState(null); 
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showHotspots, setShowHotspots] = useState(true);

  const { open, setOpen } = useDialogStore();
  const [data, setData] = useState(null);

  function setLatLong(lat, long) {
    setShowHotspots(false); 
    setLat(lat);
    setLong(long);
    setZoomed(true); 
  }
  

  useEffect(() => {
    if (!open) {
      setShowHotspots(false);
      setZoomed(false);
      setSelectedCard(null); 
    }
  }, [open]);




  const overview = {
    "Electricity Production": {
      title: "Electricity Production",
      description: " Electricity production in Finland based on the real-time measurements in Fingrid's operation control system.",
      datacode: 192,
      page:"electricity-production"
    },
    "Wind Power Production": {
      title: "Wind Power Production",
      description: "Wind power production based on the real-time measurements in Fingrid's operation control system.",
      datacode: 181,
      page:"wind-power-production"
    },
    "Electricity Consumption": {
      title: "Electricity Consumption",
      description: "Latest electricity consumption data in Finland based on the real-time measurements from energy companies.",
      datacode: 193,
      page:"electricity-consumption"
    },
  }

  // Function to open the dialog and set the selected card
  const handleCardClick = (cardTitle) => {
    setSelectedCard(cardTitle); 
    setOpen(true); 
  };


  return (
    <div className="grid h-screen bg-white grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col w-full h-screen row-start-2 items-center sm:items-start">

        <div className="relative w-full h-full  ">
          <motion.div
            className="w-full h-full"
            animate={{ scale: zoomed ? 1.7 : 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformOrigin: `${lat}% ${long}%` }}
            onAnimationComplete={() => {
              if (!zoomed) {
                setShowHotspots(true); //
              }
            }}
          >
            <Image
              src="/grid.png"
              alt="Next.js logo"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, 1920px"
              srcSet="/grid.png 1920w, /grid@2x.png 3840w"
            />
          </motion.div>


          {/* Hotspot 1: Power Breakdown */}
          <DataOverview
            top={20}
            left={80}
            open={selectedTitle === "Electricity Production"}
            setOpen={(value) => {
              if (!value) {
                setSelectedTitle(null);
                setZoomed(false);
              } else {
                setSelectedTitle("Electricity Production");
              }
            }}
            title={overview["Electricity Production"]?.title}
            description={overview["Electricity Production"]?.description}
            endpoint={overview["Electricity Production"]?.datacode}
            page={overview["Electricity Production"]?.page}
            >
            <div
              className={`absolute top-[25%] left-[48.3%] transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer ${!showHotspots ? "hidden" : ""}`}
              onClick={() => {
                setLatLong(45, 20); // Set specific lat, long values
                handleCardClick("Electricity Production"); // Open the Power Production dialog
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </DataOverview>

          {/* Hotspot 2: Carbon Intensity */}
          <DataOverview
            top={20}
            left={60}
            open={selectedTitle === "Wind Power Production"}
            setOpen={(value) => {
              if (!value) {
                setSelectedTitle(null);
                setZoomed(false);
              } else {
                setSelectedTitle("Wind Power Production");
              }
            }}
            title={overview["Wind Power Production"]?.title}
            description={overview["Wind Power Production"]?.description}
            endpoint={overview["Wind Power Production"]?.datacode}
            page={overview["Wind Power Production"]?.page}
            >
            <div
              className={`absolute top-[13%] left-[21.5%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${!showHotspots ? "hidden" : ""}`}
              onClick={() => {
                setLatLong(10, 5); // Set lat, long for Carbon Intensity
                handleCardClick("Wind Power Production"); // Open the Carbon Intensity dialog
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </DataOverview>

          {/* Hotspot 3: Power Consumption */}
          <DataOverview
            top={20}
            left={48}
            open={selectedTitle === "Power Consumption"}
            setOpen={(value) => {
              if (!value) {
                setSelectedTitle(null);
                setZoomed(false);
              } else {
                setSelectedTitle("Power Consumption");
              }
            }}
            description={overview["Electricity Consumption"]?.description}
            title={overview["Electricity Consumption"]?.title} 
            endpoint={overview["Electricity Consumption"]?.datacode}
            page={overview["Electricity Consumption"]?.page}
            >
            
            <div
              className={`absolute top-[70%] left-[60%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${!showHotspots ? "hidden" : ""}`}
              onClick={() => {
                setLatLong(60, 90); // Set lat, long for Power Consumption
                handleCardClick("Power Consumption"); // Open the Power Consumption dialog
              }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute top-0 left-0 w-6 h-6 bg-red-600 rounded-full"></div>
            </div>
          </DataOverview>
        </div>
      </main>
    </div>
  );
}
