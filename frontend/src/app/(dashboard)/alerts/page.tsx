import { createClient } from "@/utils/supabase/server";
import { formatDistanceToNow } from "date-fns";

export default async function AlertsPage() {
    const supabase = await createClient();

    // Fetch alerts ordered by event_date descending
    const { data: alerts, error } = await supabase
        .from("sar_change_alerts")
        .select("*")
        .order("event_date", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Alert Management</h1>
                    <p className="text-slate-400">Review and verify satellite-detected change events.</p>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Assign Alerts
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                    Error fetching alerts: {error.message}
                </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800/50 text-slate-400">
                        <tr>
                            <th className="px-6 py-4 font-medium">Alert ID</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Severity</th>
                            <th className="px-6 py-4 font-medium">Area (ha)</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Detected</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {alerts?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                    No alerts detected.
                                </td>
                            </tr>
                        )}
                        {alerts?.map((alert) => (
                            <tr key={alert.id} className="hover:bg-slate-800/30 transition-colors cursor-pointer">
                                <td className="px-6 py-4 font-mono text-slate-300 text-xs">
                                    {alert.id.split('-')[0]}...
                                </td>
                                <td className="px-6 py-4 text-slate-200">{alert.alert_type}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${alert.severity === 'High' || alert.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                                        alert.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{alert.detected_area_ha}</td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-400">{alert.status}</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {alert.event_date ? formatDistanceToNow(new Date(alert.event_date), { addSuffix: true }) : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
