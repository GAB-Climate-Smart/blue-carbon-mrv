import { Database as DatabaseIcon, FileJson, Table } from "lucide-react";

export default function DatabasePage() {
    const tables = [
        { name: "mangrove_plots", rowCount: "12,450", size: "48 MB", lastSync: "2 hours ago" },
        { name: "sar_change_alerts", rowCount: "142", size: "2 MB", lastSync: "1 hour ago" },
        { name: "crema_verifications", rowCount: "86", size: "15 MB", lastSync: "12 hours ago" },
        { name: "leakage_buffer_zones", rowCount: "3", size: "1 MB", lastSync: "1 week ago" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">PostGIS Database Viewer</h1>
                    <p className="text-slate-400">Direct query access to vector geometries and event logs.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
                        <FileJson className="w-4 h-4" />
                        Export GeoJSON
                    </button>
                    <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <DatabaseIcon className="w-4 h-4" />
                        New Query
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <div key={table.name} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                <Table className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="font-semibold text-slate-200 font-mono text-sm truncate">{table.name}</h3>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Rows</span>
                                <span className="text-slate-300 font-medium">{table.rowCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Size</span>
                                <span className="text-slate-300">{table.size}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Last Sync</span>
                                <span className="text-slate-300">{table.lastSync}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
