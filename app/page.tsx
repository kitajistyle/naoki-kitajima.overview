"use client";
import { useEffect, useState } from "react";
import Active from "./components/Active";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Profile from "./components/Profile";
import Skills from "./components/Skills";
import Three from "./components/Three";
import Works from "./components/Works";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5秒後にローディングを解除

    return () => clearTimeout(timer);
  }, []);

  return <div className="App">{loading ? <Loading /> : <MainContent />}</div>;
};

const MainContent: React.FC = () => {
  return (
    <main className="flex flex-col w-full h-screen">
      <div>
        <Three />
      </div>
      <div className="bg-gray-200">
        <div id="Profile" className="mx-5">
          <Profile />
        </div>
      </div>
      <div id="Skills" className="mx-5">
        <Skills />
      </div>
      <div className="bg-gray-200">
        <div id="Works" className="mx-5">
          <Works />
        </div>
      </div>
      <div id="Active" className="mx-5 mb-5">
        <Active />
      </div>
      <Footer />
    </main>
  );
};

export default App;
