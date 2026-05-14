import { useState, useRef, useEffect } from "react";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import citiesData from "@/data/cities.json";

interface City {
  name: string;
  country: string;
  category: number;
  lat: number;
  lng: number;
  energy: string;
  interpretation: string;
}

interface MarkerData {
  marker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  city: City;
}

const categoryColors = {
  1: { color: "#22c55e", label: "Favorable", hex: "#22c55e" },
  2: { color: "#eab308", label: "Caution", hex: "#eab308" },
  3: { color: "#ef4444", label: "Dangerous", hex: "#ef4444" },
};

export default function Home() {
  const [cities] = useState<City[]>(citiesData);
  const [visibleCategories, setVisibleCategories] = useState<Set<number>>(
    new Set([1, 2, 3])
  );
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const markersRef = useRef<MarkerData[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setShowSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCategory = (category: number) => {
    const newVisible = new Set(visibleCategories);
    if (newVisible.has(category)) {
      newVisible.delete(category);
    } else {
      newVisible.add(category);
    }
    setVisibleCategories(newVisible);

    // Update marker visibility
    markersRef.current.forEach(({ marker, city }) => {
      marker.setVisible(newVisible.has(city.category));
    });
  };

  const stats = {
    favorable: cities.filter((c) => c.category === 1).length,
    caution: cities.filter((c) => c.category === 2).length,
    dangerous: cities.filter((c) => c.category === 3).length,
  };

  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    markersRef.current = [];

    // Add markers for all cities
    cities.forEach((city) => {
      const marker = new google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map: map,
        title: city.name,
        visible: visibleCategories.has(city.category),
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor:
            categoryColors[city.category as keyof typeof categoryColors].color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: system-ui, -apple-system, sans-serif; padding: 12px; min-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #000;">${city.name}</h3>
            <p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Country:</strong> ${city.country}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;"><strong>Energy:</strong> ${city.energy}</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #555; line-height: 1.4;">${city.interpretation}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        // Close all other info windows
        markersRef.current.forEach(({ infoWindow: iw }) => iw.close());
        infoWindow.open(map, marker);
        setSelectedCity(city);
      });

      markersRef.current.push({ marker, infoWindow, city });
    });
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 py-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            AstroMap
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Explore astrocartography data across 50+ global cities
          </p>
        </div>
        {isMobile && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xs"
          >
            {showSidebar ? "Hide" : "Show"} Info
          </Button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            onMapReady={handleMapReady}
            initialCenter={{ lat: 20, lng: 0 }}
            initialZoom={2}
          />
        </div>

        {/* Right Sidebar - Desktop always visible, Mobile toggleable */}
        {(!isMobile || showSidebar) && (
          <div className="w-full sm:w-80 border-l border-gray-200 bg-white overflow-y-auto absolute sm:relative right-0 top-0 sm:top-auto h-full sm:h-auto z-10 sm:z-auto">
            {/* Stats Panel */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Summary
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[1].color }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Favorable
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {stats.favorable}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[2].color }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Caution
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {stats.caution}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[3].color }}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Dangerous
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {stats.dangerous}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend & Filters */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Legend
              </h2>
              <div className="space-y-2">
                <Button
                  variant={visibleCategories.has(1) ? "default" : "outline"}
                  onClick={() => toggleCategory(1)}
                  className="w-full justify-start gap-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[1].color }}
                  />
                  <span className="truncate">Favorable Cities</span>
                </Button>
                <Button
                  variant={visibleCategories.has(2) ? "default" : "outline"}
                  onClick={() => toggleCategory(2)}
                  className="w-full justify-start gap-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[2].color }}
                  />
                  <span className="truncate">Caution Cities</span>
                </Button>
                <Button
                  variant={visibleCategories.has(3) ? "default" : "outline"}
                  onClick={() => toggleCategory(3)}
                  className="w-full justify-start gap-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[3].color }}
                  />
                  <span className="truncate">Dangerous Cities</span>
                </Button>
              </div>
            </div>

            {/* Selected City Details */}
            {selectedCity && (
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  {selectedCity.name}
                </h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <p className="text-gray-600">
                      <strong>Country:</strong> {selectedCity.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Category:</strong>{" "}
                      <span
                        className="font-semibold"
                        style={{
                          color: categoryColors[
                            selectedCity.category as keyof typeof categoryColors
                          ].color,
                        }}
                      >
                        {
                          categoryColors[
                            selectedCity.category as keyof typeof categoryColors
                          ].label
                        }
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Energy:</strong> {selectedCity.energy}
                    </p>
                  </div>
                  <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-white">
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {selectedCity.interpretation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
