import math
from typing import List, Dict, Tuple

# Pre-indexed known monitoring topologies for the Tapi River & Forest catchment zone
NETWORK_TOPOLOGY = {
    "node_001": {"label": "Tapi Riverbank North", "coords": (72.8258, 21.2014), "type": ["flood"]},
    "node_002": {"label": "Weir Causeway Checkpoint", "coords": (72.8311, 21.1959), "type": ["flood", "pollution"]},
    "node_003": {"label": "Singanpore Downstream Sluice", "coords": (72.8122, 21.2188), "type": ["flood"]},
    "node_004": {"label": "Sachin Industrial Buffer", "coords": (72.8845, 21.0890), "type": ["pollution", "fire"]},
    "node_005": {"label": "Mandvi Forest Perimeter", "coords": (73.2980, 21.2580), "type": ["fire"]}
}

def haversine_km(coord1: Tuple[float, float], coord2: Tuple[float, float]) -> float:
    """Calculate Great Circle distance between two points in km."""
    lon1, lat1 = coord1
    lon2, lat2 = coord2
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def compute_spatial_correlation(
    source_node_id: str,
    hazard: str,
    source_risk_score: float,
    source_coords: List[float]
) -> Tuple[int, List[str], float, str]:
    """
    Computes spatial correlation using inverse distance weighting (IDW)
    across neighboring nodes within radius R (15km for river catchment).
    """
    s_lon, s_lat = source_coords[0], source_coords[1]
    source_pt = (s_lon, s_lat)
    
    confirming_nodes = []
    weighted_scores = []
    total_weights = []

    # Source node has weight 1.0
    weighted_scores.append(source_risk_score * 1.0)
    total_weights.append(1.0)

    for node_id, data in NETWORK_TOPOLOGY.items():
        if node_id == source_node_id:
            continue
        if hazard not in data["type"]:
            continue

        dist_km = haversine_km(source_pt, data["coords"])
        # If neighbor is within catchment correlation threshold (15 km)
        if dist_km <= 15.0:
            weight = 1.0 / max(0.5, dist_km)
            # Simulated neighboring trend based on hydrological proximity
            simulated_neighbor_score = source_risk_score * (0.85 + (0.1 * math.sin(dist_km)))
            weighted_scores.append(simulated_neighbor_score * weight)
            total_weights.append(weight)
            if simulated_neighbor_score >= 45:
                confirming_nodes.append(node_id)

    # Compute inverse distance weighted average
    if total_weights:
        idw_score = sum(weighted_scores) / sum(total_weights)
    else:
        idw_score = source_risk_score

    # Multi-node correlation boost: if >= 2 confirming nodes, boost confidence
    if len(confirming_nodes) >= 2:
        boost = 8
        confidence = 0.94
    elif len(confirming_nodes) == 1:
        boost = 4
        confidence = 0.86
    else:
        boost = 0
        confidence = 0.75

    area_probability_index = int(min(100, max(0, round(idw_score + boost))))
    spatial_cluster = f"Catchment-Sector-{source_node_id[-1]}"

    return area_probability_index, confirming_nodes, confidence, spatial_cluster
