'use client'

import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { DataOverviewChart } from '@/app/elements/DataOverview';
import { Loader2 } from 'lucide-react';



export default function DataPage() {
  const params = useParams();
  const { name } = params;  // dynamic param from URL
  console.log(name, typeof name);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState({});
  const [chartDataMap, setChartDataMap] = useState({});
  const [dataCache, setDataCache] = useState({});




  const data = {
    "electricity-production": {
      title: "Electricity Production",
      image: "/elec-prod.webp",
      description: "Electricity production in Finland based on Fingrid's operation control system.",
      datacode: {
        "Realtime Data": 192,
        "Forecast Data": 241,
        "aFRR Energy": 318,
        "Selling Data": 352,
      },
      page: "electricity-production"
    },
    "wind-power-production": {
      title: "Wind Power Production",
      image: "/wind-bg.jpg",
      description: "Wind power production based on the real-time measurements in Fingrid's operation control system.",
      datacode: {
        "Realtime Data": 181,
        "Forecast Data": 268,

      },
      page: "wind-power-production"
    },
    "electricity-consumption": {
      title: "Electricity Consumption",
      image: "/elec-consum.jpg",
      description: "Latest electricity consumption data and the number of users in Finland, based on daily data from energy companies.",
      datacode: {
        "Realtime Data": 193,
        "Forecast Data": 166,
      },
      page: "electricity-consumption"
    },
  }

  const [selectedTab, setSelectedTab] = useState("Realtime Data");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const current = data[name];

        if (!current) return;
        const endpoint =
          typeof current.datacode === "object"
            ? current.datacode[selectedTab]
            : current.datacode;

        if (!endpoint) return;

        if (dataCache[endpoint]) {
          console.log("Using cached data for:", endpoint);
          return;
        }

        setLoading(true);
        
        const res = await axios.get(`/api/fingrid?endpoint=${endpoint}`);
        setLoading(false);
        const entries = res.data.data;
        console.log(entries)
        const transformed = entries.map((entry) => ({
          time: format(parseISO(entry.startTime), "HH:mm"),
          value: parseFloat(entry.value),
          timestamp: parseISO(entry.startTime).getTime(),
        }));

        transformed.sort((a, b) => a.timestamp - b.timestamp);

        const midpoint = transformed.length - 5;
        const prev5 = transformed.slice(midpoint - 5, midpoint);
        const last5 = transformed.slice(midpoint);

        const sum = (arr) => arr.reduce((acc, item) => acc + item.value, 0);
        const prevSum = sum(prev5);
        const lastSum = sum(last5);

        const percentChange = ((lastSum - prevSum) / prevSum) * 100;

        setTrendData(prev => ({
          ...prev,
          [selectedTab]: {
            percent: Math.abs(percentChange.toFixed(1)),
            direction: percentChange >= 0 ? "up" : "down",
          },
        }));

        setChartDataMap(prev => ({
          ...prev,
          [selectedTab]: transformed.map(({ time, value }) => ({
            time,
            Value: value,
          })),
        }));

        setDataCache((prev) => ({ ...prev, [endpoint]: res.data }));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, selectedTab]);

  return (
    <div>
      {data[name] && (
        <div className="flex flex-col lg:flex-row h-full min-h-screen w-full">

          <div style={{ backgroundImage: `url(${data[name].image})` }} className={`h-screen bg-no-repeat bg-cover bg-center  w-[60%]`}>

          </div>
          <div className="w-[40%] h-screen  ">

            <Tabs defaultValue="Realtime Data" className="w-full p-2">
              <h1 className="text-5xl font-semibold my-4">{data[name].title}</h1>
              <TabsList className="w-full">
                <TabsTrigger value="Realtime Data" onClick={() => setSelectedTab("Realtime Data")}>{"Realtime Data"}</TabsTrigger>
                <TabsTrigger value="Forecast Data" onClick={() => setSelectedTab("Forecast Data")}>{"Forecast Data"}</TabsTrigger>
                {
                  name === "electricity-production" && (
                    <>
                      <TabsTrigger value="aFRR Energy" onClick={() => setSelectedTab("aFRR Energy")}>{"aFRR Energy Price "}</TabsTrigger>
                      <TabsTrigger value="Selling Data" onClick={() => setSelectedTab("Selling Data")}>{"Selling Data Price "}</TabsTrigger>
                    </>
                  )
                }
              </TabsList>
              <TabsContent value="Realtime Data">
                {loading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataOverviewChart
                    chartData={chartDataMap["Realtime Data"] || []}
                    trend={trendData["Realtime Data"]}
                    title={data[name].title}
                    description={data[name].description}
                    endpoint={data[name].datacode["Realtime Data"]}
                    page={data[name].page}
                  />
                )}
              </TabsContent>
              <TabsContent value="Forecast Data">
                {loading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataOverviewChart
                    chartData={chartDataMap["Forecast Data"] || []}
                    trend={trendData["Forecast Data"]}
                    title={data[name].title}
                    description={data[name].title + " Forecast Data for the next 24 hours"}
                    endpoint={data[name].datacode["Forecast Data"]}
                    page={data[name].page}
                  />
                )}
              </TabsContent>
              <TabsContent value="aFRR Energy">
                {loading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataOverviewChart
                    chartData={chartDataMap["aFRR Energy"] || []}
                    trend={trendData["aFRR Energy"]}
                    title={" aFRR Energy (Euro/MW,h)"}
                    description={" aFRR energy cross border marginal price (CBMP), downwards direction. Calculated by PICASSO platform for bidding zone FI. The price is average price for each minute."}
                    endpoint={data[name].datacode["aFRR Energy"]}
                    page={data[name].page}
                  />
                )}
              </TabsContent>
              <TabsContent value="Selling Data">
                {loading ? (
                  <div className="flex items-center justify-center h-full w-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataOverviewChart
                    chartData={chartDataMap["Selling Data"] || []}
                    trend={trendData["Selling Data"]}
                    title={data[name].title}
                    description={data[name].title + " Selling price"}
                    endpoint={data[name].datacode["Selling Data"]}
                    page={data[name].page}
                  />
                )}
              </TabsContent>
            </Tabs>


          </div>
        </div>
      )}
    </div>
  );
}