"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface SocioEconomicEntryModalProps {
    projects: any[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SocioEconomicEntryModal({
    projects,
    isOpen,
    onClose,
    onSuccess,
}: SocioEconomicEntryModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_id: "",
        coastal_area_name: "",
        community_name: "",
        indicator_code: "reliance_mangrove",
        indicator_name: "Community Reliance on Mangroves (%)",
        period_start: "",
        period_end: "",
        value_numeric: "",
        value_text: "",
        unit: "%",
        source: "",
        verified_by: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/v1/indicators/socioeconomic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    project_id: formData.project_id || null,
                    value_numeric: formData.value_numeric ? parseFloat(formData.value_numeric) : null,
                }),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await response.json();
                alert(`Error: ${err.detail || 'Failed to save indicators'}`);
            }
        } catch (error) {
            console.error("Error saving indicator:", error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white">Log Socio-Economic Indicator</h3>
                    <button 
                        onClick={onClose} 
                        aria-label="Close modal"
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="project-select" className="text-sm font-medium text-slate-300">Project (Optional)</label>
                            <select
                                id="project-select"
                                value={formData.project_id}
                                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            >
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="coastal-area" className="text-sm font-medium text-slate-300">Coastal Area Name *</label>
                            <input
                                id="coastal-area"
                                required
                                type="text"
                                placeholder="e.g. Keta Lagoon"
                                value={formData.coastal_area_name}
                                onChange={(e) => setFormData({ ...formData, coastal_area_name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label id="indicator-label" className="text-sm font-medium text-slate-300">Indicator *</label>
                            <select
                                required
                                aria-labelledby="indicator-label"
                                value={formData.indicator_code}
                                onChange={(e) => {
                                    const name = e.target.options[e.target.selectedIndex].text;
                                    setFormData({ ...formData, indicator_code: e.target.value, indicator_name: name });
                                }}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            >
                                <option value="reliance_mangrove">Community Reliance on Mangroves (%)</option>
                                <option value="avg_household_income">Avg. Household Income (GHS)</option>
                                <option value="population_size">Community Population Size</option>
                                <option value="mangrove_benefit_perc">Benefit Distribution (% to Local)</option>
                                <option value="livelihood_type">Dominant Livelihood Type</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="community-name" className="text-sm font-medium text-slate-300">Community Name</label>
                            <input
                                id="community-name"
                                type="text"
                                placeholder="e.g. Anyanui"
                                value={formData.community_name}
                                onChange={(e) => setFormData({ ...formData, community_name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="period-start" className="text-sm font-medium text-slate-300">Period Start *</label>
                            <input
                                id="period-start"
                                required
                                type="date"
                                value={formData.period_start}
                                onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="period-end" className="text-sm font-medium text-slate-300">Period End *</label>
                            <input
                                id="period-end"
                                required
                                type="date"
                                value={formData.period_end}
                                onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="value-numeric" className="text-sm font-medium text-slate-300">Value (Numeric or Text) *</label>
                            <div className="flex gap-2">
                                <input
                                    id="value-numeric"
                                    type="number"
                                    step="any"
                                    placeholder="Numeric value"
                                    value={formData.value_numeric}
                                    onChange={(e) => setFormData({ ...formData, value_numeric: e.target.value })}
                                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                                />
                                <input
                                    id="value-text"
                                    aria-label="Textual value"
                                    type="text"
                                    placeholder="Textual value"
                                    value={formData.value_text}
                                    onChange={(e) => setFormData({ ...formData, value_text: e.target.value })}
                                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="indicator-unit" className="text-sm font-medium text-slate-300">Unit</label>
                            <input
                                id="indicator-unit"
                                type="text"
                                placeholder="e.g. %, GHS, count"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="source-ref" className="text-sm font-medium text-slate-300">Source Reference / Verified By</label>
                            <div className="flex gap-2">
                                <input
                                    id="source-ref"
                                    type="text"
                                    placeholder="Source document"
                                    value={formData.source}
                                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                                />
                                <input
                                    type="text"
                                    placeholder="Reviewer name"
                                    value={formData.verified_by}
                                    onChange={(e) => setFormData({ ...formData, verified_by: e.target.value })}
                                    className="w-1/2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Observation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
