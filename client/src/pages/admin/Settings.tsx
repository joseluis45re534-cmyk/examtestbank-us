import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Code2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery<Record<string, string>>({
        queryKey: ["/api/settings"],
    });

    const [formData, setFormData] = useState({
        inject_head: "",
        inject_body_start: "",
        inject_footer: ""
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                inject_head: settings.inject_head || "",
                inject_body_start: settings.inject_body_start || "",
                inject_footer: settings.inject_footer || ""
            });
        }
    }, [settings]);

    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const res = await fetch("/api/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to update settings");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
            toast({ title: "Settings saved successfully" });
        },
        onError: (err: Error) => {
            toast({ title: err.message, variant: "destructive" });
        }
    });

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
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Global site configuration and tag injection</p>
                </div>
                <Button
                    onClick={() => mutation.mutate(formData)}
                    disabled={mutation.isPending}
                    className="gap-2"
                >
                    {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-primary" />
                            Tag Injection Tool
                        </CardTitle>
                        <CardDescription>
                            Add custom scripts or styles (Google Analytics, Facebook Pixel, etc.) to your site.
                            Be careful: incorrect code here can break the website.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="head_tags">Head Tags</Label>
                            <p className="text-xs text-muted-foreground mb-2">Injected before the closing &lt;/head&gt; tag. Ideal for CSS and Meta tags.</p>
                            <Textarea
                                id="head_tags"
                                className="font-mono text-sm h-32 bg-slate-950 text-slate-50"
                                value={formData.inject_head}
                                onChange={e => setFormData({ ...formData, inject_head: e.target.value })}
                                placeholder="<!-- Example: <script async ...></script> -->"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="body_tags">Body Tags (Top)</Label>
                            <p className="text-xs text-muted-foreground mb-2">Injected immediately after the opening &lt;body&gt; tag. Ideal for GTM noscript tags.</p>
                            <Textarea
                                id="body_tags"
                                className="font-mono text-sm h-32 bg-slate-950 text-slate-50"
                                value={formData.inject_body_start}
                                onChange={e => setFormData({ ...formData, inject_body_start: e.target.value })}
                                placeholder="<noscript>...</noscript>"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="footer_tags">Footer Tags</Label>
                            <p className="text-xs text-muted-foreground mb-2">Injected before the closing &lt;/body&gt; tag. Ideal for tracking scripts.</p>
                            <Textarea
                                id="footer_tags"
                                className="font-mono text-sm h-32 bg-slate-950 text-slate-50"
                                value={formData.inject_footer}
                                onChange={e => setFormData({ ...formData, inject_footer: e.target.value })}
                                placeholder="<script>console.log('Site loaded');</script>"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
