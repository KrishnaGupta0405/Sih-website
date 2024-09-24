import { BackgroundLines } from "./background-lines";
import ThemeSwitch from '@/components/theme-switch'
import { Button } from '@/components/custom/button'
import { Link } from "react-router-dom";

export default function BackgroundLinesDemo() {
  return (
    <>
      <div style={{ zIndex: 9999, background: 'black', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', padding: '10px',// Adds space from the top and right
      }}>
        <div style={{padding : "0px 10px"}}>
        <ThemeSwitch /> {/* Adds space between ThemeSwitch and Button */}
        </div>
        <Button><Link to="/sign-in">Sign In </Link></Button>
      </div>

    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 -mt-14 pb-20">
      <button className="font-extrabold inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      AI-Powered ✨
        </button>
      
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-l from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-5xl lg:text-9xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        DopeScape <br />  </h2>
        <span className="bg-clip-text text-transparent text-center bg-gradient-to-l from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-lg md:text-3xl lg:text-4xl font-sans -py-2 md:-py-10 relative z-20 font-bold tracking-tight"> Educate, Engage, Excel </span>
      <p className="max-w-7xl mx-auto text-sm my-2 md:my-10 md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
      
Explore interactive games, quizzes, and rewards that empower athletes to master Anti-Doping knowledge through engaging challenges and fun experiences. <br/>
      Join the journey to become a well-informed athlete committed to integrity and fair play!
      </p>
    </BackgroundLines>
    </>
  );
}
