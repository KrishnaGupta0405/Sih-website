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
import { handleSignIn, handleGoogleSignIn } from './firebase/firebase.tsx';

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

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await handleSignIn(email, password);

      if (result?.error) {
        setError({ message: result.error, variant: 'destructive' });
      } else {
        navigate("/"); // Navigate to home page or dashboard on success
      }
    } catch (err: any) {
      setError({ message: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError(null);
      }, 3000); // Clear error after 3 seconds
    }
  };

const signInWithGoogle = async () => {
  setIsLoading(true);
  try {
    const result = await handleGoogleSignIn();
    if (result.error) {
      setError({ message: result.error, variant: 'destructive' });
    } else if (result.newUser) {
      console.log("This is a new user!");
      navigate('/'); // Navigate to the home page or dashboard
    } else {
      console.log("This user already exists.");
      navigate('/'); // Navigate to the home page or dashboard
    }
  } catch (error: any) {
    setError({ message: error.message, variant: 'destructive' });
    console.error("Unexpected error during Google sign-in:", error);
  } finally {
    setIsLoading(false);
  }
};


  function onSubmit(data: z.infer<typeof formSchema>) {
    // setIsLoading(true);
    signIn(data.email, data.password);
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
                onClick={signInWithGoogle}
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<IconBrandGithub className='h-4 w-4' />}
              >
                Google
              </Button>
            </div>
            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  New to DopeScape ? {' '}
                  <Link to='/sign-up' className='underline underline-offset-4 hover:text-primary' > &nbsp;Sign Up </Link>
                </span>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
