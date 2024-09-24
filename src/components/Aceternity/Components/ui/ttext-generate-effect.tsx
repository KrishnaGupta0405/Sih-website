"use client";
import { TextGenerateEffect } from "./text-generate-effect";

const words = `Ensuring integrity in gaming fosters a level playing field, promoting respect among players. Anti-doping measures protect athletes' health, discouraging harmful substance use. Upholding these standards supports sustainable careers and builds trust within the community, while also positioning players as role models for future generations.`;

export default function TextGenerateEffectDemo() {
  return <TextGenerateEffect words={words} />;
}
