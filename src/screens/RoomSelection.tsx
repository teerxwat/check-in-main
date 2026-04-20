import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useLanguage } from "../contexts/LanguageContext";
import Ripple from "../components/Ripple";
import { CLOUD_DATABASE_URL } from "../config";

interface RoomType {
  room_type_id: number;
  type_name: string;
  capacity: number;
  bed_type: string;
  base_price: number;
  available_count: number;

  // optional detail fields from backend
  room_size_sqm?: number;
  view_type?: string;
  smoking_allowed?: number | boolean;
  has_wifi?: number | boolean;
  has_aircon?: number | boolean;
  has_private_bathroom?: number | boolean;
  amenities?: string[] | string;
  image_url?: string;
}

const RoomSelection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const res = await fetch(`${CLOUD_DATABASE_URL}/api/room-types`);
      const json = await res.json();

      if (json.data && Array.isArray(json.data)) {
        setRoomTypes(json.data);
      } else {
        console.error("Invalid data format:", json);
        setRoomTypes([]);
      }
    } catch (error) {
      console.error("Failed to fetch room types:", error);
      setRoomTypes([]);
    }
  };

  const handleSelectType = (type: RoomType) => {
    navigate("/id-select", {
      state: {
        selectedRoom: {
          type: type.type_name,
          price: type.base_price,
          typeId: type.room_type_id,
          room_type_id: type.room_type_id,
          room_no: "Auto-Assign",
        },
        nextRoute: "/customer-info",
      },
    });
  };

  const toBool = (value?: number | boolean, fallback = false) => {
    if (value === undefined || value === null) return fallback;
    if (typeof value === "boolean") return value;
    return value === 1;
  };

  const getRoomImage = (type: RoomType) => {
    if (type.image_url && type.image_url.trim() !== "") {
      return type.image_url;
    }

    const name = type.type_name.toLowerCase();

    if (name.includes("family")) {
      return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop";
    }

    if (name.includes("deluxe")) {
      return "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop";
    }

    return "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop";
  };

  const getBedLabel = (type: RoomType) => {
    return type.bed_type || "1 bed";
  };

  const getViewLabel = (type: RoomType) => {
    return type.view_type || "City view";
  };

  const getRoomSize = (type: RoomType) => {
    return type.room_size_sqm || 19;
  };

  const getAmenities = (type: RoomType) => {
    const items: string[] = [];

    if (toBool(type.has_wifi, true)) items.push("Free Wi-Fi");
    if (toBool(type.has_aircon, true)) items.push("Air conditioning");
    if (toBool(type.has_private_bathroom, true)) items.push("Private bathroom");
    if (!toBool(type.smoking_allowed, false)) items.push("Non-smoking");

    if (Array.isArray(type.amenities)) {
      items.push(...type.amenities);
    } else if (typeof type.amenities === "string" && type.amenities.trim()) {
      items.push(
        ...type.amenities
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      );
    }

    return [...new Set(items)].slice(0, 4);
  };

  return (
    <Layout showBackButton={true} onBack={() => navigate("/check-in-method")}>
      <div className="w-full min-h-full bg-slate-100 flex flex-col items-center px-8 pt-40 pb-16">
        <div className="flex flex-col items-center mb-10 text-center animate-fade-in-down">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1 className="text-6xl font-bold text-gray-800 mb-3">
            {t("select_room_type")}
          </h1>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-7xl animate-fade-in-up">
          {roomTypes.map((type) => {
            const isAvailable = type.available_count > 0;
            const amenities = getAmenities(type);

            return (
              <button
                key={type.room_type_id}
                onClick={() => handleSelectType(type)}
                disabled={!isAvailable}
                className={`
                  group relative overflow-hidden w-full rounded-[2.5rem] bg-white shadow-lg
                  transition-all duration-200 outline-none text-left
                  ${
                    isAvailable
                      ? "hover:scale-[1.01] active:scale-[0.995] cursor-pointer"
                      : "opacity-60 cursor-not-allowed grayscale"
                  }
                `}
              >
                <Ripple />

                <div className="flex flex-row w-full min-h-[240px]">
                  {/* image */}
                  <div className="w-[36%] min-h-[240px] flex-shrink-0">
                    <img
                      src={getRoomImage(type)}
                      alt={type.type_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-4xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                            {t(type.type_name)}
                          </h2>

                          <p className="text-xl text-gray-500 mt-1">
                            {t(type.bed_type)} • {type.capacity}{" "}
                            {t("guests_label")}
                          </p>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-full text-lg font-bold whitespace-nowrap ${
                            isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {isAvailable
                            ? `${type.available_count} ${t("available")}`
                            : t("full")}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-xl text-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🛏️</span>
                          <span>{getBedLabel(type)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">👥</span>
                          <span>{type.capacity} คน</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">📐</span>
                          <span>{getRoomSize(type)} m²</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌆</span>
                          <span>{getViewLabel(type)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🚭</span>
                          <span>
                            {toBool(type.smoking_allowed, false)
                              ? "Smoking allowed"
                              : "Non-smoking"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🛁</span>
                          <span>
                            {toBool(type.has_private_bathroom, true)
                              ? "Private bathroom"
                              : "Shared bathroom"}
                          </span>
                        </div>
                      </div>

                      {amenities.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xl font-semibold text-gray-800 mb-3">
                            สิ่งอำนวยความสะดวก
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {amenities.map((item, index) => (
                              <span
                                key={`${type.room_type_id}-${index}`}
                                className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-base font-medium"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">
                          ราคาเริ่มต้น
                        </p>
                        <div className="text-3xl font-bold text-blue-600">
                          ฿{type.base_price.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-lg font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                        เลือกห้องนี้ →
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default RoomSelection;
