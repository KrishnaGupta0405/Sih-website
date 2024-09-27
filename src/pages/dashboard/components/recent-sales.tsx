import { useEffect, useState } from 'react';
import { fetchTopPlayers } from '../../auth/components/firebase/firebase'; // Ensure the correct path to firebaseconfig
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Define the type for leaderboard entries
interface LeaderboardEntry {
  displayName: string;
  overallScore: number;
  email?: string;
}

export function RecentSales() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data with real-time updates
  useEffect(() => {
    setLoading(true);
    
    // Set up the real-time listener for leaderboard changes
    const unsubscribe = fetchTopPlayers((players) => {
      setLeaderboard(players);
      setLoading(false);
    }) || (() => {}); // Default to a no-op function if undefined

    // Unsubscribe from the listener when component unmounts
    return () => unsubscribe();

  }, []);

  if (loading) {
    return <p>Fetching...</p>; // Show a loading state while fetching data
  }

  return (
    <div className='space-y-8'>
      {leaderboard.map((player, index) => (
        <div key={index} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt={player.displayName} />
            <AvatarFallback>{index + 1}</AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{player.displayName}</p>
            <p className='text-sm text-muted-foreground'>{player.email || 'N/A'}</p>
          </div>
          <div className='ml-auto font-medium'>↑ {player.overallScore} score</div>
        </div>
      ))}
    </div>
  );
}
