import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionDemo2() {
  const features = [
    {
      title: "Built for gamers",
      description:
        "Crafted for pro gamers, casual players, and anyone who wants to level up their gaming experience.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Effortless Gameplay",
      description:
        "As simple as playing your favorite game, with controls as intuitive as they come.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Open Source & Free",
      description:
        "Our platform is open source to ensure everyone has access to tools that promote fair play and anti-doping awareness—completely free of charge.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Unbeatable Uptime",
      description:
        "Our platform stays up, just like the leaderboard champions. Nothing can stop you from gaming.",
      icon: <IconCloud />,
    },
    {
      title: "Shared Success",
      description:
        "Our multi-tenant architecture lets you and your team dominate together—no need for extra accounts.",
      icon: <IconRouteAltLeft />,
    },
    {
      title: "24/7 Gaming Support",
      description:
        "Need help? Our AI-powered game masters are available 24/7, keeping you in the game without a hitch.",
      icon: <IconHelp />,
    },
    {
      title: "Play & Learn Guarantee",
      description:
        "We don't just help you play—we educate you on anti-doping practices while keeping gaming fun.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Endless Possibilities",
      description:
        "From anti-doping awareness to gaming mastery, our platform is packed with tools to help you excel in both.",
      icon: <IconHeart />,
    },
    
  ];
  return (
    <><div className="relative z-20 pb-4 max-w-7xl mx-auto">
    <div className="px-8">
      <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
      Why Choose Us? Discover the Difference
      </h4>
      <p className="text-sm lg:text-base max-w-7xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
      Unlock a unique experience where innovation meets impact. Our platform offers cutting-edge solutions tailored to your needs, helping you grow, learn, and excel. Join us for a journey that combines expertise, engagement, and success—designed specifically with you in mind.
      </p>
    </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
    </>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
