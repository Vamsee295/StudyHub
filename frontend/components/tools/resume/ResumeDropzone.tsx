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

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="bg-card rounded-2xl border-[1.5px] border-hair p-6 sm:p-8 flex flex-col h-full justify-center items-center">
      <h2 className="label-cond text-[22px] mb-2">Upload your resume</h2>
      <p className="text-mute text-sm mb-8 text-center max-w-md">
        We’ll parse your resume and evaluate it against typical placement ATS systems to give you actionable feedback.
      </p>
      
      <div 
        className={cn(
          "w-full max-w-lg border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center text-center cursor-pointer relative",
          dragActive ? "border-accent bg-accent-soft" : "border-ink/25 hover:border-line hover:bg-card-2",
          selectedFile ? "border-note bg-success-soft/50" : "",
          isAnalyzing ? "opacity-50 pointer-events-none" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openPicker();
          }
        }}
        aria-label="Choose a resume file"
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
            <div className="w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-note" />
            </div>
            <p className="text-note font-medium">{selectedFile.name}</p>
            <p className="text-note text-xs mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            <button 
              className="mt-6 px-6 py-2.5 bg-accent text-paper rounded-lg font-medium hover:bg-accent transition-colors"
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
            <div className="w-16 h-16 bg-accent-soft rounded-full flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-accent" />
            </div>
            <p className="text-body font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-mute text-xs mb-4">PDF or DOCX (Max 5MB)</p>
          </>
        )}
      </div>

      {!selectedFile && (
        <div className="mt-8 flex flex-col items-center">
          <span className="text-sm text-mute mb-4">OR</span>
          <button 
            onClick={() => onAnalyze(null)}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-paper-2 border-[1.5px] border-hair text-body rounded-lg hover:bg-card-2 transition-colors font-medium text-sm"
          >
            <FileText className="w-4 h-4 text-accent" />
            Try with Sample SDE Resume
          </button>
        </div>
      )}
      
      {isAnalyzing && (
        <div className="mt-8 flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-accent-line border-t-accent rounded-full animate-spin mb-3"></div>
          <p className="text-accent-ink font-medium animate-pulse">Analyzing resume structure and keywords...</p>
        </div>
      )}
    </div>
  );
}
