import { globalActivityLogs } from '../pages/auth/components/firebase/firebase';
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// Description for the charts
export const description = "Radar charts, area charts, and bar charts for desktop and mobile data";

// Chart configuration for both data series
const chartConfig = {
  desktop: {
    label: "Modules",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Levels",
    color: "hsl(var(--chart-2))",
  }
} satisfies ChartConfig;

// Define the types for the activity log entry
interface ActivityLog {
  modulesCompleted: number;
  levelsCompleted: number;
  overallScore: number;
  activityDate: Date;
}

// Define the type for the chart data
interface ChartData {
  month: string;
  desktop: number;
}
// Define the type for the chart data
interface ChartDataMultiple {
  month: string;
  desktop: number;
  mobile:number,
}

// chart only for modules completed
const transformActivityLogsModules = (globalActivityLogs: ActivityLog[]): ChartData[] => {
  return globalActivityLogs.map(log => {
      const activityDate = new Date(log.activityDate);
      const month = activityDate.toLocaleString('default', { month: 'long' });
      const day = activityDate.getDate();
      const formattedDate = `${day} ${month.substring(0, 3)}`; // Format: "20 Sep"

      return {
          month: formattedDate,
          desktop: log.modulesCompleted,
      };
  });
};
// chart only for modules completed
const transformActivityLogsLevels = (globalActivityLogs: ActivityLog[]): ChartData[] => {
  return globalActivityLogs.map(log => {
      const activityDate = new Date(log.activityDate);
      const month = activityDate.toLocaleString('default', { month: 'long' });
      const day = activityDate.getDate();
      const formattedDate = `${day} ${month.substring(0, 3)}`; // Format: "20 Sep"

      return {
          month: formattedDate,
          desktop: log.levelsCompleted,
      };
  });
};
// chart only for overallScore
const transformActivityLogsOverallScore = (globalActivityLogs: ActivityLog[]): ChartData[] => {
  return globalActivityLogs.map(log => {
      const activityDate = new Date(log.activityDate);
      const month = activityDate.toLocaleString('default', { month: 'long' });
      const day = activityDate.getDate();
      const formattedDate = `${day} ${month.substring(0, 3)}`; // Format: "20 Sep"

      return {
          month: formattedDate,
          desktop: log.overallScore,
      };
  });
};
// chart only for modules completed
const transformActivityLogsBothLevelsModules = (globalActivityLogs: ActivityLog[]): ChartDataMultiple[] => {
  return globalActivityLogs.map(log => {
      const activityDate = new Date(log.activityDate);
      const month = activityDate.toLocaleString('default', { month: 'long' });
      const day = activityDate.getDate();
      const formattedDate = `${day} ${month.substring(0, 3)}`; // Format: "20 Sep"

      return {
          month: formattedDate,
          desktop: log.levelsCompleted,
          mobile: log.modulesCompleted,
      };
  });
};

//sample chart data for level
const chartDataModules = transformActivityLogsModules(globalActivityLogs);

//sample chart data for level
const chartDataLevels = transformActivityLogsLevels(globalActivityLogs);

// Sample chart data for both levels and modules
const chartDataModulesLevels = transformActivityLogsBothLevelsModules(globalActivityLogs);

//sample chart for overall score
const chartDataOverallScore = transformActivityLogsOverallScore(globalActivityLogs);

// Function for the radar chart of modules completed
export function ChartRadarGridCircleLeft() {
  // const chartdata = [
  //   { month: "January", desktop: 186 },
  //   { month: "February", desktop: 305 },
  //   { month: "March", desktop: 237 },
  //   { month: "April", desktop: 273 },
  //   { month: "May", desktop: 209 },
  //   { month: "June", desktop: 214 },
  //   { month: "july", desktop: 300 },
  //   { month: "august", desktop: 50 },
  // ];
  console.log("from multiple chart", chartDataModules)
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Total Modules Completed</CardTitle>
        <CardDescription>
        Summary of modules completed recently.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[330px]"
        >
          <RadarChart data={chartDataModules}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Tracking progress in module completion <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Last 10 Days.
        </div>
      </CardFooter>
    </Card>
  );
}
// Function for the radar chart of levels completed
export function ChartRadarGridCircleRight() {
  // const chartDataSingle = [
  //   { month: "January", desktop: 186 },
  //   { month: "February", desktop: 305 },
  //   { month: "March", desktop: 237 },
  //   { month: "April", desktop: 273 },
  //   { month: "May", desktop: 209 },
  //   { month: "June", desktop: 214 },
  // ];

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Total Levels Completed</CardTitle>
        <CardDescription>
        Summary of levels completed recently.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[330px]"
        >
          <RadarChart data={chartDataLevels}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="month" />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Tracking progress in Level completion <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Last 10 Days.
        </div>
      </CardFooter>
    </Card>
  );
}

// New function for the radar chart with a legend
export function ChartRadarMultipleGridCircle() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Modules and Levels Completed</CardTitle>
        <CardDescription>
        Combined modules and levels completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[330px]"
        >
          <RadarChart
            data={chartDataModulesLevels}
            margin={{
              top: -40,
              bottom: -10,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
            />
            <Radar dataKey="mobile" fill="var(--color-mobile)" />
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-4 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
        Insights on recent module and level.<TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          Last 10 Days.
        </div>
      </CardFooter>
    </Card>
  );
}

// Function for the area chart with gradient fill
export function AreaChartGradient() {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Combined Proficiency Analysis</CardTitle>
        <CardDescription>
        Synergistic insights on module and level achievements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartDataModulesLevels}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
            Summary of concurrent module and level completions. <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              of last 10 Days.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// Function for the horizontal bar chart
export function HorizontalBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Performance Score</CardTitle>
        <CardDescription>Summary of overall scores recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataOverallScore}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
        Overall Performance Score <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
        Cumulative score from the last 6 months.
        </div>
      </CardFooter>
    </Card>
  );
}

// Function for Coming soon
export function ComingSoon() {
    return (
      <Card>
        <CardHeader>
            <br/>
          <CardTitle>More chart coming soon!</CardTitle>
          <CardDescription>Till then keep learning.</CardDescription>
            <br/>
        </CardHeader>
      </Card>
    );
  }
