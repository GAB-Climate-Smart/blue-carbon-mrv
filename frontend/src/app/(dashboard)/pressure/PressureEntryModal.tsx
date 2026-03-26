"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PressureEntryModalProps {
    projects: any[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PressureEntryModal({
    projects,
    isOpen,
    onClose,
    onSuccess,
}: PressureEntryModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        project_id: "",
        coastal_area_name: "",
        pressure_type: "Illegal Logging",
        severity: "Medium",
        observation_date: new Date().toISOString().split('T')[0],
        area_ha: "",
        source: "",
        verified_by: "",
        notes: "",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/v1/indicators/pressure", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    project_id: formData.project_id || null,
                    area_ha: formData.area_ha ? parseFloat(formData.area_ha) : null,
                }),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await response.json();
                alert(`Error: ${err.detail || 'Failed to save pressure observation'}`);
            }
        } catch (error) {
            console.error("Error saving pressure:", error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white">Log Environmental Pressure</h3>
                    <button onClick={onClose} aria-label="Close modal" title="Close" className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="p-project-select" className="text-sm font-medium text-slate-300">Project (Optional)</label>
                            <select
                                id="p-project-select"
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
                            <label htmlFor="p-coastal-area" className="text-sm font-medium text-slate-300">Coastal Area Name *</label>
                            <input
                                id="p-coastal-area"
                                required
                                type="text"
                                placeholder="e.g. Keta Lagoon"
                                value={formData.coastal_area_name}
                                onChange={(e) => setFormData({ ...formData, coastal_area_name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label id="p-type-label" className="text-sm font-medium text-slate-300">Pressure Type *</label>
                            <select
                                required
                                aria-labelledby="p-type-label"
                                value={formData.pressure_type}
                                onChange={(e) => setFormData({ ...formData, pressure_type: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            >
                                <option value="Illegal Logging">Illegal Logging</option>
                                <option value="Fire">Fire / Burning</option>
                                <option value="Erosion">Coastal Erosion</option>
                                <option value="Pollution">Pollution (Plastic/Chemical)</option>
                                <option value="Urban Encroachment">Urban Encroachment</option>
                                <option value="Over-harvesting">Over-harvesting (Fishing/Crab)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label id="p-severity-label" className="text-sm font-medium text-slate-300">Severity *</label>
                            <select
                                required
                                aria-labelledby="p-severity-label"
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="p-obs-date" className="text-sm font-medium text-slate-300">Observation Date *</label>
                            <input
                                id="p-obs-date"
                                required
                                type="date"
                                value={formData.observation_date}
                                onChange={(e) => setFormData({ ...formData, observation_date: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="p-area-ha" className="text-sm font-medium text-slate-300">Impacted Area (Ha)</label>
                            <input
                                id="p-area-ha"
                                type="number"
                                step="any"
                                placeholder="Estimated acreage"
                                value={formData.area_ha}
                                onChange={(e) => setFormData({ ...formData, area_ha: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label htmlFor="p-notes" className="text-sm font-medium text-slate-300">Notes / Details</label>
                            <textarea
                                id="p-notes"
                                rows={3}
                                placeholder="Describe the observation..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="p-source" className="text-sm font-medium text-slate-300">Source Reference</label>
                            <input
                                id="p-source"
                                type="text"
                                placeholder="e.g. Field report #123"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="p-verified-by" className="text-sm font-medium text-slate-300">Verified By</label>
                            <input
                                id="p-verified-by"
                                type="text"
                                placeholder="Reviewer name"
                                value={formData.verified_by}
                                onChange={(e) => setFormData({ ...formData, verified_by: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
                            />
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
                            {loading ? "Saving..." : "Save Pressure"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
