import Header from "../components/Header";
import Hero from "../components/Hero";
import ToolsGrid from "../components/ToolsGrid";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ToolsGrid limit={6} />
      </main>
      <Footer />
    </div>
  );
}

export default Home;
