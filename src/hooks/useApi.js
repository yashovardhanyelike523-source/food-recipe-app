import { useState, useEffect } from "react";

const API =
  "https://www.themealdb.com/api/json/v1/1";

function useApi(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(path));

  useEffect(() => {
    if (!path) {
      setLoading(false);
      setData(null);
      setError("");
      return;
    }

    let live = true;

    setLoading(true);
    setError("");

    fetch(`${API}/${path}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API request failed");
        }
        return response.json();
      })
      .then((result) => {
        if (live) setData(result);
      })
      .catch(() => {
        if (live) {
          setError(
            "Unable to load data. Check your internet connection."
          );
        }
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [path]);

  return { data, error, loading };
}

export default useApi;
