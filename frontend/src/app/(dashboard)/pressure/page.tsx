import { createClient } from "@/utils/supabase/server";
import PressureClient from "./PressureClient";

export const dynamic = "force-dynamic";

export default async function PressurePage() {
    const supabase = await createClient();

    // Fetch all projects
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch environmental pressure observations
    const { data: observations } = await supabase
        .from("environmental_pressure_observations")
        .select("*")
        .order("observation_date", { ascending: false });

    return (
        <PressureClient
            projects={projects || []}
            initialObservations={observations || []}
        />
    );
}
