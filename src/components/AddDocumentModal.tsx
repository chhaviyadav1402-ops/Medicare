import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  Phone,
  User,
  Hospital,
  Calendar,
  AlertCircle,
  FileUp,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { DocumentCategory, MedicalDocument } from '../types';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (doc: MedicalDocument, analyzeImmediately: boolean) => Promise<void>;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onAddDocument,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<DocumentCategory>('RECENT_VISIT');
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [clinicOrHospital, setClinicOrHospital] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorNotesRaw, setDoctorNotesRaw] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview if it is an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }

      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleFillSample = (type: 'recent' | 'past') => {
    if (type === 'recent') {
      setCategory('RECENT_VISIT');
      setTitle('Recent Pulmonology & Allergy Visit - Dr. Kevin Adams');
      setDoctorName('Dr. Kevin Adams, MD (Pulmonology)');
      setDoctorPhone('+1 (555) 782-9901');
      setClinicOrHospital('St. Jude Chest & Breathing Specialty Center');
      setDate('2026-09-14');
      setDoctorNotesRaw(`VISIT NOTES & NEW PRESCRIPTION:
Patient presenting with nocturnal cough and mild wheezing.
Current diagnosis: Mild Seasonal Allergic Bronchitis.

NEW MEDICATIONS:
1. Montelukast 10mg (Tablet): Take 1 tablet once daily at BEDTIME (10:00 PM). Helps prevent nighttime airway inflammation.
2. Levocetirizine 5mg (Tablet): Take 1 tablet in the EVENING (08:30 PM) after dinner for 7 days. May cause mild drowsiness.
3. Fluticasone Nasal Spray 50mcg: 2 sprays per nostril in the MORNING after waking up.

EATING & LIFESTYLE RULES:
- Avoid cold refrigerated beverages and dairy within 1 hour before bedtime.
- Keep bedroom well-ventilated and dust-free.
- Drink warm water with lemon or herbal tea in the evening.

RESTOCK NOTICE:
- Prescribed 14-day supply of Montelukast and Levocetirizine. Restock if symptoms persist past 10 days.

EMERGENCY CALL CRITERIA:
- Call Dr. Adams at +1 (555) 782-9901 or ER if severe wheezing or stridor occurs.`);
    } else {
      setCategory('PAST_HISTORY');
      setTitle('Past Surgical History & Drug Allergy Summary');
      setDoctorName('Dr. Helena Vance, MD (General Surgery)');
      setDoctorPhone('+1 (555) 349-1122');
      setClinicOrHospital('Mercy University Hospital');
      setDate('2023-08-10');
      setDoctorNotesRaw(`HISTORICAL SUMMARY & CONTRAINDICATIONS:
- Past Laparoscopic Cholecystectomy (Gallbladder Removal, Aug 2023). Uncomplicated recovery.
- Dietary Note from surgery: Patient tolerates low-fat diets best. Avoid excessively greasy or deep-fried foods to prevent biliary colic or diarrhea.
- SEVERE DRUG ALLERGY: Penicillin & Amoxicillin (causes widespread hives and breathing tightness).
- Advised to always carry emergency medical card listing penicillin allergy.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please provide a document title.');
      return;
    }
    if (!doctorNotesRaw.trim() && !selectedFile) {
      setErrorMsg('Please either type what the doctor suggested or upload a document file.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      let base64Data: string | undefined = undefined;
      let mimeType: string | undefined = undefined;

      if (selectedFile) {
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
        base64Data = fileBase64;
        mimeType = selectedFile.type;
      }

      const newDoc: MedicalDocument = {
        id: `doc-${Date.now()}`,
        title: title.trim(),
        category,
        doctorName: doctorName.trim() || 'Attending Physician',
        doctorPhone: doctorPhone.trim() || '+1 (555) 000-0000',
        clinicOrHospital: clinicOrHospital.trim() || 'Medical Clinic',
        date: date || new Date().toISOString().split('T')[0],
        doctorNotesRaw: doctorNotesRaw.trim() || (selectedFile ? `Uploaded file: ${selectedFile.name}` : ''),
        diagnoses: [],
        allergiesNoted: [],
        fileUrl: base64Data,
        fileType: mimeType,
        fileName: selectedFile?.name,
        createdAt: new Date().toISOString(),
      };

      await onAddDocument(newDoc, true);
      onClose();
    } catch (err: any) {
      console.error('Failed to add and synthesize document:', err);
      setErrorMsg(err.message || 'Error parsing document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      id="add-document-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Upload & Add Medical Document</h2>
              <p className="text-xs text-teal-100">
                AI will read your doctor’s notes and update your timetable, eating habits, and restock alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Selector */}
        <div className="bg-teal-50/70 border-b border-teal-100 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-teal-900">Want to test with a realistic sample?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleFillSample('recent')}
              className="px-2.5 py-1 rounded-md bg-white border border-teal-200 text-teal-800 font-bold hover:bg-teal-100/50 shadow-2xs"
            >
              + Recent Doctor Visit Sample
            </button>
            <button
              type="button"
              onClick={() => handleFillSample('past')}
              className="px-2.5 py-1 rounded-md bg-white border border-teal-200 text-teal-800 font-bold hover:bg-teal-100/50 shadow-2xs"
            >
              + Past Medical History Sample
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Category Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Document Stream / Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'RECENT_VISIT', label: 'Recent Doctor Visit', desc: 'Latest consultation' },
                { id: 'PAST_HISTORY', label: 'Past Medical History', desc: 'Previous conditions' },
                { id: 'LAB_REPORT', label: 'Lab Test / Report', desc: 'Blood work, vitals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as DocumentCategory)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    category === cat.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-1 ring-teal-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold">{cat.label}</div>
                  <div className="text-[10px] text-slate-500">{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Dr. Mehta Cardiology Follow-Up"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date of Visit / Report</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Doctor Name & Emergency Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor's Name & Specialty</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Mehta (Cardiologist)"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Doctor's Phone (For Emergency Call)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={doctorPhone}
                  onChange={(e) => setDoctorPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 892-4110"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Clinic / Hospital */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital Name</label>
            <div className="relative">
              <Hospital className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={clinicOrHospital}
                onChange={(e) => setClinicOrHospital(e.target.value)}
                placeholder="e.g. Apex Heart & Vascular Specialty Centre"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* File Upload Drop Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upload Prescription Photo / PDF Document (Optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-teal-50/30"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-teal-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                {selectedFile ? selectedFile.name : 'Click to upload prescription image or PDF'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Supports JPG, PNG, PDF photos of doctor prescriptions or reports
              </p>
            </div>

            {filePreview && (
              <div className="mt-2 p-2 bg-slate-100 rounded-lg flex items-center gap-3">
                <img
                  src={filePreview}
                  alt="Prescription preview"
                  className="w-12 h-12 object-cover rounded-md border"
                />
                <span className="text-xs text-slate-700 font-medium truncate">
                  Image attached for AI analysis
                </span>
              </div>
            )}
          </div>

          {/* What Doctor Wrote / Suggested */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Doctor’s Writing, Prescriptions & Eating Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              value={doctorNotesRaw}
              onChange={(e) => setDoctorNotesRaw(e.target.value)}
              rows={5}
              placeholder="Paste or type what your doctor wrote on your prescription or consultation note:
- Medicine names & doses
- When to take them (before breakfast, with dinner, bedtime)
- Food or eating instructions (avoid salt, avoid grapefruit, drink water)
- Restock instructions & emergency signs to watch for..."
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-mono text-slate-800"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing with AI & Updating Routine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Build Daily Routine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
