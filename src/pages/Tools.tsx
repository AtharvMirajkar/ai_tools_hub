import Header from "../components/Header";
import ToolsGrid from "../components/ToolsGrid";
import Footer from "../components/Footer";

function Tools() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ToolsGrid />
      </main>
      <Footer />
    </div>
  );
}

export default Tools;
