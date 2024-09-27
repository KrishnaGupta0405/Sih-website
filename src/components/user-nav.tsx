import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'

export function UserNav() {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings'); // Redirect to the settings page
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      // Remove idToken from localStorage
      localStorage.removeItem('idToken');
      // Redirect to login page or home page
      navigate('/intro');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

   // Retrieve user information from localStorage
   const userEmail = localStorage.getItem("userEmail") || ""; // Default to empty string if null
   const userDisplayName = localStorage.getItem("userDisplayName") || ""; // Default to empty string if null 

   function getInitials(displayName:String) {
    // Split the display name into words
    const nameParts = displayName.split(' ');
    
    // Get the first letter of the first and last name
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || ''; // Handle empty case
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0).toUpperCase() || ''; // Handle empty case
    
    return `${firstInitial}${lastInitial}`; // Combine initials
  }
  // Get the initials from the display name
  const initials = getInitials(localStorage.getItem("userDisplayName") || "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{userDisplayName}</p>
            <p className='text-xs leading-none text-muted-foreground'>{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
