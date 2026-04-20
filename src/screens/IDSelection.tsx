import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import { LOCAL_HARDWARE_URL } from "../config";

const IDSelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const handleSelection = async (type: "thai_id" | "passport") => {
    const apiType = type === "thai_id" ? "thai-id" : "passport";

    try {
      await fetch(`${LOCAL_HARDWARE_URL}/api/clear`, { method: "POST" });

      await fetch(`${LOCAL_HARDWARE_URL}/api/set-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "off" }),
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      await fetch(`${LOCAL_HARDWARE_URL}/api/set-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: apiType }),
      });
    } catch (e) {
      console.error("Failed to set external reader mode:", e);
    }

    navigate("/id-scan", { state: { ...location.state, idType: type } });
  };

  return (
    <Layout showBackButton={true} onBack={() => navigate(-1)}>
      <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-8 py-12">
        {/* background glow */}
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          {/* header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex rounded-full border border-white/70 bg-white/70 px-5 py-2 shadow-sm backdrop-blur-md">
              <span className="text-sm font-semibold tracking-[0.25em] text-slate-500">
                DOCUMENT SELECTION
              </span>
            </div>

            <p className="mx-auto max-w-2xl text-lg text-slate-500 md:text-xl">
              กรุณาเลือกประเภทเอกสารที่ต้องการสแกนเพื่อดำเนินการต่อ
            </p>
          </div>

          {/* image-only clickable items */}
          <div className="mx-auto flex max-w-xl flex-col items-center gap-12">
            {/* Thai ID */}
            <button
              onClick={() => handleSelection("thai_id")}
              className="group relative w-full bg-transparent text-center"
            >
              <div className="relative mx-auto flex flex-col items-center">
                {/* floating glow */}
                <div className="pointer-events-none absolute top-10 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-sky-300/40" />

                {/* image */}
                <img
                  src="/images/thai-id-illustration.png"
                  alt="Thai National ID Card"
                  className="relative z-10 w-full max-w-[360px] object-contain transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-active:scale-95 animate-[floatY_3.5s_ease-in-out_infinite] drop-shadow-[0_25px_40px_rgba(14,165,233,0.22)]"
                />

                {/* text */}
                <div className="relative z-10 mt-6">
                  <div className="mb-3 inline-flex rounded-full bg-sky-100 px-4 py-2 text-sm font-bold text-sky-700 shadow-sm">
                    Thai National ID
                  </div>

                  <h2 className="text-4xl font-extrabold text-slate-800">
                    {t("thai_id_card")}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-slate-500">
                    สำหรับสแกนข้อมูลจากบัตรประชาชนไทย
                  </p>
                </div>
              </div>
            </button>
            <span>OR</span>
            {/* Passport */}
            <button
              onClick={() => handleSelection("passport")}
              className="group relative w-full bg-transparent text-center"
            >
              <div className="relative mx-auto flex flex-col items-center">
                {/* floating glow */}
                <div className="pointer-events-none absolute top-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-rose-300/40" />

                {/* image */}
                <img
                  src="/images/passport-illustration.png"
                  alt="Passport"
                  className="relative z-10 w-full max-w-[300px] object-contain transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-110 group-active:scale-95 animate-[floatY_3.8s_ease-in-out_infinite] drop-shadow-[0_25px_40px_rgba(127,29,29,0.22)]"
                />

                {/* text */}
                <div className="relative z-10 mt-6">
                  <div className="mb-3 inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-bold text-rose-700 shadow-sm">
                    Travel Document
                  </div>

                  <h2 className="text-4xl font-extrabold text-slate-800">
                    {t("passport")}
                  </h2>
                  <p className="mt-3 text-lg leading-relaxed text-slate-500">
                    สำหรับสแกนหนังสือเดินทางและข้อมูลผู้เดินทาง
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* custom animation */}
        <style>{`
          @keyframes floatY {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    </Layout>
  );
};

export default IDSelection;
