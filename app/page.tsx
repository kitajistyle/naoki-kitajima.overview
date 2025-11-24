import Active from "./components/Active";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import Skills from "./components/Skills";
import Works from "./components/Works";

const App: React.FC = () => {
  return (
    <main className="mt-96 flex flex-col w-full min-h-screen pt-20 bg-transparent ">
      <div className="mt-96"></div>
      <div className="bg-transparent backdrop-blur-sm relative min-h-screen">
        <div id="Profile" className="mx-5">
          <Profile />
        </div>
      </div>
      <div id="Skills" className="mx-5 relative min-h-screen bg-transparent backdrop-blur-sm">
        <Skills />
      </div>
      <div className="bg-transparent backdrop-blur-sm relative min-h-screen">
        <div id="Works" className="mx-5 mb-5">
          <Works />
        </div>
      </div>
      <div id="Active" className="mx-5 mb-5 relative min-h-screen bg-transparent backdrop-blur-sm">
        <Active />
      </div>
      <Footer />
    </main>
  );
};

export default App;
