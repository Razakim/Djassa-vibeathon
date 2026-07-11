import L from "leaflet"

const TRUCK_BODY = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`

const FRIDGE_TRUCK = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="13" height="10" rx="1"/><path d="M17 9h3l2 3v5h-5V9z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M5 11v4M8 11v4"/></svg>`

const CONTAINER_TRUCK = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="8" width="14" height="9" rx="1"/><path d="M15 10h4l2 2.5V17h-6V10z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>`

function truckSvgForType(type?: string): string {
  const t = (type ?? "").toLowerCase()
  if (t.includes("frigo")) return FRIDGE_TRUCK
  if (t.includes("conteneur") || t.includes("porte")) return CONTAINER_TRUCK
  return TRUCK_BODY
}

export function createTruckIcon(opts: {
  color: string
  heading?: number
  selected?: boolean
  speed?: number
  plate: string
  status?: string
  vehicleType?: string
}) {
  const { color, heading = 0, selected, speed = 0, plate, status, vehicleType } = opts
  const moving = speed > 0
  const statusClass =
    status === "en_retard" || status === "arret"
      ? "truck-marker--halt"
      : moving
        ? "truck-marker--moving"
        : ""

  return L.divIcon({
    html: `
      <div class="truck-marker-wrap${selected ? " truck-marker-wrap--selected" : ""}">
        <div class="truck-marker__plate">${plate}</div>
        <div class="truck-marker ${statusClass}${selected ? " truck-marker--selected" : ""}" style="--color:${color};--heading:${heading}deg">
          <div class="truck-marker__ring"></div>
          <div class="truck-marker__icon">${truckSvgForType(vehicleType)}</div>
          ${moving ? `<span class="truck-marker__speed">${speed}</span>` : ""}
        </div>
      </div>`,
    className: "",
    iconSize: [56, 56],
    iconAnchor: [28, 36],
    popupAnchor: [0, -32],
  })
}

export function createCityLabelIcon(name: string, countryCode: string, role?: "hub" | "stop") {
  return L.divIcon({
    html: `
      <div class="city-label${role === "hub" ? " city-label--hub" : ""}">
        <span class="city-label__dot"></span>
        <span class="city-label__text">
          <strong>${name}</strong>
          <em>${countryCode}</em>
        </span>
      </div>`,
    className: "",
    iconSize: [1, 1],
    iconAnchor: [6, 6],
  })
}

export function createEndpointIcon(kind: "depart" | "arrivee", label: string) {
  return L.divIcon({
    html: `
      <div class="endpoint-marker endpoint-marker--${kind}">
        <span class="endpoint-marker__badge">${kind === "depart" ? "D" : "A"}</span>
        <span class="endpoint-marker__label">${label}</span>
      </div>`,
    className: "",
    iconSize: [1, 1],
    iconAnchor: [12, 12],
  })
}

export function createProgressDot(color: string) {
  return L.divIcon({
    html: `<div class="progress-dot" style="--color:${color}"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}
