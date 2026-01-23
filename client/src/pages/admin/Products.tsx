import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminProducts() {
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Mock Mutation for Deleting Product
    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            console.log("Deleting product", id);
            return new Promise(resolve => setTimeout(resolve, 500));
        },
        onSuccess: () => {
            toast({ title: "Product deleted (Simulated)" });
            // In real app: queryClient.invalidateQueries({ queryKey: ["/api/products"] });
        }
    });

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

    const getCategoryName = (id: number) => {
        return categories.find((c: any) => c.id === id)?.name || "Unknown";
    };

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Products</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Product Name</Label>
                                <Input placeholder="e.g. Nursing Test Bank 2024" />
                            </div>
                            <div className="space-y-2">
                                <Label>Price ($)</Label>
                                <Input type="number" placeholder="29.99" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input placeholder="Nursing" />
                            </div>
                            <Button className="w-full" onClick={() => {
                                toast({ title: "Product added (Simulated)" });
                                setIsDialogOpen(false);
                            }}>
                                Save Product
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-10 h-10 rounded object-cover bg-slate-100"
                                    />
                                </TableCell>
                                <TableCell className="font-medium max-w-[300px] truncate" title={product.title}>
                                    {product.title}
                                </TableCell>
                                <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-red-600"
                                        onClick={() => {
                                            if (confirm("Are you sure you want to delete this product?")) {
                                                deleteMutation.mutate(product.id);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminLayout>
    );
}
