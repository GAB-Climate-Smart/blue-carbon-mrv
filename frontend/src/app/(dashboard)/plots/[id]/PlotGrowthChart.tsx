"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { format } from "date-fns";

interface PlotGrowthChartProps {
    data: any[];
}

export default function PlotGrowthChart({ data }: PlotGrowthChartProps) {
    // Process data for Recharts: sort by date and format
    const chartData = [...data]
        .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
        .map(m => ({
            date: format(new Date(m.measurement_date), "MMM yyyy"),
            agb: parseFloat(m.above_ground_biomass_tc_ha || 0),
            canopy: parseFloat(m.canopy_cover_percent || 0),
            height: parseFloat(m.avg_tree_height_m || 0)
        }));

    if (chartData.length === 0) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Biomass & Growth Trends</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <YAxis 
                            yAxisId="left"
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            label={{ value: 'AGB (tc/ha)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 10 } }}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right"
                            stroke="#64748b" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            label={{ value: 'Canopy (%)', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 10 } }}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="agb" 
                            name="AGB" 
                            stroke="#10b981" 
                            strokeWidth={2} 
                            dot={{ fill: '#10b981', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="canopy" 
                            name="Canopy (%)" 
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            strokeDasharray="5 5"
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
