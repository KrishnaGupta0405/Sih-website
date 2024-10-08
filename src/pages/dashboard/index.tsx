import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { RecentSales } from './components/recent-sales'
import { Overview } from './components/overview'
// import { AreaChartGradient, ChartRadarGridCircleLeft, ChartRadarGridCircleRight, ChartRadarMultipleGridCircle, ComingSoon, HorizontalBarChart } from '@/components/chart-radar-grid-circle'
import { ChartRadarGridCircleLeft } from '@/components/chart-radar-grid-circle'
import { calculateOverallLevelsCompleted, calculateOverallModulesCompleted, calculateOverallScore, getUserData } from '../auth/components/firebase/firebase'
import { useState, useEffect } from 'react'
import { auth } from '../auth/components/firebase/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth state listener

export default function Dashboard() {

  const [overallScore, setOverallScore] =  useState<number | null>(null);
  const [moduleScore, setModuleScore] =  useState<number | null>(null);
  const [levelScore, setLevelScore] =  useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState(false); // To track if user is authenticated
  const [loading, setLoading] = useState(true);

  // Define the structure of an Activity Log 
  interface ActivityLog {
    modulesCompleted: number;
    levelsCompleted: number;
    overallScore: number;
    activityDate: Date; // Use 'Date' for proper date handling
  }

  // Global variable to store activity logs
  let globalActivityLogs: ActivityLog[] = [];

  // Use state to manage activity logs locally
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        fetchData();
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      let total = await calculateOverallModulesCompleted();
      setModuleScore(total);

      total = await calculateOverallLevelsCompleted();
      setLevelScore(total);

      total = await calculateOverallScore();
      setOverallScore(total);

      const { activityLogs } = await getUserData(); // Await the async call
      globalActivityLogs = activityLogs; // Update global variable
      setActivityLogs(activityLogs); // Update local state if needed for rendering

      // console.log("useEffect of index.tsx", activityLogs);

    } catch (error) {
      console.error('Error fetching user data for chart:', error);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return <p style={{margin : "0px 15px"}}>Fetching ...</p>;
  // }

  if (!authenticated) {
    return <p>User is not authenticated. Please log in.</p>; // Optional, you could redirect to login if needed
  }

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          {/* <Search /> */}
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs orientation='vertical' defaultValue='analytics' className='space-y-4'>
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Cumulative Score</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>🏆{overallScore}</div>
                  <p className='text-xs text-muted-foreground'>Overall performance across all levels and modules.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Completed Modules</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>📚{moduleScore}</div>
                  <p className='text-xs text-muted-foreground'>Modules finished this month.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Levels Achieved</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>🎯{levelScore}</div>
                  <p className='text-xs text-muted-foreground'>Levels unlocked through your progress.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Challenges Conquered</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>⚔️Coming soon ...</div>
                  <p className='text-xs text-muted-foreground'>Milestones successfully achieved.</p>
                </CardContent>
              </Card>
            </div>

            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='pl-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Top Players Leaderboard</CardTitle>
                  <CardDescription>Recognizing the top five players with outstanding scores!</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              
              <ChartRadarGridCircleLeft globalActivityLogs={activityLogs}/>
              {/* <ChartRadarMultipleGridCircle/> */}
              {/* <ChartRadarGridCircleRight /> */}
            </div>

            {/* <div className='grid grid-cols-1 gap-4 lg:grid-cols-8'>
              <div className='col-span-1 lg:col-span-5'>
                <AreaChartGradient />
              </div>
              <div className="col-span-1 lg:col-span-3 grid grid-rows-3 gap-5">
                <div className='row-span-2'>
                  <HorizontalBarChart />
                </div>
                <div className='row-span-1'>
                  <ComingSoon />
                </div>
              </div>
            </div> */}

          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
  { title: 'Overview', href: 'dashboard/overview', isActive: true },
  { title: 'News', href: 'dashboard/products', isActive: false },
  { title: 'Learn', href: '/users', isActive: false },
  { title: 'Settings', href: '/settings', isActive: false },
]
