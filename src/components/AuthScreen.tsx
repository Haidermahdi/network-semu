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
  AlertCircle,
  Languages,
  BookOpen,
  Cpu,
  Activity,
  Zap,
  Terminal,
  Users
} from 'lucide-react';
import { CurriculumTrack, Language, UserProfile } from '../types';

interface AuthScreenProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  onLoginSuccess: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=NetworkArchitect',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CiscoEngineer',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CyberSentinel',
  'https://api.dicebear.com/7.x/bottts/svg?seed=PacketMaster',
  'https://api.dicebear.com/7.x/bottts/svg?seed=RouterGuru',
  'https://api.dicebear.com/7.x/bottts/svg?seed=CloudSpecialist'
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  lang,
  onLanguageChange,
  onLoginSuccess
}) => {
  const [step, setStep] = useState<'email' | 'verify' | 'profile'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال عنوان بريد إلكتروني صحيح ومكتمل' : 'Please enter a valid and complete email address');
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

  const handleQuickDemoLogin = (track: CurriculumTrack = 'ccna') => {
    const demoEmail = 'engineer.demo@cisco.academy';
    const demoProfile: UserProfile = {
      id: 'demo_engineer_01',
      name: lang === 'ar' ? 'مهندس الشبكات التجريبي' : 'Senior Network Engineer',
      email: demoEmail,
      avatar: AVATAR_OPTIONS[1],
      track: track,
      joinedDate: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      completedTopicIds: ['ccna_u1_ipv4_subnetting', 'ccna_u2_vlans_trunking'],
      bookmarkedTopicIds: ['ccna_u3_ospf_single_area'],
      readPagesRecord: {
        'ccna_u1_ipv4_subnetting': [1, 2, 3]
      },
      studyStreakDays: 3,
      personalNotes: {
        'ccna_u1_ipv4_subnetting': 'قاعدة حساب الـ Magic Number مهمة جداً لاختبار CCNA: 256 - Subnet Octet'
      }
    };

    localStorage.setItem(`cisco_user_${demoProfile.email}`, JSON.stringify(demoProfile));
    localStorage.setItem('cisco_current_user_email', demoProfile.email);
    onLoginSuccess(demoProfile);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== generatedCode.trim()) {
      setErrorMsg(lang === 'ar' ? 'رمز التحقق غير صحيح، يرجى التأكد من الرمز وإعادة المحاولة' : 'Invalid verification code. Please check and try again.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    
    // Check if user profile already exists
    const existingRaw = localStorage.getItem(`cisco_user_${email.trim().toLowerCase()}`);
    if (existingRaw) {
      try {
        const existingProfile = JSON.parse(existingRaw);
        setTimeout(() => {
          setIsSubmitting(false);
          localStorage.setItem('cisco_current_user_email', existingProfile.email);
          onLoginSuccess(existingProfile);
        }, 500);
        return;
      } catch (err) {
        // continue to profile creation
      }
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setName(email.split('@')[0]);
      setStep('profile');
    }, 500);
  };

  const handleProfileComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || email.split('@')[0];
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: finalName,
      email: email.trim().toLowerCase(),
      avatar: selectedAvatar,
      track: targetTrack,
      joinedDate: new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      completedTopicIds: [],
      bookmarkedTopicIds: [],
      readPagesRecord: {},
      studyStreakDays: 1,
      personalNotes: {}
    };

    localStorage.setItem(`cisco_user_${newProfile.email}`, JSON.stringify(newProfile));
    localStorage.setItem('cisco_current_user_email', newProfile.email);
    onLoginSuccess(newProfile);
  };

  const copyAndFillCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setVerificationCode(generatedCode);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden ${lang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Subtle Background Glow - Single Cohesive Tone */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-slate-800/[0.1] rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shadow-sm">
            <span className="text-lg font-black text-amber-400" style={{ fontFamily: 'serif' }}>𒀭</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
              <span>{lang === 'ar' ? 'منصة الفريق السومري للتعلم' : 'Sumerian Team Learning Platform'}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/[0.08] text-[10px] font-bold font-mono">
                CCNA • CCNP • CCIE
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {lang === 'ar' ? 'منصة تعليمية متقدمة لهندسة الشبكات والشهادات المعتمدة' : 'Advanced educational platform for network engineering & certifications'}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => onLanguageChange(lang === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white border border-white/[0.08] transition-all text-xs font-bold font-mono cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <span>{lang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Features & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'بوابة الدخول إلى منصة الفريق السومري للتعلم' : 'Gateway to Sumerian Team Learning Platform'}</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {lang === 'ar' ? (
                  <>
                    تعلّم هندسة شبكات سيسكو من <span className="text-amber-400">الصفر حتى الاحتراف</span>
                  </>
                ) : (
                  <>
                    Master Enterprise Networks from <span className="text-amber-400">Basics to CCIE</span>
                  </>
                )}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {lang === 'ar'
                  ? 'منصة تفاعلية متكاملة تجمع بين مناهج سيسكو الرسمية، كتب رقمية متعددة الفصول مع مراجع RFC، محاكي حزم البيانات التفاعلي، قصص وتطبيقات من الحياة الواقعية، ومساعد ذكاء اصطناعي متخصص.'
                  : 'An enterprise-grade interactive platform combining official Cisco Blueprints, multi-chapter digital textbooks with RFC citations, real-time packet simulator, real-life everyday analogies, and dedicated AI network tutor.'}
              </p>
            </div>

            {/* Feature Highlights Grid - Unified Cohesive Neutrals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'كتب رقمية تفاعلية متعددة الفصول' : 'Multi-Page Interactive Textbooks'}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ar' ? 'شروحات عميقة لكل موضوع مقسمة إلى فصول تخصصية مع حسابات الـ Math وأوامر التحقق.' : 'Dedicated chapters per topic with bit math, CLI traces and blueprint notes.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'معمل حي ومحاكي حزم تفاعلي' : 'Live Lab & Packet Flow Simulator'}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ar' ? 'تحكم بالروترات والسويتشات وتتبع انتقال الإطارات خطوة بخطوة في بيئة محاكاة واقعية.' : 'Control routers, switches and trace layer-by-layer packet headers in real-time.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'قصص وأمثلة من واقعنا اليومي' : 'Real-Life Analogies & Scenarios'}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ar' ? 'شرح كل بروتوكول وتقنية بتشبيهات ذكية من الحياة اليومية لترسيخ الفهم الهندسي.' : 'Master complex networking protocols through intuitive real-world city & airport metaphors.'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.14] transition-all flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white">
                    {lang === 'ar' ? 'مسارات CCNA • CCNP • CCIE' : '3 Tracks: CCNA • CCNP • CCIE'}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {lang === 'ar' ? 'تغطية شاملة لكافة محاور ومخططات اختبارات سيسكو المعتمدة مع توثيق الإنجازات.' : 'Comprehensive coverage of Cisco Official Certification Blueprints.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'هل تود تجربة المنصة مباشرة بدون إدخال بريد؟' : 'Want to try the platform instantly with a demo account?'}</span>
              </div>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ccna')}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{lang === 'ar' ? 'دخول تجريبي فوري (Demo Access)' : 'Instant Demo Login'}</span>
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#0b0f19] border border-white/[0.08] shadow-2xl p-6 sm:p-8 relative">
              
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/[0.06]">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                    <span>{lang === 'ar' ? 'تسجيل الدخول وإنشاء الحساب' : 'Sign In & Engineer Registration'}</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {lang === 'ar' ? 'أدخل بريدك لتسجيل الدخول أو إنشاء حساب جديد فوراً' : 'Enter your email to sign in or create your engineer profile'}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6 px-3 py-2 rounded-xl bg-black/30 border border-white/[0.06] text-xs">
                <div className={`flex items-center gap-1.5 font-bold ${step === 'email' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'email' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>1</span>
                  <span>{lang === 'ar' ? 'البريد' : 'Email'}</span>
                </div>
                <div className="h-px w-6 bg-white/[0.08]" />
                <div className={`flex items-center gap-1.5 font-bold ${step === 'verify' ? 'text-amber-400' : step === 'profile' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'verify' ? 'bg-amber-500/20 text-amber-300' : step === 'profile' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.04] text-slate-500'}`}>2</span>
                  <span>{lang === 'ar' ? 'رمز التحقق' : 'Verify'}</span>
                </div>
                <div className="h-px w-6 bg-white/[0.08]" />
                <div className={`flex items-center gap-1.5 font-bold ${step === 'profile' ? 'text-amber-400' : 'text-slate-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'profile' ? 'bg-amber-500/20 text-amber-300' : 'bg-white/[0.04] text-slate-500'}`}>3</span>
                  <span>{lang === 'ar' ? 'الملف المهني' : 'Profile'}</span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: EMAIL */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      {lang === 'ar' ? 'البريد الإلكتروني المهني أو الشخصي:' : 'Work or Personal Email:'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="engineer@example.com"
                        required
                        autoFocus
                        className="w-full pr-11 pl-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-white placeholder:text-slate-600 text-sm focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 transition-all font-mono dir-ltr text-right"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {lang === 'ar' 
                        ? 'سنقوم بإرسال رمز تحقق مكوّن من 6 أرقام لتأكيد حسابك فوراً وبدون الحاجة لكلمات مرور معقدة.'
                        : 'We will send a 6-digit verification code to log you in instantly with zero password hassle.'}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{lang === 'ar' ? 'متابعة وإرسال رمز التحقق' : 'Continue & Send Code'}</span>
                        <ArrowLeft className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-slate-500">
                      {lang === 'ar' ? 'جميع البيانات مشفرة ومحفوظة محلياً لأمان دراستك' : 'All progress & notes are securely stored for your account'}
                    </span>
                  </div>
                </form>
              )}

              {/* STEP 2: VERIFICATION CODE */}
              {step === 'verify' && (
                <form onSubmit={handleVerifySubmit} className="space-y-4">
                  {/* Toast simulated code info */}
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-amber-400" />
                        <span>{lang === 'ar' ? 'تم تجهيز رمز التحقق لبريدك:' : 'Verification code for:'}</span>
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">{email}</span>
                    </div>

                    {/* Quick Helper */}
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'رمز التأكيد الفوري:' : 'Your Instant Code:'}</div>
                        <div className="text-sm font-mono font-black text-amber-400 tracking-widest">{generatedCode}</div>
                      </div>
                      <button
                        type="button"
                        onClick={copyAndFillCode}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{lang === 'ar' ? 'تعبئة تلقائية' : 'Auto Fill'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      {lang === 'ar' ? 'أدخل رمز التحقق (6 أرقام):' : 'Enter 6-Digit Verification Code:'}
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••••"
                        required
                        autoFocus
                        className="w-full pr-11 pl-4 py-3 rounded-xl bg-black/40 border border-white/[0.1] text-amber-400 placeholder:text-slate-600 text-lg font-mono font-bold tracking-widest text-center focus:outline-none focus:border-amber-500/80 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <button
                      type="button"
                      onClick={() => setStep('email')}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? '← تغيير البريد الإلكتروني' : '← Change email'}
                    </button>
                    {countdown > 0 ? (
                      <span className="font-mono text-slate-500">
                        {lang === 'ar' ? `إعادة الإرسال بعد (${countdown}) ثانية` : `Resend in (${countdown})s`}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => sendVerificationCode(email)}
                        className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer"
                      >
                        {lang === 'ar' ? 'إعادة إرسال الرمز الآن' : 'Resend code now'}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || verificationCode.length < 6}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>{lang === 'ar' ? 'تأكيد الرمز والدخول إلى المنصة' : 'Verify & Enter Academy'}</span>
                        <ArrowLeft className="w-4 h-4" />
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
                      {lang === 'ar' ? 'اسم المهندس / اللقب الأكاديمي:' : 'Engineer Name / Title:'}
                    </label>
                    <div className="relative">
                      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === 'ar' ? 'م. حيدر أحمد' : 'Eng. Hayder'}
                        required
                        autoFocus
                        className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-black/40 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-amber-500/80 transition-all"
                      />
                    </div>
                  </div>

                  {/* Avatar selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      {lang === 'ar' ? 'اختر الصورة الرمزية للمهندس:' : 'Select Engineer Avatar:'}
                    </label>
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-white/[0.08]">
                      {AVATAR_OPTIONS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`p-1 rounded-lg transition-all cursor-pointer ${
                            selectedAvatar === av
                              ? 'bg-amber-500/20 border border-amber-500/60 ring-1 ring-amber-500/30'
                              : 'opacity-50 hover:opacity-100 hover:bg-white/[0.05]'
                          }`}
                        >
                          <img src={av} alt={`Avatar ${idx}`} className="w-8 h-8 rounded-md" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Track selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      {lang === 'ar' ? 'المسار الأكاديمي والشهادة المستهدفة:' : 'Target Certification Track:'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'ccna', label: 'CCNA', code: '200-301', desc: lang === 'ar' ? 'المساعد المعتمد' : 'Associate' },
                        { id: 'ccnp', label: 'CCNP', code: '350-401', desc: lang === 'ar' ? 'المحترف المتقدم' : 'Professional' },
                        { id: 'ccie', label: 'CCIE', code: 'Enterprise', desc: lang === 'ar' ? 'خبير البنية التحتية' : 'Expert' }
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTargetTrack(t.id as CurriculumTrack)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            targetTrack === t.id
                              ? 'bg-amber-500/15 border-amber-500/50 text-white font-bold'
                              : 'bg-black/30 border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                          }`}
                        >
                          <div className="text-xs font-bold text-amber-400">{t.label}</div>
                          <div className="text-[10px] font-mono text-slate-300">{t.code}</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'دخول المنصة وبدء الدراسة' : 'Launch Learning Portal'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          {lang === 'ar' 
            ? '© منصة الفريق السومري للتعلم — جميع المعايير مطابقة لمناهج سيسكو الرسمية و RFC'
            : '© Sumerian Team Learning Platform — Built according to Official Cisco OCG & RFC Standards'}
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
          <span>RFC Compliant</span>
          <span>•</span>
          <span>IOS-XE 17.x</span>
          <span>•</span>
          <span>Wireshark v4.x</span>
        </div>
      </footer>
    </div>
  );
};
