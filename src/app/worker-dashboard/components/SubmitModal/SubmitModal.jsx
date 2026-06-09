// components/SubmitModal.jsx
"use client";

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    FaCloudUploadAlt, FaFile, FaImage, FaVideo, FaFilePdf, FaFileArchive, FaTimes,
    FaPlus, FaSave, FaSpinner, FaExclamationTriangle, FaCheckCircle, FaTrash,
    FaLink, FaCalendarAlt, FaUser, FaTag, FaFlag, FaFolder, FaClock, FaDollarSign,
    FaAlignLeft, FaHeading, FaInfoCircle, FaPaperclip, FaDownload,
    FaUsers
} from 'react-icons/fa';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Form validation schema
const submitSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
    category: z.string().min(1, "Category is required"),
    priority: z.string().min(1, "Priority is required"),
    assignedTo: z.string().optional(),
    dueDate: z.string().optional(),
    estimatedHours: z.string().optional(),
    budget: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional(),
    notes: z.string().optional(),
    externalLinks: z.array(z.string().url("Invalid URL")).optional(),
});

// Constants
const CATEGORIES = [
    { value: 'development', label: 'Development', icon: '💻', color: 'bg-blue-500' },
    { value: 'design', label: 'Design', icon: '🎨', color: 'bg-purple-500' },
    { value: 'marketing', label: 'Marketing', icon: '📢', color: 'bg-pink-500' },
    { value: 'research', label: 'Research', icon: '🔍', color: 'bg-green-500' },
    { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'bg-orange-500' },
    { value: 'testing', label: 'Testing', icon: '🧪', color: 'bg-cyan-500' },
    { value: 'documentation', label: 'Documentation', icon: '📝', color: 'bg-indigo-500' },
    { value: 'other', label: 'Other', icon: '📌', color: 'bg-gray-500' }
];

const PRIORITIES = [
    { value: 'low', label: 'Low', color: 'bg-green-500', icon: '🟢' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', icon: '🟡' },
    { value: 'high', label: 'High', color: 'bg-orange-500', icon: '🟠' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500', icon: '🔴' }
];

const STATUSES = [
    { value: 'draft', label: 'Draft', color: 'bg-gray-500' },
    { value: 'planning', label: 'Planning', color: 'bg-blue-500' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-500' },
    { value: 'review', label: 'Review', color: 'bg-purple-500' },
    { value: 'completed', label: 'Completed', color: 'bg-green-500' }
];

// File type helper
const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <FaImage className="text-blue-500" />;
    if (file.type.startsWith('video/')) return <FaVideo className="text-purple-500" />;
    if (file.type === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    if (file.type.includes('zip') || file.type.includes('rar')) return <FaFileArchive className="text-yellow-500" />;
    return <FaFile className="text-gray-500" />;
};

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main SubmitModal Component
export default function SubmitModal({
    isOpen,
    onClose,
    onSubmit,
    title = "Submit New Item",
    submitButtonText = "Submit",
    initialData = {},
    users = [],
    teams = [],
    maxFileSize = 10 * 1024 * 1024,
    maxFiles = 10
}) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const fileInputRef = useRef(null);

    const form = useForm({
        resolver: zodResolver(submitSchema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            category: initialData.category || '',
            priority: initialData.priority || 'medium',
            assignedTo: initialData.assignedTo || '',
            dueDate: initialData.dueDate || '',
            estimatedHours: initialData.estimatedHours || '',
            budget: initialData.budget || '',
            tags: initialData.tags || [],
            status: initialData.status || 'draft',
            notes: initialData.notes || '',
            externalLinks: initialData.externalLinks || []
        }
    });

    // Handle file selection
    const handleFileSelect = useCallback((selectedFiles) => {
        const newFiles = Array.from(selectedFiles).filter(file => {
            if (file.size > maxFileSize) {
                alert(`File ${file.name} is too large. Maximum size is ${formatFileSize(maxFileSize)}`);
                return false;
            }
            return true;
        });

        if (files.length + newFiles.length > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} files`);
            return;
        }

        setFiles(prev => [...prev, ...newFiles]);
    }, [files.length, maxFileSize, maxFiles]);

    // Drag and drop handlers
    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFiles = e.dataTransfer.files;
        handleFileSelect(droppedFiles);
    }, [handleFileSelect]);

    // Remove file
    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Add tag
    const addTag = (tag) => {
        if (tag && !form.getValues('tags').includes(tag)) {
            form.setValue('tags', [...form.getValues('tags'), tag]);
        }
    };

    // Remove tag
    const removeTag = (tagToRemove) => {
        form.setValue('tags', form.getValues('tags').filter(tag => tag !== tagToRemove));
    };

    // Add external link
    const addExternalLink = (link) => {
        if (link && !form.getValues('externalLinks').includes(link)) {
            form.setValue('externalLinks', [...form.getValues('externalLinks'), link]);
        }
    };

    // Remove external link
    const removeExternalLink = (linkToRemove) => {
        form.setValue('externalLinks', form.getValues('externalLinks').filter(link => link !== linkToRemove));
    };

    // Handle form submission
    const handleSubmitForm = async (data) => {
        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            
            // Add form fields
            Object.keys(data).forEach(key => {
                if (Array.isArray(data[key])) {
                    data[key].forEach(item => formData.append(`${key}[]`, item));
                } else {
                    formData.append(key, data[key]);
                }
            });
            
            // Add files
            files.forEach((file, index) => {
                formData.append(`files[${index}]`, file);
            });
            
            await onSubmit(formData);
            
            // Reset form and close modal
            form.reset();
            setFiles([]);
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FaPlus className="text-primary" />
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below and upload any necessary files
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="files">Files</TabsTrigger>
                            <TabsTrigger value="advanced">Advanced</TabsTrigger>
                        </TabsList>

                        {/* Basic Info Tab */}
                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaHeading className="text-xs" />
                                        Title *
                                    </label>
                                    <Input
                                        {...form.register('title')}
                                        placeholder="Enter title..."
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaFolder className="text-xs" />
                                        Category *
                                    </label>
                                    <Select
                                        value={form.watch('category')}
                                        onValueChange={(value) => form.setValue('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{cat.icon}</span>
                                                        <span>{cat.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.category && (
                                        <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <FaAlignLeft className="text-xs" />
                                    Description *
                                </label>
                                <Textarea
                                    {...form.register('description')}
                                    placeholder="Enter detailed description..."
                                    rows={4}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                                {form.formState.errors.description && (
                                    <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaFlag className="text-xs" />
                                        Priority *
                                    </label>
                                    <Select
                                        value={form.watch('priority')}
                                        onValueChange={(value) => form.setValue('priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRIORITIES.map(priority => (
                                                <SelectItem key={priority.value} value={priority.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span>{priority.icon}</span>
                                                        <span>{priority.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaInfoCircle className="text-xs" />
                                        Status
                                    </label>
                                    <Select
                                        value={form.watch('status')}
                                        onValueChange={(value) => form.setValue('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUSES.map(status => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
                                                        <span>{status.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Details Tab */}
                        <TabsContent value="details" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaUser className="text-xs" />
                                        Assign To
                                    </label>
                                    <Select
                                        value={form.watch('assignedTo')}
                                        onValueChange={(value) => form.setValue('assignedTo', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user or team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Users</div>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <FaUser className="h-3 w-3 text-primary" />
                                                        </div>
                                                        <span>{user.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Teams</div>
                                            {teams.map(team => (
                                                <SelectItem key={team.id} value={team.id}>
                                                    <div className="flex items-center gap-2">
                                                        <FaUsers className="h-4 w-4 text-primary" />
                                                        <span>{team.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaCalendarAlt className="text-xs" />
                                        Due Date
                                    </label>
                                    <Input
                                        type="date"
                                        {...form.register('dueDate')}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaClock className="text-xs" />
                                        Estimated Hours
                                    </label>
                                    <Input
                                        type="number"
                                        {...form.register('estimatedHours')}
                                        placeholder="e.g., 40"
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <FaDollarSign className="text-xs" />
                                        Budget
                                    </label>
                                    <Input
                                        type="number"
                                        {...form.register('budget')}
                                        placeholder="e.g., 5000"
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <FaTag className="text-xs" />
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {form.watch('tags')?.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <FaTimes className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <Input
                                    placeholder="Add a tag and press Enter..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <FaLink className="text-xs" />
                                    External Links
                                </label>
                                <div className="space-y-2">
                                    {form.watch('externalLinks')?.map((link, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                value={link}
                                                readOnly
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeExternalLink(link)}
                                            >
                                                <FaTrash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Input
                                        placeholder="Add a link and press Enter..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addExternalLink(e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Files Tab */}
                        <TabsContent value="files" className="space-y-4">
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                                    isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                                }`}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <FaCloudUploadAlt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <div className="space-y-2">
                                    <p className="text-lg font-medium">
                                        {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        or click to browse
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Maximum {maxFiles} files, {formatFileSize(maxFileSize)} each
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-4"
                                >
                                    <FaPaperclip className="mr-2 h-4 w-4" />
                                    Browse Files
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileSelect(e.target.files)}
                                    className="hidden"
                                />
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Uploaded Files ({files.length})</h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    {getFileIcon(file)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                    {uploadProgress[index] !== undefined && (
                                                        <Progress value={uploadProgress[index]} className="mt-1" />
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Advanced Tab */}
                        <TabsContent value="advanced" className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1">
                                    <FaInfoCircle className="text-xs" />
                                    Additional Notes
                                </label>
                                <Textarea
                                    {...form.register('notes')}
                                    placeholder="Enter any additional notes or comments..."
                                    rows={4}
                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Preview</h4>
                                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="font-medium">Title:</span>
                                        <span>{form.watch('title') || 'Not set'}</span>
                                        <span className="font-medium">Category:</span>
                                        <span>{CATEGORIES.find(c => c.value === form.watch('category'))?.label || 'Not set'}</span>
                                        <span className="font-medium">Priority:</span>
                                        <span>{PRIORITIES.find(p => p.value === form.watch('priority'))?.label || 'Not set'}</span>
                                        <span className="font-medium">Files:</span>
                                        <span>{files.length} file(s)</span>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-[120px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2 h-4 w-4" />
                                    {submitButtonText}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}