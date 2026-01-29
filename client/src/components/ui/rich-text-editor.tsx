
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Fallback/Source view
import { Code, Eye } from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [showSource, setShowSource] = useState(false);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'header': [1, 2, 3, 4, false] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link', 'image'
    ];

    const handleChange = (content: string) => {
        // Sanitize on change to keep internal state clean? 
        // Usually better to sanitize on save or render to avoid fighting the editor.
        // But for "Save as clean HTML", we can just pass the raw string and let the parent handle final sanitization or do it here.
        onChange(content);
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div className="flex justify-end absolute top-[-30px] right-0 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSource(!showSource)}
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-primary gap-1"
                >
                    {showSource ? <><Eye className="w-3 h-3" /> Preview</> : <><Code className="w-3 h-3" /> Source</>}
                </Button>
            </div>

            {showSource ? (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                    placeholder="Enter HTML directly..."
                />
            ) : (
                <div className="bg-white rounded-md">
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={handleChange}
                        modules={modules}
                        formats={formats}
                        placeholder={placeholder}
                        className="h-[200px] mb-12 sm:mb-10" // Add margin for the toolbar
                    />
                </div>
            )}
        </div>
    );
}
