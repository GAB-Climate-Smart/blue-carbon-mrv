"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapProps = ComponentProps<any>;

const DashboardMap = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p className="text-slate-500 font-medium animate-pulse w-full h-full flex items-center justify-center">Loading Geospatial Data...</p>
});

export default function MapWrapper(props: MapProps) {
    return <DashboardMap {...props} />;
}
