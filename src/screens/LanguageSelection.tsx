import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import Logo from "../components/Logo";
import Ripple from "../components/Ripple";

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();

  const handleLanguageSelect = (lang: "TH" | "EN") => {
    setLanguage(lang);
    navigate("/check-in-choice");
  };

  return (
    <Layout showHomeButton={false} showGlobalLogo={false}>
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-10 pb-20 relative overflow-y-auto">
        <div className="flex flex-col items-center mb-24 animate-fade-in-down">
          <Logo className="w-[25rem] h-auto mb-10 pb-20" />

          <div className="text-center">
            <h2 className="text-8xl font-light text-gray-700 tracking-wide">
              Welcome
            </h2>
            <p className="text-gray-400 text-4xl mt-6">
              Please select your language.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-16 w-full max-w-5xl animate-fade-in-up">
          <button
            onClick={() => handleLanguageSelect("TH")}
            className="
                group relative overflow-hidden bg-slate-100 rounded-[5rem] shadow-neu-out w-full h-64 flex items-center justify-center
                active:shadow-neu-in transition-all duration-200 outline-none
              "
          >
            <Ripple />
            <div className="flex items-center gap-16 w-[48rem]">
              <div className="w-56 h-40 rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                <img
                  src="https://flagcdn.com/w320/th.png"
                  alt="Thai flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-8xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  ภาษาไทย
                </span>
                <span className="text-4xl text-gray-400 mt-2">Thai</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleLanguageSelect("EN")}
            className="
                group relative overflow-hidden bg-slate-100 rounded-[5rem] shadow-neu-out w-full h-64 flex items-center justify-center
                active:shadow-neu-in transition-all duration-200 outline-none
              "
          >
            <Ripple />
            <div className="flex items-center gap-16 w-[48rem]">
              <div className="w-56 h-40 rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0">
                <img
                  src="https://flagcdn.com/w320/gb.png"
                  alt="UK flag"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start flex-1">
                <span className="text-8xl font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  English
                </span>
                <span className="text-4xl text-gray-400 mt-2">English</span>
              </div>
            </div>
          </button>
        </div>

        <div className="absolute bottom-20 flex gap-12 text-gray-400 text-xl font-light">
          <span>Secure</span>
          <span>•</span>
          <span>Easy</span>
          <span>•</span>
          <span>24-Hour Service</span>
        </div>
      </div>
    </Layout>
  );
};

export default LanguageSelection;
