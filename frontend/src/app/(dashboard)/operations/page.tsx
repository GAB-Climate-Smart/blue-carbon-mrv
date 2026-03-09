import OperationsClient from "./OperationsClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: "Operations & Governance | Blue Carbon MRV",
    description: "Manage ingestion jobs and classification runs.",
};

async function getGovernanceData() {
    try {
        const supabase = await createClient();

        const [
            { data: projects },
            { data: jobs },
            { data: runs },
        ] = await Promise.all([
            supabase.from('projects').select('id, name, region').order('name'),
            supabase.from('ingestion_jobs').select('*').order('created_at', { ascending: false }).limit(100),
            supabase.from('classification_runs').select('*').order('started_at', { ascending: false }).limit(50),
        ]);

        return {
            projects: projects ?? [],
            jobs: jobs ?? [],
            runs: runs ?? [],
        };
    } catch (error) {
        console.error("Error fetching governance data:", error);
        return { projects: [], jobs: [], runs: [] };
    }
}

export default async function OperationsPage() {
    const { projects, jobs, runs } = await getGovernanceData();
    return <OperationsClient projects={projects} initialJobs={jobs} initialRuns={runs} />;
}
