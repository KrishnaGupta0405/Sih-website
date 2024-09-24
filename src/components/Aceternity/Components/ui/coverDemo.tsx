import { Cover } from "./cover";

export default function CoverDemo() {
  return (
    <div className="min-h-lvh content-center">
      <h1 className="text-4xl md:text-4xl lg:text-7xl font-bold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
      "Time to respawn! Are you set to embark on an adventure in <br /> at {" "} 
      <Cover > <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">DopeScape</span>
      </Cover>"
      </h1>
    </div>
  );
}
