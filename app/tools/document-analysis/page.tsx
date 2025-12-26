'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Send, Loader2, Upload, FileText, X } from 'lucide-react';
import DownloadButtons from '@/app/components/DownloadButtons';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UploadedDocument {
  name: string;
  content: string;
  size: number;
}

export default function DocumentAnalysisPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Document Analysis tool. Upload a document (PDF or DOCX) and I\'ll help you analyze it for compliance, risk, and improvement opportunities. You can also paste text directly or ask questions about your uploaded document.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    const fileType = file.type;
    
    if (fileType === 'text/plain') {
      return await file.text();
    }
    
    if (fileType === 'application/pdf') {
      // Use pdf.js with legacy build that has worker bundled
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      
      // Use fake worker to avoid CORS issues
      pdfjsLib.GlobalWorkerOptions.workerSrc = '';
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      return fullText;
    }
    
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Use mammoth for DOCX
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }
    
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    
    setUploading(true);
    
    try {
      const content = await extractTextFromFile(file);
      
      if (!content || content.trim().length === 0) {
        throw new Error('No text content found in the document.');
      }
      
      setUploadedDoc({
        name: file.name,
        content: content.trim(),
        size: file.size
      });
      
      // Add a message indicating the document was uploaded
      setMessages(prev => [...prev, 
        { role: 'user', content: `📄 Uploaded document: ${file.name}` },
        { role: 'assistant', content: `I've received your document "${file.name}" (${(file.size / 1024).toFixed(1)} KB, ${content.length.toLocaleString()} characters extracted). I'm ready to analyze it.\n\nWhat would you like me to help you with? For example:\n• Summarize the key points\n• Check for compliance issues\n• Identify risks or concerns\n• Review specific clauses or sections\n• Compare against standard requirements` }
      ]);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to process the document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const clearDocument = () => {
    setUploadedDoc(null);
    setMessages([{
      role: 'assistant',
      content: 'Document cleared. Upload a new document or paste text to analyze.'
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Build context with document content if available
      let contextMessage = `[Document Analysis Context]`;
      if (uploadedDoc) {
        // Include document content (truncated if very large)
        const docContent = uploadedDoc.content.length > 50000 
          ? uploadedDoc.content.substring(0, 50000) + '\n\n[Document truncated due to length...]'
          : uploadedDoc.content;
        contextMessage += `\n\n[UPLOADED DOCUMENT: "${uploadedDoc.name}"]\n${docContent}\n[END DOCUMENT]\n\nUser question about the document: `;
      }
      contextMessage += userMessage;

      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextMessage,
          history: messages.filter(m => !m.content.startsWith('📄 Uploaded')).slice(-10)
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="text-slate-400 hover:text-white transition flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Document Analysis</h1>
                </div>
              </div>
            </div>
            <DownloadButtons messages={messages} toolContext="document-analysis" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Area */}
            <div 
              className={`bg-slate-800/50 rounded border-2 border-dashed p-6 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
              />
              
              {uploading ? (
                <div className="py-4">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">Processing document...</p>
                </div>
              ) : uploadedDoc ? (
                <div className="py-2">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                  <p className="text-white font-medium text-sm mb-1 truncate">{uploadedDoc.name}</p>
                  <p className="text-slate-400 text-xs mb-3">
                    {(uploadedDoc.size / 1024).toFixed(1)} KB • {uploadedDoc.content.length.toLocaleString()} chars
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition"
                    >
                      Replace
                    </button>
                    <button
                      onClick={clearDocument}
                      className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-1.5 rounded transition flex items-center space-x-1"
                    >
                      <X className="h-3 w-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium mb-1">Upload Document</p>
                  <p className="text-slate-500 text-xs mb-3">Drag & drop or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Select File
                  </button>
                  <p className="text-slate-600 text-xs mt-3">PDF, DOCX, or TXT</p>
                </div>
              )}
            </div>

            {/* Analysis Areas */}
            <div className="bg-slate-800/50 rounded border border-slate-700 p-6">
              <h3 className="font-bold text-white mb-4">Analysis Capabilities</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Contract clause review</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Compliance assessment</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Risk identification</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Gap analysis</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Improvement recommendations</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Pricing analysis</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2">•</span><span>Terms & conditions review</span></li>
              </ul>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 rounded border border-slate-700 flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-slate-100 border border-slate-700'}`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-[#1e293b]">
                <div className="flex space-x-3">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder={uploadedDoc ? "Ask a question about your document..." : "Upload a document or paste text to analyze..."} 
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    disabled={loading} 
                  />
                  <button 
                    type="submit" 
                    disabled={loading || !input.trim()} 
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
