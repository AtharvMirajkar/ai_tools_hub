import ToolsGrid from "../components/ToolsGrid";

function Tools() {
  return (
    <div className="bg-gray-50">
        <div className="pt-24 sm:pt-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Explore AI Tools</h2>
                </div>
                <div>
                    <ToolsGrid />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Tools;