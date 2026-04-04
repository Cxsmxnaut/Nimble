import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { logDebug } from '../lib/debug';
import { 
  CloudUpload, 
  FileText, 
  X, 
  Lightbulb, 
  Trash2,
  Sparkles
} from 'lucide-react';

interface CreateKitProps {
  onGenerate: (title: string, content: string) => void;
}

export const CreateKit = ({ onGenerate }: CreateKitProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12 max-w-3xl">
        <h2 className="text-5xl font-black font-headline text-on-surface leading-[1.1] tracking-tight mb-4">
          Create New Study Kit
        </h2>
        <p className="text-on-surface-variant text-lg leading-relaxed">
          Transform your lecture notes, documents, or raw text into structured study materials using our kinetic intelligence engine.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          {/* Title */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/5">
            <label className="text-xs font-bold uppercase tracking-widest text-primary mb-4 block">Kit Title (Optional)</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank to auto-generate with AI"
              className="w-full bg-surface-container-lowest text-on-surface text-xl font-headline font-semibold p-4 rounded-xl border-none focus:ring-2 focus:ring-primary/40 focus:outline-none transition-all placeholder:text-on-surface-variant/30"
            />
          </div>

          {/* Content */}
          <div className="bg-surface-container rounded-2xl deep-bloom flex flex-col h-[500px] border border-outline-variant/5 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low/50">
              <label className="text-xs font-bold uppercase tracking-widest text-primary">Content Source</label>
              <button 
                onClick={() => setContent('')}
                className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your notes, vocab, or content here to generate questions..."
              className="flex-grow bg-transparent p-8 text-on-surface text-lg leading-relaxed resize-none border-none focus:ring-0 focus:outline-none placeholder:text-on-surface-variant/20 font-sans"
            />
            <div className="p-6 bg-surface-container-high/30 flex justify-end">
              <Button 
                size="lg" 
                onClick={() => {
                  logDebug('create-kit', 'Generate clicked', {
                    titleLength: title.length,
                    contentLength: content.length,
                  });
                  onGenerate(title, content);
                }}
                disabled={!content}
                className="px-10"
              >
                <Sparkles className="w-5 h-5" />
                Generate Questions
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          {/* Upload */}
          <section className="bg-surface-container-low p-8 rounded-2xl flex flex-col gap-6 relative overflow-hidden group border border-outline-variant/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Import Documents</h3>
              <p className="text-sm text-on-surface-variant mb-6">Drop your PDFs, DOCX, or text files here for automated parsing.</p>
              <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-all cursor-pointer bg-surface-container-lowest/50 group/upload">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                  <CloudUpload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-on-surface">Click to upload</span>
                  <p className="text-xs text-on-surface-variant/60 mt-1">Maximum file size: 25MB</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 bg-surface-container-high/40 rounded-xl border border-outline-variant/10">
                <FileText className="w-5 h-5 text-secondary" />
                <div className="flex-grow">
                  <p className="text-xs font-bold text-on-surface truncate">biology_lecture_notes.pdf</p>
                  <p className="text-[10px] text-on-surface-variant/60">Ready to parse • 1.2 MB</p>
                </div>
                <button className="text-on-surface-variant hover:text-error transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="bg-surface-bright/10 border border-outline-variant/10 p-8 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-tertiary w-5 h-5" />
              <h4 className="font-headline font-bold text-tertiary">Pro Tip</h4>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              For the best results with our kinetic intelligence engine, ensure your notes include clear headings and key terms. Use bullet points to help the AI identify relationship clusters.
            </p>
          </section>

          {/* Decorative */}
          <div className="h-48 rounded-2xl overflow-hidden relative border border-outline-variant/10">
            <img 
              src="https://picsum.photos/seed/kinetic/400/300" 
              alt="Abstract" 
              className="w-full h-full object-cover grayscale opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Kinetic Intelligence Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
