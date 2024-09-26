import BackgroundLinesDemo from "../components/Aceternity/Components/ui/backgroundLines"
import { FeaturesSectionDemo } from '../components/Aceternity/Components/ui/Bento-grid'
import { FeaturesSectionDemo2 } from '../components/Aceternity/Components/ui/Bento-grid2'
import CoverDemo from "../components/Aceternity/Components/ui/coverDemo"
import Spline from '@splinetool/react-spline'
import TextGenerateEffectDemo from "../components/Aceternity/Components/ui/ttext-generate-effect"

export default function Intro() {
  return (
    <>
      <BackgroundLinesDemo />
      <div className="flex h-full ml-8">
        <div className="flex-1 flex items-center justify-center">
          <TextGenerateEffectDemo />
        </div>
        <div className="flex-1 ">
          <section className="w-full h-full">
            <Spline scene="https://prod.spline.design/RBKMOqbrYnAQ73xj/scene.splinecode" />
          </section>
        </div>
      </div>
      <FeaturesSectionDemo />
      <FeaturesSectionDemo2 />
      <CoverDemo />
    </>
  )
}


