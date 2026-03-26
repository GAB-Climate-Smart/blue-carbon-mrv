"use client";

import { useState, useMemo } from "react";
import { 
    Users, 
    ChevronDown, 
    Plus, 
    BarChart3, 
    TrendingUp, 
    TrendingDown, 
    History,
    Search,
    Filter,
    Download
} from "lucide-react";
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    BarChart, 
    Bar,
    Legend
} from "recharts";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import SocioEconomicEntryModal from "./SocioEconomicEntryModal";

interface SocioEconomicClientProps {
    projects: any[];
    initialObservations: any[];
}

export default function SocioEconomicClient({
    projects,
    initialObservations,
}: SocioEconomicClientProps) {
    const router = useRouter();
    const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = () => {
        router.refresh();
    };

    // Filter data based on selected project
    const filteredObservations = useMemo(() => {
        let obs = initialObservations;
        if (selectedProjectId !== "all") {
            obs = obs.filter((o: any) => o.project_id === selectedProjectId);
        }
        if (searchTerm) {
            obs = obs.filter((o: any) => 
                o.indicator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.community_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return obs;
    }, [selectedProjectId, searchTerm, initialObservations]);

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    // Prepare chart data (example: trending indicators over time)
    // In a real app, we'd group by indicator_code and period
    const chartData = useMemo(() => {
        // Mocking chart data for "Community Reliance on Mangroves (%)"
        return [
            { period: "2023 Q1", value: 65, target: 60 },
            { period: "2023 Q2", value: 58, target: 55 },
            { period: "2023 Q3", value: 52, target: 50 },
            { period: "2023 Q4", value: 48, target: 45 },
            { period: "2024 Q1", value: 42, target: 40 },
        ];
    }, []);

    const stats = [
        { 
            title: "Communities Tracked", 
            value: new Set(filteredObservations.map(o => o.community_name)).size.toString(), 
            change: "Across region", 
            trend: "up", 
            icon: Users 
        },
        { 
            title: "Indicators Logged", 
            value: filteredObservations.length.toString(), 
            change: "Total records", 
            trend: "neutral", 
            icon: History 
        },
        { 
            title: "Avg. Reliance", 
            value: "42%", 
            change: "-23% from baseline", 
            trend: "down", 
            icon: TrendingDown 
        },
        { 
            title: "Project Alignment", 
            value: "88%", 
            change: "High impact", 
            trend: "up", 
            icon: BarChart3 
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Socio-Economic Indicators</h1>
                    <p className="text-slate-400">
                        {selectedProjectId === "all"
                            ? "National demographics, community reliance, and livelihood trends."
                            : `Indicator trends for ${selectedProject?.name}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20"
                    >
                        <Plus className="w-4 h-4" />
                        Log Indicator
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
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 
                                stat.trend === 'down' ? 'bg-rose-500/10 text-rose-500' : 
                                'bg-slate-800 text-slate-500'
                            }`}>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Trend: Community Livelihood Reliance
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" /> % Reliance
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-400 ml-3">
                                <span className="w-3 h-3 rounded-full bg-slate-700" /> Target
                            </span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                    dataKey="period" 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#64748b" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#10b981" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }} 
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="target" 
                                    stroke="#334155" 
                                    strokeDasharray="5 5" 
                                    strokeWidth={2} 
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-emerald-500" />
                        Income Diversification
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: "Fishing", val: 45 },
                                { name: "Crab", val: 25 },
                                { name: "Farming", val: 15 },
                                { name: "Trading", val: 10 },
                                { name: "Other", val: 5 },
                            ]} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    stroke="#94a3b8" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    width={70}
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                />
                                <Bar dataKey="val" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Log History */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-500" />
                        <h3 className="font-bold text-white">Indicator Log History</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                            <input 
                                type="text"
                                placeholder="Search indicators..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-full md:w-64"
                            />
                        </div>
                        <button 
                            aria-label="Filter options"
                            className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <button 
                            aria-label="Download data"
                            className="p-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800/50 text-slate-400 font-medium border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4">Indicator Name</th>
                                <th className="px-6 py-4">Period</th>
                                <th className="px-6 py-4">Community</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Unit</th>
                                <th className="px-6 py-4">Verified By</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredObservations.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No observations found for the selected criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredObservations.map((obs: any, i: number) => (
                                    <tr key={obs.id || i} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-200">{obs.indicator_name}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {format(new Date(obs.observation_period_start), "MMM yyyy")} - {format(new Date(obs.observation_period_end), "MMM yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">{obs.community_name || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-emerald-400 font-mono font-bold">
                                                {obs.value_numeric ?? obs.value_text}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{obs.unit || "-"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                                                    {obs.verified_by?.substring(0, 2).toUpperCase() || "SY"}
                                                </div>
                                                <span className="text-slate-400 text-xs">{obs.verified_by || "System"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-emerald-500 hover:text-emerald-400 font-medium">View Details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SocioEconomicEntryModal 
                projects={projects}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
