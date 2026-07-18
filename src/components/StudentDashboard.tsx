import React, { useMemo, useState } from "react";
import {
  Calendar,
  BookOpen,
  CreditCard,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Info,
  CheckCircle2,
  Clock,
  ChevronRight,
  GraduationCap,
  Camera,
  Sparkles,
  Circle,
  MessageSquareText,
  FileText,
  X,
  Eye,
  Download,
  RotateCcw,
  Share2,
  AlertCircle,
  Cpu,
  Atom,
  FlaskConical,
  Dna,
  Globe,
  Scroll,
  Languages
} from "lucide-react";
import { motion } from "motion/react";
import { Student, ChapterNote } from "../types";
import { ALL_ACADEMIC_MONTHS, MONTH_NAMES } from "../utils/monthHelper";

interface StudentDashboardProps {
  student: Student;
  onSelectSubject: (subject: string) => void;
  onNavigateToTab: (tab: "Settings" | "My") => void;
  onOpenAvatarModal: () => void;
  onUpdateChapterRemark: (subject: string, noteId: string, remark: string) => void;
}

type TileSize = "1x1" | "2x1" | "1x2" | "2x2" | "1x3" | "3x1" | "1/2x2";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

interface SubjectColorPalette {
  from: string;
  bg: string;
  text: string;
  darkText: string;
  accent: string;
  ring: string;
  badge: string;
  badgeText: string;
}

export function getSubjectColor(subject: string): SubjectColorPalette {
  const norm = subject.trim().toLowerCase();
  
  const colors: Record<string, SubjectColorPalette> = {
    mathematics: {
      from: "from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      text: "text-blue-600 dark:text-blue-400",
      darkText: "text-blue-900 dark:text-blue-200",
      accent: "bg-blue-500 border-blue-200 dark:border-blue-900/50",
      ring: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 dark:bg-blue-900/50",
      badgeText: "text-blue-800 dark:text-blue-200"
    },
    english: {
      from: "from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      text: "text-indigo-600 dark:text-indigo-400",
      darkText: "text-indigo-900 dark:text-indigo-200",
      accent: "bg-indigo-500 border-indigo-200 dark:border-indigo-900/50",
      ring: "text-indigo-600 dark:text-indigo-400",
      badge: "bg-indigo-100 dark:bg-indigo-900/50",
      badgeText: "text-indigo-800 dark:text-indigo-200"
    },
    science: {
      from: "from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20",
      bg: "bg-green-50 dark:bg-green-950/30",
      text: "text-green-600 dark:text-green-400",
      darkText: "text-green-900 dark:text-green-200",
      accent: "bg-green-500 border-green-200 dark:border-green-900/50",
      ring: "text-green-600 dark:text-green-400",
      badge: "bg-green-100 dark:bg-green-900/50",
      badgeText: "text-green-800 dark:text-green-200"
    },
    physics: {
      from: "from-purple-500/10 to-fuchsia-500/10 dark:from-purple-500/20 dark:to-fuchsia-500/20",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      text: "text-purple-600 dark:text-purple-400",
      darkText: "text-purple-900 dark:text-purple-200",
      accent: "bg-purple-500 border-purple-200 dark:border-purple-900/50",
      ring: "text-purple-600 dark:text-purple-400",
      badge: "bg-purple-100 dark:bg-purple-900/50",
      badgeText: "text-purple-800 dark:text-purple-200"
    },
    chemistry: {
      from: "from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-orange-500/20",
      bg: "bg-orange-50 dark:bg-orange-950/30",
      text: "text-orange-650 dark:text-orange-400",
      darkText: "text-orange-900 dark:text-orange-200",
      accent: "bg-orange-500 border-orange-200 dark:border-orange-900/50",
      ring: "text-orange-600 dark:text-orange-400",
      badge: "bg-orange-100 dark:bg-orange-900/50",
      badgeText: "text-orange-800 dark:text-orange-200"
    },
    biology: {
      from: "from-teal-500/10 to-cyan-500/10 dark:from-teal-500/20 dark:to-cyan-500/20",
      bg: "bg-teal-50 dark:bg-teal-950/30",
      text: "text-teal-600 dark:text-teal-400",
      darkText: "text-teal-900 dark:text-teal-200",
      accent: "bg-teal-500 border-teal-200 dark:border-teal-900/50",
      ring: "text-teal-600 dark:text-teal-400",
      badge: "bg-teal-100 dark:bg-teal-900/50",
      badgeText: "text-teal-800 dark:text-teal-200"
    },
    history: {
      from: "from-amber-500/10 to-yellow-500/10 dark:from-amber-500/20 dark:to-yellow-500/20",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      text: "text-amber-600 dark:text-amber-450",
      darkText: "text-amber-900 dark:text-amber-200",
      accent: "bg-amber-500 border-amber-200 dark:border-amber-900/50",
      ring: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-900/50",
      badgeText: "text-amber-850 dark:text-amber-200"
    },
    geography: {
      from: "from-cyan-500/10 to-sky-500/10 dark:from-cyan-500/20 dark:to-sky-500/20",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
      text: "text-cyan-600 dark:text-cyan-400",
      darkText: "text-cyan-900 dark:text-cyan-200",
      accent: "bg-cyan-500 border-cyan-200 dark:border-cyan-900/50",
      ring: "text-cyan-600 dark:text-cyan-400",
      badge: "bg-cyan-100 dark:bg-cyan-900/50",
      badgeText: "text-cyan-800 dark:text-cyan-200"
    },
    "political science": {
      from: "from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      text: "text-violet-600 dark:text-violet-400",
      darkText: "text-violet-900 dark:text-violet-200",
      accent: "bg-violet-500 border-violet-200 dark:border-violet-900/50",
      ring: "text-violet-600 dark:text-violet-400",
      badge: "bg-violet-100 dark:bg-violet-900/50",
      badgeText: "text-violet-800 dark:text-violet-200"
    },
    economics: {
      from: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      text: "text-emerald-600 dark:text-emerald-400",
      darkText: "text-emerald-900 dark:text-emerald-200",
      accent: "bg-emerald-500 border-emerald-200 dark:border-emerald-900/50",
      ring: "text-emerald-600 dark:text-emerald-400",
      badge: "bg-emerald-100 dark:bg-emerald-900/50",
      badgeText: "text-emerald-800 dark:text-emerald-200"
    },
    "computer science": {
      from: "from-blue-900/10 to-indigo-900/10 dark:from-blue-900/20 dark:to-indigo-900/20",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-700 dark:text-blue-300",
      darkText: "text-blue-900 dark:text-blue-100",
      accent: "bg-blue-900 border-blue-300 dark:border-blue-900",
      ring: "text-blue-800 dark:text-blue-400",
      badge: "bg-blue-100 dark:bg-blue-900/50",
      badgeText: "text-blue-800 dark:text-blue-200"
    },
    hindi: {
      from: "from-amber-600/10 to-red-500/10 dark:from-amber-600/20 dark:to-red-500/20",
      bg: "bg-amber-50/40 dark:bg-amber-950/25",
      text: "text-amber-700 dark:text-amber-400",
      darkText: "text-amber-950 dark:text-amber-250",
      accent: "bg-amber-500 border-amber-200 dark:border-amber-900",
      ring: "text-amber-600 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-900/50",
      badgeText: "text-amber-800 dark:text-amber-200"
    },
    nepali: {
      from: "from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20",
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-600 dark:text-red-450",
      darkText: "text-red-900 dark:text-red-200",
      accent: "bg-red-500 border-red-200 dark:border-red-900/50",
      ring: "text-red-600 dark:text-red-400",
      badge: "bg-red-100 dark:bg-red-900/50",
      badgeText: "text-red-800 dark:text-red-200"
    }
  };

  if (colors[norm]) return colors[norm];
  const found = Object.keys(colors).find(key => norm.includes(key));
  if (found) return colors[found];

  const list = Object.values(colors);
  const index = subject.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % list.length;
  return list[index];
}

export function getSubjectIcon(subject: string) {
  const norm = subject.toLowerCase();
  if (norm.includes("math")) return Cpu;
  if (norm.includes("computer") || norm.includes("code")) return Cpu;
  if (norm.includes("physic")) return Atom;
  if (norm.includes("chemistry")) return FlaskConical;
  if (norm.includes("biology")) return Dna;
  if (norm.includes("science")) return Atom;
  if (norm.includes("history")) return Scroll;
  if (norm.includes("geograph")) return Globe;
  if (norm.includes("english")) return Languages;
  if (norm.includes("nepali") || norm.includes("hindi")) return Languages;
  return BookOpen;
}

export function StudentMyTab({ 
  student, 
  initialSubject, 
  onSelectSubject, 
  onUpdateChapterRemark 
}: { 
  student: Student; 
  initialSubject?: string | null;
  onSelectSubject?: (subject: string) => void;
  onUpdateChapterRemark: (subject: string, noteId: string, remark: string) => void; 
}) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(() => {
    return initialSubject || student.enrolledSubjects[0] || null;
  });
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [remarkDrafts, setRemarkDrafts] = useState<Record<string, string>>({});
  const [activePreviewPdf, setActivePreviewPdf] = useState<{ url: string; title: string } | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    if (onSelectSubject) {
      onSelectSubject(subject);
    }
  };

  const selectedNotes = useMemo(() => {
    if (!selectedSubject) return [] as ChapterNote[];
    return (student.notes[selectedSubject] || []).slice().sort((a, b) => (a.chapterNo || 0) - (b.chapterNo || 0));
  }, [selectedSubject, student.notes]);

  const sortedSubjects = useMemo(() => {
    return [...student.enrolledSubjects].sort((a, b) => a.localeCompare(b));
  }, [student.enrolledSubjects]);

  const handleSaveRemark = (note: ChapterNote) => {
    const draft = (remarkDrafts[note.id] ?? note.remark ?? "").trim();
    onUpdateChapterRemark(selectedSubject || "", note.id, draft);
    setEditingRemarkId(null);
  };

  const handleShare = async (note: ChapterNote) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Chapter ${note.chapterNo}: ${note.chapterName}`,
          text: `Check out this study material for ${selectedSubject}!`,
          url: note.pdfUrl.startsWith("data:") ? undefined : note.pdfUrl
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(note.pdfUrl.startsWith("data:") ? window.location.href : note.pdfUrl);
        setCopiedNoteId(note.id);
        setTimeout(() => setCopiedNoteId(null), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const getFileSizeStr = (pdfUrl: string, chapterNo: number) => {
    if (pdfUrl.startsWith("data:")) {
      const base64Length = pdfUrl.length - (pdfUrl.indexOf(",") + 1);
      const sizeInBytes = Math.round(base64Length * 0.75);
      if (sizeInBytes > 1024 * 1024) {
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
      }
      return `${Math.round(sizeInBytes / 1024)} KB`;
    }
    const mockedKb = ((chapterNo * 420 + 280) % 1800) + 350;
    if (mockedKb > 1024) {
      return `${(mockedKb / 1024).toFixed(1)} MB`;
    }
    return `${mockedKb} KB`;
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn" id="student-my-tab">
      {/* File Explorer Layout Grid */}
      <div className="grid grid-cols-1 min-[520px]:grid-cols-12 gap-4 h-[calc(100vh-220px)] min-h-[500px] overflow-hidden" id="my-study-space-split-container">
        
        {/* LEFT PANEL (32% width on sm+ or 4/12 columns) */}
        <div className="col-span-12 min-[520px]:col-span-4 flex flex-col h-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4" id="split-left-panel">
          <div className="mb-4 shrink-0" id="study-left-header">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">ENROLLED SUBJECTS</p>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">My Study Space</h2>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 scrollbar-thin" id="study-left-subjects">
            {sortedSubjects.map((subject) => {
              const isActive = selectedSubject === subject;
              const palette = getSubjectColor(subject);
              const IconComponent = getSubjectIcon(subject);
              return (
                <button
                  key={subject}
                  onClick={() => handleSelectSubject(subject)}
                  className={`group rounded-xl border px-3 py-2.5 text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    isActive 
                      ? `${palette.bg} border-blue-500 text-blue-700 dark:text-blue-400 shadow-sm` 
                      : "border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`p-1.5 rounded-lg ${isActive ? palette.badge : "bg-slate-50 dark:bg-slate-950 group-hover:bg-slate-100"}`}>
                      <IconComponent className={`h-3.5 w-3.5 ${isActive ? palette.text : "text-slate-400"}`} />
                    </div>
                    <span className="truncate">{subject}</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "text-blue-500 translate-x-0.5" : "text-slate-350 opacity-0 group-hover:opacity-100"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL (68% width on sm+ or 8/12 columns) */}
        <div className="col-span-12 min-[520px]:col-span-8 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 shadow-xs" id="split-right-panel">
          {selectedSubject ? (
            <>
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex items-center justify-between shrink-0" id="study-right-header">
                <div className="truncate">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Selected Subject</p>
                  <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 truncate pr-2">{selectedSubject}</h3>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-850/60 flex items-center gap-1.5 shrink-0">
                  <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>{selectedNotes.length} Chapters</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scrollbar-thin" id="study-right-notes">
                {selectedNotes.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 my-auto border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20 dark:bg-slate-950/10">
                    <div className="relative mb-4">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500 shadow-xs">
                        <FileText className="w-10 h-10 stroke-[1.2]" />
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 p-1 bg-amber-500 rounded-full text-white shadow-xs">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-slate-750 dark:text-slate-200">No notes are available for this subject.</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                      Your tutor hasn't uploaded any PDF chapters for {selectedSubject} yet. Please check back later.
                    </p>
                  </div>
                ) : (
                  selectedNotes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 p-3 hover:border-slate-200 dark:hover:border-slate-750 hover:bg-slate-50/80 dark:hover:bg-slate-950/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl text-red-500 dark:text-red-400 shrink-0 border border-red-100/60 dark:border-red-900/30">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Chapter {note.chapterNo}</p>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate pr-4">{note.chapterName}</h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] font-semibold text-slate-400">
                            {note.createdAt && (
                              <span className="bg-slate-100/80 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                Added {formatDate(note.createdAt)}
                              </span>
                            )}
                            <span className="bg-slate-100/80 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                              Size: {getFileSizeStr(note.pdfUrl, note.chapterNo)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setActivePreviewPdf({ url: note.pdfUrl, title: `Chapter ${note.chapterNo}: ${note.chapterName}` });
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
                          title="View PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>

                        <a
                          href={note.pdfUrl}
                          download={`${note.chapterName.replace(/\s+/g, "_")}.pdf`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>

                        <button
                          onClick={() => handleShare(note)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold transition-all cursor-pointer ${
                            copiedNoteId === note.id 
                              ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" 
                              : "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-600 dark:hover:text-purple-400"
                          }`}
                          title="Share Link"
                        >
                          {copiedNoteId === note.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (editingRemarkId === note.id) {
                              handleSaveRemark(note);
                            } else {
                              setEditingRemarkId(note.id);
                              setRemarkDrafts((prev) => ({ ...prev, [note.id]: note.remark || "" }));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer"
                          title={note.remark ? "Edit remark" : "Add remark"}
                        >
                          <MessageSquareText className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-sm text-slate-500">
              Choose a subject to view chapter-wise notes.
            </div>
          )}
        </div>

      </div>

      {/* Student PDF Preview Modal */}
      {activePreviewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 animate-fadeIn" id="student-pdf-modal">
          <div className="absolute inset-0" onClick={() => setActivePreviewPdf(null)} />
          <div className="relative w-full h-full sm:h-[90vh] max-w-4xl bg-white dark:bg-slate-950 rounded-none sm:rounded-2xl p-0 shadow-2xl z-10 flex flex-col overflow-hidden border border-slate-100 dark:border-slate-900">
            <div className="flex justify-between items-center bg-slate-900 text-white p-4 shrink-0">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold truncate">{activePreviewPdf.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePreviewPdf.url}
                  download={`${activePreviewPdf.title.replace(/\s+/g, "_")}.pdf`}
                  className="p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setActivePreviewPdf(null)}
                  className="p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-2 sm:p-4 flex items-center justify-center relative">
              {activePreviewPdf.url ? (
                <iframe
                  src={`${activePreviewPdf.url}#toolbar=1`}
                  className="w-full h-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                  title={activePreviewPdf.title}
                />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <p className="font-bold text-sm">Cannot render raw data format directly</p>
                  <p className="text-xs text-slate-400 mt-1">Please use the Download button to open this PDF document.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentDashboard({
  student,
  onSelectSubject,
  onNavigateToTab,
  onOpenAvatarModal,
  onUpdateChapterRemark
}: StudentDashboardProps) {
  const [feesSize, setFeesSize] = useState<TileSize>("2x1");
  const [attendanceSize, setAttendanceSize] = useState<TileSize>("2x1");
  const [showAttendanceHistoryModal, setShowAttendanceHistoryModal] = useState(false);
  const [showFeeHistoryModal, setShowFeeHistoryModal] = useState(false);

  const studentMonthsSinceJoining = useMemo(() => {
    const regDate = student.registrationDate || "2026-06-01";
    const [regYearStr, regMonthStr] = regDate.split("-");
    const regYear = parseInt(regYearStr) || 2026;
    const regMonthIdx = (parseInt(regMonthStr) || 6) - 1; // 0-indexed

    // Prevent displaying any future months in student portal
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonthIdx = today.getMonth();

    return ALL_ACADEMIC_MONTHS.filter((m) => {
      const [mName, yStr] = m.split(" ");
      const mIdx = MONTH_NAMES.indexOf(mName);
      const year = parseInt(yStr) || 2026;
      
      const isAfterReg = year > regYear || (year === regYear && mIdx >= regMonthIdx);
      const isBeforeOrCurrent = year < currentYear || (year === currentYear && mIdx <= currentMonthIdx);

      return isAfterReg && isBeforeOrCurrent;
    });
  }, [student.registrationDate]);

  const attendanceHistoryByMonth = useMemo(() => {
    const records: Record<string, { present: number; absent: number; total: number }> = {};
    studentMonthsSinceJoining.forEach((m) => {
      records[m] = { present: 0, absent: 0, total: 0 };
    });

    Object.entries(student.attendance).forEach(([dateStr, status]) => {
      if (status === "na") return;
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        const key = `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
        if (records[key]) {
          records[key].total += 1;
          if (status === true) records[key].present += 1;
          else if (status === false) records[key].absent += 1;
        }
      } catch (e) {
        console.error(e);
      }
    });

    return studentMonthsSinceJoining.map((m) => {
      const stats = records[m] || { present: 0, absent: 0, total: 0 };
      const pct = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 100;
      return { month: m, ...stats, pct };
    });
  }, [student.attendance, studentMonthsSinceJoining, MONTH_NAMES]);

  const feeHistory = useMemo(() => {
    return studentMonthsSinceJoining.map((m) => {
      const status = student.feeMonths?.[m] || "unpaid";
      const payDate = student.feePaymentDates?.[m];
      return { month: m, status, payDate };
    });
  }, [student.feeMonths, student.feePaymentDates, studentMonthsSinceJoining]);

  const [subjectSizes, setSubjectSizes] = useState<Record<string, TileSize>>(() => {
    const initial: Record<string, TileSize> = {};
    student.enrolledSubjects.forEach((sub) => {
      initial[sub] = "2x1";
    });
    return initial;
  });

  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(`tuition_student_layout_${student.id}`);
    const allCards = ["attendance", "fees", ...student.enrolledSubjects];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((c) => allCards.includes(c));
          const missing = allCards.filter((c) => !filtered.includes(c));
          return [...filtered, ...missing];
        }
      } catch (e) {
        console.error("Failed to parse saved layout:", e);
      }
    }
    return allCards;
  });

  const enrolledSubjectCardsOnly = useMemo(() => {
    return cardOrder.filter((id) => id !== "attendance" && id !== "fees");
  }, [cardOrder]);

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<string | null>(null);

  const saveOrder = (newOrder: string[]) => {
    setCardOrder(newOrder);
    localStorage.setItem(`tuition_student_layout_${student.id}`, JSON.stringify(newOrder));
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    if (!draggedCardId || draggedCardId === targetCardId) return;

    const dragIndex = cardOrder.indexOf(draggedCardId);
    const targetIndex = cardOrder.indexOf(targetCardId);

    if (dragIndex !== -1 && targetIndex !== -1) {
      const updated = [...cardOrder];
      updated.splice(dragIndex, 1);
      updated.splice(targetIndex, 0, draggedCardId);
      saveOrder(updated);
    }
  };

  const handleDragEnd = () => setDraggedCardId(null);

  const handleMoveUp = (cardId: string) => {
    const idx = cardOrder.indexOf(cardId);
    if (idx > 0) {
      const updated = [...cardOrder];
      const temp = updated[idx];
      updated[idx] = updated[idx - 1];
      updated[idx - 1] = temp;
      saveOrder(updated);
    }
  };

  const handleMoveDown = (cardId: string) => {
    const idx = cardOrder.indexOf(cardId);
    if (idx !== -1 && idx < cardOrder.length - 1) {
      const updated = [...cardOrder];
      const temp = updated[idx];
      updated[idx] = updated[idx + 1];
      updated[idx + 1] = temp;
      saveOrder(updated);
    }
  };

  const handleSetSubjectSize = (subject: string, size: TileSize) => {
    setSubjectSizes((prev) => ({ ...prev, [subject]: size }));
  };

  const attendanceStats = useMemo(() => {
    const records = Object.values(student.attendance).filter((r) => r !== "na");
    const total = records.length;
    const presents = records.filter((r) => r === true).length;
    const rate = total > 0 ? Math.round((presents / total) * 100) : 100;
    return { presents, total, rate };
  }, [student.attendance]);

  const subjectProgress = useMemo(() => {
    return student.enrolledSubjects
      .map((sub) => {
        const notes = student.notes[sub] || [];
        const total = notes.length;
        const completed = notes.filter((n) => n.isCompleted).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { name: sub, total, completed, rate, notes };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [student.enrolledSubjects, student.notes]);

  const recentAttendance = useMemo(() => {
    const dates = ["2026-07-14", "2026-07-13", "2026-07-12", "2026-07-11", "2026-07-10", "2026-07-09", "2026-07-08"];
    return dates.map((date) => {
      const dateObj = new Date(date);
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return { date, dayName: dayNames[dateObj.getDay()], dayNum: dateObj.getDate(), val: student.attendance[date] };
    });
  }, [student.attendance]);

  const currentMonthName = useMemo(() => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const d = new Date();
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }, []);

  const currentMonthStatus = student.feeMonths?.[currentMonthName] || (student.feePaidThisMonth ? "paid" : "unpaid");

  const feeStats = useMemo(() => {
    const entries = student.feeMonths ? Object.entries(student.feeMonths) : [];
    const paidCount = entries.filter(([, status]) => status === "paid").length;
    const unpaidCount = entries.filter(([, status]) => status === "unpaid").length;
    return { paidCount, unpaidCount };
  }, [student.feeMonths]);

  const activeSubjectDetails = useMemo(() => {
    if (!selectedSubjectModal) return null;
    return subjectProgress.find((sub) => sub.name === selectedSubjectModal) || null;
  }, [selectedSubjectModal, subjectProgress]);

  const sizeClasses: Record<TileSize, string> = {
    "1x1": "col-span-1 row-span-1",
    "2x1": "col-span-2 row-span-1",
    "1x2": "col-span-1 row-span-2",
    "2x2": "col-span-2 row-span-2",
    "1x3": "col-span-1 row-span-3",
    "3x1": "col-span-3 row-span-1",
    "1/2x2": "col-span-1 row-span-2"
  };

  const cardBaseClass = "rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all duration-300";

  return (
    <div className="flex flex-col gap-4 animate-fadeIn" id="student-dashboard-root">
      {/* Student Welcome Header Card */}
      <div className="flex items-center gap-3 rounded-[28px] border border-blue-400/30 bg-gradient-to-r from-blue-600 via-blue-600 to-purple-600 p-4 text-white shadow-lg" style={{boxShadow: "0 8px 32px rgba(59, 130, 246, 0.25)"}}>
        <button onClick={onOpenAvatarModal} className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-3 border-white/80 bg-white/10 hover:bg-white/20 transition-all cursor-pointer group shadow-lg" title="Upload and edit photo">
          {student.avatarUrl ? (
            <img src={student.avatarUrl} alt={student.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-lg font-black">{getInitials(student.name)}</span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-white" />
          </div>
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-100">Personal Student Space</p>
          <h1 className="text-lg font-black">{student.name}</h1>
          <p className="text-xs text-blue-100">Keep track of progress and attendance and many more.</p>
          {student.registrationDate && (
            <p className="text-[11px] text-blue-200 mt-1.5">Joined: {formatDate(student.registrationDate)}</p>
          )}
        </div>
      </div>

      {/* Top Fixed Tiles Grid (1x1 sizes side-by-side) */}
      <div className="grid grid-cols-2 gap-3" id="fixed-student-tiles">
        {/* Attendance Card (Fixed 1x1) */}
        <div 
          onClick={() => setShowAttendanceHistoryModal(true)}
          className="rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          id="fixed-attendance-tile"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Attendance</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{attendanceStats.rate}%</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{attendanceStats.presents}/{attendanceStats.total} classes</p>
          </div>
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-0.5">
            View History <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        {/* Fees Card (Fixed 1x1) */}
        <div 
          onClick={() => setShowFeeHistoryModal(true)}
          className="rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
          id="fixed-fees-tile"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Fees</span>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">₹{student.monthlyFee}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{currentMonthName}</p>
          </div>
          <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-0.5">
            View History <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* Dynamic Subjects Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {enrolledSubjectCardsOnly.map((cardId) => {
          const sub = subjectProgress.find((item) => item.name === cardId);
          if (!sub) return null;
          const size = subjectSizes[sub.name] || "2x1";
          const palette = getSubjectColor(sub.name);

          return (
            <motion.div
              layout
              draggable
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, sub.name)}
              onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>, sub.name)}
              onDragEnd={() => handleDragEnd()}
              key={sub.name}
              className={`${cardBaseClass} ${sizeClasses[size]} ${draggedCardId === sub.name ? "opacity-50" : ""}`}
            >
              <div className={`rounded-[20px] bg-gradient-to-br ${palette.from} p-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-slate-300 dark:text-slate-700 cursor-grab" />
                    <BookOpen className={`h-4 w-4 ${palette.ring}`} />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600 dark:text-slate-400">{sub.name}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleMoveUp(sub.name)} className="rounded-md p-1 text-slate-400 hover:text-slate-600 transition-colors"><ArrowUp className="h-3 w-3" /></button>
                    <button onClick={() => handleMoveDown(sub.name)} className="rounded-md p-1 text-slate-400 hover:text-slate-600 transition-colors"><ArrowDown className="h-3 w-3" /></button>
                    <select value={size} onChange={(e) => handleSetSubjectSize(sub.name, e.target.value as TileSize)} className="rounded-md border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-2 py-1 text-[10px] font-bold text-slate-500">
                      <option value="1x1">1x1</option>
                      <option value="2x1">2x1</option>
                      <option value="2x2">2x2</option>
                      <option value="1x3">1x3</option>
                      <option value="3x1">3x1</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <svg className="h-16 w-16 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.85)" strokeWidth="10" fill="none" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * sub.rate) / 100} className={palette.ring} />
                    </svg>
                    <div className="absolute text-sm font-black text-slate-700 dark:text-slate-300">{sub.rate}%</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{sub.completed}/{sub.total} chapters complete</p>
                    <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400">{sub.total - sub.completed} remaining</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-end text-[11px] font-semibold">
                <button onClick={() => setSelectedSubjectModal(sub.name)} className="flex items-center gap-1 text-blue-600 dark:text-blue-400 cursor-pointer">
                  View details <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Attendance History Pop-up Modal */}
      {showAttendanceHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" id="attendance-history-modal">
          <div className="w-full max-w-md rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Attendance Log</p>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Monthly Attendance History</h3>
              </div>
              <button onClick={() => setShowAttendanceHistoryModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {attendanceHistoryByMonth.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">No attendance entries recorded yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {attendanceHistoryByMonth.map((item) => (
                    <div key={item.month} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.month}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5">{item.present} present / {item.total} classes marked</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                          item.pct >= 85 ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" :
                          item.pct >= 70 ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400" :
                          "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                        }`}>
                          {item.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fee Payment History Pop-up Modal */}
      {showFeeHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" id="fee-history-modal">
          <div className="w-full max-w-md rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 shrink-0">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Payment Ledger</p>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">Fee Payment History</h3>
              </div>
              <button onClick={() => setShowFeeHistoryModal(false)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="flex flex-col gap-1.5">
                {feeHistory.map((item) => (
                  <div key={item.month} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-200">{item.month}</p>
                      {item.status === "paid" && item.payDate && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Paid on {formatDate(item.payDate)}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                        item.status === "paid" ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                      }`}>
                        {item.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject details popup modal */}
      {activeSubjectDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn" id="subject-detail-modal">
          <div className="w-full max-w-md rounded-[28px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Subject details</p>
                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{activeSubjectDetails.name}</h3>
              </div>
              <button onClick={() => setSelectedSubjectModal(null)} className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Chapters completed</p>
                <p className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{activeSubjectDetails.completed}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Remaining</p>
                <p className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{activeSubjectDetails.total - activeSubjectDetails.completed}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 sm:col-span-2 border border-slate-100 dark:border-slate-850">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Completion</p>
                <p className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">{activeSubjectDetails.rate}%</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                <FileText className="h-3.5 w-3.5 text-blue-500" />
                Notes uploaded
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{activeSubjectDetails.notes.length} notes are currently synced for this subject.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
