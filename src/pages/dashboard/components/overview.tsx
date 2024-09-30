import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getUserData, auth } from '../../auth/components/firebase/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; // Import Firebase auth state listener

// Define the type for the activity log entry
interface ActivityLogEntry {
  name: string;
  total: number;
}

export function Overview() {
  const [data, setData] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false); // To track if user is authenticated

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        fetchData(); // Call fetchData when the user is authenticated
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
  
      // Fetch user data including the last 10 activity logs
      const { activityLogs } = await getUserData();
       console.log("activitylog from overview barchart->", activityLogs)
      // Reverse the order of activityLogs to have the latest activity first
      const reversedLogs = activityLogs.reverse();
  
      // Set the activity logs to state with the full date in reverse order
      setData(
        reversedLogs.map((log: any) => ({
          name: new Date(log.activityDate).toLocaleDateString('en-US', {
            day: 'numeric',  // For the day (28)
            month: 'short',  // For the month abbreviation (Sep)
          }),
          total: log.overallScore, // Use overallScore for the chart
        }))
      );
  
      // console.log("this is reversed log-",reversedLogs);
      // console.log("this is activity data-", data);
    } catch (error) {
      console.error('Error fetching user data for chart:', error);
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return <p style={{margin : "0px 15px"}}>Fetching ...</p>;
  }

  if (!authenticated) {
    return <p>User is not authenticated. Please log in.</p>; // Optional, you could redirect to login if needed
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Bar
            dataKey="total"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
