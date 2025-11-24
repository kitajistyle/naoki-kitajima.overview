import Active from "./components/Active";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import Works from "./components/Works";


const App: React.FC = () => {
  return (
    <main className="flex flex-col w-full relative">
      {/* ファーストビュー - Three.jsが背景に表示される */}
      <div className="h-screen flex items-center justify-center">
        {/* 何も表示しない（Three.jsが背景として見える） */}
      </div>
      
      {/* Profile セクション */}
      <div className="bg-transparent backdrop-blur-sm relative min-h-screen">
        <div id="Profile" className="mx-5 py-20">
          <Profile />
        </div>
      </div>

      {/* Works セクション */}
      <div className="bg-transparent backdrop-blur-sm relative min-h-screen">
        <div id="Works" className="mx-5 py-20">
          <Works />
        </div>
      </div>

      {/* Active セクション */}
      <div className="bg-transparent backdrop-blur-sm relative min-h-screen">
        <div id="Active" className="mx-5 py-20">
          <Active />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default App;
