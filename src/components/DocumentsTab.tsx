import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Calendar,
  User,
  Hospital,
  Phone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  RefreshCw,
  FolderOpen,
  FileCheck,
  AlertCircle,
  FileCode,
  Download,
  Printer,
  FileDown,
} from 'lucide-react';
import { MedicalDocument, DocumentCategory, FullCarePlan, MoodLogEntry } from '../types';
import { DownloadSummaryModal } from './DownloadSummaryModal';
import { generateMedicalSummaryText, downloadTextFile } from '../utils/summaryExport';

interface DocumentsTabProps {
  documents: MedicalDocument[];
  onOpenAddModal: () => void;
  onDeleteDocument: (docId: string) => void;
  onReanalyzeAll: () => Promise<void>;
  isAnalyzing: boolean;
  onResetToDefault: () => void;
  carePlan: FullCarePlan;
  moodLogs: MoodLogEntry[];
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onOpenAddModal,
  onDeleteDocument,
  onReanalyzeAll,
  isAnalyzing,
  onResetToDefault,
  carePlan,
  moodLogs,
}) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | DocumentCategory>('ALL');
  const [expandedDocIds, setExpandedDocIds] = useState<Record<string, boolean>>({
    'doc-recent-001': true,
  });
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleQuickDownloadTxt = () => {
    const textContent = generateMedicalSummaryText(carePlan, documents, moodLogs);
    const sanitizedName = (carePlan.patientName || 'patient')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const filename = `medicare-summary-${sanitizedName}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadTextFile(filename, textContent);
  };

  const toggleExpand = (id: string) => {
    setExpandedDocIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDocs = documents.filter((doc) => {
    if (filterCategory === 'ALL') return true;
    return doc.category === filterCategory;
  });

  const getCategoryBadge = (cat: DocumentCategory) => {
    switch (cat) {
      case 'RECENT_VISIT':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
            Recent Visit / Prescription
          </span>
        );
      case 'PAST_HISTORY':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Past Medical History
          </span>
        );
      case 'LAB_REPORT':
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            Lab Diagnostic Report
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
            Medical Record
          </span>
        );
    }
  };

  return (
    <div id="documents-tab" className="space-y-6">
      <div className="space-y-6 print:hidden">
        {/* Header Actions Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-700">
              <FolderOpen className="w-4 h-4" />
              <span>Medical Records Vault</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Your Medical History & Recent Prescriptions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Upload past medical records and recent doctor consultation notes. The AI automatically synthesizes them to build your medication schedule, eating instructions, and restock alarms.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="upload-new-doc-btn"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Document</span>
            </button>

            <button
              id="open-download-summary-btn"
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-xs active:scale-95 transition-all"
              title="Download or print care plan, medication history, and mood trends summary"
            >
              <FileDown className="w-4 h-4 text-teal-400" />
              <span>Download Summary</span>
            </button>

            <button
              id="reanalyze-all-btn"
              onClick={onReanalyzeAll}
              disabled={isAnalyzing || documents.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all disabled:opacity-50"
              title="Re-run AI to synthesize updated timetable from all stored documents"
            >
              <RefreshCw className={`w-4 h-4 text-teal-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Synthesizing...' : 'Sync Routine'}</span>
            </button>
          </div>
        </div>

        {/* Clinical Export Quick-Access Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800 shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-teal-950">Preparing for a doctor consultation? </span>
              <span className="text-slate-600">
                Export your complete care plan, active prescriptions, restock needs, and recent mood trends.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              id="quick-download-txt-btn"
              onClick={handleQuickDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-teal-900 hover:bg-teal-100/50 font-bold text-xs transition-colors"
              title="Quick download as plain text (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-teal-700" />
              <span>Quick .txt</span>
            </button>

            <button
              id="quick-print-pdf-btn"
              onClick={() => setIsDownloadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition-colors"
              title="Open printable summary / PDF preview"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'ALL', label: `All Documents (${documents.length})` },
              {
                id: 'RECENT_VISIT',
                label: `Recent Visits (${documents.filter((d) => d.category === 'RECENT_VISIT').length})`,
              },
              {
                id: 'PAST_HISTORY',
                label: `Past History (${documents.filter((d) => d.category === 'PAST_HISTORY').length})`,
              },
              {
                id: 'LAB_REPORT',
                label: `Lab Reports (${documents.filter((d) => d.category === 'LAB_REPORT').length})`,
              },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterCategory === f.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={onResetToDefault}
            className="text-xs text-slate-500 hover:text-teal-700 underline font-medium"
            title="Reload default realistic cardiology and diabetes records"
          >
            Reload Sample Records
          </button>
        </div>
      </div>

      {/* Documents List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No documents found in this section</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Click "Upload New Document" to add your past history or latest doctor's note, or reload the sample records.
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4" />
            Upload Document Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDocs.map((doc) => {
            const isExpanded = Boolean(expandedDocIds[doc.id]);

            return (
              <div
                key={doc.id}
                id={`doc-card-${doc.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-teal-300"
              >
                {/* Document Card Header */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(doc.category)}
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {doc.date}
                      </span>
                      {doc.fileName && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                          {doc.fileName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{doc.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>{doc.doctorName}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Hospital className="w-3.5 h-3.5 text-slate-400" />
                        {doc.clinicOrHospital}
                      </span>
                      {doc.doctorPhone && (
                        <a
                          href={`tel:${doc.doctorPhone.replace(/[^0-9+]/g, '')}`}
                          className="flex items-center gap-1 text-red-600 hover:underline font-bold"
                          title="Call this doctor directly"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {doc.doctorPhone}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => toggleExpand(doc.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Doctor Notes'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete this document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Doctor Notes & Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    {/* Diagnoses & Allergies Tags */}
                    {(doc.diagnoses.length > 0 || (doc.allergiesNoted && doc.allergiesNoted.length > 0)) && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {doc.diagnoses.map((diag, i) => (
                          <span
                            key={i}
                            className="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800"
                          >
                            Condition: {diag}
                          </span>
                        ))}
                        {doc.allergiesNoted?.map((allg, i) => (
                          <span
                            key={i}
                            className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1"
                          >
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            Allergy: {allg}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Raw Doctor Writing */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                        <span>Doctor's Written Directives & Prescription Details</span>
                      </div>
                      <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed font-sans sm:font-mono">
                        {doc.doctorNotesRaw}
                      </pre>
                    </div>

                    {/* File Preview if uploaded */}
                    {doc.fileUrl && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                          Attached Medical Image / Prescription Scan
                        </div>
                        <img
                          src={doc.fileUrl}
                          alt={doc.title}
                          className="max-h-64 rounded-lg object-contain border"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>

      {/* Download & Printable Summary Modal */}
      <DownloadSummaryModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        carePlan={carePlan}
        documents={documents}
        moodLogs={moodLogs}
      />
    </div>
  );
};
