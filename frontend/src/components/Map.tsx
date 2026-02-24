"use client";

import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issues in Next.js if a point is ever rendered
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapProps {
    plots: any[];
    alerts: any[];
}

export default function Map({ plots, alerts }: MapProps) {
    const ghanaCenter: [number, number] = [5.6, -0.2];

    return (
        <MapContainer center={ghanaCenter} zoom={8} scrollWheelZoom={true} className="w-full h-full rounded-xl z-0 relative">
            <TileLayer
                attribution='&copy; <a href="https://carto.com/">Carto</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {plots.map((plot) => (
                <GeoJSON
                    key={plot.id}
                    data={plot.geojson}
                    pathOptions={{ color: '#10b981', weight: 2, fillOpacity: 0.15 }}
                >
                    <Tooltip sticky>
                        <div className="text-sm p-1">
                            <strong className="text-emerald-700">{plot.stratum_name}</strong><br />
                            <span className="text-slate-600">Area: {plot.area_ha} ha</span><br />
                            <span className="text-slate-600">Planted: {plot.planting_date}</span>
                        </div>
                    </Tooltip>
                </GeoJSON>
            ))}

            {alerts.map((alert) => (
                <GeoJSON
                    key={alert.id}
                    data={alert.geojson}
                    pathOptions={{
                        color: alert.severity === 'High' || alert.severity === 'Critical' ? '#f43f5e' : '#f59e0b',
                        weight: 2,
                        fillOpacity: 0.4
                    }}
                >
                    <Tooltip sticky>
                        <div className="text-sm p-1">
                            <strong className="text-slate-800">{alert.alert_type} Alert</strong><br />
                            <span className="text-slate-600">Severity: {alert.severity}</span><br />
                            <span className="text-slate-600">Status: {alert.status}</span><br />
                            <span className="text-slate-600">Area: {alert.detected_area_ha} ha</span>
                        </div>
                    </Tooltip>
                </GeoJSON>
            ))}
        </MapContainer>
    );
}
