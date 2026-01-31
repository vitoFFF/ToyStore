"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createProduct, updateProduct } from "@/lib/data/products";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";
import { useI18n } from "@/components/i18n/LanguageProvider";

// DB Types
type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

interface ProductFormProps {
    product?: Product;
    categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_urls?.[0] || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const supabase = createClient();
    const { t } = useI18n();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Handle Image Upload
            let imageUrl = product?.image_urls?.[0] || ""; // Default to existing

            if (imageFile) {
                const toastId = toast.loading(t("toasts.uploadingImage"));
                const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
                const path = `products/${filename}`; // Simplification: we might want per-product folders but ID isn't known for new. root/timestamp-name is fine for MVP. Or uuid-name.

                const { data, error: uploadError } = await supabase.storage
                    .from("product-images")
                    .upload(path, imageFile);

                if (uploadError) {
                    toast.dismiss(toastId);
                    throw new Error(t("toasts.imageUploadFailed", { message: uploadError.message }));
                }

                const { data: { publicUrl } } = supabase.storage
                    .from("product-images")
                    .getPublicUrl(path);

                imageUrl = publicUrl;
                toast.dismiss(toastId);
                toast.success(t("toasts.imageUploaded"));
            }

            // Append image_url to formData (handled by server action)
            formData.set("image_url", imageUrl);

            // Handle Checkbox
            // formData.get("is_active") returns "on" if checked, null if not.
            // Server action expects parsing.

            if (product) {
                await updateProduct(product.id, formData);
                toast.success(t("toasts.productUpdated"));
            } else {
                await createProduct(formData);
                toast.success(t("toasts.productCreated"));
            }

            router.push("/admin/products");
            router.refresh();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t("toasts.genericError"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t("adminProductForm.productTitle")}</Label>
                        <Input id="title" name="title" defaultValue={product?.title} required placeholder={t("adminProductForm.titlePlaceholder")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">{t("adminProductForm.slug")}</Label>
                        <Input id="slug" name="slug" defaultValue={product?.slug} required placeholder={t("adminProductForm.slugPlaceholder")} />
                        <p className="text-xs text-muted-foreground">{t("adminProductForm.slugHelp")}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="price_cents">{t("adminProductForm.priceCents")}</Label>
                            <Input
                                id="price_cents"
                                name="price_cents"
                                type="number"
                                defaultValue={product?.price_cents}
                                required
                                placeholder={t("adminProductForm.priceHint")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stock">{t("adminProductForm.stock")}</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                defaultValue={product?.stock ?? 0}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category_id">{t("adminProductForm.category")}</Label>
                        <Select name="category_id" defaultValue={product?.category_id || undefined} required>
                            <SelectTrigger>
                                <SelectValue placeholder={t("adminProductForm.selectCategory")} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age_min">{t("adminProductForm.minAge")}</Label>
                            <Input id="age_min" name="age_min" type="number" defaultValue={product?.age_min || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age_max">{t("adminProductForm.maxAge")}</Label>
                            <Input id="age_max" name="age_max" type="number" defaultValue={product?.age_max || ""} />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>{t("adminProductForm.productImage")}</Label>
                        <div
                            className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-4 min-h-[200px] cursor-pointer hover:bg-secondary/50 transition-colors relative overflow-hidden"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt={t("adminProductForm.previewAlt")} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-muted-foreground p-8">
                                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                                    <p>{t("adminProductForm.clickUpload")}</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </div>
                        {imagePreview && (
                            <Button type="button" variant="outline" size="sm" onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                            }}>
                                {t("adminProductForm.removeImage")}
                            </Button>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("adminProductForm.description")}</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={product?.description || ""}
                            rows={5}
                            placeholder={t("adminProductForm.descriptionPlaceholder")}
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-background">
                        <Label htmlFor="is_active" className="cursor-pointer">{t("adminProductForm.activeStatus")}</Label>
                        <Switch id="is_active" name="is_active" defaultChecked={product?.is_active ?? true} />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => router.back()}>{t("adminProductForm.cancel")}</Button>
                <Button type="submit" disabled={loading} className="min-w-[150px]">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : (product ? t("adminProductForm.updateProduct") : t("adminProductForm.createProduct"))}
                </Button>
            </div>
        </form>
    );
}
