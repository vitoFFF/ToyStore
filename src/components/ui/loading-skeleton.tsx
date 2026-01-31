import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
    type: "product" | "card" | "list" | "form"
    count?: number
}

export function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
    const items = Array.from({ length: count })

    if (type === "product") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((_, i) => (
                    <div key={i} className="flex flex-col gap-4">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-9 w-full mt-2" />
                    </div>
                ))}
            </div>
        )
    }

    if (type === "form") {
        return (
            <div className="flex flex-col gap-6 w-full max-w-md">
                <Skeleton className="h-10 w-1/2 mx-auto" />
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {items.map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    )
}
