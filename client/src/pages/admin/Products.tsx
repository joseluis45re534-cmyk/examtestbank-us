import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export default function AdminProducts() {
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        categoryId: "",
        shortDescription: "",
        longDescription: "",
        imageUrl: "",
        author: "",
        edition: ""
    });

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                title: editingProduct.title,
                price: editingProduct.price.toString(),
                categoryId: editingProduct.categoryId.toString(),
                shortDescription: editingProduct.shortDescription,
                longDescription: editingProduct.longDescription,
                imageUrl: editingProduct.imageUrl,
                author: editingProduct.author || "",
                edition: editingProduct.edition || ""
            });
        } else {
            setFormData({
                title: "",
                price: "",
                categoryId: "1",
                shortDescription: "",
                longDescription: "",
                imageUrl: "",
                author: "",
                edition: ""
            });
        }
    }, [editingProduct, isDialogOpen]);

    // Create/Update Product Mutation
    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            const isEdit = !!editingProduct;
            const url = isEdit ? `/api/products/${editingProduct.id}` : "/api/products";
            const method = isEdit ? "PATCH" : "POST";

            const payload = {
                ...data,
                price: data.price.toString(),
                categoryId: parseInt(data.categoryId),
                slug: data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
            };

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to save product");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({ title: editingProduct ? "Product updated" : "Product created" });
            setIsDialogOpen(false);
            setEditingProduct(null);
        },
        onError: (error: Error) => {
            toast({ title: error.message, variant: "destructive" });
        }
    });

    // Delete Product Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete product");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            toast({ title: "Product deleted" });
        },
        onError: () => {
            toast({ title: "Failed to delete product", variant: "destructive" });
        }
    });

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const isLoading = productsLoading || categoriesLoading;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your catalog of test banks and resources</p>
                </div>
                <Button onClick={handleAdd} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4 md:col-span-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Product Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Lewis's Medical-Surgical Nursing 11th Edition Test Bank"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="25.00"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={val => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Author (Optional)</Label>
                            <Input
                                id="author"
                                value={formData.author}
                                onChange={e => setFormData({ ...formData, author: e.target.value })}
                                placeholder="e.g. Lewis"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edition">Edition (Optional)</Label>
                            <Input
                                id="edition"
                                value={formData.edition}
                                onChange={e => setFormData({ ...formData, edition: e.target.value })}
                                placeholder="e.g. 11th Edition"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="image">Image URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="image"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                                {formData.imageUrl && (
                                    <div className="w-10 h-10 border rounded overflow-hidden flex-shrink-0">
                                        <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="shortDesc">Short Description</Label>
                            <Input
                                id="shortDesc"
                                value={formData.shortDescription}
                                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                                placeholder="Brief summary for listings"
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="longDesc">Full Description (Supports newlines)</Label>
                            <Textarea
                                id="longDesc"
                                className="h-32"
                                value={formData.longDescription}
                                onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                                placeholder="Detailed product information..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
                            {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {editingProduct ? "Update Product" : "Create Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No products found. Add your first one above.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 border flex items-center justify-center overflow-hidden">
                                            {product.imageUrl ? (
                                                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[400px]">
                                        <div className="truncate" title={product.title}>{product.title}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">ID: {product.id} | {product.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal capitalize">
                                            {categories.find((c: any) => c.id === product.categoryId)?.name || "Nursing"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-primary">
                                        ${Number(product.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-slate-600 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to delete this product?")) {
                                                        deleteMutation.mutate(product.id);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
