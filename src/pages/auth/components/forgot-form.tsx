import { HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail } from 'firebase/auth'; // Import Firebase's function
import { auth } from './firebase/firebase'; // Import your Firebase auth instance

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
});

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // To display success messages
  const [error, setError] = useState(''); // To display error messages

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessage(''); // Reset message before submission
    setError('');   // Reset error before submission
    try {
      await sendPasswordResetEmail(auth, data.email); // Call Firebase to send the password reset email
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading} disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Continue'}
            </Button>

            {/* Display success or error message */}
            {message && <p className="mt-2 text-green-600">{message}</p>}
            {error && <p className="mt-2 text-red-600">{error}</p>}
          </div>
        </form>
      </Form>
    </div>
  );
}
