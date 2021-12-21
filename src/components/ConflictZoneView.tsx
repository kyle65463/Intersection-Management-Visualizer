import React from "react";
import { Intersection } from "../hooks/useIntersection";
import { ConflictZone } from "../models/confict_zone";
import { getZonePos } from "../utils/position_utils";

interface ConflictZoneViewProps {
	zone: ConflictZone;
	intersection: Intersection;
}

function ConflictZoneView({ zone, intersection }: ConflictZoneViewProps) {
	const { col, row } = zone;
	return <div style={getZonePos(col, row, intersection)} className='absolute bg-gray-300 border-2 border-gray-500' />;
}

export default ConflictZoneView;
