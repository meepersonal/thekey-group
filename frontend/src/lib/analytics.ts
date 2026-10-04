import { useEffect, useRef } from "react";

const API_BASE = "/api/v1";
const VISITOR_KEY = "tk_visitor_id";
const MAX_DURATION_SECONDS = 3600;

function visitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function newViewToken(): string {
  return crypto.randomUUID();
}

/**
 * Enregistre une visite sur une page véhicule : consultations, temps d'affichage
 * et clics. Le temps n'est décompté que lorsque l'onglet est visible, et
 * l'envoi se fait en beacon pour ne jamais retarder la navigation.
 */
export function useVehiclePageTracking(vehicleId: number | string | undefined) {
  const clicksRef = useRef(0);
  const viewTokenRef = useRef<string>("");

  useEffect(() => {
    if (!vehicleId) return;

    const viewToken = newViewToken();
    viewTokenRef.current = viewToken;
    clicksRef.current = 0;

    let accumulatedMs = 0;
    let lastTick = performance.now();
    let sent = false;

    const tick = () => {
      const now = performance.now();
      if (document.visibilityState === "visible") {
        accumulatedMs += now - lastTick;
      }
      lastTick = now;
    };

    const send = () => {
      if (sent) return;
      sent = true;
      tick();

      const body = new FormData();
      body.append("view_token", viewToken);
      body.append("visitor_id", visitorId());
      body.append(
        "duration_seconds",
        String(Math.min(Math.round(accumulatedMs / 1000), MAX_DURATION_SECONDS)),
      );
      body.append("clicks", String(clicksRef.current));

      const url = `${API_BASE}/vehicles/${vehicleId}/page-view`;
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        void fetch(url, { method: "POST", body, keepalive: true }).catch(() => {});
      }
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (target) clicksRef.current += 1;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") send();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", send);
    document.addEventListener("click", onClick, true);
    const interval = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", send);
      document.removeEventListener("click", onClick, true);
      send();
    };
  }, [vehicleId]);
}
