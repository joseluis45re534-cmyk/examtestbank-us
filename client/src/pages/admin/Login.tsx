import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [, setLocation] = useLocation();
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // HARDCODED ADMIN CODE FOR DEMO
        if (code === "admin123") {
            localStorage.setItem("admin_token", "demo_token_valid");
            setLocation("/admin");
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Admin Access</CardTitle>
                    <CardDescription>Enter the secure access code to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Input
                                type="password"
                                placeholder="Access Code"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setError(false);
                                }}
                                className={error ? "border-red-500" : ""}
                            />
                            {error && <p className="text-xs text-red-500 mt-1">Invalid access code</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            Unlock Dashboard
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Hint: Use <strong>admin123</strong>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
