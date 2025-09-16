import React, { useState, useRef } from 'react';
// Markdown renderer (installed via react-markdown + remark-gfm)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - types will resolve after dependency installation
import ReactMarkdown from 'react-markdown';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import remarkGfm from 'remark-gfm';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UploadIcon, ImageIcon, SendIcon, RefreshCcwIcon, Loader2Icon, BarChart2Icon, DropletIcon } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface RoofAIAnalysis {
  quality: string;
  score: number;
  notes: string[];
  recommendations: string[];
  areaEstimate?: number | null;
  captureQuality: string;
  runoffPotential: string;
  summary?: string;
}

const RoofAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RoofAIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'Upload a rooftop satellite or drone image to begin. I\'ll estimate collection suitability and you can ask follow‑up questions.'
  }]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysis(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const b64 = await toBase64(selectedFile);
      const res = await fetch('/api/roof-ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64, filename: selectedFile.name })
      });
      if (!res.ok) throw new Error('Analysis failed');
      const data: RoofAIAnalysis = await res.json();
      setAnalysis(data);
      setMessages(prev => [...prev, { role: 'assistant', content: `Analysis complete. Score: ${data.score}/100 (Quality: ${data.quality}). ${data.summary || ''}` }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Analysis failed. Please try another image or retry later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setMessages([{ role: 'assistant', content: 'Upload a rooftop image to begin a new analysis.' }]);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatError(null);
    setChatLoading(true);
    try {
      const res = await fetch('/api/roof-ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].filter(m => m.role !== 'system'),
          analysis
        })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e: unknown) {
      setChatError('Failed to get AI response.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had an issue generating a response.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="md:ml-64 p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center"><DropletIcon className="mr-2 text-blue-600" /> Roof AI Analysis</h1>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left / Main Column */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-full md:w-1/2">
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center bg-gray-50">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-72 object-contain rounded" />
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-600 mb-2 font-medium">Drop or Select Roof Image</p>
                      <p className="text-xs text-gray-400 mb-4">Accepted: JPG, PNG • Clear top view preferred</p>
                      <Button variant="outline" size="sm" onClick={triggerFilePicker} icon={<UploadIcon size={16} />}>Choose Image</Button>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Upload roof image" title="Upload roof image" />
                    </>
                  )}
                </div>
                {previewUrl && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={triggerFilePicker} icon={<UploadIcon size={14} />}>Change</Button>
                    <Button variant="primary" size="sm" onClick={runAnalysis} disabled={loading} icon={loading ? <Loader2Icon className="animate-spin" size={16} /> : <BarChart2Icon size={16} />}>{loading ? 'Analysing...' : 'Analyse'}</Button>
                    <Button variant="secondary" size="sm" onClick={reset} icon={<RefreshCcwIcon size={14} />}>Reset</Button>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Result Overview</h2>
                {!analysis && <p className="text-sm text-gray-500">No analysis yet. Upload an image and click Analyse to view AI-derived roof suitability metrics.</p>}
                {analysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">Score</p>
                        <p className="text-2xl font-bold text-blue-700">{analysis.score}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-green-600 font-semibold">Quality</p>
                        <p className="text-xl font-bold text-green-700">{analysis.quality}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">Capture Potential</p>
                        <p className="text-lg font-semibold text-indigo-700">{analysis.runoffPotential}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-amber-600 font-semibold">Capture Quality</p>
                        <p className="text-lg font-semibold text-amber-700">{analysis.captureQuality}</p>
                      </div>
                      {/* Removed Est. Roof Area display as per request */}
                    </div>
                    {analysis.summary && (
                      <div className="bg-white border rounded-lg p-3">
                        <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">AI Summary</p>
                        <p className="text-sm text-gray-700 leading-snug">{analysis.summary}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Observations</p>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                        {analysis.notes.map((n,i)=>(<li key={i}>{n}</li>))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Recommendations</p>
                      <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                        {analysis.recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Technical Notes (Coming Soon)</h2>
            <p className="text-sm text-gray-600 leading-relaxed">This section will display segmentation overlays, contour detection visuals, and runoff pathway estimation once the backend AI and image processing endpoints are integrated. For now, it serves as a placeholder to reserve layout space consistent with other app pages.</p>
          </Card>
        </div>

        {/* Right / Chat Column */}
        <div className="xl:col-span-1">
          <Card className="flex flex-col h-[600px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Ask AI About This Roof</h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((m, idx) => {
                const isUser = m.role === 'user';
                return (
                  <div
                    key={idx}
                    className={`rounded-lg px-3 py-2 text-sm max-w-[85%] prose prose-sm dark:prose-invert ${isUser ? 'bg-blue-600 text-white ml-auto prose-invert' : 'bg-gray-100 text-gray-800'} whitespace-pre-wrap`}
                  >
                    {isUser ? (
                      m.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: (props: React.HTMLAttributes<HTMLUListElement>) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                          ol: (props: React.HTMLAttributes<HTMLOListElement>) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                          strong: (props: React.HTMLAttributes<HTMLElement>) => <strong className="font-semibold" {...props} />,
                          p: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-2 last:mb-0" {...props} />
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                );
              })}
              {chatLoading && <div className="text-xs text-gray-500 italic">Thinking...</div>}
              {chatError && <div className="text-xs text-red-500">{chatError}</div>}
            </div>
            <div className="mt-3 flex items-stretch gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask about debris, slope, filtration..."
                value={chatInput}
                onChange={(e)=>setChatInput(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendChat(); } }}
              />
              <Button variant="primary" size="sm" onClick={sendChat} disabled={chatLoading} icon={<SendIcon size={14} />}>{chatLoading ? '...' : 'Send'}</Button>
            </div>
            <p className="mt-2 text-[11px] text-gray-400">AI responses are illustrative. Actual roof quality assessment will use computer vision models in a future update.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoofAnalysis;
