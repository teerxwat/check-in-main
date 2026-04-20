import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Logo from "../components/Logo";

const IdleScreen: React.FC = () => {
  const navigate = useNavigate();

  // Use a top level effect to catch any possible interaction instantly
  useEffect(() => {
    const events = ["pointerdown", "keydown"];

    const onWake = () => {
      navigate("/"); // Navigate to the Language Selection (Root route)
    };

    events.forEach((event) => document.addEventListener(event, onWake));

    return () => {
      events.forEach((event) => document.removeEventListener(event, onWake));
    };
  }, [navigate]);

  return (
    <Layout
      showBackButton={false}
      showHomeButton={false}
      showGlobalLogo={false}
    >
      {/* 
              This div overlays the entire screen to catch clicks just in case.
              The effect above also catches global events.
            */}
      <div className="w-full h-full flex-grow flex items-center justify-center bg-slate-100 cursor-pointer">
        {/* 
                  Using a subtle pulsing animation to indicate the screen is active 
                  but waiting for interaction.
                */}
        <div className="animate-pulse">
          <Logo className="w-[40rem] h-auto opacity-70" />
        </div>
      </div>
    </Layout>
  );
};

export default IdleScreen;
