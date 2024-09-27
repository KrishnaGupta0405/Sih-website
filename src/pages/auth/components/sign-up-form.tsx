import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import { cn } from '@/lib/utils';
import { IconBrandGithub } from '@tabler/icons-react';
import { handleSignUp, handleGoogleSignUp } from './firebase/firebase.tsx';

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
  setError: (error: { title: string; message: string; variant: 'default' | 'destructive' } | null) => void; // Updated type here
  startProgress: () => void;
}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit' })
    .regex(/[\W_]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
});

export function SignUpForm({ className, setError, startProgress, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit, control } = form;

  const signUpWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await handleGoogleSignUp();
      if (result.error) {
        setError({
          title: 'Error',
          message: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } else if (result.newUser) {
        console.log("This is a new user!");
        navigate('/'); // Navigate to the home page or dashboard
      } else {
        console.log("This user already exists.");
        navigate('/'); // Navigate to the home page or dashboard
      }
    } catch (error: any) {
      setError({
        title: 'Error',
        message: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      console.error("Unexpected error during Google sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: any) => {
    setIsLoading(true); // Start loading state
    try {
      const result = await handleSignUp(data.email, data.password); // Await the signup function

      if (result.success) {
        // Trigger success message and start progress bar
        await startProgress(); // Make sure this is defined elsewhere in your code
        setError({
          title: 'Success',
          message: result.success, // Use the success message from the result
          variant: 'default',
        });
        setTimeout(() => navigate('/sign-in'), 1500); // Navigate after a delay
      } else if (result.error) {
        // Handle error case
        setError({
          title: 'Error',
          message: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      // Handle unexpected errors
      setError({
        title: 'Error',
        message: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setError(null); // Clear any previous error
    signUp(data);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            {/* Email Field */}
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button className='mt-2' loading={isLoading} disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Google Sign In */}
            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>Or continue with</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                onClick={signUpWithGoogle}
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
  );
}
