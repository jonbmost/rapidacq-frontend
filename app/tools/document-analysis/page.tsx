'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FileSearch, ArrowLeft, Send, Loader2, Download, SearchCheck, Upload, X, FileText } from 'lucide-react';
import DownloadButtons from '@/app/components/DownloadButtons';
import IntakeForm from '@/app/components/IntakeForm';
import { intakeConfigs } from '@/app/config/intakeQuestions';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://acquisition-assistant-266001336704.us-central1.run.app';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function DocumentAnalysisPage() {
  const [showIntake, setShowIntake] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileLoading, setFileLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractPdfText = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker source
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += `\n--- Page ${i} ---\n${pageText}`;
    }
    
    return fullText;
  };

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setFileLoading(true);
    setFileContent('');
    
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const text = await extractPdfText(file);
        setFileContent(text);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        setFileContent(text);
      } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX, we'd need mammoth.js - for now, notify user
        setFileContent(`[Word Document: ${file.name} - Please save as PDF or copy/paste text for full analysis]`);
      } else {
        // Try to read as text
        const text = await file.text();
        setFileContent(text);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContent(`[Error reading file: ${file.name}. Please try copy/pasting the text instead.]`);
    } finally {
      setFileLoading(false);
    }
  };

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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async (userMessage: string) => {
    // Include file content in the message if available
    let fullMessage = userMessage;
    if (fileContent && !messages.some(m => m.content.includes('--- DOCUMENT CONTENT ---'))) {
      const truncatedContent = fileContent.substring(0, 80000); // Limit to ~80k chars
      fullMessage = `${userMessage}\n\n--- DOCUMENT CONTENT ---\n${truncatedContent}`;
      if (fileContent.length > 80000) {
        fullMessage += `\n\n[Note: Document truncated. Original length: ${fileContent.length} characters]`;
      }
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[Document Analysis Context] ${fullMessage}`,
          history: messages
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const handleIntakeComplete = async (generatedPrompt: string) => {
    setShowIntake(false);
    setMessages([{ 
      role: 'assistant', 
      content: `Great! I understand you want to ${generatedPrompt.includes('compliance') ? 'check compliance' : generatedPrompt.includes('risk') ? 'identify risks' : 'analyze'} a document. Please upload your document or paste the text below, and I'll provide a thorough analysis.` 
    }]);
  };

  const handleIntakeSkip = () => {
    setShowIntake(false);
    setMessages([{ role: 'assistant', content: 'Welcome to Document Analysis. I can help you review solicitations, contracts, proposals, and other acquisition documents. Upload a document or paste the text you want analyzed, and I\'ll help identify issues, risks, and opportunities.' }]);
  };

  const exportConversation = () => {
    const content = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-analysis.txt';
    a.click();
  };

  const intakeConfig = intakeConfigs['document-analysis'];

  if (showIntake && intakeConfig) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <header className="bg-[#1e293b] border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-slate-400 hover:text-white transition flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                    <FileSearch className="h-5 w-5 text-blue-500" />
                  </div>
                  <h1 className="text-lg font-bold text-white">Document Analysis</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <IntakeForm config={intakeConfig} onComplete={handleIntakeComplete} onSkip={handleIntakeSkip} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <header className="bg-[#1e293b] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-700"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center">
                  <FileSearch className="h-5 w-5 text-blue-500" />
                </div>
                <h1 className="text-lg font-bold text-white">Document Analysis</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DownloadButtons messages={messages} toolContext="document-analysis" />
              <button onClick={exportConversation} className="flex items-center space-x-2 text-slate-400 hover:text-white transition">
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload Area */}
            <div 
              className={`bg-slate-800/50 backdrop-blur-sm border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInput}
                accept=".txt,.md,.pdf,.docx,.doc"
                className="hidden"
              />
              
              {fileLoading ? (
                <div className="text-center py-4">
                  <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-white">Extracting text...</p>
                </div>
              ) : uploadedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-white font-medium truncate max-w-[150px]">
                        {uploadedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-slate-400 hover:text-red-400 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                  {fileContent && !fileContent.startsWith('[') && (
                    <p className="text-xs text-green-400">
                      ✓ {fileContent.length.toLocaleString()} chars extracted
                    </p>
                  )}
                  {fileContent && fileContent.startsWith('[') && (
                    <p className="text-xs text-yellow-400">
                      ⚠ {fileContent}
                    </p>
                  )}
                </div>
              ) : (
                <div 
                  className="text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-slate-500 mx-auto mb-3" />
                  <p className="text-sm text-white font-medium">Upload Document</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag & drop or click to browse
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    .pdf, .txt, .md
                  </p>
                </div>
              )}
            </div>

            {/* Analysis Types */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6">
              <h3 className="font-bold text-white mb-4 flex items-center">
                <SearchCheck className="h-5 w-5 text-blue-500 mr-2" />
                Analysis Types
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Solicitation review</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Contract clause analysis</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Compliance checking</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Risk identification</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Requirements clarity</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Terms comparison</span></li>
                <li className="flex items-start"><span className="text-blue-500 mr-2 mt-0.5">•</span><span>Gap analysis</span></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-slate-100 border border-slate-700'}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
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
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-[#1e293b]">
                {uploadedFile && fileContent && !fileContent.startsWith('[') && (
                  <div className="mb-3 flex items-center gap-2 text-xs text-green-400">
                    <FileText className="h-3 w-3" />
                    <span>Ready to analyze: {uploadedFile.name}</span>
                  </div>
                )}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={uploadedFile && fileContent ? "Ask a question about the document..." : "Upload a document or paste text here..."}
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading || !input.trim()} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
