"use client";

import { useState, useMemo } from "react";
import { 
    ShieldAlert, 
    ChevronDown, 
    Plus, 
    BarChart3, 
    History,
    Search,
    Filter,
    Download,
    AlertTriangle,
    Clock,
    Flame,
    Wind,
    Droplets
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from "recharts";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import PressureEntryModal from "./PressureEntryModal";

interface PressureClientProps {
    projects: any[];
    initialObservations: any[];
}

export default function PressureClient({
    projects,
    initialObservations,
}: PressureClientProps) {
    const router = useRouter();
    const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = () => {
        router.refresh();
    };

    // Filter data
    const filteredObservations = useMemo(() => {
        let obs = initialObservations;
        if (selectedProjectId !== "all") {
            obs = obs.filter((o: any) => o.project_id === selectedProjectId);
        }
        if (searchTerm) {
            obs = obs.filter((o: any) => 
                o.pressure_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.coastal_area_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return obs;
    }, [selectedProjectId, searchTerm, initialObservations]);

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Distribution data
    const distributionData = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredObservations.forEach(o => {
            counts[o.pressure_type] = (counts[o.pressure_type] || 0) + 1;
        });
        return Object.entries(counts).map(([name, val]) => ({ name, val }));
    }, [filteredObservations]);

    const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];

    const stats = [
        { title: "Critical Pressures", value: filteredObservations.filter(o => o.severity === 'Critical').length.toString(), change: "Active threats", trend: "down", icon: AlertTriangle },
        { title: "Impacted Area (Ha)", value: filteredObservations.reduce((sum, o) => sum + Number(o.estimated_impacted_area_ha || 0), 0).toFixed(1), change: "Cumulative", trend: "neutral", icon: BarChart3 },
        { title: "Total Observations", value: filteredObservations.length.toString(), change: "Logged to date", trend: "up", icon: History },
        { title: "Avg. Severity", value: "Medium", change: "Current state", trend: "neutral", icon: ShieldAlert },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Environmental Pressures</h1>
                    <p className="text-slate-400">
                        {selectedProjectId === "all"
                            ? "Monitoring external threats, landscape degradation, and incident reports."
                            : `Pressure indicators for ${selectedProject?.name}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        Log Observation
                    </button>
                    <div className="relative">
                        <select
                            aria-label="Filter by project"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all min-w-[220px]"
                        >
                            <option value="all">🌍 All Projects</option>
                            {projects.map((p: any) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
                            <div className="p-2 bg-slate-800 rounded-lg">
                                <stat.icon className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                            <span className="text-[10px] font-medium text-slate-500">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Distribution Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                    Pressure Type Distribution
                </h3>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distributionData.length > 0 ? distributionData : [{name: 'No data', val: 0}]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            />
                            <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={40}>
                                {distributionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Log History */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-bold text-white">Pressure Observation History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input 
                                type="text"
                                placeholder="Search observations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
                            />
                        </div>
                        <button aria-label="Filters" className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Pressure Type</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Coastal Area</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Area (Ha)</th>
                                <th className="px-6 py-4">Verified By</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredObservations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No observations found.
                                    </td>
                                </tr>
                            ) : (
                                filteredObservations.map((obs: any, i: number) => (
                                    <tr key={obs.id || i} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${
                                                    obs.pressure_type === 'Fire' ? 'bg-rose-500/10 text-rose-500' :
                                                    obs.pressure_type === 'Illegal Logging' ? 'bg-amber-500/10 text-amber-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                    {obs.pressure_type === 'Fire' ? <Flame className="w-4 h-4" /> :
                                                     obs.pressure_type === 'Erosion' ? <Wind className="w-4 h-4" /> :
                                                     <ShieldAlert className="w-4 h-4" />}
                                                </div>
                                                <span className="font-medium text-slate-200">{obs.pressure_type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{format(new Date(obs.observation_date), "dd MMM yyyy")}</td>
                                        <td className="px-6 py-4 text-slate-400">{obs.coastal_area_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                obs.severity === 'Critical' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
                                                obs.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                                                obs.severity === 'Medium' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                                                'bg-slate-800 text-slate-400 border border-slate-700'
                                            }`}>
                                                {obs.severity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sky-400 font-mono">{obs.estimated_impacted_area_ha || "-"}</td>
                                        <td className="px-6 py-4 text-slate-400 text-xs">{obs.verified_by || "System"}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-emerald-500 hover:text-emerald-400 font-medium">Review</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PressureEntryModal 
                projects={projects}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
