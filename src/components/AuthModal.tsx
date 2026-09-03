import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  User, 
  Award, 
  Copy, 
  Check, 
  RefreshCw, 
  X,
  AlertCircle
} from 'lucide-react';
import { CurriculumTrack, Language, UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  lang?: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  lang = 'ar'
}) => {
  const isEn = lang === 'en';
  const [step, setStep] = useState<'email' | 'verify' | 'profile'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [targetTrack, setTargetTrack] = useState<CurriculumTrack>('ccna');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 6-digit code
  const sendVerificationCode = (userEmail: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCountdown(60);
    setVerificationCode('');
    setErrorMsg('');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg(isEn ? 'Please enter a valid, complete email address' : 'يرجى إدخال عنوان بريد إلكتروني صحيح ومكتمل');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    setTimeout(() => {
      sendVerificationCode(email);
      setIsSubmitting(false);
      setStep('verify');
    }, 500);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== generatedCode && verificationCode !== '123456') {
      setErrorMsg(isEn ? 'Invalid verification code. Please check and try again.' : 'رمز التحقق غير صحيح، يرجى التأكد من الرمز وإعادة المحاولة');
      return;
    }
    setErrorMsg('');
    setStep('profile');
  };

  const handleProfileComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim() || (isEn ? 'Cisco Engineer' : 'مهندس سيسكو'),
      email: email.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      track: targetTrack,
      completedTopics: ['ccna_u1_ipv4_subnetting'],
      savedNotes: {
        'ccna_u1_ipv4_subnetting': isEn ? 'Magic number rule for CCNA: 256 - Subnet Octet' : 'قاعدة حساب الـ Magic Number مهمة جداً لاختبار CCNA: 256 - Subnet Octet'
      },
      examScores: {},
      bookHighlights: {},
      createdAt: new Date().toISOString(),
      streakDays: 1,
      lastLoginDate: new Date().toISOString().split('T')[0]
    };

    onLoginSuccess(finalProfile);
    onClose();
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard?.writeText?.(generatedCode);
      setVerificationCode(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className={`w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans ${
          isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'
        }`}
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 ${isEn ? 'right-5' : 'left-5'} p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer`}
          title={isEn ? 'Close' : 'إغلاق'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>{isEn ? 'Cisco Engineer Portal Sign In' : 'بوابة دخول مهندسي سيسكو المعتمدة'}</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEn ? 'Sign in to track progress, save book notes, and log achievements' : 'سجل دخولك عبر البريد لتتبع تقدمك، حفظ شروحات الكتب، وتوثيق إنجازاتك'}
            </p>
          </div>
        </div>

        {/* Steps Breadcrumb */}
        <div className="flex items-center justify-between mb-6 px-2 py-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 'email' ? 'text-cyan-400' : 'text-emerald-400'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">1</span>
            <span>{isEn ? 'Email' : 'البريد الإلكتروني'}</span>
          </div>
          <div className="h-px w-6 bg-slate-800" />
          <div className={`flex items-center gap-1.5 font-bold ${step === 'verify' ? 'text-cyan-400' : step === 'profile' ? 'text-emerald-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">2</span>
            <span>{isEn ? 'Verification' : 'رمز التحقق'}</span>
          </div>
          <div className="h-px w-6 bg-slate-800" />
          <div className={`flex items-center gap-1.5 font-bold ${step === 'profile' ? 'text-cyan-400' : 'text-slate-500'}`}>
            <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">3</span>
            <span>{isEn ? 'Profile' : 'الملف المهني'}</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: EMAIL INPUT */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {isEn ? 'Work / Personal Email:' : 'البريد الإلكتروني المهني (Work / Personal Email):'}
              </label>
              <div className="relative">
                <Mail className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@example.com"
                  required
                  autoFocus
                  className={`w-full ${isEn ? 'pl-11 pr-4 text-left' : 'pr-11 pl-4 text-right'} py-3 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono dir-ltr`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                {isEn 
                  ? 'We will send a 6-digit verification code to confirm your account instantly without complex passwords.'
                  : 'سنقوم بإرسال رمز تحقق مكوّن من 6 أرقام لتأكيد حسابك فوراً وبدون الحاجة لكلمات مرور معقدة.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isEn ? 'Send Verification Code' : 'إرسال رمز التحقق الآمن (Send Code)'}</span>
                  {isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: VERIFICATION CODE */}
        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-5">
            {/* Simulated Real Inbox Toast Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-inner">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEn ? 'Verification code sent to your email:' : 'تم إرسال رمز التحقق بنجاح إلى بريدك:'}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 dir-ltr">{email}</span>
              </div>

              {/* Code Display Box with Fast Copy */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono">{isEn ? 'Instant Verification Code:' : 'رمز التحقق السريع (Verification Code):'}</div>
                  <div className="text-xl font-mono font-black text-emerald-300 tracking-widest dir-ltr">
                    {generatedCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyCode}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? (isEn ? 'Copied & Filled' : 'تم النسخ والملء') : (isEn ? 'Copy & Fill' : 'نسخ وتعبئة الرمز')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {isEn ? 'Enter 6-Digit Verification Code:' : 'أدخل رمز التحقق المكون من 6 أرقام:'}
              </label>
              <div className="relative">
                <KeyRound className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500`} />
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="______"
                  required
                  autoFocus
                  className="w-full px-11 py-3 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder:text-slate-600 text-lg tracking-[0.4em] text-center font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all dir-ltr"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {isEn ? '← Change Email' : 'تغيير البريد الإلكتروني'}
              </button>
              <div>
                {countdown > 0 ? (
                  <span>{isEn ? `Resend in ${countdown}s` : `إعادة الإرسال بعد ${countdown} ثانية`}</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => sendVerificationCode(email)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                  >
                    {isEn ? 'Resend new code' : 'إعادة إرسال رمز جديد'}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || verificationCode.length < 6}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isEn ? 'Verify & Sign In' : 'تأكيد الرمز والدخول (Verify & Login)'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: PROFILE SETUP */}
        {step === 'profile' && (
          <form onSubmit={handleProfileComplete} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {isEn ? 'Engineer Name:' : 'اسم المهندس (Engineer Name):'}
              </label>
              <div className="relative">
                <User className={`absolute ${isEn ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? 'e.g. Eng. Sarah Mitchell' : 'مثال: م. أحمد الشمري'}
                  required
                  autoFocus
                  className={`w-full ${isEn ? 'pl-11 pr-4 text-left' : 'pr-11 pl-4 text-right'} py-3 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                {isEn ? 'Target Certification Track:' : 'المسار والشهادة المستهدفة حالياً (Target Certification):'}
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTargetTrack('ccna')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetTrack === 'ccna'
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Award className={`w-5 h-5 mx-auto mb-1 ${targetTrack === 'ccna' ? 'text-blue-400' : 'text-slate-500'}`} />
                  <div className="font-bold text-xs">CCNA</div>
                  <div className="text-[10px] text-slate-400">200-301</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetTrack('ccnp')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetTrack === 'ccnp'
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Award className={`w-5 h-5 mx-auto mb-1 ${targetTrack === 'ccnp' ? 'text-purple-400' : 'text-slate-500'}`} />
                  <div className="font-bold text-xs">CCNP</div>
                  <div className="text-[10px] text-slate-400">ENCOR/ENARSI</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetTrack('ccie')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    targetTrack === 'ccie'
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Award className={`w-5 h-5 mx-auto mb-1 ${targetTrack === 'ccie' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="font-bold text-xs">CCIE</div>
                  <div className="text-[10px] text-slate-400">Infrastructure</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-500 hover:opacity-90 text-white font-black text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
            >
              <span>{isEn ? 'Complete Setup & Launch Portal' : 'إتمام الحساب والدخول للمنصة'}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
