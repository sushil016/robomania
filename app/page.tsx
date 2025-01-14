import ContactForm from "@/components/ContactForm";
import EventDetails from "@/components/EventDetails";
import EventHighlights from "@/components/EventHighlights";
import Hero from "@/components/Hero";
import LiveUpdates from "@/components/LiveUpdates";
import MediaGallery from "@/components/MediaGallery";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <EventHighlights />
      <EventDetails />
      <LiveUpdates />
      <MediaGallery />
      <ContactForm />
    </div>
  )
}

