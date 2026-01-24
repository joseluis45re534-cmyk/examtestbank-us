import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [location, setLocation] = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        if (token !== "demo_token_valid") {
            setLocation("/admin/login");
        } else {
            setIsAuthorized(true);
        }
    }, [setLocation]);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        setLocation("/admin/login");
    };

    if (!isAuthorized) return null;

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = location === href;
        return (
            <Link href={href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-white border-b z-50 px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold font-display text-primary">Admin</h1>
                <Button variant="ghost" size="icon" onClick={() => {
                    // Simple alert for now, real mobile menu would need a Sheet component
                    // For this MVP, we can just use the same desktop sidebar but handle visibility with CSS or state.
                    const sidebar = document.getElementById('mobile-sidebar');
                    if (sidebar) sidebar.classList.toggle('hidden');
                }}>
                    <LayoutDashboard className="w-6 h-6" />
                </Button>
            </header>

            {/* Sidebar */}
            <aside id="mobile-sidebar" className="w-64 bg-white border-r fixed h-full hidden md:flex flex-col z-40 pt-16 md:pt-0">
                <div className="p-6 border-b hidden md:block">
                    <h1 className="text-xl font-bold font-display text-primary">Admin Panel</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem href="/admin/products" icon={Package} label="Products" />
                    <NavItem href="/admin/orders" icon={ShoppingCart} label="Orders" />
                    <NavItem href="/admin/settings" icon={Settings} label="Settings" />
                </nav>

                <div className="p-4 border-t">
                    <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 pt-24 md:pt-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
