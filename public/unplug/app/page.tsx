import { MotionProvider } from '@/components/MotionProvider';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Why from '@/components/Why';
import NightSim from '@/components/NightSim';
import Gains from '@/components/Gains';
import Experts from '@/components/Experts';
import ToolkitIntro from '@/components/ToolkitIntro';
import DeviceQuiz from '@/components/DeviceQuiz';
import Smartphone from '@/components/Smartphone';
import Replies from '@/components/Replies';
import Meetup from '@/components/Meetup';
import Friends from '@/components/Friends';
import Kit from '@/components/Kit';
import Pact from '@/components/Pact';
import Faq from '@/components/Faq';
import Finale from '@/components/Finale';

export default function Page() {
  return (
    <MotionProvider>
      <a className="skip" href="#main">דילוג לתוכן</a>
      <Header />
      <main id="main">
        <Hero />
        <Why />
        <NightSim />
        <Gains />
        <Experts />
        <ToolkitIntro />
        <DeviceQuiz />
        <Smartphone />
        <Replies />
        <Meetup />
        <Friends />
        <Kit />
        <Pact />
        <Faq />
      </main>
      <Finale />
    </MotionProvider>
  );
}
