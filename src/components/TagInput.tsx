import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function TagInput({ tags, onChange, placeholder = 'Add tag...', className = '' }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();

            // Prevent empty or duplicate tags
            if (newTag && !tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
                onChange([...tags, newTag]);
            }
            setInputValue('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag if backspace is pressed on empty input
            e.preventDefault();
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className={`flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-colors min-h-[42px] ${className}`}>
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="p-0.5 hover:bg-indigo-200 hover:text-indigo-900 rounded-sm transition-colors focus:outline-none"
                        aria-label={`Remove ${tag}`}
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    // Attempt to add whatever is typed on blur as well
                    const newTag = inputValue.trim();
                    if (newTag && !tags.some(tag => tag.toLowerCase() === newTag.toLowerCase())) {
                        onChange([...tags, newTag]);
                    }
                    setInputValue('');
                }}
                placeholder={tags.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] px-1.5 py-1 text-sm bg-transparent outline-none placeholder:text-slate-400"
            />
        </div>
    );
}
