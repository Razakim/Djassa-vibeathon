from __future__ import annotations

import math
from typing import TypeAlias

LatLng: TypeAlias = tuple[float, float]

CITY_REGISTRY: dict[str, dict] = {
    "Abidjan": {"name": "Abidjan", "country": "Côte d'Ivoire", "countryCode": "CI", "coords": (5.348, -4.0275), "hub": True},
    "Bouaké": {"name": "Bouaké", "country": "Côte d'Ivoire", "countryCode": "CI", "coords": (7.6939, -5.0303), "hub": True},
    "San Pedro": {"name": "San Pedro", "country": "Côte d'Ivoire", "countryCode": "CI", "coords": (4.7485, -6.6363), "hub": True},
    "Yamoussoukro": {"name": "Yamoussoukro", "country": "Côte d'Ivoire", "countryCode": "CI", "coords": (6.82, -5.2775), "hub": True},
    "Ferkessédougou": {"name": "Ferkessédougou", "country": "Côte d'Ivoire", "countryCode": "CI", "coords": (9.5928, -5.1963)},
    "Bamako": {"name": "Bamako", "country": "Mali", "countryCode": "ML", "coords": (12.6392, -8.0029), "hub": True},
    "Dakar": {"name": "Dakar", "country": "Sénégal", "countryCode": "SN", "coords": (14.6928, -17.4467), "hub": True},
}

CORRIDORS: dict[str, list[str]] = {
    "Abidjan|Bouaké": ["Abidjan", "Yamoussoukro", "Bouaké"],
    "Bouaké|Abidjan": ["Bouaké", "Yamoussoukro", "Abidjan"],
    "Abidjan|Yamoussoukro": ["Abidjan", "Yamoussoukro"],
    "Yamoussoukro|Abidjan": ["Yamoussoukro", "Abidjan"],
    "Abidjan|San Pedro": ["Abidjan", "San Pedro"],
    "San Pedro|Abidjan": ["San Pedro", "Abidjan"],
    "San Pedro|Bouaké": ["San Pedro", "Abidjan", "Yamoussoukro", "Bouaké"],
    "Bouaké|San Pedro": ["Bouaké", "Yamoussoukro", "Abidjan", "San Pedro"],
    "Abidjan|Dakar": ["Abidjan", "Yamoussoukro", "Bouaké", "Bamako", "Dakar"],
    "Dakar|Abidjan": ["Dakar", "Bamako", "Bouaké", "Yamoussoukro", "Abidjan"],
    "Ferkessédougou|Abidjan": ["Ferkessédougou", "Bouaké", "Yamoussoukro", "Abidjan"],
    "Abidjan|Ferkessédougou": ["Abidjan", "Yamoussoukro", "Bouaké", "Ferkessédougou"],
    "Ferkessédougou|Bouaké": ["Ferkessédougou", "Bouaké"],
    "Bouaké|Ferkessédougou": ["Bouaké", "Ferkessédougou"],
    "Bouaké|Dakar": ["Bouaké", "Bamako", "Dakar"],
    "Dakar|Bouaké": ["Dakar", "Bamako", "Bouaké"],
}


def get_city_coords(city: str) -> LatLng:
    meta = CITY_REGISTRY.get(city) or CITY_REGISTRY["Abidjan"]
    return meta["coords"]


def _resolve_waypoints(from_city: str, to_city: str) -> list[str]:
    key = f"{from_city}|{to_city}"
    if key in CORRIDORS:
        return CORRIDORS[key]
    rev = f"{to_city}|{from_city}"
    if rev in CORRIDORS:
        return list(reversed(CORRIDORS[rev]))
    return [from_city, to_city]


def _interpolate_segment(a: LatLng, b: LatLng, steps: int) -> list[LatLng]:
    points: list[LatLng] = []
    for i in range(steps + 1):
        t = i / steps
        points.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    return points[:-1]


def build_route(from_city: str, to_city: str, steps_per_segment: int = 12) -> list[LatLng]:
    waypoints = [get_city_coords(c) for c in _resolve_waypoints(from_city, to_city)]
    route: list[LatLng] = []
    for i in range(len(waypoints) - 1):
        route.extend(_interpolate_segment(waypoints[i], waypoints[i + 1], steps_per_segment))
    route.append(waypoints[-1])
    return route


def interpolate_route(route: list[LatLng], progress: float) -> LatLng:
    if not route:
        return get_city_coords("Abidjan")
    if len(route) == 1:
        return route[0]
    idx = min(int(progress * (len(route) - 1)), len(route) - 2)
    t = progress * (len(route) - 1) - idx
    a, b = route[idx], route[idx + 1]
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)


def haversine_km(a: LatLng, b: LatLng) -> float:
    r = 6371
    lat1, lon1 = math.radians(a[0]), math.radians(a[1])
    lat2, lon2 = math.radians(b[0]), math.radians(b[1])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def get_bearing(from_pt: LatLng, to_pt: LatLng) -> float:
    lat1, lon1 = math.radians(from_pt[0]), math.radians(from_pt[1])
    lat2, lon2 = math.radians(to_pt[0]), math.radians(to_pt[1])
    dlon = lon2 - lon1
    y = math.sin(dlon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlon)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def get_route_bearing(route: list[LatLng], progress: float) -> float:
    if len(route) < 2:
        return 0.0
    idx = min(int(progress * (len(route) - 1)), len(route) - 2)
    return get_bearing(route[idx], route[idx + 1])
