import { useState, useEffect } from "react";
import { projectService } from "../services/api";

export function useProjects() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState<"loading" | "loaded" | "empty" | "error">("loading");

  useEffect(() => {
    let mounted = true;
    setStatus("loading");
    
    projectService.getProjects()
      .then((res) => {
        if (!mounted) return;
        if (res.length === 0) {
          setStatus("empty");
        } else {
          setData(res);
          setStatus("loaded");
        }
      })
      .catch((err) => {
        console.error("useProjects error:", err);
        if (!mounted) return;
        setStatus("error");
      });

    return () => { mounted = false; };
  }, []);

  return { data, status };
}
