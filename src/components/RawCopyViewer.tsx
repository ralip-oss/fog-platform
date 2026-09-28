import React, { useState } from 'react';
import { SECTIONS_DATA, TARGET_URL } from '../data/steamAuditData';
import { Search, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

export const RawCopyViewer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const filteredSections = SECTIONS_DATA.filter(section => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const inName = section.name.toLowerCase().includes(term);
    const inCopy = section.rawCopyTranscribed.some(line => line.toLowerCase().includes(term));
    const inGoal = section.functionalGoal.toLowerCase().includes(term);
    return inName || inCopy || inGoal;
  });

  const copySectionText = (sectionId: string, lines: string[]) => {
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search and Header Bar */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-slate-700" />
            Raw Transcribed Content Inspector
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exact extracted text verbatim from <a href={TARGET_URL} target="_blank" rel="noreferrer" className="underline text-slate-700 hover:text-slate-900">{TARGET_URL}</a>.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search raw copy or keywords..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.map(section => (
          <div key={section.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                  {section.order}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {section.name}
                </h3>
              </div>

              <button
                onClick={() => copySectionText(section.id, section.rawCopyTranscribed)}
                className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1.5 transition-colors self-start sm:self-center cursor-pointer"
              >
                {copiedSection === section.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Raw Snippet</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-lg p-3.5 font-mono text-xs space-y-1 border border-slate-800">
              {section.rawCopyTranscribed.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-600 select-none">{String(idx + 1).padStart(2, '0')}.</span>
                  <span className="text-emerald-300 font-medium">{line}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
