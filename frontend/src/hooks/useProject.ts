import { useState, useEffect } from "react";
import { projectService } from "../services/api";

export function useProject(slug: string | undefined) {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  useEffect(() => {
    let mounted = true;
    if (!slug) return;
    
    setStatus("loading");
    
    projectService.getProjectBySlug(slug)
      .then((res) => {
        if (!mounted) return;
        setData(res);
        setStatus("loaded");
      })
      .catch((err) => {
        console.error("useProject error:", err);
        if (!mounted) return;
        setStatus("error");
      });

    return () => { mounted = false; };
  }, [slug]);

  return { data, status };
}
