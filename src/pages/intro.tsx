import BackgroundLinesDemo from "../components/Aceternity/Components/ui/backgroundLines"
import { FeaturesSectionDemo } from '../components/Aceternity/Components/ui/Bento-grid'
import { FeaturesSectionDemo2 } from '../components/Aceternity/Components/ui/Bento-grid2'
import CoverDemo from "../components/Aceternity/Components/ui/coverDemo"
import Spline from '@splinetool/react-spline'
import TextGenerateEffectDemo from "../components/Aceternity/Components/ui/ttext-generate-effect"
import FadeInComponent from './fadeInComponent'; // Import the new component

export default function intro() {
  return (
    <>
    <FadeInComponent>
        <BackgroundLinesDemo />
      </FadeInComponent>

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
      
      <FadeInComponent>
        <FeaturesSectionDemo />
        </FadeInComponent>
      <FadeInComponent>
        <FeaturesSectionDemo2 />
      </FadeInComponent>

      <FadeInComponent>
        <CoverDemo />
      </FadeInComponent>
    </>
  )
}


