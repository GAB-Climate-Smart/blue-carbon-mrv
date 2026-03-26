import { createClient } from "@/utils/supabase/server";
import SocioEconomicClient from "./SocioEconomicClient";

export const dynamic = "force-dynamic";

export default async function SocioEconomicPage() {
    const supabase = await createClient();

    // Fetch all projects for the selector
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch socioeconomic observations
    const { data: observations } = await supabase
        .from("socio_economic_observations")
        .select("*")
        .order("observation_period_end", { ascending: false });

    return (
        <SocioEconomicClient
            projects={projects || []}
            initialObservations={observations || []}
        />
    );
}
