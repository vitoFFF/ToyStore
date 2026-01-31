"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/lib/data/products";
import { toast } from "sonner";
import { useI18n } from "@/components/i18n/LanguageProvider";
// Product deletion component

export function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const { t } = useI18n();

    const handleDelete = () => {
        if (!confirm(t("toasts.deleteConfirm"))) return;

        startTransition(async () => {
            try {
                await deleteProduct(id);
                toast.success(t("toasts.productDeleted"));
            } catch (error) {
                toast.error(t("toasts.deleteFailed"));
            }
        });
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="hover:bg-red-50 hover:text-red-500"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
