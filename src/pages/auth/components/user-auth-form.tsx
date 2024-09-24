import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandGithub } from '@tabler/icons-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, provider } from './firebase/firebase.tsx'

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
  setError: (error: { message: string, variant: 'default' | 'destructive' }) => void;
}

export function UserAuthForm({ className, setError, ...props }: UserAuthFormProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // const handleSignIn = async (email: string, password: string) => {
  //   setIsLoading(true);
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, email, password);
  //     const user = userCredential.user;
  
  //     // Check if the email is verified
  //     if (user.emailVerified) {
  //       setError({ message: 'Sign-in successful', variant: 'default' });
  //       navigate('/dashboard');
  //     } else {
  //       // If the email is not verified, sign the user out and show an error message
  //       await signOut(auth);
  //       setError({ message: 'Please verify your email before signing in.', variant: 'destructive' });
  //     }
  //   } catch (err: any) {
  //     // Firebase error code handling
  //     if (err.code === 'auth/wrong-password') {
  //       setError({ message: 'Incorrect password. Please try again.', variant: 'destructive' });
  //     } else if (err.code === 'auth/user-not-found') {
  //       setError({ message: 'No account found with this email.', variant: 'destructive' });
  //     } else if (err.code === 'auth/invalid-email') {
  //       setError({ message: 'Invalid email address. Please check and try again.', variant: 'destructive' });
  //     } else {
  //       setError({ message: (err as Error).message, variant: 'destructive' });
  //     }
  //     console.log(err); // Log the error for debugging
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true); // Start loading state
    try {
      // Attempt to sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user.emailVerified) {
        console.log('Sign-in successful', user);
        navigate('/dashboard'); 
      } else {
        setError({ message: 'Please verify your email before signing in.', variant: 'destructive' });
        console.log('Email not verified');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError({ message: 'Incorrect credentials', variant: 'destructive' });
      } else {
        setError({ message: (err as Error).message, variant: 'destructive' });
      }
      console.log('Error signing in:', err); // Log the error for debugging
    } finally {
      setIsLoading(false); // End loading state
      
      // Clear the error after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000); // 3000 milliseconds = 3 seconds
    }
  };
  
  
  
  

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError({ message: 'Error signing in with Google.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    handleSignIn(data.email, data.password);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Sign In
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                onClick={handleGoogleSignIn}
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                Google
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
