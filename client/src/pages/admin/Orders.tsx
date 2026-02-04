import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Loader2, Package, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Order } from "@shared/schema";

interface OrderResponse {
    orders: Order[];
    total: number;
}

export default function AdminOrders() {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useQuery<OrderResponse>({
        queryKey: [`/api/admin/orders?page=${page}&limit=${limit}`],
    });

    const orders = data?.orders || [];
    const totalPages = data?.total ? Math.ceil(data.total / limit) : 0;

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage and track customer purchases</p>
                </div>
            </div>

            <div className="border rounded-lg bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Package className="w-8 h-8 opacity-20" />
                                        <p>No orders found</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id}</TableCell>
                                    <TableCell>{order.name || "N/A"}</TableCell>
                                    <TableCell>{order.email}</TableCell>
                                    <TableCell>
                                        {order.createdAt && format(new Date(order.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "completed" || order.status === "paid" ? "default" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Order Details #{order.id}</DialogTitle>
                                                    <DialogDescription>
                                                        Details for order placed on {order.createdAt && format(new Date(order.createdAt), "PPP")}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <span className="font-bold">Customer:</span>
                                                        <span className="col-span-3">{order.name || "N/A"}</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <span className="font-bold">Email:</span>
                                                        <span className="col-span-3">{order.email}</span>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <span className="font-bold">Status:</span>
                                                        <span className="col-span-3 capitalize">{order.status}</span>
                                                    </div>
                                                    <div className="border-t pt-4 mt-2">
                                                        <h4 className="font-semibold mb-2">Order Data</h4>
                                                        <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto max-h-[200px]">
                                                            {JSON.stringify(order, null, 2)}
                                                        </pre>
                                                    </div>
                                                    {/* Future: Add Items list here if we start storing them relationally */}
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <div className="text-sm font-medium">
                    Page {page} of {Math.max(1, totalPages)}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || isLoading}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </AdminLayout>
    );
}
