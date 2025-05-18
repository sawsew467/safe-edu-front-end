"use client";

import { useEffect, useState } from "react";

import { useVisitMutation } from "@/features/statistics/api";

function VisitStatic() {
  const [visit] = useVisitMutation();
  const [ip, setIp] = useState<string>("");

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
        },
        (error) => {}
      );
    } else {
    }
  };

  useEffect(() => {
    const fetchIpAndVisit = async () => {
      try {
        getCurrentLocation();
        const response = await fetch("https://api4.ipify.org/?format=json", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = await response.json();

        console.log(data);

        setIp(data.IPv4);
        visit({ ipAddress: data.IPv4 });
        console.log("[VisitStatic] User IP address:", data.IPv4);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIpAndVisit();
  }, [visit]);

  return null;
}

export default VisitStatic;
