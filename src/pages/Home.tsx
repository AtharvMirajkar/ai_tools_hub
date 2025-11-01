import Hero from "../components/Hero";
import ToolsGrid from "../components/ToolsGrid";

function Home() {
  return (
    <>
      <Hero />
      <ToolsGrid limit={6} />
    </>
  );
}

export default Home;
