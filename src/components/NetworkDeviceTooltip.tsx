import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Layers, 
  Shield, 
  Terminal, 
  Activity, 
  Radio, 
  Server, 
  Monitor, 
  GitCommit, 
  Info,
  CheckCircle2,
  Zap,
  Cable,
  ArrowRightLeft
} from 'lucide-react';
import { StreetCharacter, HumanNetworkStory, Language } from '../types';

export interface DeviceTechnicalProfile {
  deviceType: 'switch' | 'router' | 'host' | 'firewall' | 'server' | 'dhcp' | 'dns' | 'gateway' | 'cloud_vtep';
  deviceTypeNameAr: string;
  deviceTypeNameEn: string;
  osiLayerAr: string;
  osiLayerEn: string;
  icon: React.ComponentType<{ className?: string }>;
  functionExplanationAr: string;
  functionExplanationEn: string;
  keyResponsibilitiesAr: string[];
  keyResponsibilitiesEn: string[];
  ciscoVerificationCmd: string;
  hardwareRoleAr: string;
  hardwareRoleEn: string;
}

export function inferDeviceTechnicalProfile(
  char?: StreetCharacter | null,
  story?: HumanNetworkStory | null
): DeviceTechnicalProfile {
  if (!char) {
    return {
      deviceType: 'host',
      deviceTypeNameAr: 'جهاز حاسوب طرفي (Client Host / End Workstation)',
      deviceTypeNameEn: 'Client Station / End Host',
      osiLayerAr: 'مكدس TCP/IP الكامل (Layers 1-7)',
      osiLayerEn: 'Full TCP/IP Stack (Layers 1-7)',
      icon: Monitor,
      functionExplanationAr: 'محطة العمل أو الجهاز الذي يستخدمه المستخدم؛ يقوم بإنشاء البيانات وطلب الخدمات وتغليفها عبر طبقات الشبكة واستخدام البوابة الافتراضية (Default Gateway) عند التواصل خارج الشبكة المحلية.',
      functionExplanationEn: 'End-user client initiating application sessions, resolving destination MACs via local ARP cache, and directing traffic via default gateway.',
      keyResponsibilitiesAr: [
        'فحص قناع الشبكة لتحديد هل الوجهة محلية أم خارجية (Bitwise AND).',
        'إرسال طلبات ARP Request عند غياب الـ MAC في الـ ARP Cache.',
        'توليد ترويسات L4 (TCP/UDP) وترويسات L3 (IPv4/IPv6).'
      ],
      keyResponsibilitiesEn: [
        'Performs Bitwise AND against subnet mask to determine if destination is local or remote.',
        'Issues ARP Requests when target MAC address is absent from local ARP Cache.',
        'Generates L4 (TCP/UDP) and L3 (IPv4/IPv6) headers with appropriate port assignments.'
      ],
      ciscoVerificationCmd: 'ipconfig /all (Windows) | ip addr show (Linux)',
      hardwareRoleAr: 'حاسوب مستخدم مع بطاقة شبكة Gigabit Ethernet NIC',
      hardwareRoleEn: 'End-user computer with standard Gigabit Ethernet NIC'
    };
  }

  const nameLower = (char.nameEn || char.nameAr || '').toLowerCase();
  const roleLower = (char.roleAr || char.roleEn || '').toLowerCase();
  const idLower = (char.id || '').toLowerCase();
  const storyLower = (story?.id || story?.titleEn || '').toLowerCase();

  // 1. Switch
  if (
    nameLower.includes('switch') || 
    roleLower.includes('سويتش') || 
    roleLower.includes('سنترال') || 
    idLower.includes('switch') ||
    roleLower.includes('مبدل')
  ) {
    return {
      deviceType: 'switch',
      deviceTypeNameAr: 'مبدل الشبكة (Layer 2 Access Switch)',
      deviceTypeNameEn: 'Layer 2 Ethernet Switch',
      osiLayerAr: 'الطبقة الثانية (Data Link Layer)',
      osiLayerEn: 'Layer 2 (Data Link)',
      icon: Activity,
      functionExplanationAr: 'يربط الأجهزة داخل الشبكة المحلية (LAN) ويوجه إطارات الإيثرنت (Frames) بناءً على جدول الـ CAM وعناوين MAC. يعزل كل منفذ في مجال تصادم (Collision Domain) مستقل لمنع تداخل الإشارات.',
      functionExplanationEn: 'Connects local network devices and forwards Ethernet frames using CAM/MAC tables at wire-speed with dedicated collision domains per port.',
      keyResponsibilitiesAr: [
        'التعلم الذاتي لعناوين MAC من ترويسة المصدر (Source MAC).',
        'توجيه الإطارات لمنفذ الوجهة المحدد وتفادي الإفاضة عند حفظ العنوان.',
        'إفاضة الإطارات المجهولة (Unknown Unicast Flooding) لجميع المنافذ.',
        'منع الحلقات اللانهائية عبر بروتوكول الشجرة الممتدة (STP).'
      ],
      keyResponsibilitiesEn: [
        'Dynamically learns MAC addresses from ingress frame Source MAC fields.',
        'Unicast forwards to destination port when entry exists in CAM table.',
        'Executes Unknown Unicast Flooding across all member VLAN ports when MAC is unlearned.',
        'Prevents Layer 2 switching loops through Spanning Tree Protocol (STP).'
      ],
      ciscoVerificationCmd: 'show mac address-table dynamic | show interfaces status',
      hardwareRoleAr: 'سويتش إيثرنت متعدد المنافذ مدعوم بشرائح تسريع عتادي ASIC',
      hardwareRoleEn: 'Multi-port Ethernet switch powered by dedicated ASIC hardware engines'
    };
  }

  // 2. Firewall / Security Guard
  if (
    nameLower.includes('firewall') || 
    nameLower.includes('guard') || 
    roleLower.includes('جدار') || 
    roleLower.includes('حارس') || 
    roleLower.includes('تفتيش') ||
    idLower.includes('firewall') ||
    idLower.includes('guard') ||
    idLower.includes('acl')
  ) {
    return {
      deviceType: 'firewall',
      deviceTypeNameAr: 'الجدار الناري وفاحص الحزم (Next-Gen Stateful Firewall)',
      deviceTypeNameEn: 'Stateful Inspection Firewall',
      osiLayerAr: 'الطبقات 3 إلى 7 (Network to Application Layers)',
      osiLayerEn: 'Layers 3-7 (Deep Packet Inspection)',
      icon: Shield,
      functionExplanationAr: 'يعمل كخط دفاع أمني ذكي؛ يفحص كل حزمة تمر عبره ويتحقق من حالة الاتصال (Connection State) وتطبيق قواعد الأمان (ACLs) لمنع الاختراق وحجب الحزم غير المصرح بها.',
      functionExplanationEn: 'Inspects active bidirectional network sessions, enforces security ACLs, and drops unauthorized traffic or malicious packets.',
      keyResponsibilitiesAr: [
        'الفحص المعتمد على الحالة (Stateful Packet Inspection).',
        'تطبيق قوائم التحكم بالوصول (Standard & Extended ACLs).',
        'مراقبة أرقام المنافذ والبروتوكولات ومنع هجمات الحرمان من الخدمة (DoS).'
      ],
      keyResponsibilitiesEn: [
        'Tracks connection states with stateful inspection table verification.',
        'Enforces standard and extended access control lists (ACLs).',
        'Monitors protocol and port numbers to block unauthorized access and DoS floods.'
      ],
      ciscoVerificationCmd: 'show access-lists | show conn | show asp drop',
      hardwareRoleAr: 'جهاز أمان شبكي متخصص (Cisco ASA / Firepower Appliance)',
      hardwareRoleEn: 'Dedicated enterprise security appliance (Cisco ASA / Firepower)'
    };
  }

  // 3. Router / Gateway
  if (
    nameLower.includes('router') || 
    nameLower.includes('gateway') || 
    roleLower.includes('راوتر') || 
    roleLower.includes('موجه') || 
    roleLower.includes('بوابة') ||
    roleLower.includes('بريد الرياض') ||
    roleLower.includes('بريد دبي') ||
    idLower.includes('router') ||
    idLower.includes('gateway') ||
    idLower.includes('r1') ||
    idLower.includes('r2')
  ) {
    return {
      deviceType: 'router',
      deviceTypeNameAr: 'الموجه والراوتر (Layer 3 Edge / Core Router)',
      deviceTypeNameEn: 'Layer 3 Network Router',
      osiLayerAr: 'الطبقة الثالثة (Network Layer)',
      osiLayerEn: 'Layer 3 (Network Layer)',
      icon: Layers,
      functionExplanationAr: 'يربط الشبكات المختلفة والإنترنت ببعضها البعض، يحدد أفضل مسار (Best Path) باستخدام خوارزميات التوجيه، يعزل مجالات البث العام (Broadcast Domains)، ويستبدل ترويسة MAC في كل قفزة.',
      functionExplanationEn: 'Routes packets across distinct networks using routing tables (FIB/RIB), isolates broadcast domains, and re-encapsulates L2 headers per hop.',
      keyResponsibilitiesAr: [
        'توجيه الحزم باختيار أطول قناع شبكة (Longest Prefix Match).',
        'إنقاص حقل زمن البقاء (TTL) بمقدار 1 لحماية الإنترنت من الحلقات.',
        'فك تغليف فريم الـ L2 وتركيب فريم L2 جديد للقفزة القادمة (Next-Hop).',
        'عزل البث العام وإسقاط فريمات Broadcast لمنع تشبع الشبكة.'
      ],
      keyResponsibilitiesEn: [
        'Forwards IP packets using Longest Prefix Match against routing tables.',
        'Decrements Time-to-Live (TTL) by 1 to mitigate routing loops.',
        'De-encapsulates ingress L2 frames and encapsulates new L2 headers for the next hop.',
        'Terminates broadcast domains and isolates subnet traffic.'
      ],
      ciscoVerificationCmd: 'show ip route | show ip cef | show ip interface brief',
      hardwareRoleAr: 'راوتر عالي الأداء مزود بذاكرة توجيه FIB ومعالج توجيه متقدم',
      hardwareRoleEn: 'High-performance edge/core router with hardware CEF and FIB tables'
    };
  }

  // 4. DHCP Server
  if (nameLower.includes('dhcp') || roleLower.includes('توزيع العناوين') || idLower.includes('dhcp')) {
    return {
      deviceType: 'dhcp',
      deviceTypeNameAr: 'خادم توزيع العناوين التلقائي (DHCP Server)',
      deviceTypeNameEn: 'Dynamic Host Configuration Server',
      osiLayerAr: 'الطبقة السابعة (Application Layer - UDP 67/68)',
      osiLayerEn: 'Layer 7 Application (UDP)',
      icon: Radio,
      functionExplanationAr: 'يوفر إعدادات بروتوكول IP تلقائياً للأجهزة فور اتصالها بالشبكة (العنوان، قناع الشبكة، البوابة الافتراضية، وخوادم DNS) عبر عملية DORA الشهيرة.',
      functionExplanationEn: 'Dynamically assigns IP parameters, subnet masks, gateways, and DNS to connecting hosts via the 4-way DORA process.',
      keyResponsibilitiesAr: [
        'إدارة نطاق العناوين (IP Address Pool) وفترات الإيجار (Lease Time).',
        'معالجة طلبات الاستكشاف (Discover) والطلب (Request).',
        'منع تعارض العناوين (IP Conflict Detection).'
      ],
      keyResponsibilitiesEn: [
        'Manages IP address pools, leases, and default gateway assignments.',
        'Processes DHCP Discover, Offer, Request, and Acknowledgment (DORA) messages.',
        'Performs IP conflict detection prior to lease allocations.'
      ],
      ciscoVerificationCmd: 'show ip dhcp binding | show ip dhcp pool',
      hardwareRoleAr: 'خادم خدمات شبكية أو خدمة مدمجة في راوتر سيسكو',
      hardwareRoleEn: 'Dedicated enterprise server or integrated Cisco IOS DHCP service'
    };
  }

  // 5. DNS Server / Directory
  if (nameLower.includes('dns') || roleLower.includes('دليل الأسماء') || idLower.includes('dns')) {
    return {
      deviceType: 'dns',
      deviceTypeNameAr: 'خادم أسماء النطاقات (DNS Resolver Server)',
      deviceTypeNameEn: 'Domain Name System Server',
      osiLayerAr: 'الطبقة السابعة (Application Layer - UDP/TCP 53)',
      osiLayerEn: 'Layer 7 Application (UDP/TCP 53)',
      icon: Server,
      functionExplanationAr: 'يترجم أسماء النطاقات التي يفهمها البشر (مثل google.com) إلى عناوين IP رقمية (مثل 142.250.180.14) تستطيع الراوترات والسويتشات توجيه البيانات إليها.',
      functionExplanationEn: 'Resolves human-friendly domain names to machine-routable IP addresses using distributed hierarchical records (A, AAAA, CNAME).',
      keyResponsibilitiesAr: [
        'البحث العودي والتكراري في سجلات الأسماء (A, AAAA, PTR).',
        'تخزين النتائج في ذاكرة الكاش السريعة لتسريع التصفح.',
        'الاستجابة لطلبات الحواسب عبر بروتوكول UDP منفذ 53.'
      ],
      keyResponsibilitiesEn: [
        'Executes recursive and iterative lookups for A, AAAA, and PTR records.',
        'Caches resolved mappings to accelerate subsequent domain lookups.',
        'Answers client resolution requests over UDP port 53.'
      ],
      ciscoVerificationCmd: 'show hosts | ip domain lookup',
      hardwareRoleAr: 'خادم اسم نطاق مركزي أو خادم كاش محلي',
      hardwareRoleEn: 'Authoritative or recursive caching DNS server node'
    };
  }

  // 6. Server / Data Center Node
  if (
    nameLower.includes('server') || 
    roleLower.includes('خادم') || 
    roleLower.includes('طبيب') || 
    roleLower.includes('بنك') || 
    idLower.includes('server') ||
    idLower.includes('target')
  ) {
    return {
      deviceType: 'server',
      deviceTypeNameAr: 'خادم ومستودع الخدمات (Enterprise Application Server)',
      deviceTypeNameEn: 'Application / Target Server',
      osiLayerAr: 'مكدس البروتوكولات الكامل (Layers 1-7 Stack)',
      osiLayerEn: 'End-to-End L1-L7 Application Stack',
      icon: Server,
      functionExplanationAr: 'يستضيف الخدمات وقواعد البيانات ومواقع الويب؛ يستمع عبر منافذ مخصصة (مثل 80/443/53) ويقوم بمعالجة طلبات المستخدمين الواردة والرد عليها بحزم بيانات منسقة.',
      functionExplanationEn: 'Hosts enterprise web services, applications, and APIs listening on standard TCP/UDP ports and responding to client queries.',
      keyResponsibilitiesAr: [
        'معالجة جلسات TCP Handshake والاتصالات المشفرة TLS/SSL.',
        'الرد على طلبات الـ ARP بتقديم عنوان الـ MAC الفيزيائي الخاص بكارت السيرفر.',
        'توفير التوافر العالي والتعافي من الكوارث.'
      ],
      keyResponsibilitiesEn: [
        'Terminates TCP three-way handshakes and establishes encrypted TLS/SSL sessions.',
        'Responds to ARP requests with its local interface NIC MAC address.',
        'Maintains high availability and process clustering for incoming transactions.'
      ],
      ciscoVerificationCmd: 'netstat -tulnp | ss -tuna',
      hardwareRoleAr: 'خادم نصل Rack/Blade Server مزود ببطاقة شبكة 10G/25G Dual NIC',
      hardwareRoleEn: 'Enterprise rack/blade server with high-bandwidth dual 10G/25G NICs'
    };
  }

  // 7. Default: Host / Client PC
  return {
    deviceType: 'host',
    deviceTypeNameAr: 'جهاز حاسوب طرفي (Client Host / End Workstation)',
    deviceTypeNameEn: 'Client Station / End Host',
    osiLayerAr: 'مكدس TCP/IP الكامل (Layers 1-7)',
    osiLayerEn: 'Full TCP/IP Stack (Layers 1-7)',
    icon: Monitor,
    functionExplanationAr: 'محطة العمل أو الجهاز الذي يستخدمه المستخدم؛ يقوم بإنشاء البيانات وطلب الخدمات وتغليفها عبر طبقات الشبكة واستخدام البوابة الافتراضية (Default Gateway) عند التواصل خارج الشبكة المحلية.',
    functionExplanationEn: 'End-user client initiating application sessions, resolving destination MACs via local ARP cache, and directing traffic via default gateway.',
    keyResponsibilitiesAr: [
      'فحص قناع الشبكة لتحديد هل الوجهة محلية أم خارجية (Bitwise AND).',
      'إرسال طلبات ARP Request عند غياب الـ MAC في الـ ARP Cache.',
      'توليد ترويسات L4 (TCP/UDP) وترويسات L3 (IPv4/IPv6).'
    ],
    keyResponsibilitiesEn: [
      'Executes Bitwise AND to check if destination IP resides on local subnet.',
      'Sends broadcast ARP requests when destination MAC is not in ARP cache.',
      'Encapsulates transport (TCP/UDP) and network (IPv4/IPv6) headers.'
    ],
    ciscoVerificationCmd: 'ipconfig /all (Windows) | ip addr show (Linux)',
    hardwareRoleAr: 'حاسوب مستخدم مع بطاقة شبكة Gigabit Ethernet NIC',
    hardwareRoleEn: 'Client workstation with Gigabit Ethernet network adapter'
  };
}

interface NetworkDeviceTooltipProps {
  character: StreetCharacter | null;
  story?: HumanNetworkStory;
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export const NetworkDeviceTooltip: React.FC<NetworkDeviceTooltipProps> = ({
  character,
  story,
  isOpen,
  onClose,
  lang = 'ar'
}) => {
  if (!isOpen || !character) return null;

  const profile = inferDeviceTechnicalProfile(character, story);
  const Icon = profile.icon;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 8 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-2xl overflow-hidden text-right text-slate-100 ${
            lang === 'ar' ? 'dir-rtl' : 'dir-ltr text-left'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-amber-500/15 via-slate-800 to-slate-900 border-b border-amber-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-100">
                    {lang === 'ar' ? character.nameAr : character.nameEn}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {lang === 'ar' ? profile.osiLayerAr : profile.osiLayerEn}
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-medium mt-0.5">
                  {lang === 'ar' ? profile.deviceTypeNameAr : profile.deviceTypeNameEn}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
            {/* Real vs Technical Metaphor Banner */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-amber-300">
                  {lang === 'ar' ? 'التشبيه الواقعي: ' : 'Real Metaphor: '}
                </span>
                {lang === 'ar' ? character.roleAr : (character.roleEn || character.roleAr)}
                {(character.initialSpeechEn || character.initialSpeech) && (
                  <span className="block text-slate-400 text-[11px] italic mt-1">
                    "{lang === 'ar' ? character.initialSpeech : (character.initialSpeechEn || character.initialSpeech)}"
                  </span>
                )}
              </div>
            </div>

            {/* Core Network Technical Function */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'الوظيفة الهندسية للقطعة في الشبكة:' : 'Technical Role in Network:'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {lang === 'ar' ? profile.functionExplanationAr : profile.functionExplanationEn}
              </p>
            </div>

            {/* Technical Identifiers Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {lang === 'ar' ? 'عنوان الطبقة الثالثة (Logical L3 IP):' : 'L3 IP Address:'}
                </span>
                <span className="font-mono text-xs font-bold text-cyan-300 block truncate">
                  {character.ipAddress}
                </span>
                <span className="text-[9px] text-slate-500 block mt-1">
                  {lang === 'ar' ? 'يُستخدم للتوجيه العالمي بين الشبكات' : 'Used for End-to-End routing'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">
                  {lang === 'ar' ? 'عنوان الطبقة الثانية (Physical L2 MAC):' : 'L2 MAC Address:'}
                </span>
                <span className="font-mono text-xs font-bold text-emerald-300 block truncate">
                  {character.macAddress}
                </span>
                <span className="text-[9px] text-slate-500 block mt-1">
                  {lang === 'ar' ? 'محفور في بطاقة NIC للتسليم المحلي' : 'Burned in NIC for Hop-by-Hop delivery'}
                </span>
              </div>
            </div>

            {/* Key Network Responsibilities */}
            <div>
              <span className="text-xs font-bold text-slate-200 block mb-1.5">
                {lang === 'ar' ? 'المهام والمسؤوليات الأساسية لهذه القطعة:' : 'Key Engineering Responsibilities:'}
              </span>
              <ul className="space-y-1.5">
                {(lang === 'ar' ? profile.keyResponsibilitiesAr : profile.keyResponsibilitiesEn).map((resp, i) => (
                  <li key={i} className="text-[11px] text-slate-300 flex items-start gap-2 bg-slate-950/30 p-2 rounded-lg border border-slate-800/60">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hardware Role Description */}
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                {lang === 'ar' ? 'مواصفات العتاد الفيزيائي في الشبكات الحقيقية:' : 'Hardware Specification:'}
              </span>
              <span className="text-xs text-slate-200 font-medium">
                {lang === 'ar' ? profile.hardwareRoleAr : profile.hardwareRoleEn}
              </span>
            </div>

            {/* Cisco CLI Command to verify */}
            <div className="rounded-xl overflow-hidden border border-emerald-500/20 bg-slate-950">
              <div className="px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                  <Terminal className="w-3 h-3" />
                  <span>Cisco Verification Command</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">CCNA/CCNP Tool</span>
              </div>
              <div className="p-2.5 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                # {profile.ciscoVerificationCmd}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-[11px] text-slate-400">
              {lang === 'ar' ? '💡 اضغط في أي مكان للإغلاق أو انقر فوق بطاقة أخرى' : 'Click anywhere to close'}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'تم الفهم' : 'Got it'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Generic Hover Tooltip for Cable, Ports, Headers, and Capsules
interface ComponentQuickTooltipProps {
  title: string;
  category: string;
  description: string;
  ciscoConcept?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  lang?: Language;
  children: React.ReactNode;
}

export const ComponentQuickTooltip: React.FC<ComponentQuickTooltipProps> = ({
  title,
  category,
  description,
  ciscoConcept,
  side = 'top',
  className = '',
  lang = 'ar',
  children
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getPositionClasses = () => {
    switch (side) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  const getInitialAnimation = () => {
    switch (side) {
      case 'bottom': return { opacity: 0, scale: 0.95, y: 4 };
      case 'left': return { opacity: 0, scale: 0.95, x: -4 };
      case 'right': return { opacity: 0, scale: 0.95, x: 4 };
      case 'top':
      default:
        return { opacity: 0, scale: 0.95, y: -4 };
    }
  };

  const isEn = lang === 'en';

  return (
    <div 
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(prev => !prev)}
    >
      {children}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={getInitialAnimation()}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={getInitialAnimation()}
            transition={{ duration: 0.15 }}
            className={`absolute ${getPositionClasses()} z-40 w-64 p-3 rounded-xl bg-slate-900/98 border border-amber-500/30 shadow-2xl backdrop-blur-md pointer-events-none text-slate-100 ${
              isEn ? 'text-left dir-ltr' : 'text-right dir-rtl'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-amber-400 truncate">{title}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {category}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-1.5">
              {description}
            </p>
            {ciscoConcept && (
              <div className="pt-1.5 border-t border-slate-800 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <Terminal className="w-3 h-3 shrink-0" />
                <span className="truncate">{ciscoConcept}</span>
              </div>
            )}
            {/* Arrow indicator */}
            <div 
              className={`absolute w-2.5 h-2.5 bg-slate-900 border-amber-500/30 rotate-45 ${
                side === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b' :
                side === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t' :
                side === 'left' ? '-right-1.5 top-1/2 -translate-y-1/2 border-r border-t' :
                '-left-1.5 top-1/2 -translate-y-1/2 border-l border-b'
              }`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
