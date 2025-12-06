import ContactForm from "@/components/ContactForm";
import EventDetails from "@/components/EventDetails";
import EventHighlights from "@/components/EventHighlights";
import EventsSection from "@/components/EventsSection";
import Hero from "@/components/Hero";
import LiveUpdates from "@/components/LiveUpdates";
import MediaGallery from "@/components/MediaGallery";
import SponsorsSection from "@/components/SponsorsSection";


export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Hero />
      <EventsSection />
      <EventHighlights />
      {/* <EventDetails /> */}
      {/* <LiveUpdates /> */}
      <MediaGallery />
      <SponsorsSection />
      {/* <ContactForm /> */}
    </div>
  )
}

