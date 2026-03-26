import { createClient } from "@/utils/supabase/server";
import PlotsClient from "./PlotsClient";

export default async function PlotsPage() {
    const supabase = await createClient();

    // Fetch projects for the registration modal and filter
    const { data: projects } = await supabase
        .from("projects")
        .select("id, name")
        .order("name");

    // Fetch plots with measurement count for due-date logic
    const { data: plots } = await supabase
        .from("sample_plots")
        .select(`
            *,
            plot_measurements (
                measurement_date
            )
        `)
        .order("plot_name");

    return (
        <PlotsClient
            projects={projects || []}
            plots={plots || []}
        />
    );
}
