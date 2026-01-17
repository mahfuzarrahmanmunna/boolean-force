// // src/app/dashboard/submit-task/page.jsx
// "use client";

// import { useState, useEffect, useRef } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import {
//     Upload,
//     FileText,
//     Calendar,
//     Clock,
//     AlertCircle,
//     CheckCircle,
//     X,
//     Save,
//     Plus,
//     Trash2,
//     Paperclip,
//     Download,
//     Eye,
//     User,
//     MapPin,
//     Briefcase,
//     Target,
//     Star,
//     BarChart3,
//     TrendingUp,
//     Filter,
//     Search,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight
// } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// export default function SubmitTaskPage() {
//     const { data: session, status } = useSession();
//     const router = useRouter();

//     // Form state
//     const [taskData, setTaskData] = useState({
//         title: '',
//         description: '',
//         category: '',
//         priority: 'medium',
//         dueDate: '',
//         estimatedHours: '',
//         assignedTo: '',
//         tags: [],
//         progress: 0
//     });

//     // File state
//     const [files, setFiles] = useState([]);
//     const [uploadedFiles, setUploadedFiles] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);
//     const fileInputRef = useRef(null);

//     // UI state
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showPreview, setShowPreview] = useState(false);
//     const [activeTab, setActiveTab] = useState('details');
//     const [showSuccessModal, setShowSuccessModal] = useState(false);

//     // Mock data for demonstration
//     const [categories, setCategories] = useState([
//         'Development',
//         'Design',
//         'Marketing',
//         'Research',
//         'Documentation',
//         'Testing',
//         'Other'
//     ]);

//     const [employees, setEmployees] = useState([
//         { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
//         { id: '2', name: 'Bob Williams', email: 'bob@example.com' },
//         { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
//         { id: '4', name: 'Diana Prince', email: 'diana@example.com' }
//     ]);

//     useEffect(() => {
//         if (status === 'loading') return;

//         if (!session) {
//             router.push('/login');
//             return;
//         }

//         // Set default assigned to current user
//         if (session?.user?.name) {
//             setTaskData(prev => ({ ...prev, assignedTo: session.user.name }));
//         }
//     }, [session, status, router]);

//     // Handle file input change
//     const handleFileChange = (e) => {
//         const newFiles = Array.from(e.target.files);
//         setFiles(prev => [...prev, ...newFiles]);
//     };

//     // Handle drag and drop
//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => {
//         setIsDragging(false);
//     };

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);

//         const droppedFiles = Array.from(e.dataTransfer.files);
//         setFiles(prev => [...prev, ...droppedFiles]);
//     };

//     // Remove file from list
//     const removeFile = (index) => {
//         setFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     // Upload files (mock function)
//     const uploadFiles = () => {
//         const newUploadedFiles = files.map(file => ({
//             id: Date.now() + Math.random(),
//             name: file.name,
//             size: (file.size / 1024).toFixed(2) + ' KB',
//             type: file.type,
//             uploadDate: new Date().toISOString()
//         }));

//         setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
//         setFiles([]);
//         toast.success('Files uploaded successfully');
//     };

//     // Handle form input change
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setTaskData(prev => ({ ...prev, [name]: value }));
//     };

//     // Handle tags input
//     const handleTagsChange = (e) => {
//         if (e.key === 'Enter' && e.target.value.trim()) {
//             e.preventDefault();
//             setTaskData(prev => ({
//                 ...prev,
//                 tags: [...prev.tags, e.target.value.trim()]
//             }));
//             e.target.value = '';
//         }
//     };

//     // Remove tag
//     const removeTag = (index) => {
//         setTaskData(prev => ({
//             ...prev,
//             tags: prev.tags.filter((_, i) => i !== index)
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!taskData.title || !taskData.description || !taskData.dueDate) {
//             toast.error('Please fill in all required fields');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             // In a real app, you would send this data to your API
//             // const response = await fetch('/api/tasks', {
//             //     method: 'POST',
//             //     headers: { 'Content-Type': 'application/json' },
//             //     body: JSON.stringify({
//             //         ...taskData,
//             //         files: uploadedFiles,
//             //         submittedBy: session.user.name,
//             //         submittedAt: new Date().toISOString()
//             //     })
//             // });

//             // Mock API call
//             await new Promise(resolve => setTimeout(resolve, 1500));

//             setIsSubmitting(false);
//             setShowSuccessModal(true);
//             toast.success('Task submitted successfully');

//             // Reset form after successful submission
//             setTaskData({
//                 title: '',
//                 description: '',
//                 category: '',
//                 priority: 'medium',
//                 dueDate: '',
//                 estimatedHours: '',
//                 assignedTo: session?.user?.name || '',
//                 tags: [],
//                 progress: 0
//             });
//             setUploadedFiles([]);
//         } catch (error) {
//             console.error('Error submitting task:', error);
//             toast.error('Failed to submit task');
//             setIsSubmitting(false);
//         }
//     };

//     // Download file (mock function)
//     const downloadFile = (file) => {
//         // In a real app, you would download the actual file
//         toast.success(`Downloading ${file.name}`);
//     };

//     // View file (mock function)
//     const viewFile = (file) => {
//         // In a real app, you would open the actual file
//         toast.success(`Viewing ${file.name}`);
//     };

//     if (status === 'loading') {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
//             {/* Header */}
//             <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center py-4">
//                         <div className="flex items-center">
//                             <ChevronLeft
//                                 className="w-5 h-5 text-slate-500 cursor-pointer mr-2"
//                                 onClick={() => router.back()}
//                             />
//                             <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Submit Task</h1>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <button className=" cursor-pointerp-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
//                                 <Search className="w-5 h-5" />
//                             </button>
//                             <div className="relative">
//                                 <button className=" cursor-pointerp-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
//                                     <Filter className="w-5 h-5" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Left Column - Form */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
//                             {/* Tabs */}
//                             <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
//                                 <button
//                                     className={`pb-4 px-1 text-sm font-medium ${activeTab === 'details'
//                                         ? 'text-blue-600 border-b-2 border-blue-600'
//                                         : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
//                                         }`}
//                                     onClick={() => setActiveTab('details')}
//                                 >
//                                     Task Details
//                                 </button>
//                                 <button
//                                     className={`pb-4 px-1 text-sm font-medium ${activeTab === 'files'
//                                         ? 'text-blue-600 border-b-2 border-blue-600'
//                                         : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
//                                         }`}
//                                     onClick={() => setActiveTab('files')}
//                                 >
//                                     Files
//                                 </button>
//                                 <button
//                                     className={`pb-4 px-1 text-sm font-medium ${activeTab === 'preview'
//                                         ? 'text-blue-600 border-b-2 border-blue-600'
//                                         : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
//                                         }`}
//                                     onClick={() => setActiveTab('preview')}
//                                 >
//                                     Preview
//                                 </button>
//                             </div>

//                             {/* Task Details Tab */}
//                             {activeTab === 'details' && (
//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     {/* Title */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Task Title <span className="text-red-500">*</span>
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="title"
//                                             value={taskData.title}
//                                             onChange={handleInputChange}
//                                             className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//                                             placeholder="Enter task title"
//                                             required
//                                         />
//                                     </div>

//                                     {/* Description */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Description <span className="text-red-500">*</span>
//                                         </label>
//                                         <textarea
//                                             name="description"
//                                             value={taskData.description}
//                                             onChange={handleInputChange}
//                                             rows={5}
//                                             className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//                                             placeholder="Describe the task in detail"
//                                             required
//                                         />
//                                     </div>

//                                     {/* Category and Priority */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Category
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     name="category"
//                                                     value={taskData.category}
//                                                     onChange={handleInputChange}
//                                                     className="w-full appearance-none px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
//                                                 >
//                                                     <option value="">Select category</option>
//                                                     {categories.map(category => (
//                                                         <option key={category} value={category}>{category}</option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                                     <ChevronDown className="w-5 h-5 text-slate-400" />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Priority
//                                             </label>
//                                             <div className="grid grid-cols-3 gap-2">
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="radio"
//                                                         name="priority"
//                                                         value="low"
//                                                         checked={taskData.priority === 'low'}
//                                                         onChange={handleInputChange}
//                                                         className="mr-2"
//                                                     />
//                                                     <span className="text-sm">Low</span>
//                                                 </label>
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="radio"
//                                                         name="priority"
//                                                         value="medium"
//                                                         checked={taskData.priority === 'medium'}
//                                                         onChange={handleInputChange}
//                                                         className="mr-2"
//                                                     />
//                                                     <span className="text-sm">Medium</span>
//                                                 </label>
//                                                 <label className="flex items-center">
//                                                     <input
//                                                         type="radio"
//                                                         name="priority"
//                                                         value="high"
//                                                         checked={taskData.priority === 'high'}
//                                                         onChange={handleInputChange}
//                                                         className="mr-2"
//                                                     />
//                                                     <span className="text-sm">High</span>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Due Date and Story Point */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Due Date <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     type="date"
//                                                     name="dueDate"
//                                                     value={taskData.dueDate}
//                                                     onChange={handleInputChange}
//                                                     className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//                                                     required
//                                                 />
//                                                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                                     <Calendar className="w-5 h-5 text-slate-400" />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Story Point
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     type="number"
//                                                     name="estimatedHours"
//                                                     value={taskData.estimatedHours}
//                                                     onChange={handleInputChange}
//                                                     min="0"
//                                                     step="0.5"
//                                                     className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//                                                     placeholder="0"
//                                                 />
//                                                 <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                                     <Clock className="w-5 h-5 text-slate-400" />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Assigned To */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Assigned To
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 name="assignedTo"
//                                                 value={taskData.assignedTo}
//                                                 onChange={handleInputChange}
//                                                 className="w-full appearance-none px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white pr-10"
//                                             >
//                                                 {employees.map(employee => (
//                                                     <option key={employee.id} value={employee.name}>{employee.name}</option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                                                 <ChevronDown className="w-5 h-5 text-slate-400" />
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Tags */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Tags
//                                         </label>
//                                         <div className="flex flex-wrap gap-2 mb-2">
//                                             {taskData.tags.map((tag, index) => (
//                                                 <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                                                     {tag}
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeTag(index)}
//                                                         className="ml-2 text-blue-500 hover:text-blue-700"
//                                                     >
//                                                         <X className="w-3 h-3" />
//                                                     </button>
//                                                 </span>
//                                             ))}
//                                         </div>
//                                         <input
//                                             type="text"
//                                             placeholder="Add tags and press Enter"
//                                             onKeyDown={handleTagsChange}
//                                             className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
//                                         />
//                                     </div>

//                                     {/* Progress */}
//                                     <div>
//                                         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Progress: {taskData.progress}%
//                                         </label>
//                                         <input
//                                             type="range"
//                                             name="progress"
//                                             value={taskData.progress}
//                                             onChange={handleInputChange}
//                                             min="0"
//                                             max="100"
//                                             className="w-full"
//                                         />
//                                     </div>

//                                     {/* Submit Button */}
//                                     <div className="flex justify-end">
//                                         <button
//                                             type="submit"
//                                             disabled={isSubmitting}
//                                             className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                                         >
//                                             {isSubmitting ? (
//                                                 <>
//                                                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                                                     Submitting...
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <Save className="w-4 h-4 mr-2" />
//                                                     Submit Task
//                                                 </>
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>
//                             )}

//                             {/* Files Tab */}
//                             {activeTab === 'files' && (
//                                 <div className="space-y-6">
//                                     {/* File Upload Area */}
//                                     <div
//                                         className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-600'
//                                             }`}
//                                         onDragOver={handleDragOver}
//                                         onDragLeave={handleDragLeave}
//                                         onDrop={handleDrop}
//                                     >
//                                         <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
//                                         <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                             Drag and drop your files here
//                                         </p>
//                                         <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
//                                             or
//                                         </p>
//                                         <button
//                                             type="button"
//                                             onClick={() => fileInputRef.current?.click()}
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                         >
//                                             Browse Files
//                                         </button>
//                                         <input
//                                             ref={fileInputRef}
//                                             type="file"
//                                             multiple
//                                             onChange={handleFileChange}
//                                             className="hidden"
//                                         />
//                                     </div>

//                                     {/* File List */}
//                                     {files.length > 0 && (
//                                         <div className="space-y-2">
//                                             <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Files to Upload
//                                             </h3>
//                                             {files.map((file, index) => (
//                                                 <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
//                                                     <div className="flex items-center">
//                                                         <FileText className="w-5 h-5 text-slate-400 mr-2" />
//                                                         <div>
//                                                             <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
//                                                             <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
//                                                         </div>
//                                                     </div>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => removeFile(index)}
//                                                         className="text-red-500 hover:text-red-700"
//                                                     >
//                                                         <Trash2 className="w-4 h-4" />
//                                                     </button>
//                                                 </div>
//                                             ))}
//                                             <div className="flex justify-end mt-4">
//                                                 <button
//                                                     type="button"
//                                                     onClick={uploadFiles}
//                                                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                                 >
//                                                     Upload Files
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Uploaded Files */}
//                                     {uploadedFiles.length > 0 && (
//                                         <div className="space-y-2">
//                                             <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
//                                                 Uploaded Files
//                                             </h3>
//                                             {uploadedFiles.map((file, index) => (
//                                                 <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
//                                                     <div className="flex items-center">
//                                                         <FileText className="w-5 h-5 text-green-500 mr-2" />
//                                                         <div>
//                                                             <p className="text-sm font-medium text-slate-900 dark:text-white">{file.name}</p>
//                                                             <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex space-x-2">
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => viewFile(file)}
//                                                             className="text-blue-500 hover:text-blue-700"
//                                                         >
//                                                             <Eye className="w-4 h-4" />
//                                                         </button>
//                                                         <button
//                                                             type="button"
//                                                             onClick={() => downloadFile(file)}
//                                                             className="text-blue-500 hover:text-blue-700"
//                                                         >
//                                                             <Download className="w-4 h-4" />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             )}

//                             {/* Preview Tab */}
//                             {activeTab === 'preview' && (
//                                 <div className="space-y-6">
//                                     <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
//                                         <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">
//                                             Task Preview
//                                         </h3>
//                                         <div className="space-y-4">
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</h4>
//                                                 <p className="text-slate-900 dark:text-white">
//                                                     {taskData.title || 'Not specified'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</h4>
//                                                 <p className="text-slate-900 dark:text-white">
//                                                     {taskData.description || 'Not specified'}
//                                                 </p>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div>
//                                                     <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</h4>
//                                                     <p className="text-slate-900 dark:text-white">
//                                                         {taskData.category || 'Not specified'}
//                                                     </p>
//                                                 </div>
//                                                 <div>
//                                                     <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</h4>
//                                                     <p className="text-slate-900 dark:text-white">
//                                                         {taskData.priority || 'Not specified'}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 <div>
//                                                     <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</h4>
//                                                     <p className="text-slate-900 dark:text-white">
//                                                         {taskData.dueDate ? new Date(taskData.dueDate).toLocaleDateString() : 'Not specified'}
//                                                     </p>
//                                                 </div>
//                                                 <div>
//                                                     <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Story Point</h4>
//                                                     <p className="text-slate-900 dark:text-white">
//                                                         {taskData.estimatedHours || 'Not specified'}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned To</h4>
//                                                 <p className="text-slate-900 dark:text-white">
//                                                     {taskData.assignedTo || 'Not specified'}
//                                                 </p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</h4>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {taskData.tags.length > 0 ? (
//                                                         taskData.tags.map((tag, index) => (
//                                                             <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
//                                                                 {tag}
//                                                             </span>
//                                                         ))
//                                                     ) : (
//                                                         <span className="text-slate-500 dark:text-slate-400">No tags</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</h4>
//                                                 <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
//                                                     <div
//                                                         className="bg-blue-600 h-2.5 rounded-full"
//                                                         style={{ width: `${taskData.progress}%` }}
//                                                     ></div>
//                                                 </div>
//                                                 <p className="text-slate-900 dark:text-white mt-1">{taskData.progress}%</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Files</h4>
//                                                 <div className="space-y-2">
//                                                     {uploadedFiles.length > 0 ? (
//                                                         uploadedFiles.map((file, index) => (
//                                                             <div key={index} className="flex items-center">
//                                                                 <FileText className="w-4 h-4 text-green-500 mr-2" />
//                                                                 <span className="text-sm text-slate-900 dark:text-white">{file.name}</span>
//                                                             </div>
//                                                         ))
//                                                     ) : (
//                                                         <span className="text-slate-500 dark:text-slate-400">No files uploaded</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Right Column - Task Statistics */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
//                             <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Task Statistics</h2>
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</span>
//                                     <span className="text-sm font-medium text-slate-900 dark:text-white">24</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Completed</span>
//                                     <span className="text-sm font-medium text-green-600 dark:text-green-400">18</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">In Progress</span>
//                                     <span className="text-sm font-medium text-amber-600 dark:text-amber-400">4</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
//                                     <span className="text-sm font-medium text-slate-600 dark:text-slate-400">2</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
//                             <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Priority Distribution</h2>
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
//                                         <span className="text-sm text-slate-600 dark:text-slate-400">High Priority</span>
//                                     </div>
//                                     <span className="text-sm font-medium text-slate-900 dark:text-white">8</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
//                                         <span className="text-sm text-slate-600 dark:text-slate-400">Medium Priority</span>
//                                     </div>
//                                     <span className="text-sm font-medium text-slate-900 dark:text-white">12</span>
//                                 </div>
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center">
//                                         <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
//                                         <span className="text-sm text-slate-600 dark:text-slate-400">Low Priority</span>
//                                     </div>
//                                     <span className="text-sm font-medium text-slate-900 dark:text-white">4</span>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
//                             <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
//                             <div className="space-y-4">
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3"></div>
//                                     <div>
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">New task submitted</p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-500">2 hours ago</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3"></div>
//                                     <div>
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">Task completed</p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-500">5 hours ago</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full mt-1.5 mr-3"></div>
//                                     <div>
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">Task updated</p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-500">1 day ago</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start">
//                                     <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-3"></div>
//                                     <div>
//                                         <p className="text-sm text-slate-600 dark:text-slate-400">Task overdue</p>
//                                         <p className="text-xs text-slate-500 dark:text-slate-500">2 days ago</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Success Modal */}
//             {showSuccessModal && (
//                 <div className="fixed inset-0 z-50 overflow-y-auto">
//                     <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//                         {/* <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//                             <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//                         </div> */}
//                         <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
//                             <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
//                                 <div className="flex items-center justify-center">
//                                     <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
//                                         <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
//                                     </div>
//                                     <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
//                                         <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white" id="modal-title">
//                                             Task Submitted Successfully
//                                         </h3>
//                                         <div className="mt-2">
//                                             <p className="text-sm text-slate-500 dark:text-slate-400">
//                                                 Your task has been submitted and is now being processed.
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowSuccessModal(false)}
//                                     className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
//                                 >
//                                     Close
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


// src/app/dashboard/submit-task/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Upload,
    FileText,
    Calendar,
    CheckCircle,
    AlertCircle,
    X,
    Save,
    Users,
    Briefcase,
    Clock,
    ChevronLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TeamLeaderSubmitPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State
    const [teamInfo, setTeamInfo] = useState(null);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notes, setNotes] = useState('');
    const [files, setFiles] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        // Fetch team leader's projects
        fetchTeamLeaderProjects();
    }, [session, status, router]);

    const fetchTeamLeaderProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/projects/team-leader');
            const data = await response.json();
            
            if (data.success) {
                setTeamInfo(data.data.team);
                setProjects(data.data.projects);
            } else {
                toast.error(data.error || 'Failed to load projects');
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error('Failed to load projects');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setNotes('');
        setFiles([]);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!selectedProject) {
            toast.error('Please select a project');
            return;
        }

        if (!notes.trim()) {
            toast.error('Please add submission notes');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare files data
            const filesData = await Promise.all(
                files.map(async (file) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    // In real app, upload to cloud storage here
                    url: `uploads/${Date.now()}-${file.name}`
                }))
            );

            const response = await fetch('/api/projects/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: selectedProject._id,
                    notes: notes,
                    files: filesData
                })
            });

            const result = await response.json();

            if (result.success) {
                setShowSuccess(true);
                toast.success('Project submitted successfully!');
                
                // Refresh projects list
                fetchTeamLeaderProjects();
                // Reset form
                setTimeout(() => {
                    setSelectedProject(null);
                    setNotes('');
                    setFiles([]);
                    setShowSuccess(false);
                }, 3000);
            } else {
                toast.error(result.error || 'Failed to submit project');
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            toast.error('Failed to submit project');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <ChevronLeft
                                className="w-5 h-5 text-gray-500 cursor-pointer mr-2"
                                onClick={() => router.back()}
                            />
                            <h1 className="text-xl font-semibold text-gray-900">
                                Submit Project (Team Leader)
                            </h1>
                        </div>
                        {teamInfo && (
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{teamInfo.name}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800">Project submitted successfully!</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Projects List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Briefcase className="w-5 h-5 mr-2" />
                                Select Project to Submit
                            </h2>
                            
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                    <p className="mt-2 text-sm text-gray-500">Loading projects...</p>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="text-center py-8 border border-gray-300 rounded-lg">
                                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No pending projects to submit</p>
                                    <p className="text-sm text-gray-400 mt-1">All projects have been submitted or completed</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {projects.map(project => (
                                        <div
                                            key={project._id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedProject?._id === project._id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => handleProjectSelect(project)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900">{project.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                        {project.description}
                                                    </p>
                                                    
                                                    <div className="flex items-center space-x-4 mt-3">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            project.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {project.priority}
                                                        </span>
                                                        <span className="flex items-center text-sm text-gray-500">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Due: {new Date(project.dueDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="ml-4">
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {project.progress}%
                                                        </div>
                                                        <div className="text-xs text-gray-500">Progress</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submission Form */}
                        {selectedProject && (
                            <div className="mt-6 bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Submit: {selectedProject.title}
                                </h2>
                                
                                <div className="space-y-6">
                                    {/* Submission Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Submission Notes *
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Describe what has been completed, any challenges faced, and final outcomes..."
                                            required
                                        />
                                    </div>

                                    {/* File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Attach Supporting Files
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-sm text-gray-500 mb-2">
                                                Drag and drop files here or click to browse
                                            </p>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                                            >
                                                Browse Files
                                            </label>
                                        </div>

                                        {/* File List */}
                                        {files.length > 0 && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Selected Files ({files.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {files.map((file, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                            <div className="flex items-center">
                                                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                                                <span className="text-sm text-gray-700">{file.name}</span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeFile(index)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4 border-t">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting || !notes.trim()}
                                            className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Submit Project for Review
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Once submitted, the project will be sent to admin for review
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Info Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                <Users className="w-5 h-5 inline mr-2" />
                                Team Leader Instructions
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-sm font-medium">1</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900">Select Project</h3>
                                        <p className="text-sm text-gray-500">Choose a project assigned to your team</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-sm font-medium">2</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900">Add Notes</h3>
                                        <p className="text-sm text-gray-500">Describe what has been completed</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-sm font-medium">3</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900">Attach Files</h3>
                                        <p className="text-sm text-gray-500">Upload supporting documents if needed</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-sm font-medium">4</span>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900">Submit</h3>
                                        <p className="text-sm text-gray-500">Admin will review and approve</p>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Box */}
                            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                                        <p className="text-xs text-yellow-700 mt-1">
                                            Only team leaders can submit projects. Once submitted, the project status cannot be changed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}