import Link from "next/link";
import { Button } from "@/components/ui/button";
import { adminListProducts, deleteProduct } from "@/lib/data/products";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getServerTranslator } from "@/lib/i18n.server";
import { formatCurrency, getLocale } from "@/lib/i18n";

export default async function AdminProductsPage() {
    const { t, lang } = await getServerTranslator();
    const locale = getLocale(lang);
    const products = await adminListProducts(true);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">{t("adminProducts.title")}</h1>
                    <p className="text-muted-foreground">{t("adminProducts.subtitle")}</p>
                </div>
                <Button asChild className="rounded-xl font-bold bg-primary hover:bg-primary/90">
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" />
                        {t("adminProducts.addProduct")}
                    </Link>
                </Button>
            </div>

            <div className="border border-border/50 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[100px]">{t("common.image")}</TableHead>
                            <TableHead>{t("common.title")}</TableHead>
                            <TableHead>{t("common.category")}</TableHead>
                            <TableHead>{t("common.price")}</TableHead>
                            <TableHead>{t("common.stock")}</TableHead>
                            <TableHead>{t("common.status")}</TableHead>
                            <TableHead className="text-right">{t("common.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.image_urls?.[0] ? (
                                        <img
                                            src={product.image_urls[0]}
                                            alt={product.title}
                                            className="w-12 h-12 rounded-lg object-cover bg-secondary"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-xs">
                                            {t("adminProducts.noImage")}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-bold">{product.title}</TableCell>
                                <TableCell>{(product.categories as any)?.name || t("adminProducts.uncategorized")}</TableCell>
                                <TableCell>
                                    {formatCurrency(locale, product.price_cents / 100, product.currency || "GEL")}
                                </TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    {product.is_active ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                            {t("common.active")}
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
                                            {t("common.inactive")}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {products.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        {t("adminProducts.noProducts")}
                    </div>
                )}
            </div>
        </div>
    );
}
