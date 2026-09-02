import { SlideData } from '../types';

export const SLIDES_DATA: SlideData[] = [
  {
    id: 'slide-1',
    number: 1,
    category: 'foundation',
    categoryAr: 'المفاهيم الأساسية',
    titleAr: 'كيف تتحدث الحواسيب؟ السويتشينغ مقابل الراوتينغ',
    titleEn: 'How Networks Breathe: Switching (L2) vs Routing (L3)',
    subtitleAr: 'الرحلة من غرفتك الصغيرة إلى خوادم السحاب حول العالم',
    realWorldMetaphor: {
      titleAr: 'تشبيه برج المكاتب مقابل النقل الجوي الدولي',
      iconName: 'Building2',
      storyAr: 'تخيل أنك تعمل في مكتب داخل ناطحة سحاب ضخمة. عندما تريد إرسال ملف إلى زميلك في نفس الدور، فإن موظف البريد الداخلي (السويتش) يأخذه مباشرة ويوصله لباب مكتب زميلك فوراً لأن لديه خريطة بأرقام المكاتب (MAC Address). ولكن إن أردت إرسال طرد إلى فرع الشركة في مدينة نيويورك، فإن موظف البريد الداخلي لا يعرف شوارع نيويورك؛ لذلك يسلمه فوراً إلى شركة الشحن العالمية (الراوتر) التي تفحص العنوان والمدينة والرمز البريدي (IP Address) وتنقله عبر المطارات والطرق السريعة.',
      lessonAr: 'السويتش يحكم داخل المبنى (الشبكة المحلية LAN)، بينما الراوتر يحكم الطرق السريعة بين المدن والبلدان (الشبكات المتباعدة WAN / Internet).',
      comparison: [
        { realWorld: 'رقم الغرفة / المكتب الداخلي (لا يتغير فيزيائياً داخل الدور)', networkWorld: 'عنوان الـ MAC (Layer 2 Physical Identifier)' },
        { realWorld: 'الرمز البريدي واسم الدولة والمدينة (عالمي ومنطقي)', networkWorld: 'عنوان الـ IP (Layer 3 Logical Hierarchy)' },
        { realWorld: 'موظف الاستقبال أو ساعي البريد داخل المبنى', networkWorld: 'السويتش (Switch) لتمرير الفريمات المحلية' },
        { realWorld: 'المطار الدولي ومحطات الفرز بين المدن', networkWorld: 'الراوتر (Router) لتوجيه الحزم بين الشبكات' }
      ]
    },
    keyConcepts: [
      {
        title: 'الطبقة الثانية (Data Link Layer)',
        term: 'Layer 2 / Frames',
        desc: 'مقر عمل السويتش؛ تتعامل مع الإطارات (Frames) وعناوين الماك المطبوعة على كروت الشبكة.',
        color: 'emerald'
      },
      {
        title: 'الطبقة الثالثة (Network Layer)',
        term: 'Layer 3 / Packets',
        desc: 'مقر عمل الراوتر؛ تتعامل مع الحزم (Packets) وعناوين الـ IP التوجيهية وتحديد أفضل مسار.',
        color: 'indigo'
      },
      {
        title: 'وحدة نقل البيانات',
        term: 'PDU Transition',
        desc: 'البيانات تُسمى فريم (Frame) عند السويتش، وتُسمى حزمة (Packet) عند الراوتر.',
        color: 'cyan'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'لا يمكن لشبكة محلية أن تعمل بكفاءة بدون سويتش، ولا يمكن لشبكات العالم أن تتواصل مع بعضها بدون راوتر!'
  },
  {
    id: 'slide-2',
    number: 2,
    category: 'switching',
    categoryAr: 'عالم السويتشينغ',
    titleAr: 'تشريح السويتش (Layer 2 Switching): كيف يفكر ويتعلم؟',
    titleEn: 'Inside the Switch: The CAM Table & Hardware Speed',
    subtitleAr: 'الذكاء العتادي القائم على التعلم الذاتي وحفظ المنافذ',
    realWorldMetaphor: {
      titleAr: 'ساعي البريد الذكي الذي يحفظ الوجوه والمكاتب',
      iconName: 'Cpu',
      storyAr: 'عندما يبدأ ساعي بريد جديد عمله في المبنى، لا يعرف من يسكن في أي مكتب. حين يخرج شخص من المكتب رقم 1 ويسلمه رسالة موجهة لشخص آخر، يدوّن الساعي فوراً في دفتره: "الموظف أحمد موجود في المكتب رقم 1". ثم عندما يسأل عن وجهة الرسالة المجهولة، يضطر للطرق على جميع الأبواب (Flooding). ولكن بمجرد أن يرد المستلم من المكتب رقم 2، يدوّن في دفتره: "سارة في المكتب رقم 2". من تلك اللحظة فصاعداً، أي رسالة بين أحمد وسارة تذهب مباشرة وبدون إزعاج لبقية المكاتب!',
      lessonAr: 'السويتش يتعلم عنوان المصدر تلقائياً (Source MAC Learning) عند دخول أي فريم، ويوجه الفريم بناءً على عنوان الوجهة (Destination MAC Lookup).',
      comparison: [
        { realWorld: 'دفتر ملاحظات الساعي', networkWorld: 'جدول الـ MAC Table / CAM Table' },
        { realWorld: 'طرق جميع الأبواب للبحث عن شخص غير مسجل', networkWorld: 'عملية الإفاضة (Flooding / Unknown Unicast)' },
        { realWorld: 'التسليم المباشر لباب المكتب المعني فقط', networkWorld: 'التوجيه الأحادي المباشر (Unicast Forwarding)' },
        { realWorld: 'مسح اسم الشخص إذا لم يرسل رسائل منذ فترة', networkWorld: 'مؤقت تقادم العناوين (MAC Table Aging Time - 300s)' }
      ]
    },
    keyConcepts: [
      {
        title: 'التعلم من المصدر',
        term: 'Source MAC Learning',
        desc: 'السويتش لا يتعلم من عنوان الوجهة، بل يراقب عنوان المصدر لكل فريم يدخل من المنفذ.',
        color: 'emerald'
      },
      {
        title: 'عزل مجالات التصادم',
        term: 'Micro-segmentation',
        desc: 'كل منفذ في السويتش يمثل Collision Domain منفصل ويعمل بتقنية Full-Duplex لمنع التصادم.',
        color: 'indigo'
      },
      {
        title: 'سرعة الشرائح العتادية (ASIC)',
        term: 'Hardware-level Speed',
        desc: 'السويتش يتخذ قرارات التمرير عبر شرائح إلكترونية مخصصة فائقة السرعة بمليارات البايتات في الثانية.',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'السويتش أعمى عن عناوين الـ IP؛ هو يرى فقط عناوين الماك والمنافذ الفيزيائية المتصلة بها.'
  },
  {
    id: 'slide-3',
    number: 3,
    category: 'arp',
    categoryAr: 'بروتوكول ARP',
    titleAr: 'بروتوكول ARP: الجسر السحري بين عالم الـ IP وعالم الـ MAC',
    titleEn: 'Address Resolution Protocol (ARP): Who is who?',
    subtitleAr: 'كيف يجد جهازك عنوان الماك المجهول عندما يعرف فقط عنوان الـ IP؟',
    realWorldMetaphor: {
      titleAr: 'النداء العام في قاعة المؤتمرات',
      iconName: 'Megaphone',
      storyAr: 'تخيل أنك في قاعة مؤتمرات وتريد تسليم وثيقة للمدير المالي "الأستاذ طارق" (عنوان IP منطقي)، لكنك لم تره من قبل ولا تعرف شكله وملامحه (عنوان MAC الفيزيائي). ماذا تفعل؟ تقف على المسرح وتمسك الميكروفون (Broadcast) وتقول بصوت عالٍ: "أنا أحمد من قسم التقنية، من هو الأستاذ طارق المدير المالي؟ أرجوك ارفع يدك!" كل من في القاعة يسمعك، لكن الحاضرين الآخرين يتجاهلون النداء لأن أسماءهم ليست طارق. فيقوم الأستاذ طارق من كرسيه ويقترب منك بنفسه (Unicast) ويقول: "أنا طارق وهذه بطاقة هويتي". فتحفظ شكله فوراً في ذاكرتك.',
      lessonAr: 'طلب الـ ARP Request يُرسل كبث عام (Broadcast FF:FF:FF:FF:FF:FF) ويصل لكل أجهزة السويتش، بينما رد الـ ARP Reply يكون خاصاً ومباشراً (Unicast).',
      comparison: [
        { realWorld: 'النداء في الميكروفون على المسرح', networkWorld: 'ARP Request (Broadcast FF:FF:FF:FF:FF:FF)' },
        { realWorld: 'رد الشخص المعني مباشرة لحامل الوثيقة', networkWorld: 'ARP Reply (Unicast to Requester MAC)' },
        { realWorld: 'حفظ رقم هاتف الشخص في مفكرة الهاتف', networkWorld: 'تخزين العنوان في جدول الـ ARP Cache' },
        { realWorld: 'تجاهل باقي الحضور للنداء غير الموجه لهم', networkWorld: 'تجاهل كروت الشبكة للحزم غير المطابقة لـ IP الخاص بها' }
      ]
    },
    keyConcepts: [
      {
        title: 'عنوان البث العام',
        term: 'Broadcast Address',
        desc: 'عنوان FF:FF:FF:FF:FF:FF يجبر السويتش على نسخ الفريم لجميع المنافذ النشطة.',
        color: 'amber'
      },
      {
        title: 'ذاكرة الـ ARP المؤقتة',
        term: 'ARP Cache Table',
        desc: 'يخزن الربط بين IP و MAC لفترة (تتراوح بين دقائق وساعات) لتفادي البث المتكرر.',
        color: 'cyan'
      },
      {
        title: 'ARP المجاني (Gratuitous ARP)',
        term: 'Gratuitous ARP (GARP)',
        desc: 'إعلان يرسله الجهاز عند تشغيله ليخبر الجميع بعنوانه ويكتشف إذا كان هناك تضارب IP (IP Conflict).',
        color: 'rose'
      }
    ],
    interactiveScenarioId: 'arp-broadcast-resolution',
    takeawayMessage: 'بدون بروتوكول ARP، لا يمكن لأي جهاز حاسوب أن يبدأ بإرسال فريم إيثرنت واحد عبر السويتش!'
  },
  {
    id: 'slide-4',
    number: 4,
    category: 'routing',
    categoryAr: 'عالم الراوتينغ',
    titleAr: 'تشريح الراوتر (Layer 3 Routing): الملاحة الذكية بين الشبكات',
    titleEn: 'Inside the Router: Route Tables, Subnets & Gateways',
    subtitleAr: 'العقل المدبر لتحديد أفضل مسار وفصل نطاقات البث',
    realWorldMetaphor: {
      titleAr: 'مطار الشحن الدولي وبرج المراقبة',
      iconName: 'Compass',
      storyAr: 'في المطار الدولي، تصل الحاويات من شاحنات محلية مختلفة. مسؤولو الجمارك والشحن (الراوتر) ينظرون إلى كود الدولة والمدينة المكتوب على الحاوية الخارجية (IP Address). لديهم جدول مواعيد ورحلات ضخم (Routing Table) يحدد: "شحنات أوروبا تذهب عبر البوابة الشرقية، شحنات آسيا عبر الطائرة B747، وإذا كانت الوجهة غير معروفة، أرسلها إلى مركز التوزيع العام (Default Route 0.0.0.0/0)". كما يقوم المطار بإلغاء بطاقة الشاحنة المحلية ووضع بطاقة الشحن الجوي قبل الإقلاع.',
      lessonAr: 'الراوتر يربط بين شبكات مختلفة كلياً في الـ IP Subnet، ويقرر الوجهة القادمة (Next-Hop) بناءً على أطول مطابقة لعنوان الشبكة (Longest Prefix Match).',
      comparison: [
        { realWorld: 'جدول مواعيد رحلات الطيران ومسارات الشحن', networkWorld: 'جدول التوجيه (Routing Table / RIB & FIB)' },
        { realWorld: 'البوابة الرئيسية لمغادرة المدينة إلى العالم الخارجي', networkWorld: 'البوابة الافتراضية (Default Gateway IP)' },
        { realWorld: 'مسار الطوارئ للشحنات إلى الدول النادرة', networkWorld: 'المسار الافتراضي (Default Route 0.0.0.0/0)' },
        { realWorld: 'فصل حدود الدول وعدم السماح بالصراخ عبر الحدود', networkWorld: 'كسر وعزل نطاق البث (Broadcast Domain Separation)' }
      ]
    },
    keyConcepts: [
      {
        title: 'فصل نطاق البث',
        term: 'Broadcast Domain Separation',
        desc: 'الراوتر لا يمرر حزم الـ Broadcast أبداً، مما يحمي الشبكات من العواصف البرمجية.',
        color: 'indigo'
      },
      {
        title: 'أفضل مسار والـ Metric',
        term: 'Best Path & Metric Calculation',
        desc: 'بروتوكولات التوجيه (OSPF, BGP, Static) تختار المسار الأسرع والأقل تكلفة.',
        color: 'emerald'
      },
      {
        title: 'القفزة التالية (Next-Hop)',
        term: 'Next-Hop Resolution',
        desc: 'الراوتر لا يحتاج لمعرفة المسار بالكامل حتى النهاية؛ يكفي أن يعرف الجهاز التالي الذي يسلمه الحزمة.',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'الراوتر هو صمام الأمان الذي يقسم الإنترنت إلى مليارات الشبكات المنفصلة دون أن تنهار بالبث العام.'
  },
  {
    id: 'slide-5',
    number: 5,
    category: 'end_to_end',
    categoryAr: 'الرحلة الكاملة',
    titleAr: 'سحر التغليف (Encapsulation): ماذا يتغير وماذا يبقى ثابتاً؟',
    titleEn: 'The Golden Rule of Networking: MAC Changes, IP Stays!',
    subtitleAr: 'كشف أسرار فك وتركيب الحزم والتحكم في زمن البقاء (TTL)',
    realWorldMetaphor: {
      titleAr: 'المظروف الداخلي المغلق وصناديق الشحن المتغيرة',
      iconName: 'Layers',
      storyAr: 'تخيل أنك كتبت رسالة حب ووضعتها داخل مظروف مغلق بالشمع وكتبت عليه: "من أحمد إلى ليلى في باريس". هذا المظروف بالشمع هو (حزمة IP) التي لا تُفتح ولا تتغير في أي محطة. لكن لنقلها، يتم وضعها في حقيبة ساعي البريد، ثم في صندوق شاحنة النقل، ثم في حاوية الطائرة، ثم في حقيبة ساعي باريس. في كل مرحلة، يتم تغيير الصندوق الخارجي (فريم الإيثرنت وعناوين MAC)، لكن المظروف الأصلي الداخلي يصل ليد ليلى سالماً كما هو!',
      lessonAr: 'عنوان IP المصدر والهدف لا يتغيران طوال الرحلة عبر العالم، بينما عنوان MAC المصدر والهدف يتجددان تماماً عند كل راوتر تقابله الحزمة.',
      comparison: [
        { realWorld: 'المظروف الداخلي الموجه لليلى', networkWorld: 'حزمة الـ IP (Src IP & Dest IP ثابته)' },
        { realWorld: 'صناديق الشاحنات والطائرات المتغيرة', networkWorld: 'فريم الـ Ethernet (Src MAC & Dest MAC يتغيران بكل Hop)' },
        { realWorld: 'عداد صلاحية الطرد (تاريخ انتهاء الصلاحية)', networkWorld: 'حقل زمن الحياة (Time To Live - TTL ينقص 1 عند كل راوتر)' },
        { realWorld: 'إتلاف الطرد إذا طاف في حلقة مفرغة بين المطارات', networkWorld: 'إسقاط الحزمة (Drop) وإرسال ICMP Time Exceeded عند وصول TTL=0' }
      ]
    },
    keyConcepts: [
      {
        title: 'فك وإعادة التغليف',
        term: 'Decapsulation & Re-encapsulation',
        desc: 'الراوتر يزيل إطار L2 القديم، يفحص L3، ثم يغلف بحزمة L2 جديدة تناسب الوصلة التالية.',
        color: 'emerald'
      },
      {
        title: 'حماية الشبكة من الحلقات (TTL)',
        term: 'Time-to-Live (TTL Protection)',
        desc: 'كل راوتر ينقص قيمة TTL بمقدار 1 لمنع الحزم التائهة من الدوران إلى ما لا نهاية.',
        color: 'rose'
      },
      {
        title: 'البوابة الافتراضية (Default Gateway)',
        term: 'Gateway as First Hop',
        desc: 'العنوان الفيزيائي للراوتر هو أول وجهة MAC تضعها الحواسيب عند مخاطبة العالم الخارجي.',
        color: 'indigo'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'تذكر دائماً: الـ IP للوجهة النهائية (End-to-End)، والـ MAC للقفزة الحالية فقط (Hop-by-Hop).'
  },
  {
    id: 'slide-6',
    number: 6,
    category: 'comparison',
    categoryAr: 'المقارنة الشاملة',
    titleAr: 'المواجهة الكبرى: السويتش ضد الراوتر في ميزان الهندسة',
    titleEn: 'The Ultimate Comparison: Switch vs Router Matrix',
    subtitleAr: 'ملخص شامل لكل الفروق التقنية والوظيفية في شاشة واحدة',
    realWorldMetaphor: {
      titleAr: 'طرق الحي الداخلية مقابل شبكة الطرق السريعة المعلقة',
      iconName: 'GitCompare',
      storyAr: 'الطرق الداخلية داخل الحي (Switching) سريعة ومصممة للتنقل السلس بين المنازل المتجاورة، لكنها لا تصلح لعبور المحيطات. شبكة الطرق السريعة ومحطات الرسوم والتقاطعات المعلقة (Routing) معقدة وذكية وتملك لافتات إرشادية كبرى تقودك بين المحافظات والدول وتمنع التكدس.',
      lessonAr: 'أنت بحاجة للسويتش لتوزيع الاتصال بسرعة فائقة محلياً، وبحاجة للراوتر لحماية شبكتك وربطها بالإنترنت.',
      comparison: [
        { realWorld: 'شوارع الحي المحلي المتصلة بدون حواجز', networkWorld: 'مجال البث الواحد (Single Broadcast Domain)' },
        { realWorld: 'بوابات الرسوم والجمارك بين المدن', networkWorld: 'حدود الراوتر التي تقطع البث وتفصل الشبكات' },
        { realWorld: 'اللوحات المعدنية للمركبات المسجلة في المرور', networkWorld: 'عناوين MAC الفيزيائية المحفورة بالعتاد' },
        { realWorld: 'العنوان الوطني الشجري (شارع / حي / مدينة)', networkWorld: 'عناوين IP المنطقية القابلة للتقسيم (Subnetting)' }
      ]
    },
    keyConcepts: [
      {
        title: 'طبقة العمل في نموذج OSI',
        term: 'Layer 2 (Switch) vs Layer 3 (Router)',
        desc: 'السويتش في طبقة ربط البيانات (Data Link)، والراوتر في طبقة الشبكة (Network).',
        color: 'emerald'
      },
      {
        title: 'جدول اتخاذ القرار',
        term: 'CAM Table vs Routing Table',
        desc: 'السويتش يبحث في جدول MAC Address، والراوتر يبحث في جدول Routing Table عبر خوارزميات التوجيه.',
        color: 'indigo'
      },
      {
        title: 'التعامل مع البث العام',
        term: 'Broadcast Handling',
        desc: 'السويتش يمرر الـ Broadcast لجميع الأجهزة، بينما الراوتر يوقفه ويمنع عبوره نهائياً.',
        color: 'amber'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'الشبكة الحديثة المتكاملة هي سيمفونية رائعة تجمع سرعة السويتش مع ذكاء وتوجيه الراوتر!'
  },
  {
    id: 'slide-7',
    number: 7,
    category: 'interactive_lab',
    categoryAr: 'المعمل التفاعلي الحي',
    titleAr: 'مختبر الشبكات الحي: أطلق الحزم واختبر بنفسك',
    titleEn: 'Interactive Live Network Sandbox',
    subtitleAr: 'تحكم كامل في إرسال البيانات، فحص الفريمات، ومراقبة الجداول في الوقت الحقيقي',
    realWorldMetaphor: {
      titleAr: 'غرفة التحكم والمحاكاة لمهندسي الشبكات',
      iconName: 'Terminal',
      storyAr: 'أنت الآن رئيس مهندسي الشبكة في غرفة العمليات! أمامك أزرار الإطلاق، بإمكانك تجربة إرسال طلب بين حاسوبين في نفس الشبكة لمشاهدة السويتشينغ، أو إطلاق طلب عابر للقارات لمشاهدة تبديل عناوين الماك والـ TTL في الراوتر.',
      lessonAr: 'التجربة المباشرة ومشاهدة حركة الحزم نبضة بنبضة ترسخ المعلومة في ذهنك للأبد.',
      comparison: [
        { realWorld: 'لوحة التحكم برادارات الحركة الجوية', networkWorld: 'شاشة مراقبة مسار الحزمة (Packet Flow Monitor)' },
        { realWorld: 'فحص جوازات السفر وحقائب الركاب', networkWorld: 'محلل ترويسات الحزمة (Packet Inspector)' },
        { realWorld: 'سجل تحركات ومسارات الرحلات', networkWorld: 'جداول الـ MAC والـ ARP والـ Routing Tables' },
        { realWorld: 'زر إيقاف الوقت ودراسة كل لقطة', networkWorld: 'التحكم بالخطوات (Step-by-Step Simulation)' }
      ]
    },
    keyConcepts: [
      {
        title: 'فحص الترويسات الحي',
        term: 'Real-time Header Inspection',
        desc: 'انقر على أي خطوة لرؤية تفاصيل L2 Ethernet Frame و L3 IPv4 Packet بالتفصيل الممل.',
        color: 'cyan'
      },
      {
        title: 'تحديث الجداول التلقائي',
        term: 'Dynamic Table Synchronization',
        desc: 'شاهد كيف تسجل السويتشات الماك أدرس وكيف تتغير جداول التوجيه عند كل خطوة.',
        color: 'emerald'
      },
      {
        title: 'التحكم بالسرعة والتشغيل',
        term: 'Play, Pause & Step-by-Step',
        desc: 'سرّع المحاكاة أو أوقفها أو تقدم خطوة واحدة لدراسة كل لحظة.',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'استخدم الأزرار في الأسفل لتبديل السيناريوهات وتجربة جميع حالات الإرسال!'
  },
  {
    id: 'slide-8',
    number: 8,
    category: 'quiz',
    categoryAr: 'تحدي المعرفة',
    titleAr: 'تحدي أبطال الشبكات: هل أصبحت خبيراً في السويتش والراوتر؟',
    titleEn: 'Network Mastery Challenge & Knowledge Check',
    subtitleAr: 'أسئلة تفاعلية ذكية مع شروحات واقعية لترسيخ فهمك',
    realWorldMetaphor: {
      titleAr: 'اختبار رخصة قيادة الشبكات العالمية',
      iconName: 'Award',
      storyAr: 'حان وقت إثبات براعتك! أجب عن السيناريوهات الواقعية واكتشف هل ستتصرف كسويتش عتادي فائق السرعة أم كراوتر ذكي حكيم؟',
      lessonAr: 'التقييم المستمر يعزز الفهم العميق ويزيل أي لبس بين مفاهيم الطبقة الثانية والثالثة.',
      comparison: [
        { realWorld: 'اختبار السيناريوهات الطارئة في الطيران', networkWorld: 'أسئلة معالجة المشاكل (Troubleshooting Scenarios)' },
        { realWorld: 'الحصول على شهادة الكفاءة', networkWorld: 'درجة إتقان مفاهيم الشبكات المتقدمة' },
        { realWorld: 'التعلم من الإجابات الخاطئة', networkWorld: 'شروحات فورية تفصيلية لكل سؤال' },
        { realWorld: 'التطبيق العملي في الحياة اليومية', networkWorld: 'فهم كيفية وصول الإنترنت لجهازك وهاتفك' }
      ]
    },
    keyConcepts: [
      {
        title: 'سيناريوهات واقعية',
        term: 'Real-world Scenarios',
        desc: 'أسئلة تحاكي اختبارات CCNA و Network+ بأسلوب مبسط وممتع.',
        color: 'emerald'
      },
      {
        title: 'تفسير فوري لكل إجابة',
        term: 'Instant Explanation',
        desc: 'اكتشف سبب صحة أو خطأ كل خيار مع التشبيه الواقعي المناسب له.',
        color: 'amber'
      },
      {
        title: 'توليد فوري للشهادة',
        term: 'Certificate & Score',
        desc: 'احصل على تقييمك الفوري واحتفل بإتمام رحلة تعلم الشبكات.',
        color: 'indigo'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'أكمل جميع الأسئلة لتتوج كمهندس شبكات محترف!'
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    questionAr: 'عندما يرسل حاسوبك طلباً إلى موقع (مثل google.com في أمريكا)، ماذا يحدث لعناوين IP و MAC عبر المسار؟',
    questionEn: 'What happens to IP and MAC headers across multiple router hops?',
    optionsAr: [
      'يتغير عنوان الـ IP عند كل راوتر، بينما يبقى عنوان الـ MAC ثابتاً.',
      'يبقى عنوان الـ IP ثابتاً من البداية للنهاية، بينما يتغير عنوان الـ MAC عند كل راوتر تقابله الحزمة.',
      'يتغير كلاهما (الـ IP والـ MAC) في كل قفزة في الشبكة.',
      'لا يتغير أي منهما ويسافران كما هما عبر كابلات الألياف الضوئية.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'رائع وصحيح تماماً! عنوان الـ IP يمثل الهوية الشاملة للوجهة النهائية (مثل عنوان المدينة والدولة على المظروف)، ولذلك لا يتغير طوال الرحلة. أما عنوان الـ MAC فيمثل وسيلة النقل الفيزيائية للقفزة الحالية فقط (Hop-by-Hop)، فيتم استبداله عند كل راوتر ليناسب الوصلة التالية!',
    realWorldAnalogyAr: 'مثل كتابة اسم صديقك في باريس على رسالة؛ الاسم لا يتغير، لكن وسيلة النقل تتغير من دراجة ساعي البريد إلى شاحنة النقل ثم إلى الطائرة.',
    difficulty: 'متوسط'
  },
  {
    id: 'q2',
    questionAr: 'ما هو الدور الأساسي لبروتوكول ARP في الشبكة المحلية؟',
    questionEn: 'What is the primary purpose of the ARP protocol?',
    optionsAr: [
      'تشفير كلمات المرور لحمايتها من الاختراق.',
      'معرفة عنوان الـ MAC الفيزيائي المقابل لعنوان IP معين داخل الشبكة المحلية.',
      'تحديد أفضل مسار جغرافي للوصول إلى سيرفرات الألعاب السريعة.',
      'إعادة تشغيل السويتش تلقائياً عند انقطاع التيار الكهربائي.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'إجابة دقيقة! بروتوكول ARP (Address Resolution Protocol) هو المترجم الذي يسأل في الشبكة: "من يملك هذا الـ IP؟ أخبرني بالـ MAC الخاص بك"، لكي يتمكن الحاسوب من تغليف فريم الإيثرنت بشكل صحيح.',
    realWorldAnalogyAr: 'مثل مناداة اسم شخص في صالة الانتظار للتعرف على وجهه قبل تسليمه الملف.',
    difficulty: 'مبتدئ'
  },
  {
    id: 'q3',
    questionAr: 'لماذا يقوم كل راوتر بإنقاص حقل زمن الحياة (TTL) بمقدار 1 عند مرور الحزمة من خلاله؟',
    questionEn: 'Why do routers decrement the Time-to-Live (TTL) field by 1?',
    optionsAr: [
      'لتقليل حجم الملفات وزيادة سرعة الإنترنت.',
      'لحساب تكلفة الاشتراك الشهري وتحديد الفواتير.',
      'لمنع الحزم من الدوران في حلقات توجيه لانهائية (Routing Loops) واستهلاك كل سعة الشبكة.',
      'لتحديث توقيت الساعة في نظام التشغيل.'
    ],
    correctAnswerIndex: 2,
    explanationAr: 'ممتاز! حقل TTL يبدأ برقم محدد (مثل 64 أو 128)، وينقص 1 عند كل راوتر. إذا وصل إلى 0، يتم إتلاف الحزمة فوراً وإرسال تنبيه ICMP للمصدر، مما يمنع الحزم التائهة من إغراق كابلات الإنترنت إلى الأبد.',
    realWorldAnalogyAr: 'مثل وضع تاريخ انتهاء صلاحية على الأطعمة؛ إذا لم تُستهلك في الوقت المحدد يتم إتلافها لحماية المستهلكين.',
    difficulty: 'متوسط'
  },
  {
    id: 'q4',
    questionAr: 'ما هو الفرق الجوهري في معالجة رسائل البث العام (Broadcast) بين السويتش والراوتر؟',
    questionEn: 'How do Switches and Routers differ in handling Broadcast traffic?',
    optionsAr: [
      'السويتش يمنع البث، بينما الراوتر ينشره لجميع شبكات العالم.',
      'السويتش يفيض البث (Flooding) لجميع منافذه في نفس الـ VLAN، بينما الراوتر يوقف البث ولا يمرره للشبكات الأخرى.',
      'كلاهما يمنع البث العام بشكل تام لمنع الضوضاء.',
      'لا يوجد أي فرق؛ كلاهما يتعامل مع البث بنفس الطريقة تماماً.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'صحيح 100%! السويتش يمثل مجال بث واحد (Single Broadcast Domain) فيمرر الـ Broadcast لجميع أجهزته، بينما الراوتر يقسم الشبكة إلى مجالات بث منفصلة (Separates Broadcast Domains) ويحمي شبكات العالم من التلوث ببث بعضها البعض.',
    realWorldAnalogyAr: 'جدران المبنى تسمع فيها صوت الصراخ في الممر (السويتش)، بينما الجدران العازلة بين الأبراج تمنع انتقال الصراخ للمباني المجاورة (الراوتر).',
    difficulty: 'متقدم'
  },
  {
    id: 'q5',
    questionAr: 'إذا استلم السويتش فريم موجه لعنوان MAC لم يسبق له رؤيته وغير موجود في جدول الـ CAM، ماذا سيفعل؟',
    questionEn: 'What does a switch do with an unknown destination MAC address (Unknown Unicast)?',
    optionsAr: [
      'يقوم بمسح الحزمة وإلغائها فوراً (Drop).',
      'يرسلها فقط إلى منفذ الراوتر الافتراضي.',
      'يقوم بعمل إفاضة (Flooding) للفريم على جميع المنافذ النشطة ما عدا المنفذ الذي استلم منه الفريم.',
      'يقوم بإيقاف تشغيل المنفذ لحماية الشبكة.'
    ],
    correctAnswerIndex: 2,
    explanationAr: 'إجابة عبقرية! هذه العملية تُسمى Unknown Unicast Flooding. يقوم السويتش بإرسال الفريم لكل المنافذ آملاً أن يستجيب الجهاز صاحب الماك المطلوب، وعندما يستجيب يتعلم السويتش موقعه فوراً ويسجله في جدول الـ CAM للمستقبل.',
    realWorldAnalogyAr: 'مثل طرق جميع أبواب الغرف في الفندق بحثاً عن نزيل لم يسجل اسمه في سجل الاستقبال بعد.',
    difficulty: 'متقدم'
  },
  {
    id: 'q6',
    questionAr: 'في بروتوكول OSPFv2، ما هي الشروط الثلاثة الأساسية لتطابق حزم الـ Hello وتشكيل الجوار (Adjacency) بنجاح؟',
    questionEn: 'In OSPFv2, what parameters must match in Hello packets for neighbors to form full adjacency?',
    optionsAr: [
      'تطابق رقم الـ Area ID، ومؤقتات Hello/Dead Timers، وقناع الشبكة Subnet Mask وكلمة المرور.',
      'تطابق عنوان الـ Router ID فقط.',
      'تطابق سرعة كابل الإيثرنت ونوع نظام التشغيل.',
      'تطابق اسم الراوتر وسنة التصنيع.'
    ],
    correctAnswerIndex: 0,
    explanationAr: 'دقيق جداً! يشترط بروتوكول OSPF تطابق: Area ID، و Hello/Dead Intervals (غالباً 10s/40s)، و Subnet Mask على نفس الوصلة، والـ Authentication، والـ MTU حجم الإطار لتجنب مشاكل التبادل.',
    realWorldAnalogyAr: 'مثل تبادل بطاقات العمل المشروطة بالتحدث بنفس اللغة ونفس وتيرة الحديث وموافقة الإدارة.',
    difficulty: 'خبير (CCNA/CCNP)'
  },
  {
    id: 'q7',
    questionAr: 'إذا تعلّم الراوتر نفس الشبكة الفرعية (10.10.10.0/24) عبر بروتوكول OSPF وعبر مسار ثابت Static Route، أيهما سيفوز بالدخول في جدول الـ Routing Table؟ ولماذا؟',
    questionEn: 'If a router learns 10.10.10.0/24 via both OSPF and a Static Route, which wins in the Routing Table?',
    optionsAr: [
      'بروتوكول OSPF لأن سرعته أعلى.',
      'المسار الثابت Static Route لأن قيمة الـ Administrative Distance له أقل (AD=1 مقابل AD=110 لـ OSPF).',
      'سيتم توزيع الحمل بينهما مناصفة 50/50.',
      'سيتم حظر المسار بسبب التضارب.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'رائع! المسافة الإدارية (Administrative Distance) هي معيار الثقة في مصدر المسار. كلما كان الرقم أقل، زادت الثقة. المسار الثابت له AD=1 بينما OSPF له AD=110، لذلك يفوز المسار الثابت دائماً.',
    realWorldAnalogyAr: 'المسار الثابت مثل أمر مباشر من رئيس مجلس الإدارة شخصياً، بينما OSPF هو اقتراح الزملاء في العمل؛ الأول له الأولوية المطلقة.',
    difficulty: 'خبير (CCNP)'
  },
  {
    id: 'q8',
    questionAr: 'ما هي الوظيفة المحورية لبروتوكول STP (802.1D / 802.1w) في شبكات السويتشات المترابطة بوصلات احتياطية زائدة (Redundant Links)؟',
    questionEn: 'What is the primary function of Spanning Tree Protocol (STP) in redundant Layer 2 switched networks?',
    optionsAr: [
      'تسريع تشغيل الحواسيب وتقليل استهلاك الكهرباء.',
      'منع حدوث حلقات الطبقة الثانية (Layer 2 Switching Loops) وعواصف البث (Broadcast Storms) عبر وضع المنافذ الفائضة في حالة حظر (Blocking).',
      'توزيع عناوين IP تلقائياً بدلاً من سيرفر الـ DHCP.',
      'حجب المواقع غير الآمنة على المتصفح.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'صحيح 100%! في Layer 2 لا يوجد حقل TTL مثل Layer 3، لذا فإن أي حلقة فيزيائية بين السويتشات تؤدي لتكرار الفريمات بلا نهاية وحدوث Broadcast Storm يغرق الشبكة في ثوانٍ. يقوم STP بانتخاب Root Bridge وحظر المنافذ الزائدة لحماية الشبكة.',
    realWorldAnalogyAr: 'مثل إشارات المرور الذكية التي تغلق مساراً احتياطياً لمنع التصادم والازدحام الدائري، وتفتحه فوراً إذا تعطل الطريق الرئيسي.',
    difficulty: 'متقدم (CCNA)'
  }
];
