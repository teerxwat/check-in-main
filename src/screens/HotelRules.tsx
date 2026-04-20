import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import { CLOUD_DATABASE_URL } from "../config";
import Ripple from "../components/Ripple";

const HotelRules: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, bookingCode, selectedRoom } = (location.state as any) || {};

  const handleAgree = async () => {
    if (!agreed || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const existingBooking = (location.state as any)?.booking;

      if (existingBooking && existingBooking.check_in_booking_id) {
        navigate("/id-select", {
          state: {
            ...location.state,
            nextRoute: "/key-dispense",
          },
        });
      } else {
        const today = new Date().toISOString().split("T")[0];

        const payload = {
          booking_code: bookingCode || "WALK-IN-TEST",
          id_card: formData?.idNumber || "",
          card_type:
            formData?.idNumber?.length === 13 ? "บัตรประชาชน" : "พาสปอร์ต",
          first_name: formData?.firstName || "",
          last_name: formData?.lastName || "",
          phone: formData?.phone || "",
          email: formData?.email || "",
          license_plate: formData?.licensePlate || "",
          room_id: selectedRoom?.room_id || 0,
          room_no: selectedRoom?.room_no || "",
          room_type_id: selectedRoom?.room_type_id || 0,
          check_in_date: today,
          duration: "1",
          nationality: formData?.nationality || "",
        };

        const response = await fetch(
          `${CLOUD_DATABASE_URL}/api/create-booking`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        if (response.ok) {
          navigate("/key-dispense", { state: { ...location.state } });
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || "Failed to create booking"}`);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Connection failed");
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showHomeButton={false}>
      <div className="w-full h-full bg-slate-100 flex flex-col relative p-10 pt-64">
        <div className="flex-1 flex flex-col items-center w-full max-w-5xl mx-auto pb-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              {t("welcome_hotel")}
            </h1>
            <p className="text-2xl text-gray-500">{t("review_rules")}</p>
          </div>

          {/* Video */}
          <div className="w-full h-[32rem] bg-black rounded-[3rem] shadow-neu-in relative overflow-hidden mb-12">
            <video
              className="w-full h-full object-cover pointer-events-none"
              src="/present.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
              controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
              disablePictureInPicture
            />
          </div>

          <div className="grid grid-cols-4 gap-6 w-full mb-12">
            {[
              {
                name: t("amenity_restaurant"),
                icon: "M12 4v16m8-8H4",
                sub: t("amenity_restaurant_desc"),
              },
              {
                name: t("amenity_parking"),
                icon: "M5 10l7-7m0 0l7 7m-7-7v18",
                sub: t("amenity_parking_desc"),
              },
              {
                name: t("amenity_emergency"),
                icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                sub: t("amenity_emergency_desc"),
              },
              {
                name: t("amenity_stay_info"),
                icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                sub: t("amenity_stay_info_desc"),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-100 rounded-[2rem] shadow-neu-out p-6 flex flex-col items-center text-center pb-8 border border-slate-50"
              >
                <div className="w-16 h-16 text-gray-400 mb-4">
                  {idx === 0 && (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  )}
                  {idx === 3 && (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-full h-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-1">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400 leading-tight">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-50 rounded-[2.5rem] shadow-neu-in p-8 border border-white mb-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-6 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <span className="text-2xl text-gray-600 font-medium">
                  {t("no_pets")}
                </span>
              </div>

              <div className="flex items-center gap-6 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <span className="text-2xl text-gray-600 font-medium">
                  {t("no_smoking")}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      clipRule="evenodd"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                </div>
                <span className="text-2xl text-gray-600 font-medium">
                  {t("keep_quiet")}
                </span>
              </div>

              <div className="flex items-center gap-6 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-2xl text-gray-600 font-medium">
                  {t("checkout_before_noon")}
                </span>
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-6 mb-10 cursor-pointer"
            onClick={() => setAgreed(!agreed)}
          >
            <div
              className={`w-12 h-12 rounded-xl border-4 flex items-center justify-center transition-all ${
                agreed
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                  : "bg-white border-gray-300 text-transparent"
              }`}
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-3xl text-gray-600 font-medium">
              {t("agree_rules")}
            </span>
          </div>

          <div className="w-full">
            <button
              onClick={handleAgree}
              disabled={!agreed || isSubmitting}
              className={`
                relative overflow-hidden w-full py-8 rounded-[2rem] text-3xl font-bold shadow-xl transition-all
                ${
                  agreed && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-[1.02] hover:shadow-2xl"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <Ripple />
              <span className="relative z-10">
                {isSubmitting ? t("processing") : t("i_agree")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HotelRules;
