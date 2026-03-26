"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ValidationActionsProps {
    measurementId: string;
    currentStatus: string;
}

export default function ValidationActions({ measurementId, currentStatus }: ValidationActionsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleAction = async (status: 'Approved' | 'Rejected') => {
        setIsSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            const { error } = await supabase
                .from('plot_measurements')
                .update({ 
                    validation_status: status,
                    validated_by: user?.id 
                })
                .eq('id', measurementId);

            if (error) throw error;
            router.refresh();
        } catch (err) {
            console.error("Validation failed:", err);
            alert("Failed to update validation status.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (currentStatus !== 'Pending') return null;

    return (
        <div className="flex items-center gap-2">
            {isSubmitting ? (
                <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
            ) : (
                <>
                    <button 
                        onClick={() => handleAction('Approved')}
                        className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-wider transition-colors"
                    >
                        Approve
                    </button>
                    <span className="text-slate-700 text-xs">|</span>
                    <button 
                        onClick={() => handleAction('Rejected')}
                        className="text-[10px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-wider transition-colors"
                    >
                        Reject
                    </button>
                </>
            )}
        </div>
    );
}
