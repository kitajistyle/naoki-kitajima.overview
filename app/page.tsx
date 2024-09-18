"use client";
import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Profile from "./components/Profile";
import Skills from "./components/Skills";
import Three from "./components/Three";
import Works from "./components/Works";
import Active from "./components/Active";

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
      <div className="mb-5">
        <Three />
      </div>
      <div id="Profile" className="mx-5">
        <Profile />
      </div>
      <div id="Skills" className="mx-5">
        <Skills />
      </div>
      <div id="Works" className="mx-5">
        <Works />
      </div>
      <div id="Active" className="mx-5">
        <Active />
      </div>
      <Footer />
    </main>
  );
};

export default App;
