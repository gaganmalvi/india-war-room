import { useEffect, useState } from "react";
import { MapPin, Plane, Newspaper, Info, Rss } from "lucide-react";
import './App.css';

export default function WarRoomDashboard() {
  const [activeView, setActiveView] = useState("news");
  const [rssFeeds, setRssFeeds] = useState([
    { name: "Times of India", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", items: [] },
    { name: "NDTV - Top Stories", url: "https://feeds.feedburner.com/ndtvnews-top-stories", items: [] },
    { name: "CNBC TV18", url: "https://www.cnbctv18.com/commonfeeds/v1/cne/rss/india.xml", items: [] }
  ]);
  const [activeRssFeed, setActiveRssFeed] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeView === "news") {
      // Load Twitter widgets
      const script = document.createElement("script");
      script.setAttribute("src", "https://platform.twitter.com/widgets.js");
      script.setAttribute("async", "true");
      document.body.appendChild(script);

      // Fetch RSS feed
      fetchRssFeed(rssFeeds[activeRssFeed].url);
    }
  }, [activeView, activeRssFeed]);

  const fetchRssFeed = async (url) => {
    setLoading(true);
    try {
      // Using a CORS proxy to fetch the RSS feed
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.text();
      
      // Parse the XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const items = xml.querySelectorAll("item");
      
      const feedItems = Array.from(items).map(item => {
        return {
          title: item.querySelector("title")?.textContent || "",
          link: item.querySelector("link")?.textContent || "",
          description: item.querySelector("description")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || ""
        };
      });
      
      const updatedFeeds = [...rssFeeds];
      updatedFeeds[activeRssFeed].items = feedItems;
      setRssFeeds(updatedFeeds);
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
    }
    setLoading(false);
  };

  const officialTwitterHandles = [
    "SpokespersonMoD",
    "adgpi",
    "Sofiyaquresi",
    "ShashiTharoor",
    "narendramodi",
    "MEAIndia",
    "rajnathsingh"
  ];

  const speculativeTwitterHandles = [
    "ShivAroor",
    "ANI",
    "sidhant"
  ];

  return (
    <div className="min-h-screen min-w-screen bg-[#222222] text-white flex flex-col items-center justify-start p-6">
      <header className="w-full text-left mb-6">
        <h1 className="text-3xl font-bold">
          {activeView === "news" && "Live News Feed"}
          {activeView === "flight" && "Live Flight Radar"}
          {activeView === "map" && "Conflict Map"}
          {activeView === "info" && "Info & Version"}
        </h1>
        <p className="text-sm text-gray-400">
          {activeView === "news" && "RSS Feeds, Tweets & Headlines from Trusted Sources"}
          {activeView === "flight" && "Courtesy ADS-B Exchange"}
          {activeView === "map" && "Major Attacks and Conflict Events"}
          {activeView === "info" && "War Room Project - India-Pakistan Tracker"}
        </p>
      </header>

      <main className="w-full flex-1">
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
            <div className="w-full h-full flex items-center flex-row justify-center text-gray-400">
              {/* Placeholder - Replace with Leaflet or similar */}
            </div>
          )}

          {activeView === "news" && (
            <div className="w-full h-full overflow-y-auto p-4 text-sm text-gray-300 flex flex-row">
              {/* Left Column - RSS Feeds */}
              {/* Left Column - RSS Feeds */}
              <div className="w-1/3 pr-4 border-r border-gray-700 overflow-y-auto">
                <div className="mb-4 sticky top-0 bg-[#222222] pb-2 z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Rss size={16} className="mr-2" /> RSS Feeds
                    </h2>
                    <button 
                      onClick={() => fetchRssFeed(rssFeeds[activeRssFeed].url)}
                      className="p-1.5 bg-[#333] hover:bg-blue-600 rounded-full transition-colors"
                      title="Refresh feed"
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        className={`${loading ? "animate-spin text-blue-400" : "text-gray-300"}`}>
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {rssFeeds.map((feed, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveRssFeed(index)}
                        className={`px-2 py-1 text-xs rounded ${
                          activeRssFeed === index
                            ? "bg-blue-600 text-white"
                            : "bg-[#333] text-gray-400 hover:bg-blue-700"
                        }`}
                      >
                        {feed.name}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rssFeeds[activeRssFeed]?.items.map((item, index) => (
                      <div key={index} className="p-3 bg-[#2a2a2a] rounded-lg">
                        <h3 className="font-medium text-white">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                            {item.title}
                          </a>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">{new Date(item.pubDate).toLocaleString()}</p>
                        <div 
                          className="mt-2 text-xs text-gray-300" 
                          dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Middle Column - Twitter Feeds (First Group) */}
              <div className="w-1/3 px-4 border-r border-gray-700 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-[#222222] pb-2 z-10">Official Sources</h2>
                {officialTwitterHandles.map((handle) => (
                  <blockquote
                    key={handle}
                    className="twitter-tweet mb-6"
                    data-theme="dark"
                    data-dnt="true"
                  >
                    <a href={`https://x.com/${handle}`}>Tweets by @{handle}</a>
                  </blockquote>
                ))}
              </div>

              {/* Right Column - Twitter Feeds (Second Group) */}
              <div className="w-1/3 pl-4 overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4 sticky top-0 bg-[#222222] pb-2 z-10">Other Updates</h2>
                {speculativeTwitterHandles.map((handle) => (
                  <blockquote
                    key={handle}
                    className="twitter-tweet mb-6"
                    data-theme="dark"
                    data-dnt="true"
                  >
                    <a href={`https://x.com/${handle}`}>Tweets by @{handle}</a>
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {activeView === "info" && (
            <div className="w-full h-full p-4 text-sm text-gray-400">
              <p><strong>Version:</strong> 0.2.0 (RSS Update)</p>
              <p><strong>Author:</strong> War Room India</p>
              <p><strong>Data Sources:</strong> ADS-B Exchange, Twitter/X, RSS feeds (Times of India)</p>
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