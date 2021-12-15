import React from "react";
import { ConflictZone } from "../models/confict_zone";
import { getZonePos } from "../utils/position_utils";

interface ConflictZoneViewProps {
	zone: ConflictZone;
}

function ConflictZoneView({ zone }: ConflictZoneViewProps) {
	const { col, row } = zone;
	return <div style={getZonePos(col, row)} className='absolute bg-gray-300 border-2 border-gray-500' />;
}

export default ConflictZoneView;
