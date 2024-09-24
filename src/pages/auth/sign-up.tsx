import { Card } from '@/components/ui/card';
import { SignUpForm } from './components/sign-up-form';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import LoadingBar from 'react-top-loading-bar';

export default function SignUp() {
  const [error, setError] = useState<{ title: string; message: string; variant: 'default' | 'destructive' } | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startProgress = (): Promise<void> => {
    return new Promise((resolve) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
  
      let currentProgress = 0;
      const increment = 100 / (4 * 10); // for 4 seconds
  
      intervalRef.current = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(intervalRef.current!);
          resolve();
        }
        setProgress(currentProgress);
      }, 100);
    });
  };
  
  return (
    <>
      <LoadingBar
        color='#0000ff'
        shadow={true} // Change this to a boolean
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        {/* Display the alert if there's an error */}
        {error && (
          <Alert variant={error.variant || "destructive"}>
            <AlertTitle>{error.title}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            <h1 className='text-xl font-medium'>DopeScape Register</h1>
          </div>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-lg font-semibold tracking-tight'>
                Create an account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email and password to create an account. <br />
                Already have an account?{' '}
                <Link
                  to='/sign-in'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Sign In
                </Link>
              </p>
            </div>
            <SignUpForm setError={setError} startProgress={startProgress} />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
              By creating an account, you agree to our{' '}
              <a
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                Privacy Policy
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
