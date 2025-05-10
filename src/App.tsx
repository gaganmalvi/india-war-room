import { useEffect, useState } from "react";
import { MapPin, Plane, Newspaper, Info } from "lucide-react";
import './App.css';

export default function WarRoomDashboard() {
  const [activeView, setActiveView] = useState("flight");
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    if (activeView === "news") {
      // Embed tweets via widgets instead of fetching due to CORS
      const script = document.createElement("script");
      script.setAttribute("src", "https://platform.twitter.com/widgets.js");
      script.setAttribute("async", "true");
      document.body.appendChild(script);
    }
  }, [activeView]);

  const twitterHandles = [
    "SpokespersonMoD",
    "adgpi",
    "Sofiyaquresi",
    "ShashiTharoor",
    "narendramodi",
    "MEAIndia",
    "rajnathsingh"
  ];

  return (
    <div className="min-h-screen min-w-screen bg-[#222222] text-white flex flex-col items-center justify-start p-6">
      <header className="w-full max-w-6xl text-left mb-6">
        <h1 className="text-3xl font-bold">
          {activeView === "news" && "Live News Feed"}
          {activeView === "flight" && "Live Flight Radar"}
          {activeView === "map" && "Conflict Map"}
          {activeView === "info" && "Info & Version"}
        </h1>
        <p className="text-sm text-gray-400">
          {activeView === "news" && "Tweets + Headlines from Trusted Sources"}
          {activeView === "flight" && "Courtesy ADS-B Exchange"}
          {activeView === "map" && "Major Attacks and Conflict Events"}
          {activeView === "info" && "War Room Project - India-Pakistan Tracker"}
        </p>
      </header>

      <main className="w-full max-w-6xl flex-1">
        <div className="relative w-full h-[70vh] rounded-lg overflow-hidden shadow-lg border border-gray-700">
          {activeView === "flight" && (
            <iframe
              title="Live Flight Radar"
              src="https://globe.adsbexchange.com/?lat=31.5&lon=75.3&zoom=6"
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          )}

          {activeView === "map" && (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {/* Placeholder - Replace with Leaflet or similar */}
              <p>Conflict Map coming soon...</p>
            </div>
          )}

          {activeView === "news" && (
            <div className="w-full h-full overflow-y-auto p-4 text-sm text-gray-300 space-y-6">
              {twitterHandles.map((handle) => (
                <blockquote
                  key={handle}
                  className="twitter-tweet"
                  data-theme="dark"
                  data-dnt="true"
                >
                  <a href={`https://x.com/${handle}`}>Tweets by @{handle}</a>
                </blockquote>
              ))}
            </div>
          )}

          {activeView === "info" && (
            <div className="w-full h-full p-4 text-sm text-gray-400">
              <p><strong>Version:</strong> 0.1.0 (Preview)</p>
              <p><strong>Author:</strong> War Room India</p>
              <p><strong>Data Sources:</strong> ADS-B Exchange, Twitter/X, RSS feeds</p>
              <p><strong>Notes:</strong> This is an OSINT-based project. No classified or government data is used.</p>
            </div>
          )}
        </div>
      </main>

      <div className="mt-6 flex gap-3 bg-[#2a2a2a] rounded-xl p-3 shadow-lg border border-gray-700">
        <button
          onClick={() => setActiveView("flight")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeView === "flight"
              ? "bg-red-600 text-white shadow-md scale-105"
              : "bg-[#333] text-gray-400 hover:bg-red-700"
            }`}
        >
          <Plane size={20} />
        </button>
        <button
          onClick={() => setActiveView("map")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeView === "map"
              ? "bg-yellow-600 text-white shadow-md scale-105"
              : "bg-[#333] text-gray-400 hover:bg-yellow-700"
            }`}
        >
          <MapPin size={20} />
        </button>
        <button
          onClick={() => setActiveView("news")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeView === "news"
              ? "bg-blue-600 text-white shadow-md scale-105"
              : "bg-[#333] text-gray-400 hover:bg-blue-700"
            }`}
        >
          <Newspaper size={20} />
        </button>
        <button
          onClick={() => setActiveView("info")}
          className={`p-3 rounded-xl transition-all duration-200 ${activeView === "info"
              ? "bg-gray-500 text-white shadow-md scale-105"
              : "bg-[#333] text-gray-400 hover:bg-gray-600"
            }`}
        >
          <Info size={20} />
        </button>
      </div>
      <footer className="w-full max-w-6xl text-center text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} War Room Dashboard | India-Pakistan OSINT
      </footer>
    </div>
  );
}