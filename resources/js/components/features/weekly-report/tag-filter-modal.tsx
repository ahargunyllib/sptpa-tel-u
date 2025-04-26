"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import type { Tag } from "@/types";

interface TagFilterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tags: Tag[];
    selectedTags: string[];
    onApplyFilter: (tagIds: string[]) => void;
}

export function TagFilterModal({
    open,
    onOpenChange,
    tags,
    selectedTags = [],
    onApplyFilter,
}: TagFilterModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTagIds, setSelectedTagIds] =
        useState<string[]>(selectedTags);

    // Reset selected tags when modal opens with new selectedTags prop
    useEffect(() => {
        if (open) {
            setSelectedTagIds(selectedTags);
        }
    }, [open, selectedTags]);

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleTag = (tagId: string) => {
        setSelectedTagIds((prev) =>
            prev.includes(tagId)
                ? prev.filter((id) => id !== tagId)
                : [...prev, tagId]
        );
    };

    const handleApply = () => {
        onApplyFilter(selectedTagIds);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tag</DialogTitle>
                    <DialogDescription>
                        Pilih tag weekly report yang ingin ditampilkan
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <Input
                        placeholder="Cari tag"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />

                    <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Tags</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            {filteredTags.map((tag) => (
                                // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
                                    key={tag.id}
                                    className="flex items-center gap-2"
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    <div
                                        className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer ${
                                            selectedTagIds.includes(tag.id)
                                                ? "bg-primary text-white"
                                                : "border border-gray-300"
                                        }`}
                                    >
                                        {selectedTagIds.includes(tag.id) && (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </div>
                                    <span className="text-sm">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Batalkan
                    </Button>
                    <Button type="button" onClick={handleApply}>
                        Tampilkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
