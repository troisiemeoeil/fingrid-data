import { parseISO, format } from "date-fns"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useEffect, useState } from "react";

import { Activity, Loader2, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button";
export function DataOverview({ children, title, open, setOpen, top, left, description, endpoint, page }) {
  const handleClose = () => {
    setOpen(false);
  };

  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [dataCache, setDataCache] = useState({});
  const [trend, setTrend] = useState(null);


  useEffect(() => {
    if (!open || !endpoint || dataCache[endpoint]) return;

    axios
      .get(`/api/fingrid?endpoint=${endpoint}`)
      .then((res) => {
        const entries = res.data.data;

        const transformed = entries.map(entry => ({
          time: format(parseISO(entry.startTime), 'HH:mm'),
          value: parseFloat(entry.value),
          timestamp: parseISO(entry.startTime).getTime()
        }));


        transformed.sort((a, b) => a.timestamp - b.timestamp);
        const midpoint = transformed.length - 5;
        const prev5 = transformed.slice(midpoint - 5, midpoint);
        const last5 = transformed.slice(midpoint);
        const sum = arr => arr.reduce((acc, item) => acc + item.value, 0);
        const prevSum = sum(prev5);
        const lastSum = sum(last5);

        const percentChange = ((lastSum - prevSum) / prevSum) * 100;

        setTrend({
          percent: Math.abs(percentChange.toFixed(1)),
          direction: percentChange >= 0 ? "up" : "down"
        });

        setChartData(transformed.map(({ time, value }) => ({ time, Value: value })));
        setDataCache(prev => ({ ...prev, [endpoint]: res.data }));

      })
      .catch(err => console.error('Error:', err));
  }, [open, endpoint]);




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] absolute top-[40%] left-[80%] transform -translate-x-1/2 -translate-y-1/2">
   <DialogHeader>
          <DialogTitle hidden>{title}</DialogTitle>
          <DialogDescription hidden className="text-sm ">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {chartData.length > 0 ? (
     <DataOverviewChart chartData={chartData} trend={trend} title={title} description={description} />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" className="cursor-pointer" onClick={handleClose}>Close</Button>
          <Button variant="default" className="cursor-pointer" onClick={() => window.location.href = `/data/${page}`}>View details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




export function DataOverviewChart({ chartData, trend, title, description }) {
  const chartConfig = {
    Value: {
      label: "Value ",
      color: "hsl(var(--chart-2))",
      icon: Activity,
    },
  }
  return (
    <Card >
      <CardHeader>
        <CardTitle> {title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={true}
              axisLine={true}
              tickMargin={12}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="Value"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        {trend && (
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending {trend.direction} by {trend.percent}% in the last 5 hours
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
} 



