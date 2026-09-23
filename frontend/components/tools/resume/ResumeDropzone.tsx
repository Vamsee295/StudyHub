import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeDropzoneProps {
  onAnalyze: (file: File | null) => void;
  isAnalyzing: boolean;
}

export function ResumeDropzone({ onAnalyze, isAnalyzing }: ResumeDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Only accept PDF/DOCX
    if (file.type === 'application/pdf' || file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      setSelectedFile(file);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col h-full justify-center items-center">
      <h2 className="text-xl font-bold text-gray-900 mb-2">Upload your Resume</h2>
      <p className="text-gray-500 text-sm mb-8 text-center max-w-md">
        We'll parse your resume and evaluate it against typical placement ATS systems to give you actionable feedback.
      </p>
      
      <div 
        className={cn(
          "w-full max-w-lg border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center text-center cursor-pointer relative",
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
          selectedFile ? "border-green-500 bg-green-50/50" : "",
          isAnalyzing ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden" 
          onChange={handleChange}
        />
        
        {selectedFile ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-green-800 font-medium">{selectedFile.name}</p>
            <p className="text-green-600 text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze(selectedFile);
              }}
            >
              Analyze Resume
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-xs mb-4">PDF or DOCX (Max 5MB)</p>
          </>
        )}
      </div>

      {!selectedFile && (
        <div className="mt-8 flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-4">OR</span>
          <button 
            onClick={() => onAnalyze(null)}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            <FileText className="w-4 h-4 text-blue-500" />
            Try with Sample SDE Resume
          </button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-8 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-3"></div>
          <p className="text-blue-600 font-medium animate-pulse">Analyzing resume structure and keywords...</p>
        </div>
      )}
    </div>
  );
}
