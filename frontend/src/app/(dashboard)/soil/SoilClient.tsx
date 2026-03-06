"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Microscope, Beaker, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { ProjectFilter, useProjectSelection } from "@/components/ProjectFilter";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function SoilClient({ projects, samples }: { projects: any[]; samples: any[] }) {
    const [selectedProjectId, setSelectedProjectId] = useProjectSelection("all");

    const filtered = useMemo(() => {
        if (selectedProjectId === "all") return samples;
        // Filter by either the sample's direct project_id or through its plot's project_id
        return samples.filter((s: any) =>
            s.project_id === selectedProjectId ||
            s.sample_plots?.project_id === selectedProjectId
        );
    }, [selectedProjectId, samples]);

    const totalSamples = filtered.length;
    const pendingAnalysis = filtered.filter((s: any) => s.analysis_status === 'Pending').length;
    const completedAnalysis = filtered.filter((s: any) => s.analysis_status === 'Analysed').length;

    const chartData = useMemo(() => {
        return filtered
            .filter((s: any) => typeof s.organic_carbon_percent === 'number' || typeof s.organic_carbon_percent === 'string')
            .map((s: any) => ({
                id: s.sample_id,
                depth: s.depth_interval,
                carbon: Number(s.organic_carbon_percent) || 0,
                density: Number(s.bulk_density_g_cm3) || 0,
                plot: s.sample_plots?.plot_name || 'Unknown'
            })).sort((a: any, b: any) => a.depth.localeCompare(b.depth));
    }, [filtered]);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Microscope className="w-6 h-6 text-emerald-500" />Soil Data Registry</h1>
                    <p className="text-slate-400 mt-1">Manage below-ground carbon samples and chain-of-custody.</p>
                </div>
                <ProjectFilter projects={projects} selectedProjectId={selectedProjectId} onProjectChange={setSelectedProjectId} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-slate-400 font-medium">Total Cores Logged</h3><div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Beaker className="w-4 h-4" /></div></div>
                    <div className="text-3xl font-bold text-white">{totalSamples}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-slate-400 font-medium">Pending Lab Analysis</h3><div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-4 h-4" /></div></div>
                    <div className="text-3xl font-bold text-white">{pendingAnalysis}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-slate-400 font-medium">Verified Results</h3><div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><CheckCircle2 className="w-4 h-4" /></div></div>
                    <div className="text-3xl font-bold text-white">{completedAnalysis}</div>
                </div>
            </div>

            {chartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-white font-medium mb-4">Organic Carbon by Depth</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="depth" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                        itemStyle={{ color: '#10b981' }}
                                        formatter={(value: number) => [`${value.toFixed(2)}%`, 'Carbon']}
                                        labelFormatter={(label) => `Depth: ${label}`}
                                    />
                                    <Bar dataKey="carbon" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                        <h3 className="text-white font-medium mb-4">Bulk Density Overview</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="id" stroke="#94a3b8" fontSize={10} tick={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'dataMax + 0.5']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                                        itemStyle={{ color: '#eab308' }}
                                        formatter={(value: number) => [`${value.toFixed(3)} g/cm³`, 'Density']}
                                        labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                    />
                                    <Bar dataKey="density" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                            <tr><th className="px-6 py-4 font-medium">Sample ID</th><th className="px-6 py-4 font-medium">Origin Plot</th><th className="px-6 py-4 font-medium">Collection Date</th><th className="px-6 py-4 font-medium">Depth</th><th className="px-6 py-4 font-medium text-right">Bulk Density</th><th className="px-6 py-4 font-medium text-right">Carbon %</th><th className="px-6 py-4 font-medium">Status</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filtered.map((sample: any) => (
                                <tr key={sample.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4"><div className="font-mono text-emerald-400">{sample.sample_id}</div><div className="text-xs text-slate-500 mt-1">By: {sample.collected_by?.split('@')[0]}</div></td>
                                    <td className="px-6 py-4 text-slate-300">{sample.sample_plots?.plot_name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-slate-300">{format(new Date(sample.collected_date), 'MMM d, yyyy')}</td>
                                    <td className="px-6 py-4 text-slate-300"><span className="bg-slate-800 px-2 py-1 rounded text-xs">{sample.depth_interval}</span></td>
                                    <td className="px-6 py-4 text-slate-300 text-right font-mono">{sample.bulk_density_g_cm3 ? `${Number(sample.bulk_density_g_cm3).toFixed(3)}` : '-'}</td>
                                    <td className="px-6 py-4 text-slate-300 text-right font-mono">{sample.organic_carbon_percent ? `${Number(sample.organic_carbon_percent).toFixed(1)}%` : '-'}</td>
                                    <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${sample.analysis_status === 'Analysed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : sample.analysis_status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>{sample.analysis_status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}{sample.analysis_status === 'Analysed' && <CheckCircle2 className="w-3 h-3 mr-1" />}{sample.analysis_status === 'Flagged' && <AlertCircle className="w-3 h-3 mr-1" />}{sample.analysis_status}</span></td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500"><Microscope className="w-8 h-8 mx-auto mb-3 opacity-20" /><p>No soil samples registered yet.</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
