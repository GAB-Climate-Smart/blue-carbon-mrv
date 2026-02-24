import { Shield, Key, Users } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
                <p className="text-slate-400">Manage MRV roles, alert parameters, and API integrations.</p>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                <div className="p-6 flex items-start gap-4">
                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                        <Shield className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Geospatial Alert Parameters</h3>
                        <p className="text-slate-400 text-sm mb-4">Configure the sensitivity of the Change Detection Engine for Sentinel-1 and Sentinel-2 ingestion.</p>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                                <div>
                                    <div className="text-slate-300 font-medium text-sm">NDVI Drop Threshold</div>
                                    <div className="text-slate-500 text-xs">Minimum reduction to trigger deforestation alert</div>
                                </div>
                                <div className="bg-slate-950 border border-slate-700 rounded px-3 py-1 font-mono text-emerald-400 text-sm">
                                    &gt; 20%
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-slate-300 font-medium text-sm">Minimum Mapping Unit</div>
                                    <div className="text-slate-500 text-xs">Smallest contiguous area to track (Hectares)</div>
                                </div>
                                <div className="bg-slate-950 border border-slate-700 rounded px-3 py-1 font-mono text-emerald-400 text-sm">
                                    0.1 ha
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 flex items-start gap-4 opacity-50">
                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                        <Users className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Role & Access Control</h3>
                        <p className="text-slate-400 text-sm">Manage MRV Admins, GIS Analysts, and CREMA Users. (Supabase Auth)</p>
                        <button className="mt-3 text-sm text-emerald-500 font-medium" disabled>Coming soon...</button>
                    </div>
                </div>

                <div className="p-6 flex items-start gap-4 opacity-50">
                    <div className="p-3 bg-slate-800 rounded-lg shrink-0">
                        <Key className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">API Integrations</h3>
                        <p className="text-slate-400 text-sm">Connect Google Earth Engine Service Accounts and Registry Webhooks.</p>
                        <button className="mt-3 text-sm text-emerald-500 font-medium" disabled>Coming soon...</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
