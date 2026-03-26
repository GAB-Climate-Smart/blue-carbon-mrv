"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format, addYears, isAfter } from "date-fns";
import { TreePine, Activity, Navigation, AlertCircle, Clock } from "lucide-react";
import { ProjectFilter, useProjectSelection } from "@/components/ProjectFilter";
import PlotRegistrationModal from "./PlotRegistrationModal";

export default function PlotsClient({ projects = [], plots = [] }: { projects?: any[]; plots?: any[] }) {
    const [selectedProjectId, setSelectedProjectId] = useProjectSelection("all");

    const filtered = useMemo(() => {
        const list = selectedProjectId === "all" ? plots : plots.filter((p: any) => p.project_id === selectedProjectId);
        
        return list.map((plot: any) => {
            const sorted = plot.plot_measurements?.sort((a: any, b: any) => 
                new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime()
            ) || [];
            
            const lastDate = sorted.length > 0 ? new Date(sorted[0].measurement_date) : null;
            const dueDate = lastDate ? addYears(lastDate, 2) : new Date(plot.created_at);
            const isOverdue = isAfter(new Date(), dueDate);

            return { 
                ...plot, 
                lastSurvey: lastDate ? format(lastDate, "MMM d, yyyy") : "No Data",
                nextDue: format(dueDate, "MMM d, yyyy"),
                isOverdue
            };
        });
    }, [selectedProjectId, plots]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Permanent Sample Plots</h1>
                    <p className="text-slate-400">Registry of field monitoring nodes and longitudinal data.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ProjectFilter projects={projects} selectedProjectId={selectedProjectId} onProjectChange={setSelectedProjectId} />
                    <PlotRegistrationModal projects={projects} />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Plot Code</th>
                                <th className="px-6 py-4 font-medium">Stratum</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-center">Last Survey</th>
                                <th className="px-6 py-4 font-medium text-center">Next Survey Due</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filtered.map((plot: any) => (
                                <tr key={plot.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                <TreePine className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <span className="font-medium text-white">{plot.plot_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Navigation className="w-4 h-4" />
                                            {plot.stratum}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                            plot.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                            plot.status === "Restoring" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
                                            "bg-red-500/10 text-red-400 border-red-500/20"
                                        }`}>
                                            {plot.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-slate-300 font-medium">{plot.lastSurvey}</span>
                                            {plot.lastSurvey !== "No Data" && (
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Activity className="w-3 h-3" /> Recorded
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`font-medium ${plot.isOverdue ? 'text-rose-400' : 'text-slate-300'}`}>
                                                {plot.nextDue}
                                            </span>
                                            {plot.isOverdue ? (
                                                <span className="text-[10px] text-rose-500/80 flex items-center gap-1 mt-0.5">
                                                    <AlertCircle className="w-3 h-3" /> Overdue
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" /> Scheduled
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/plots/${plot.id}`} className="inline-flex items-center text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
                                            Manage<span className="ml-1 text-lg leading-none">&rarr;</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No sample plots registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
