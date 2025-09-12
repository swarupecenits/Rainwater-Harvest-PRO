import { useState, useEffect } from "react";
import axios from "axios";

export const useMap = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>({
    lat: 47.21725,
    lng: -1.55336,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
      },
      (blocked) => {
        const fetch = async () => {
          try {
            const { data } = await axios.get("https://ipapi.co/json");
            setPosition({ lat: data.latitude, lng: data.longitude });
          } catch (err) {
            console.error(err);
          }
        };
        fetch();
      }
    );
  }, []);

  return { position };
};
