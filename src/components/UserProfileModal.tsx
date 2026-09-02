import React, { useState } from 'react';
import { 
  User, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Flame, 
  LogOut, 
  X, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Edit3, 
  Save,
  Trash2,
  Sparkles
} from 'lucide-react';
import { CurriculumTrack, UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onSwitchTrack: (track: CurriculumTrack) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onSwitchTrack
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'settings'>('overview');
  const [editingName, setEditingName] = useState(user.name);
  const [selectedTrack, setSelectedTrack] = useState<CurriculumTrack>(user.track);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    const updated: UserProfile = {
      ...user,
      name: editingName.trim() || user.name,
      track: selectedTrack
    };
    onUpdateUser(updated);
    onSwitchTrack(selectedTrack);
    localStorage.setItem(`cisco_user_${user.email}`, JSON.stringify(updated));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getTrackBadge = (t: CurriculumTrack) => {
    if (t === 'ccna') return { title: 'CCNA 200-301 Associate', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (t === 'ccnp') return { title: 'CCNP Enterprise Professional', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    return { title: 'CCIE Enterprise Infrastructure Expert', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  };

  const currentBadge = getTrackBadge(user.track);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-slate-900 to-[#0b1120] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-right font-sans overflow-hidden"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl bg-slate-800 p-1 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-slate-900" title="نشط الآن" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white truncate">{user.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${currentBadge.color}`}>
                {user.track.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5 dir-ltr text-right">{user.email}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>حماسة الدراسة: {user.studyStreakDays} يوم متتالي</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>عضو منذ {user.joinedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 my-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نظرة عامة والإنجازات
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ملاحظاتي على الكتب ({Object.keys(user.personalNotes || {}).length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            إعدادات الحساب والمسار
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 pl-1 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {user.completedTopicIds.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">مواضيع مكتملة</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {Object.values(user.readPagesRecord || {}).reduce((acc, curr) => acc + curr.length, 0)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">صفحات كتاب مقروءة</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {user.bookmarkedTopicIds.length}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">مواضيع مفضلة</div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>المسار الحالي: {currentBadge.title}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تتقدم حالياً في دراسة مواضيع ومختبرات شهادة سيسكو الرسمية. استمر في قراءة صفحات الكتب ومراجعة سيناريوهات CLI والمختبرات الحية لتحقيق الجاهزية الكاملة للامتحان.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              {Object.keys(user.personalNotes || {}).length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد ملاحظات مدونة بعد. يمكنك تدوين ملاحظاتك أثناء تصفح صفحات الكتب لأي موضوع.</p>
                </div>
              ) : (
                Object.entries(user.personalNotes).map(([topicId, noteText]) => (
                  <div key={topicId} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-cyan-300 flex items-center justify-between">
                      <span>موضوع: {topicId}</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap">{noteText}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  اسم المهندس:
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  تغيير المسار المعتمد:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ccna', 'ccnp', 'ccie'] as CurriculumTrack[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedTrack(t)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedTrack === t
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="font-bold text-xs">{t.toUpperCase()}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaved ? 'تم حفظ التعديلات!' : 'حفظ التغييرات'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-500/30 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من المنصة</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
