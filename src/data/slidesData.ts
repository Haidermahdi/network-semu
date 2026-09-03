import { SlideData } from '../types';

export const SLIDES_DATA: SlideData[] = [
  {
    id: 'slide-1',
    number: 1,
    category: 'foundation',
    categoryAr: 'المفاهيم الأساسية',
    categoryEn: 'Foundations',
    titleAr: 'كيف تتحدث الحواسيب؟ السويتشينغ مقابل الراوتينغ',
    titleEn: 'How Networks Breathe: Switching (L2) vs Routing (L3)',
    subtitleAr: 'الرحلة من غرفتك الصغيرة إلى خوادم السحاب حول العالم',
    subtitleEn: 'The journey from your room to cloud servers worldwide',
    realWorldMetaphor: {
      titleAr: 'تشبيه برج المكاتب مقابل النقل الجوي الدولي',
      titleEn: 'Office Tower Mailroom vs. International Air Freight',
      iconName: 'Building2',
      storyAr: 'تخيل أنك تعمل في مكتب داخل ناطحة سحاب ضخمة. عندما تريد إرسال ملف إلى زميلك في نفس الدور، فإن موظف البريد الداخلي (السويتش) يأخذه مباشرة ويوصله لباب مكتب زميلك فوراً لأن لديه خريطة بأرقام المكاتب (MAC Address). ولكن إن أردت إرسال طرد إلى فرع الشركة في مدينة نيويورك، فإن موظف البريد الداخلي لا يعرف شوارع نيويورك؛ لذلك يسلمه فوراً إلى شركة الشحن العالمية (الراوتر) التي تفحص العنوان والمدينة والرمز البريدي (IP Address) وتنقله عبر المطارات والطرق السريعة.',
      storyEn: 'Imagine working in an office inside a massive skyscraper. When sending a folder to a colleague on the same floor, the internal mail courier (the switch) delivers it straight to their door because he has an office floor map (MAC Address). But if you need to dispatch a parcel to the New York branch, the internal courier does not know New York streets; he hands it to the international freight carrier (the router), which inspects the city, zip code, and country (IP Address) to transport it via highways and airports.',
      lessonAr: 'السويتش يحكم داخل المبنى (الشبكة المحلية LAN)، بينما الراوتر يحكم الطرق السريعة بين المدن والبلدان (الشبكات المتباعدة WAN / Internet).',
      lessonEn: 'The switch governs within the building (Local Area Network - LAN), while the router commands the expressways connecting cities and nations (WAN / Internet).',
      comparison: [
        {
          realWorld: 'رقم الغرفة / المكتب الداخلي (لا يتغير فيزيائياً داخل الدور)',
          realWorldEn: 'Office / room number (physically fixed within the floor)',
          networkWorld: 'عنوان الـ MAC (Layer 2 Physical Identifier)',
          networkWorldEn: 'Layer 2 MAC address (physical hardware identifier)'
        },
        {
          realWorld: 'الرمز البريدي واسم الدولة والمدينة (عالمي ومنطقي)',
          realWorldEn: 'Country, city, and postal zip code (global & logical)',
          networkWorld: 'عنوان الـ IP (Layer 3 Logical Hierarchy)',
          networkWorldEn: 'Layer 3 IP address (hierarchical logical address)'
        },
        {
          realWorld: 'موظف الاستقبال أو ساعي البريد داخل المبنى',
          realWorldEn: 'Internal building receptionist or floor courier',
          networkWorld: 'السويتش (Switch) لتمرير الفريمات المحلية',
          networkWorldEn: 'Ethernet Switch forwarding local frames'
        },
        {
          realWorld: 'المطار الدولي ومحطات الفرز بين المدن',
          realWorldEn: 'International cargo airport and cross-country hubs',
          networkWorld: 'الراوتر (Router) لتوجيه الحزم بين الشبكات',
          networkWorldEn: 'IP Router steering packets across subnets'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'الطبقة الثانية (Data Link Layer)',
        titleEn: 'Data Link Layer (Layer 2)',
        term: 'Layer 2 / Frames',
        desc: 'مقر عمل السويتش؛ تتعامل مع الإطارات (Frames) وعناوين الماك المطبوعة على كروت الشبكة.',
        descEn: 'The domain of switches; operates on Ethernet frames and hardware MAC addresses.',
        color: 'emerald'
      },
      {
        title: 'الطبقة الثالثة (Network Layer)',
        titleEn: 'Network Layer (Layer 3)',
        term: 'Layer 3 / Packets',
        desc: 'مقر عمل الراوتر؛ تتعامل مع الحزم (Packets) وعناوين الـ IP التوجيهية وتحديد أفضل مسار.',
        descEn: 'The domain of routers; operates on IP packets, subnet routing, and path selection.',
        color: 'indigo'
      },
      {
        title: 'وحدة نقل البيانات',
        titleEn: 'Protocol Data Unit (PDU)',
        term: 'PDU Transition',
        desc: 'البيانات تُسمى فريم (Frame) عند السويتش، وتُسمى حزمة (Packet) عند الراوتر.',
        descEn: 'Data units are encapsulated as Frames at Layer 2 and Packets at Layer 3.',
        color: 'cyan'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'لا يمكن لشبكة محلية أن تعمل بكفاءة بدون سويتش، ولا يمكن لشبكات العالم أن تتواصل مع بعضها بدون راوتر!',
    takeawayMessageEn: 'A local network cannot function efficiently without a switch, and global networks cannot communicate without a router!',
    examTraps: [
      {
        trapTitleAr: 'فحص ترويسات الـ IP في سويتش الطبقة الثانية L2',
        trapTitleEn: 'Inspecting IP headers on Layer 2 Switches',
        questionAr: 'هل يقوم سويتش الطبقة الثانية L2 بفحص أو تعديل ترويسة IP في الفريم المار من خلاله؟',
        questionEn: 'Does a standard Layer 2 switch inspect or modify the IP header inside passing frames?',
        trickAr: 'يعتقد بعض الطلاب أن السويتش يحتاج لقراءة عنوان الـ IP ليعرف أين يرسل البيانات.',
        trickEn: 'Assuming switches must read IP addresses to know where to direct packets.',
        correctRuleAr: 'سويتش الطبقة الثانية يتعامل فقط مع Layer 2 Ethernet Header؛ هو أعمى تماماً عن حقول IPv4 ولا يقرؤها أو يعدلها مطلقاً.',
        correctRuleEn: 'A Layer 2 switch operates exclusively on the L2 Ethernet header; it is completely oblivious to IPv4 fields and never alters them.'
      },
      {
        trapTitleAr: 'اتصال جهازين في شبكتين مختلفتين بنفس السويتش',
        trapTitleEn: 'Connecting two different subnets to the same physical switch',
        questionAr: 'إذا اتصل حاسوبان بنفس السويتش الفيزيائي لكن أحدهما 192.168.1.10/24 والآخر 10.0.0.5/24، هل يمكنهما التخاطب مباشرة؟',
        questionEn: 'If two hosts connect to the same physical switch with IPs 192.168.1.10/24 and 10.0.0.5/24, can they communicate directly?',
        trickAr: 'الظن بأن الاتصال بنفس السويتش الفيزيائي يكفي لحدوث الاتصال.',
        trickEn: 'Believing physical connection to the same switch automatically permits direct communication.',
        correctRuleAr: 'كلا! لأن كل حاسوب يجري عملية Bitwise AND لقناع الشبكة، فيجد أن الوجهة في شبكة خارجية، فيحاول إرسالها للبوابة الافتراضية (Default Gateway). بدون راوتر يوجه بين الشبكتين لن يتم الاتصال أبداً.',
        correctRuleEn: 'No! Each host performs a Bitwise AND check and realizes the target is on a different subnet, prompting it to forward to the Default Gateway. Without a router, communication fails.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'show interfaces status',
        context: 'التحقق من حالة المنافذ ونمط الازدواج في سويتش سيسكو',
        contextEn: 'Verifying port status and duplex negotiation on Cisco Switch',
        outputSample: 'Port      Name               Status       Vlan       Duplex  Speed Type\nFa0/1     To-Host-A          connected    10         a-full  a-100 10/100BaseTX\nFa0/2     To-Host-B          connected    10         a-full  a-100 10/100BaseTX\nFa0/3     To-Server          connected    10         a-full  a-100 10/100BaseTX',
        keyFieldExplanationAr: 'يوضح عمود Duplex حالة a-full (Auto Full-Duplex)، وهي الميزة التي تمنح كل منفذ Collision Domain مستقل وتمنع تصادم الإشارات الكهربائية نهائياً.',
        keyFieldExplanationEn: 'The Duplex column displays "a-full" (Auto Full-Duplex), providing a dedicated collision domain per port and eliminating electrical collisions.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'ما هي الوحدة الأساسية لنقل البيانات (PDU) الخاصة بالطبقة الثانية (Data Link Layer)؟',
      questionEn: 'What is the primary Protocol Data Unit (PDU) of the Data Link Layer (Layer 2)?',
      optionsAr: [
        'البت (Bits)',
        'الإطار (Frame)',
        'الحزمة (Packet)',
        'القطعة (Segment)'
      ],
      optionsEn: [
        'Bits (Layer 1)',
        'Frame (Layer 2)',
        'Packet (Layer 3)',
        'Segment (Layer 4)'
      ],
      correctIndex: 1,
      explanationAr: 'في الطبقة الأولى تكون PDU هي Bits، وفي الطبقة الثانية تسمى إطاراً (Frame)، وفي الطبقة الثالثة حزمة (Packet)، وفي الطبقة الرابعة قطعة (Segment).',
      explanationEn: 'At Layer 1 the PDU is Bits; Layer 2 is Frame; Layer 3 is Packet; Layer 4 is Segment.'
    }
  },
  {
    id: 'slide-2',
    number: 2,
    category: 'switching',
    categoryAr: 'عالم السويتشينغ',
    categoryEn: 'Switching World',
    titleAr: 'تشريح السويتش (Layer 2 Switching): كيف يفكر ويتعلم؟',
    titleEn: 'Inside the Switch: The CAM Table & Hardware Speed',
    subtitleAr: 'السرعة المادية الفائقة القائمة على التعلم الذاتي وحفظ المنافذ',
    subtitleEn: 'Hardware wire-speed forwarding through dynamic learning and port mapping',
    realWorldMetaphor: {
      titleAr: 'ساعي البريد الذكي الذي يحفظ الوجوه والمكاتب',
      titleEn: 'The Smart Mail Clerk Memorizing Desks and Faces',
      iconName: 'Cpu',
      storyAr: 'عندما يبدأ ساعي بريد جديد عمله في المبنى، لا يعرف من يسكن في أي مكتب. حين يخرج شخص من المكتب رقم 1 ويسلمه رسالة موجهة لشخص آخر، يدوّن الساعي فوراً في دفتره: "الموظف أحمد موجود في المكتب رقم 1". ثم عندما يسأل عن وجهة الرسالة المجهولة، يضطر للطرق على جميع الأبواب (Flooding). ولكن بمجرد أن يرد المستلم من المكتب رقم 2، يدوّن في دفتره: "سارة في المكتب رقم 2". من تلك اللحظة فصاعداً، أي رسالة بين أحمد وسارة تذهب مباشرة وبدون إزعاج لبقية المكاتب!',
      storyEn: 'When a new mail courier starts in an office tower, he does not know who occupies which desk. As a worker emerges from office #1 to hand him a letter, he notes in his logbook: "Alice is in Office 1". When looking for the unknown recipient, he must knock on all doors (Flooding). Once the recipient responds from Office 2, he logs: "Bob is in Office 2". From that moment on, letters between Alice and Bob are delivered directly without disturbing anyone else!',
      lessonAr: 'السويتش يتعلم عنوان المصدر تلقائياً (Source MAC Learning) عند دخول أي فريم، ويوجه الفريم بناءً على عنوان الوجهة (Destination MAC Lookup).',
      lessonEn: 'The switch dynamically learns the Source MAC on ingress, and forwards frames based on Destination MAC lookup.',
      comparison: [
        {
          realWorld: 'دفتر ملاحظات الساعي',
          realWorldEn: 'Courier notebook / registry',
          networkWorld: 'جدول الـ MAC Table / CAM Table',
          networkWorldEn: 'Switch CAM / MAC Address Table'
        },
        {
          realWorld: 'طرق جميع الأبواب للبحث عن شخص غير مسجل',
          realWorldEn: 'Knocking on every door to locate an unlisted person',
          networkWorld: 'عملية الإفاضة (Flooding / Unknown Unicast)',
          networkWorldEn: 'Unknown Unicast Flooding across all member ports'
        },
        {
          realWorld: 'التسليم المباشر لباب المكتب المعني فقط',
          realWorldEn: 'Direct delivery exclusively to the recipient door',
          networkWorld: 'التوجيه الأحادي المباشر (Unicast Forwarding)',
          networkWorldEn: 'Selective Layer 2 Unicast Forwarding'
        },
        {
          realWorld: 'مسح اسم الشخص إذا لم يرسل رسائل منذ فترة',
          realWorldEn: 'Erasing an inactive tenant from the notebook',
          networkWorld: 'مؤقت تقادم العناوين (MAC Table Aging Time - 300s)',
          networkWorldEn: 'MAC Address Aging Timer (default 300 seconds)'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'التعلم من المصدر',
        titleEn: 'Source MAC Learning',
        term: 'Source MAC Learning',
        desc: 'السويتش لا يتعلم من عنوان الوجهة، بل يراقب عنوان المصدر لكل فريم يدخل من المنفذ.',
        descEn: 'The switch never learns from destination MACs; it observes the Source MAC of ingress frames.',
        color: 'emerald'
      },
      {
        title: 'عزل مجالات التصادم',
        titleEn: 'Micro-segmentation',
        term: 'Micro-segmentation',
        desc: 'كل منفذ في السويتش يمثل Collision Domain منفصل ويعمل بتقنية Full-Duplex لمنع التصادم.',
        descEn: 'Every switch port constitutes an isolated Collision Domain operating in Full-Duplex.',
        color: 'indigo'
      },
      {
        title: 'سرعة الرقاقات المباشرة (ASIC)',
        titleEn: 'Hardware ASIC Forwarding',
        term: 'Hardware-level Speed',
        desc: 'السويتش يتخذ قرارات التمرير عبر شرائح إلكترونية مخصصة فائقة السرعة بمليارات البايتات في الثانية.',
        descEn: 'Switches perform line-rate lookups using Application-Specific Integrated Circuits (ASICs).',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'السويتش أعمى عن عناوين الـ IP؛ هو يرى فقط عناوين الماك والمنافذ الفيزيائية المتصلة بها.',
    takeawayMessageEn: 'The switch is blind to IP addresses; it only sees MAC addresses and connected physical ports.',
    examTraps: [
      {
        trapTitleAr: 'من أين يتعلم السويتش العناوين؟',
        trapTitleEn: 'Which MAC field populates the CAM table?',
        questionAr: 'أي حقل في فريم الإيثرنت يقرأه السويتش لتسجيل المنفذ في جدول الـ CAM؟',
        questionEn: 'Which field in an Ethernet frame is inspected to dynamically populate the CAM table?',
        trickAr: 'يعتقد البعض أن السويتش يسجل المنفذ بناءً على عنوان الوجهة (Destination MAC).',
        trickEn: 'Believing the switch logs ports based on the Destination MAC address.',
        correctRuleAr: 'يتعلم السويتش حصراً من عنوان المصدر (Source MAC) لكل فريم يدخل السويتش، بينما عنوان الوجهة يُستخدم فقط للبحث في الجدول لتحديد منفذ الخروج.',
        correctRuleEn: 'Switches learn exclusively from the Source MAC of incoming frames; Destination MAC is only used to look up the egress port.'
      },
      {
        trapTitleAr: 'الفرق بين Unknown Unicast Flooding والـ Broadcast',
        trapTitleEn: 'Unknown Unicast Flooding vs Broadcast',
        questionAr: 'ماذا يفعل السويتش إذا استلم فريم موجه لجهاز معين (Unicast) لكن عنوانه غير موجود في الـ CAM Table؟',
        questionEn: 'What does a switch do when receiving a unicast frame whose destination MAC is not in the CAM table?',
        trickAr: 'اعتقاد أن السويتش يسقط الفريم (Drop) أو يعيده للمرسل.',
        trickEn: 'Assuming the switch drops the frame or returns an error to sender.',
        correctRuleAr: 'يقوم بعملية إفاضة تسمى Unknown Unicast Flooding، حيث ينسخ الفريم لجميع المنافذ النشطة في نفس الـ VLAN أملاً في أن يرد المستهدف، وعندما يرد يتعلم مكانه فوراً.',
        correctRuleEn: 'It executes Unknown Unicast Flooding, broadcasting copies across all active VLAN ports (except ingress) until the target answers.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'show mac address-table dynamic',
        context: 'معاينة العناوين المتعلمة ديناميكياً في سويتش سيسكو Catalyst',
        contextEn: 'Displaying dynamically learned MAC addresses on Cisco Catalyst switch',
        outputSample: '          Mac Address Table\n-------------------------------------------\nVlan    Mac Address       Type        Ports\n----    -----------       --------    -----\n  10    001a.2b3c.4d5e    DYNAMIC     Fa0/1\n  10    009f.8e7d.6c5b    DYNAMIC     Fa0/2\nTotal Mac Addresses for this criterion: 2',
        keyFieldExplanationAr: 'يوضح الجدول نوع التعلم DYNAMIC مع مؤقت تقادم افتراضي 300 ثانية (Aging Timer). إذا صمت الجهاز 5 دقائق يتم حذفه لتوفير مساحة الـ TCAM.',
        keyFieldExplanationEn: 'Indicates dynamic MAC entries with default 300s aging timer. Inactive hosts are pruned to free TCAM space.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'ما هو الإجراء الفوري للسويتش عند استلام فريم بعنوان وجهة Destination MAC غير موجود في جدول الـ CAM؟',
      questionEn: 'What is the immediate switch action when receiving a frame with a Destination MAC missing from the CAM table?',
      optionsAr: [
        'مسح الفريم وإسقاطه فوراً (Drop)',
        'إرسال الفريم فقط لمنفذ الراوتر الافتراضي',
        'عملية إفاضة (Flooding) لجميع المنافذ في نفس الـ VLAN ما عدا منفذ الدخول',
        'إيقاف تشغيل المنفذ'
      ],
      optionsEn: [
        'Drop the frame immediately',
        'Forward exclusively to the default gateway router port',
        'Flood the frame out of all ports in the VLAN except the ingress port',
        'Shut down the interface'
      ],
      correctIndex: 2,
      explanationAr: 'السويتش يفيض الفريم (Unknown Unicast Flooding) لجميع المنافذ النشطة في نفس الـ VLAN لكي يستجيب الجهاز الهدف ويتعلم السويتش موقعه في جدول الـ CAM.',
      explanationEn: 'The switch floods the frame out all member ports in the VLAN except the ingress port to prompt a response from the destination.'
    }
  },
  {
    id: 'slide-3',
    number: 3,
    category: 'arp',
    categoryAr: 'بروتوكول ARP',
    categoryEn: 'ARP Protocol',
    titleAr: 'بروتوكول ARP: الجسر السحري بين عالم الـ IP وعالم الـ MAC',
    titleEn: 'Address Resolution Protocol (ARP): Who is who?',
    subtitleAr: 'كيف يجد جهازك عنوان الماك المجهول عندما يعرف فقط عنوان الـ IP؟',
    subtitleEn: 'How devices discover unknown MAC addresses using only known IP addresses',
    realWorldMetaphor: {
      titleAr: 'النداء العام في قاعة المؤتمرات',
      titleEn: 'Public Announcement in a Conference Hall',
      iconName: 'Megaphone',
      storyAr: 'تخيل أنك في قاعة مؤتمرات وتريد تسليم وثيقة للمدير المالي "الأستاذ طارق" (عنوان IP منطقي)، لكنك لم تره من قبل ولا تعرف شكله وملامحه (عنوان MAC الفيزيائي). ماذا تفعل؟ تقف على المسرح وتمسك الميكروفون (Broadcast) وتقول بصوت عالٍ: "أنا أحمد من قسم التقنية، من هو الأستاذ طارق المدير المالي؟ أرجوك ارفع يدك!" كل من في القاعة يسمعك، لكن الحاضرين الآخرين يتجاهلون النداء لأن أسماءهم ليست طارق. فيقوم الأستاذ طارق من كرسيه ويقترب منك بنفسه (Unicast) ويقول: "أنا طارق وهذه بطاقة هويتي". فتحفظ شكله فوراً في ذاكرتك.',
      storyEn: 'Imagine being in a large conference hall needing to hand a folder to CFO "Mr. Tariq" (logical IP address), but you have never seen his face (physical MAC address). You grab the microphone on stage (Broadcast) and announce: "Who is Mr. Tariq the CFO? Please raise your hand!" Everyone hears you, but others ignore it because their names are not Tariq. Mr. Tariq stands up, walks directly to you (Unicast) and presents his ID. You immediately memorize his face.',
      lessonAr: 'طلب الـ ARP Request يُرسل كبث عام (Broadcast FF:FF:FF:FF:FF:FF) ويصل لكل أجهزة السويتش، بينما رد الـ ARP Reply يكون خاصاً ومباشراً (Unicast).',
      lessonEn: 'An ARP Request is sent as a broadcast (FF:FF:FF:FF:FF:FF) reaching all switch ports, while the ARP Reply is a direct unicast to the requester.',
      comparison: [
        {
          realWorld: 'النداء في الميكروفون على المسرح',
          realWorldEn: 'Public announcement on stage microphone',
          networkWorld: 'ARP Request (Broadcast FF:FF:FF:FF:FF:FF)',
          networkWorldEn: 'ARP Request (Layer 2 Broadcast FF:FF:FF:FF:FF:FF)'
        },
        {
          realWorld: 'رد الشخص المعني مباشرة لحامل الوثيقة',
          realWorldEn: 'Target person walking directly to the requester',
          networkWorld: 'ARP Reply (Unicast to Requester MAC)',
          networkWorldEn: 'ARP Reply (Layer 2 Unicast to sender MAC)'
        },
        {
          realWorld: 'حفظ رقم هاتف الشخص في مفكرة الهاتف',
          realWorldEn: 'Saving phone number and name in phone contacts',
          networkWorld: 'تخزين العنوان في جدول الـ ARP Cache',
          networkWorldEn: 'Caching IP-to-MAC mapping in the ARP Cache'
        },
        {
          realWorld: 'تجاهل باقي الحضور للنداء غير الموجه لهم',
          realWorldEn: 'Other attendees ignoring announcements not for them',
          networkWorld: 'تجاهل كروت الشبكة للحزم غير المطابقة لـ IP الخاص بها',
          networkWorldEn: 'Hosts discarding ARP requests with non-matching target IP'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'عنوان البث العام',
        titleEn: 'Broadcast Address',
        term: 'Broadcast Address',
        desc: 'عنوان FF:FF:FF:FF:FF:FF يجبر السويتش على نسخ الفريم لجميع المنافذ النشطة.',
        descEn: 'MAC FF:FF:FF:FF:FF:FF commands the switch to flood the frame out all ports in the VLAN.',
        color: 'amber'
      },
      {
        title: 'ذاكرة الـ ARP المؤقتة',
        titleEn: 'ARP Cache Table',
        term: 'ARP Cache Table',
        desc: 'يخزن الربط بين IP و MAC لفترة (تتراوح بين دقائق وساعات) لتفادي البث المتكرر.',
        descEn: 'Caches IP-to-MAC bindings to avoid redundant broadcast queries.',
        color: 'cyan'
      },
      {
        title: 'ARP المجاني (Gratuitous ARP)',
        titleEn: 'Gratuitous ARP (GARP)',
        term: 'Gratuitous ARP (GARP)',
        desc: 'إعلان يرسله الجهاز عند تشغيله ليخبر الجميع بعنوانه ويكتشف إذا كان هناك تضارب IP (IP Conflict).',
        descEn: 'An unprompted ARP broadcast sent upon boot to announce ownership and detect IP conflicts.',
        color: 'rose'
      }
    ],
    interactiveScenarioId: 'arp-broadcast-resolution',
    takeawayMessage: 'بدون بروتوكول ARP، لا يمكن لأي جهاز حاسوب أن يبدأ بإرسال فريم إيثرنت واحد عبر السويتش!',
    takeawayMessageEn: 'Without ARP, no computer could ever begin transmitting an Ethernet frame across a switch!',
    examTraps: [
      {
        trapTitleAr: 'هل يعبر طلب الـ ARP عبر الراوتر؟',
        trapTitleEn: 'Do ARP requests cross routers?',
        questionAr: 'إذا أرسل حاسوب طلب ARP Request، فهل يمكن لهذا الطلب عبور الراوتر إلى الإنترنت؟',
        questionEn: 'If a computer issues an ARP Request, can that request pass through a router to the internet?',
        trickAr: 'اعتقاد أن الـ ARP يبحث في كل مكان للوصول للهدف.',
        trickEn: 'Assuming ARP searches everywhere until reaching the final destination.',
        correctRuleAr: 'مستحيل! طلب الـ ARP يُغلف في إطار بث عام (FF:FF:FF:FF:FF:FF)، والراوتر كقاعدة أساسية يعزل نطاقات البث ويسقط أي فريم Broadcast ولا يمرره أبداً.',
        correctRuleEn: 'Impossible! ARP is encapsulated in a Layer 2 broadcast (FF:FF:FF:FF:FF:FF); routers terminate broadcast domains and never forward broadcasts.'
      },
      {
        trapTitleAr: 'حقل Target MAC في طلب الـ ARP',
        trapTitleEn: 'Target MAC value inside ARP Request',
        questionAr: 'ما هي القيمة المحفورة في حقل Target Hardware Address داخل طلب الـ ARP Request؟',
        questionEn: 'What value is placed in the Target Hardware Address field within an ARP Request packet?',
        trickAr: 'الظن بأنها FF:FF:FF:FF:FF:FF كما في ترويسة الإيثرنت.',
        trickEn: 'Assuming it is FF:FF:FF:FF:FF:FF identical to the outer Ethernet frame header.',
        correctRuleAr: 'في بايتات الـ ARP الداخلية تكون القيمة أصفاراً كاملة (00:00:00:00:00:00) لأنها المجهول المراد البحث عنه، بينما FF:FF:FF:FF:FF:FF توضع فقط في ترويسة الإيثرنت الخارجية L2 ليسمعه السويتش.',
        correctRuleEn: 'Inside the ARP payload, Target MAC is set to all zeros (00:00:00:00:00:00) as the unknown value; FF:FF:FF:FF:FF:FF is placed only in the L2 Ethernet header.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'show ip arp',
        context: 'معاينة جدول الـ ARP Cache في راوتر أو سويتش سيسكو',
        contextEn: 'Displaying the ARP cache table on Cisco IOS router or switch',
        outputSample: 'Protocol  Address          Age (min)  Hardware Addr   Type   Interface\nInternet  192.168.1.1             -   aabb.cc11.2201  ARPA   GigabitEthernet0/0\nInternet  192.168.1.10           14   001a.2b3c.4d5e  ARPA   GigabitEthernet0/0\nInternet  192.168.1.20            8   009f.8e7d.6c5b  ARPA   GigabitEthernet0/0',
        keyFieldExplanationAr: 'يربط الجدول بين عنوان الـ IP والـ MAC المقابل له مع تحديد المنفذ ومؤقت البقاء Age بالدقائق. علامة (-) تعني عنوان المنفذ المحلي للراوتر نفسه.',
        keyFieldExplanationEn: 'Maps IP to MAC with associated egress interface and age in minutes. The dash (-) signifies the router local interface.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'كيف يتم إرسال حزمة رد الـ ARP Reply في الشبكة المحلية بعد استلام الطلب؟',
      questionEn: 'How is an ARP Reply message transmitted across the local network upon receiving the request?',
      optionsAr: [
        'كبث عام Broadcast يصل لكل أجهزة الشبكة',
        'كإرسال أحادي Unicast موجه حصراً لعنوان MAC الحاسوب الطالب',
        'عبر خادم الـ DNS السحابي',
        'كبث متعدد Multicast'
      ],
      optionsEn: [
        'As a Broadcast received by all local network hosts',
        'As a direct Unicast addressed specifically to the requester MAC',
        'Through cloud-based DNS resolution',
        'As an IPv4 Multicast packet'
      ],
      correctIndex: 1,
      explanationAr: 'رد الـ ARP Reply يكون دائماً Unicast لأن الجهاز المستجيب علم مسبقاً بعنوان MAC الطالب من حزمة الطلب الأصلية.',
      explanationEn: 'ARP Reply is always Unicast because the target host already learned the requester MAC from the original request.'
    }
  },
  {
    id: 'slide-4',
    number: 4,
    category: 'routing',
    categoryAr: 'عالم الراوتينغ',
    categoryEn: 'Routing World',
    titleAr: 'تشريح الراوتر (Layer 3 Routing): الملاحة الذكية بين الشبكات',
    titleEn: 'Inside the Router: Route Tables, Subnets & Gateways',
    subtitleAr: 'العقل المدبر لتحديد أفضل مسار وفصل نطاقات البث',
    subtitleEn: 'The mastermind determining optimal paths and isolating broadcast domains',
    realWorldMetaphor: {
      titleAr: 'مطار الشحن الدولي وبرج المراقبة',
      titleEn: 'International Airport Cargo Hub & Air Traffic Control',
      iconName: 'Compass',
      storyAr: 'في المطار الدولي، تصل الحاويات من شاحنات محلية مختلفة. مسؤولو الجمارك والشحن (الراوتر) ينظرون إلى كود الدولة والمدينة المكتوب على الحاوية الخارجية (IP Address). لديهم جدول مواعيد ورحلات ضخم (Routing Table) يحدد: "شحنات أوروبا تذهب عبر البوابة الشرقية، شحنات آسيا عبر الطائرة B747، وإذا كانت الوجهة غير معروفة، أرسلها إلى مركز التوزيع العام (Default Route 0.0.0.0/0)". كما يقوم المطار بإلغاء بطاقة الشاحنة المحلية ووضع بطاقة الشحن الجوي قبل الإقلاع.',
      storyEn: 'At an international cargo airport, containers arrive from different local trucks. Freight managers (the router) inspect the destination country and city code printed on each container (IP Address). They consult a routing schedule (Routing Table): European freight departs via Gate East, Asian cargo boards Boeing 747, and unknown destinations route via default hub (0.0.0.0/0). Local trucking tags are stripped and air waybills attached.',
      lessonAr: 'الراوتر يربط بين شبكات مختلفة كلياً في الـ IP Subnet، ويقرر الوجهة القادمة (Next-Hop) بناءً على أطول مطابقة لعنوان الشبكة (Longest Prefix Match).',
      lessonEn: 'The router bridges completely distinct IP subnets, resolving next hops via Longest Prefix Match algorithms.',
      comparison: [
        {
          realWorld: 'جدول مواعيد رحلات الطيران ومسارات الشحن',
          realWorldEn: 'Flight departure board and global cargo schedules',
          networkWorld: 'جدول التوجيه (Routing Table / RIB & FIB)',
          networkWorldEn: 'Routing Information Base (RIB) & Forwarding Base (FIB)'
        },
        {
          realWorld: 'البوابة الرئيسية لمغادرة المدينة إلى العالم الخارجي',
          realWorldEn: 'Main border gate exiting the city to the outside world',
          networkWorld: 'البوابة الافتراضية (Default Gateway IP)',
          networkWorldEn: 'Host Default Gateway IP address'
        },
        {
          realWorld: 'مسار الطوارئ للشحنات إلى الدول النادرة',
          realWorldEn: 'Fallback freight route for unlisted remote destinations',
          networkWorld: 'المسار الافتراضي (Default Route 0.0.0.0/0)',
          networkWorldEn: 'Default Route (0.0.0.0/0 Gateway of Last Resort)'
        },
        {
          realWorld: 'فصل حدود الدول وعدم السماح بالصراخ عبر الحدود',
          realWorldEn: 'Immigration border stopping sound from carrying across borders',
          networkWorld: 'كسر وعزل نطاق البث (Broadcast Domain Separation)',
          networkWorldEn: 'Hard Layer 3 Broadcast Domain Boundary Isolation'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'فصل نطاق البث',
        titleEn: 'Broadcast Domain Separation',
        term: 'Broadcast Domain Separation',
        desc: 'الراوتر لا يمرر حزم الـ Broadcast أبداً، مما يحمي الشبكات من العواصف البرمجية.',
        descEn: 'Routers terminate broadcast domains and never forward broadcast packets, shielding networks from storms.',
        color: 'indigo'
      },
      {
        title: 'أفضل مسار والـ Metric',
        titleEn: 'Best Path & Metric Calculation',
        term: 'Best Path & Metric Calculation',
        desc: 'بروتوكولات التوجيه (OSPF, BGP, Static) تختار المسار الأسرع والأقل تكلفة.',
        descEn: 'Routing protocols (OSPF, BGP, Static) select the lowest cost, shortest path.',
        color: 'emerald'
      },
      {
        title: 'القفزة التالية (Next-Hop)',
        titleEn: 'Next-Hop Resolution',
        term: 'Next-Hop Resolution',
        desc: 'الراوتر لا يحتاج لمعرفة المسار بالكامل حتى النهاية؛ يكفي أن يعرف الجهاز التالي الذي يسلمه الحزمة.',
        descEn: 'Routers do not need the full end-to-end topology; resolving the immediate Next-Hop is sufficient.',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'الراوتر هو صمام الأمان الذي يقسم الإنترنت إلى مليارات الشبكات المنفصلة دون أن تنهار بالبث العام.',
    takeawayMessageEn: 'The router is the safety valve dividing the global internet into billions of distinct networks without broadcast saturation.',
    examTraps: [
      {
        trapTitleAr: 'المسافة الإدارية AD مقابل أطول قناع Longest Match',
        trapTitleEn: 'Administrative Distance vs Longest Prefix Match',
        questionAr: 'إذا وجد الراوتر مسار /24 عبر OSPF (AD=110) ومسار /16 كمسار ثابت Static (AD=1)، أيهما يفوز؟',
        questionEn: 'If a router has a /24 route via OSPF (AD=110) and a /16 Static Route (AD=1), which route wins?',
        trickAr: 'يظن الكثيرون أن المسار الثابت يفوز فوراً لأن الـ AD له أقل (1 مقابل 110).',
        trickEn: 'Believing the Static Route automatically wins due to lower AD (1 vs 110).',
        correctRuleAr: 'فخ شهير جداً في اختبار CCNA! قاعدة Longest Prefix Match تسبق الـ AD؛ المسار /24 هو الأطول والأكثر دقة فيفوز قطعاً، ولا ننظر للمسافة الإدارية إلا عند تساوي الأقنعة.',
        correctRuleEn: 'Famous CCNA trap! Longest Prefix Match always precedes Administrative Distance; the /24 prefix is more specific and wins regardless of AD.'
      },
      {
        trapTitleAr: 'سر المسار الافتراضي 0.0.0.0/0',
        trapTitleEn: 'The Default Route 0.0.0.0/0 Rule',
        questionAr: 'متى يلجأ الراوتر لاستخدام المسار الافتراضي (Gateway of Last Resort)؟',
        questionEn: 'When does a router resort to using the default route (Gateway of Last Resort)?',
        trickAr: 'الظن بأنه يوجه كل الحزم مباشرة.',
        trickEn: 'Assuming it indiscriminately routes all incoming traffic without inspecting table prefixes.',
        correctRuleAr: 'طول قناع 0.0.0.0/0 هو صفر، لذلك يعتبر أضعف وأقصر مسار؛ لا يُستخدم إطلاقاً إلا إذا فشلت كل المسارات المحددة الأخرى في جدول التوجيه.',
        correctRuleEn: 'The mask length of 0.0.0.0/0 is zero; it is the shortest prefix match and is only consulted as a last resort when no other route matches.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'show ip route',
        context: 'قراءة جدول التوجيه العالمي في راوتر سيسكو',
        contextEn: 'Inspecting global routing table on Cisco IOS router',
        outputSample: 'Gateway of last resort is 203.0.113.1 to network 0.0.0.0\nS*    0.0.0.0/0 [1/0] via 203.0.113.1\nC     192.168.1.0/24 is directly connected, GigabitEthernet0/0\nO     10.1.2.0/24 [110/10] via 192.168.14.2, 00:04:12, GigabitEthernet0/1\nD     172.16.0.0/16 [90/15000] via 192.168.13.2, 01:12:00, GigabitEthernet0/2',
        keyFieldExplanationAr: 'الرموز: C متصل، S ثابت، O عبر OSPF، D عبر EIGRP. والقيم بين الأقواس [AD/Metric] مثل [110/10] تحدد الثقة والتكلفة.',
        keyFieldExplanationEn: 'Codes: C connected, S static, O OSPF, D EIGRP. Values in brackets [AD/Metric] like [110/10] express trustworthiness and path cost.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'حزمة موجهة لـ 10.1.1.50، والجدول يحتوي على 10.0.0.0/8 و 10.1.0.0/16 و 10.1.1.0/24. أي مسار يختاره الراوتر؟',
      questionEn: 'For a destination 10.1.1.50, with routes 10.0.0.0/8, 10.1.0.0/16, and 10.1.1.0/24, which route is chosen?',
      optionsAr: [
        '10.0.0.0/8 لأنه يشمل أكبر عدد من الأجهزة',
        '10.1.0.0/16 كحل وسطي',
        '10.1.1.0/24 لأنه صاحب أطول قناع شبكة (Longest Prefix Match)',
        'يسقط الراوتر الحزمة فوراً'
      ],
      optionsEn: [
        '10.0.0.0/8 because it covers the largest host range',
        '10.1.0.0/16 as an intermediate compromise',
        '10.1.1.0/24 because it is the Longest Prefix Match',
        'The router drops the packet'
      ],
      correctIndex: 2,
      explanationAr: 'خوارزمية Longest Prefix Match تجعل المسار الأطول /24 هو الفائز دائماً لدقته العالية في تحديد الشبكة المستهدفة.',
      explanationEn: 'Longest Prefix Match guarantees that the most specific /24 route is selected.'
    }
  },
  {
    id: 'slide-5',
    number: 5,
    category: 'end_to_end',
    categoryAr: 'الرحلة الكاملة',
    categoryEn: 'End-to-End Journey',
    titleAr: 'سحر التغليف (Encapsulation): ماذا يتغير وماذا يبقى ثابتاً؟',
    titleEn: 'The Golden Rule of Networking: MAC Changes, IP Stays!',
    subtitleAr: 'كشف أسرار فك وتركيب الحزم والتحكم في زمن البقاء (TTL)',
    subtitleEn: 'Uncovering packet decapsulation, re-encapsulation, and TTL loop mitigation',
    realWorldMetaphor: {
      titleAr: 'المظروف الداخلي المغلق وصناديق الشحن المتغيرة',
      titleEn: 'The Sealed Letter Inside Changing Transport Crates',
      iconName: 'Layers',
      storyAr: 'تخيل أنك كتبت رسالة حب ووضعتها داخل مظروف مغلق بالشمع وكتبت عليه: "من أحمد إلى ليلى في باريس". هذا المظروف بالشمع هو (حزمة IP) التي لا تُفتح ولا تتغير في أي محطة. لكن لنقلها، يتم وضعها في حقيبة ساعي البريد، ثم في صندوق شاحنة النقل، ثم في حاوية الطائرة، ثم في حقيبة ساعي باريس. في كل مرحلة، يتم تغيير الصندوق الخارجي (فريم الإيثرنت وعناوين MAC)، لكن المظروف الأصلي الداخلي يصل ليد ليلى سالماً كما هو!',
      storyEn: 'Imagine writing a letter sealed with wax addressed: "From Alice to Bob in Paris". The sealed letter is the IP packet; it is never opened along the path. But for transport, it sits in the mail carrier bag, then a regional postal truck, then an air freight container, then a Parisian delivery pouch. At each hop, the outer transport container (Ethernet Frame & MACs) changes, but the inner envelope arrives in Bob hands completely intact!',
      lessonAr: 'عنوان IP المصدر والهدف لا يتغيران طوال الرحلة عبر العالم، بينما عنوان MAC المصدر والهدف يتجددان تماماً عند كل راوتر تقابله الحزمة.',
      lessonEn: 'Source and Destination IP remain constant end-to-end, while Source and Destination MACs are rewritten at every intermediate router hop.',
      comparison: [
        {
          realWorld: 'المظروف الداخلي الموجه لليلى',
          realWorldEn: 'Inner sealed envelope addressed to recipient',
          networkWorld: 'حزمة الـ IP (Src IP & Dest IP ثابته)',
          networkWorldEn: 'Layer 3 IP packet (Src IP & Dst IP stay intact)'
        },
        {
          realWorld: 'صناديق الشاحنات والطائرات المتغيرة',
          realWorldEn: 'Changing shipping crates, trucks, and cargo holds',
          networkWorld: 'فريم الـ Ethernet (Src MAC & Dest MAC يتغيران بكل Hop)',
          networkWorldEn: 'Layer 2 Ethernet frame (Src MAC & Dst MAC rewritten per hop)'
        },
        {
          realWorld: 'عداد صلاحية الطرد (تاريخ انتهاء الصلاحية)',
          realWorldEn: 'Package expiration date stamped on container',
          networkWorld: 'حقل زمن الحياة (Time To Live - TTL ينقص 1 عند كل راوتر)',
          networkWorldEn: 'Time-to-Live (TTL decremented by 1 at each router)'
        },
        {
          realWorld: 'إتلاف الطرد إذا طاف في حلقة مفرغة بين المطارات',
          realWorldEn: 'Discarding freight circulating in airport loops',
          networkWorld: 'إسقاط الحزمة (Drop) وإرسال ICMP Time Exceeded عند وصول TTL=0',
          networkWorldEn: 'Dropping packet and issuing ICMP Time Exceeded when TTL=0'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'فك وإعادة التغليف',
        titleEn: 'Decapsulation & Re-encapsulation',
        term: 'Decapsulation & Re-encapsulation',
        desc: 'الراوتر يزيل إطار L2 القديم، يفحص L3، ثم يغلف بحزمة L2 جديدة تناسب الوصلة التالية.',
        descEn: 'The router strips the incoming L2 frame, evaluates L3, then encapsulates a fresh L2 frame for the next hop.',
        color: 'emerald'
      },
      {
        title: 'حماية الشبكة من الحلقات (TTL)',
        titleEn: 'Time-to-Live (TTL Protection)',
        term: 'Time-to-Live (TTL Protection)',
        desc: 'كل راوتر ينقص قيمة TTL بمقدار 1 لمنع الحزم التائهة من الدوران إلى ما لا نهاية.',
        descEn: 'Every router decrements TTL by 1, dropping packets if zero to prevent eternal routing loops.',
        color: 'rose'
      },
      {
        title: 'البوابة الافتراضية (Default Gateway)',
        titleEn: 'Default Gateway (First Hop)',
        term: 'Gateway as First Hop',
        desc: 'العنوان الفيزيائي للراوتر هو أول وجهة MAC تضعها الحواسيب عند مخاطبة العالم الخارجي.',
        descEn: 'The gateway router interface MAC is the immediate L2 destination when sending off-subnet.',
        color: 'indigo'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'تذكر دائماً: الـ IP للوجهة النهائية (End-to-End)، والـ MAC للقفزة الحالية فقط (Hop-by-Hop).',
    takeawayMessageEn: 'Always remember: IP is for the end-to-end destination, while MAC is strictly for the current hop!',
    examTraps: [
      {
        trapTitleAr: 'ثبات الـ IP وتغير الـ MAC',
        trapTitleEn: 'IP Persistence vs MAC Mutation',
        questionAr: 'عندما تسافر حزمة عبر 5 راوترات، ماذا يحدث لعناوين IP و MAC المصدر والهدف؟',
        questionEn: 'When a packet traverses 5 router hops, what happens to source and destination IP and MAC addresses?',
        trickAr: 'الاعتقاد بأن الـ IP يتغير مع كل راوتر مثل الـ MAC.',
        trickEn: 'Assuming IP addresses mutate at every hop just like MAC addresses.',
        correctRuleAr: 'الـ IP المصدر والهدف يبقيان ثابتين تماماً (ما لم يُستخدم تقنية NAT)، بينما يتغير عنوان الـ MAC عند كل راوتر ليناسب وسيط النقل في القفزة الحالية.',
        correctRuleEn: 'Source and destination IP remain unchanged (unless NAT is applied), whereas MAC addresses are rebuilt at each hop.'
      },
      {
        trapTitleAr: 'ماذا يتغير في ترويسة الـ IP نفسها؟',
        trapTitleEn: 'What changes inside the IPv4 header itself?',
        questionAr: 'هل تتغير ترويسة IPv4 عند مرورها بالراوتر؟ وإذا كان الجواب نعم، فما الحقل الذي يتغير؟',
        questionEn: 'Does the IPv4 header change when passing through a router? If so, which fields change?',
        trickAr: 'القول بأن ترويسة الـ IP لا يُمس منها أي حقل.',
        trickEn: 'Claiming that IPv4 headers pass through routers 100% untouched.',
        correctRuleAr: 'ينقص الراوتر حقل الـ TTL بمقدار 1، وبسبب هذا النقصان يُجبر الراوتر على إعادة حساب تدقيق المجموع (Header Checksum) للترويسة.',
        correctRuleEn: 'The router decrements TTL by 1, which in turn forces recalculation of the Header Checksum field.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'debug ip packet detail',
        context: 'مراقبة فك وإعادة التغليف وإنقاص الـ TTL حياً في راوتر سيسكو',
        contextEn: 'Real-time observation of decapsulation, re-encapsulation, and TTL decrement',
        outputSample: 'IP: s=192.168.1.10 (GigabitEthernet0/0), d=172.16.1.100, len 84, fwd, ttl 64->63\nUDP: s=53210, d=53\nIP: rewriting L2 header: new src=aabb.cc11.2202, new dst=ddee.ff33.4401',
        keyFieldExplanationAr: 'سطر rewriting L2 header يثبت هندسياً أن الراوتر حذف ترويسة الإيثرنت القديمة ووضع عناوين MAC جديدة تماماً للوصلة القادمة، مع إنقاص ttl 64->63.',
        keyFieldExplanationEn: 'The line "rewriting L2 header" proves that the router stripped the old Ethernet header and applied new MACs for the next hop while decrementing TTL.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'ماذا يحدث للحزمة إذا استلمها الراوتر ووجد أن قيمة حقل الـ TTL تساوي 1؟',
      questionEn: 'What happens to a packet when a router receives it with a TTL value of 1?',
      optionsAr: [
        'يمررها بسرعة مضاعفة للوجهة',
        'ينقصها إلى 0 ويسقطها فوراً (Drop) ويرسل ICMP Time Exceeded للمصدر',
        'يعيد شحن الـ TTL إلى 64 تلقائياً',
        'يحولها إلى فريم إيثرنت محلي'
      ],
      optionsEn: [
        'Forwards it at double speed to the destination',
        'Decrements to 0, drops the packet, and transmits ICMP Time Exceeded to the source',
        'Recharges the TTL back to 64 automatically',
        'Converts it into a local Ethernet frame'
      ],
      correctIndex: 1,
      explanationAr: 'إذا أصبح TTL=0 تُتلف الحزمة لحماية الإنترنت من الحلقات اللانهائية، وهي الفكرة التي يعتمد عليها أمر traceroute.',
      explanationEn: 'When TTL reaches 0, the packet is discarded to prevent infinite routing loops; this principle powers the traceroute diagnostic command.'
    }
  },
  {
    id: 'slide-6',
    number: 6,
    category: 'comparison',
    categoryAr: 'المقارنة الشاملة',
    categoryEn: 'Comparison Matrix',
    titleAr: 'المواجهة الكبرى: السويتش ضد الراوتر في ميزان الهندسة',
    titleEn: 'The Ultimate Comparison: Switch vs Router Matrix',
    subtitleAr: 'ملخص شامل لكل الفروق التقنية والوظيفية في شاشة واحدة',
    subtitleEn: 'Comprehensive summary of architectural and operational distinctions on one screen',
    realWorldMetaphor: {
      titleAr: 'طرق الحي الداخلية مقابل شبكة الطرق السريعة المعلقة',
      titleEn: 'Neighborhood Residential Streets vs. Elevated Highway Grids',
      iconName: 'GitCompare',
      storyAr: 'الطرق الداخلية داخل الحي (Switching) سريعة ومصممة للتنقل السلس بين المنازل المتجاورة، لكنها لا تصلح لعبور المحيطات. شبكة الطرق السريعة ومحطات الرسوم والتقاطعات المعلقة (Routing) معقدة وذكية وتملك لافتات إرشادية كبرى تقودك بين المحافظات والدول وتمنع التكدس.',
      storyEn: 'Local neighborhood streets (Switching) are fast and optimized for seamless short hops between neighboring homes, but cannot cross oceans. Expressways, toll gates, and interchanges (Routing) are intelligent, featuring highway signs directing long-haul traffic between states and preventing gridlock.',
      lessonAr: 'أنت بحاجة للسويتش لتوزيع الاتصال بسرعة فائقة محلياً، وبحاجة للراوتر لحماية شبكتك وربطها بالإنترنت.',
      lessonEn: 'You need switches for lightning-fast local distribution, and routers to boundary and interconnect your network with the global internet.',
      comparison: [
        {
          realWorld: 'شوارع الحي المحلي المتصلة بدون حواجز',
          realWorldEn: 'Unobstructed local neighborhood streets',
          networkWorld: 'مجال البث الواحد (Single Broadcast Domain)',
          networkWorldEn: 'Single Layer 2 Broadcast Domain'
        },
        {
          realWorld: 'بوابات الرسوم والجمارك بين المدن',
          realWorldEn: 'Toll booths and customs checkpoints between cities',
          networkWorld: 'حدود الراوتر التي تقطع البث وتفصل الشبكات',
          networkWorldEn: 'Router boundary isolating subnets & terminating broadcasts'
        },
        {
          realWorld: 'اللوحات المعدنية للمركبات المسجلة في المرور',
          realWorldEn: 'Vehicle license plates registered with traffic authority',
          networkWorld: 'عناوين MAC الفيزيائية المحفورة في بطاقة الشبكة',
          networkWorldEn: 'Hardware MAC addresses burned into the NIC'
        },
        {
          realWorld: 'العنوان الوطني الشجري (شارع / حي / مدينة)',
          realWorldEn: 'Hierarchical national mailing address (Street / City / Country)',
          networkWorld: 'عناوين IP المنطقية القابلة للتقسيم (Subnetting)',
          networkWorldEn: 'Hierarchical logical IP addresses supporting subnetting'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'طبقة العمل في نموذج OSI',
        titleEn: 'OSI Operating Layer',
        term: 'Layer 2 (Switch) vs Layer 3 (Router)',
        desc: 'السويتش في طبقة ربط البيانات (Data Link)، والراوتر في طبقة الشبكة (Network).',
        descEn: 'Switches operate at Layer 2 (Data Link); Routers operate at Layer 3 (Network).',
        color: 'emerald'
      },
      {
        title: 'جدول اتخاذ القرار',
        titleEn: 'Forwarding Tables',
        term: 'CAM Table vs Routing Table',
        desc: 'السويتش يبحث في جدول MAC Address، والراوتر يبحث في جدول Routing Table عبر خوارزميات التوجيه.',
        descEn: 'Switches look up MACs in CAM tables; Routers evaluate IP prefixes in RIB/FIB tables.',
        color: 'indigo'
      },
      {
        title: 'التعامل مع البث العام',
        titleEn: 'Broadcast Handling',
        term: 'Broadcast Handling',
        desc: 'السويتش يمرر الـ Broadcast لجميع الأجهزة، بينما الراوتر يوقفه ويمنع عبوره نهائياً.',
        descEn: 'Switches flood broadcasts across member ports; Routers drop and never forward broadcasts.',
        color: 'amber'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'الشبكة الحديثة المتكاملة هي سيمفونية رائعة تجمع سرعة السويتش مع ذكاء وتوجيه الراوتر!',
    takeawayMessageEn: 'A modern enterprise network is a symphony harmonizing switch wire-speed with router intelligence!',
    examTraps: [
      {
        trapTitleAr: 'سويتش الطبقة الثالثة (L3 Switch / Multilayer)',
        trapTitleEn: 'Layer 3 Multilayer Switches vs Routers',
        questionAr: 'ما الذي يميز سويتش الطبقة الثالثة L3 Switch عن الراوتر التقليدي؟',
        questionEn: 'What distinguishes a Layer 3 Multilayer Switch from a traditional router?',
        trickAr: 'الظن بأن السويتش L3 لا يملك وظائف التوجيه Routing.',
        trickEn: 'Assuming Layer 3 switches lack true IP routing capabilities.',
        correctRuleAr: 'سويتش الطبقة الثالثة ينفذ عمليات التوجيه بين الـ VLANs عبر شرائح العتاد ASIC والـ CEF بسرعة خيالية تقارب سرعة الأسلاك (Wire-speed).',
        correctRuleEn: 'A Layer 3 switch routes inter-VLAN traffic in hardware via ASICs and CEF at near wire-speed.'
      },
      {
        trapTitleAr: 'مجالات البث والتصادم',
        trapTitleEn: 'Collision vs Broadcast Domains in 24-Port Switch',
        questionAr: 'كم عدد مجالات البث والتصادم في سويتش 24 منفذ بدون VLANs؟',
        questionEn: 'How many collision and broadcast domains exist on a 24-port switch with default VLAN 1?',
        trickAr: 'الخلط بين مفهوم مجالات البث ومجالات التصادم.',
        trickEn: 'Confusing collision domain counts with broadcast domains.',
        correctRuleAr: 'يحتوي على 24 مجال تصادم (Collision Domain) منفصل، ولكنه يشكل مجال بث عام واحد فقط (1 Broadcast Domain).',
        correctRuleEn: 'It has 24 isolated collision domains (one per port), but forms a single broadcast domain.'
      }
    ],
    ciscoCliDeepDive: [
      {
        command: 'show ip cef',
        context: 'معاينة جدول التسريع العتادي CEF في أجهزة سيسكو',
        contextEn: 'Inspecting Cisco Express Forwarding (CEF) FIB table',
        outputSample: 'Prefix               Next Hop            Interface\n0.0.0.0/0            203.0.113.1         GigabitEthernet0/0\n192.168.1.0/24       attached            GigabitEthernet0/0\n172.16.1.0/24        192.168.14.2        GigabitEthernet0/1',
        keyFieldExplanationAr: 'تقنية Cisco Express Forwarding تدمج مسبقاً جدول التوجيه وجدول الـ ARP في ذاكرة سريعة FIB لتوجيه الحزم بأقل استهلاك للمعالج.',
        keyFieldExplanationEn: 'Cisco Express Forwarding pre-compiles routing and ARP tables into high-speed FIB and adjacency tables for minimal CPU overhead.'
      }
    ],
    knowledgeCheck: {
      questionAr: 'أي جهاز شبكات يقوم بكسر وعزل مجالات البث العام (Broadcast Domains) كخاصية أساسية؟',
      questionEn: 'Which networking device segments and isolates broadcast domains as a primary architectural function?',
      optionsAr: [
        'الموزع القديم (Hub)',
        'السويتش غير المقسم بـ VLANs',
        'الراوتر (Router)',
        'كابل الشبكة الملتوي (UTP)'
      ],
      optionsEn: [
        'Legacy Hub (Layer 1)',
        'Unmanaged Switch without VLANs',
        'Network Router (Layer 3)',
        'UTP Twisted-Pair Cable'
      ],
      correctIndex: 2,
      explanationAr: 'الراوتر لا يمرر حزم البث العام أبداً، مما يجعله خط الدفاع الذي يقسم الشبكات ويعزل مجالات البث.',
      explanationEn: 'Routers terminate broadcast domains and isolate broadcast traffic between subnets.'
    }
  },
  {
    id: 'slide-7',
    number: 7,
    category: 'interactive_lab',
    categoryAr: 'المعمل التفاعلي الحي',
    categoryEn: 'Interactive Live Sandbox',
    titleAr: 'مختبر الشبكات الحي: أطلق الحزم واختبر بنفسك',
    titleEn: 'Interactive Live Network Sandbox',
    subtitleAr: 'تحكم كامل في إرسال البيانات، فحص الفريمات، ومراقبة الجداول في الوقت الحقيقي',
    subtitleEn: 'Full control over packet injection, frame inspection, and live table monitoring',
    realWorldMetaphor: {
      titleAr: 'غرفة التحكم والمحاكاة لمهندسي الشبكات',
      titleEn: 'Network Engineer Flight Simulator & Control Room',
      iconName: 'Terminal',
      storyAr: 'أنت الآن رئيس مهندسي الشبكة في غرفة العمليات! أمامك أزرار الإطلاق، بإمكانك تجربة إرسال طلب بين حاسوبين في نفس الشبكة لمشاهدة السويتشينغ، أو إطلاق طلب عابر للقارات لمشاهدة تبديل عناوين الماك والـ TTL في الراوتر.',
      storyEn: 'You are the lead network engineer in the mission control center! You have the controls: inject traffic between local hosts to observe switching, or launch cross-network packets to witness MAC rewrites and TTL decrements on routers.',
      lessonAr: 'التجربة المباشرة ومشاهدة حركة الحزم نبضة بنبضة ترسخ المعلومة في ذهنك للأبد.',
      lessonEn: 'Hands-on experimentation and tracing live packets pulse-by-pulse cements networking intuition permanently.',
      comparison: [
        {
          realWorld: 'لوحة التحكم برادارات الحركة الجوية',
          realWorldEn: 'Air traffic radar control console',
          networkWorld: 'شاشة مراقبة مسار الحزمة (Packet Flow Monitor)',
          networkWorldEn: 'Packet Flow Monitor and visual topology canvas'
        },
        {
          realWorld: 'فحص جوازات السفر وحقائب الركاب',
          realWorldEn: 'Airport customs inspecting passports and luggage',
          networkWorld: 'محلل ترويسات الحزمة (Packet Inspector)',
          networkWorldEn: 'Live Packet Header Inspector'
        },
        {
          realWorld: 'سجل تحركات ومسارات الرحلات',
          realWorldEn: 'Flight movement log and flight plans',
          networkWorld: 'جداول الـ MAC والـ ARP والـ Routing Tables',
          networkWorldEn: 'Live CAM, ARP cache, and Routing tables'
        },
        {
          realWorld: 'زر إيقاف الوقت ودراسة كل لقطة',
          realWorldEn: 'Freezing time to analyze individual motion frames',
          networkWorld: 'التحكم بالخطوات (Step-by-Step Simulation)',
          networkWorldEn: 'Step-by-Step interactive simulation playback'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'فحص الترويسات الحي',
        titleEn: 'Live Header Inspection',
        term: 'Real-time Header Inspection',
        desc: 'انقر على أي خطوة لرؤية تفاصيل L2 Ethernet Frame و L3 IPv4 Packet بالتفصيل الممل.',
        descEn: 'Click any step to inspect L2 Ethernet frames and L3 IPv4 packet fields in meticulous detail.',
        color: 'cyan'
      },
      {
        title: 'تحديث الجداول التلقائي',
        titleEn: 'Dynamic Table Sync',
        term: 'Dynamic Table Synchronization',
        desc: 'شاهد كيف تسجل السويتشات الماك أدرس وكيف تتغير جداول التوجيه عند كل خطوة.',
        descEn: 'Observe how switches learn MACs and how routing tables are evaluated at each step.',
        color: 'emerald'
      },
      {
        title: 'التحكم بالسرعة والتشغيل',
        titleEn: 'Playback & Speed Controls',
        term: 'Play, Pause & Step-by-Step',
        desc: 'سرّع المحاكاة أو أوقفها أو تقدم خطوة واحدة لدراسة كل لحظة.',
        descEn: 'Accelerate, pause, or step forward/backward to study each network transmission.',
        color: 'purple'
      }
    ],
    interactiveScenarioId: 'cross-network-journey',
    takeawayMessage: 'استخدم الأزرار في الأسفل لتبديل السيناريوهات وتجربة جميع حالات الإرسال!',
    takeawayMessageEn: 'Use the controls below to switch scenarios and experience every forwarding condition!'
  },
  {
    id: 'slide-8',
    number: 8,
    category: 'quiz',
    categoryAr: 'تحدي المعرفة',
    categoryEn: 'Knowledge Challenge',
    titleAr: 'تحدي أبطال الشبكات: هل أصبحت خبيراً في السويتش والراوتر؟',
    titleEn: 'Network Mastery Challenge & Knowledge Check',
    subtitleAr: 'أسئلة تفاعلية ذكية مع شروحات واقعية لترسيخ فهمك',
    subtitleEn: 'Interactive scenario-based questions with instant real-world explanations',
    realWorldMetaphor: {
      titleAr: 'اختبار رخصة قيادة الشبكات العالمية',
      titleEn: 'Global Network Driver License Exam',
      iconName: 'Award',
      storyAr: 'حان وقت إثبات براعتك! أجب عن السيناريوهات الواقعية واكتشف هل ستتصرف كسويتش فائق السرعة عبر الرقاقات أم كراوتر ذكي حكيم؟',
      storyEn: 'Time to test your skills! Navigate realistic enterprise scenarios and discover whether you react with switch wire-speed or router intelligence.',
      lessonAr: 'التقييم المستمر يعزز الفهم العميق ويزيل أي لبس بين مفاهيم الطبقة الثانية والثالثة.',
      lessonEn: 'Continuous assessment solidifies deep conceptual clarity between Layer 2 and Layer 3 fundamentals.',
      comparison: [
        {
          realWorld: 'اختبار السيناريوهات الطارئة في الطيران',
          realWorldEn: 'Aviation emergency flight simulator test',
          networkWorld: 'أسئلة معالجة المشاكل (Troubleshooting Scenarios)',
          networkWorldEn: 'Hands-on troubleshooting diagnostic scenarios'
        },
        {
          realWorld: 'الحصول على شهادة الكفاءة',
          realWorldEn: 'Receiving a certified competence license',
          networkWorld: 'درجة إتقان مفاهيم الشبكات المتقدمة',
          networkWorldEn: 'Network engineering proficiency score'
        },
        {
          realWorld: 'التعلم من الإجابات الخاطئة',
          realWorldEn: 'Learning from mistake analyses',
          networkWorld: 'شروحات فورية تفصيلية لكل سؤال',
          networkWorldEn: 'Instant engineering breakdowns for every option'
        },
        {
          realWorld: 'التطبيق العملي في الحياة اليومية',
          realWorldEn: 'Real-world practical logistics mastery',
          networkWorld: 'فهم كيفية وصول الإنترنت لجهازك وهاتفك',
          networkWorldEn: 'Understanding how internet packets reach client devices'
        }
      ]
    },
    keyConcepts: [
      {
        title: 'سيناريوهات واقعية',
        titleEn: 'Real-world Scenarios',
        term: 'Real-world Scenarios',
        desc: 'أسئلة تحاكي اختبارات CCNA و Network+ بأسلوب مبسط وممتع.',
        descEn: 'Questions mirroring real CCNA and Network+ exams in an engaging format.',
        color: 'emerald'
      },
      {
        title: 'تفسير فوري لكل إجابة',
        titleEn: 'Instant Explanations',
        term: 'Instant Explanation',
        desc: 'اكتشف سبب صحة أو خطأ كل خيار مع التشبيه الواقعي المناسب له.',
        descEn: 'Learn why each option is correct or incorrect with intuitive analogies.',
        color: 'amber'
      },
      {
        title: 'توليد فوري للشهادة',
        titleEn: 'Score & Certification',
        term: 'Certificate & Score',
        desc: 'احصل على تقييمك الفوري واحتفل بإتمام رحلة تعلم الشبكات.',
        descEn: 'Obtain your performance score and celebrate completing the networking track.',
        color: 'indigo'
      }
    ],
    interactiveScenarioId: 'same-lan-switching',
    takeawayMessage: 'أكمل جميع الأسئلة لتتوج كمهندس شبكات محترف!',
    takeawayMessageEn: 'Complete all questions to earn your certified networking engineer badge!'
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
    optionsEn: [
      'The IP address changes at each router, while the MAC address remains constant.',
      'The IP address remains constant end-to-end, while the MAC address changes at each router hop.',
      'Both IP and MAC addresses change at every network hop.',
      'Neither changes; both travel intact across fiber-optic links.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'رائع وصحيح تماماً! عنوان الـ IP يمثل الهوية الشاملة للوجهة النهائية (مثل عنوان المدينة والدولة على المظروف)، ولذلك لا يتغير طوال الرحلة. أما عنوان الـ MAC فيمثل وسيلة النقل الفيزيائية للقفزة الحالية فقط (Hop-by-Hop)، فيتم استبداله عند كل راوتر ليناسب الوصلة التالية!',
    explanationEn: 'Spot on! The IP address represents the end-to-end logical identifier (like country and city on an envelope) and stays constant. The MAC address is a local hop-by-hop physical delivery vehicle and gets rewritten at every router hop to match the next physical link!',
    realWorldAnalogyAr: 'مثل كتابة اسم صديقك في باريس على رسالة؛ الاسم لا يتغير، لكن وسيلة النقل تتغير من دراجة ساعي البريد إلى شاحنة النقل ثم إلى الطائرة.',
    realWorldAnalogyEn: 'Like mailing a letter to Paris: the recipient’s address on the letter never changes, but the transport changes from a bike to a truck to an aircraft.',
    difficulty: 'متوسط',
    difficultyEn: 'Intermediate'
  },
  {
    id: 'q2',
    questionAr: 'ما هو الدور الأساسي لبروتوكول ARP في الشبكة المحلية؟',
    questionEn: 'What is the primary purpose of the ARP protocol in a local network?',
    optionsAr: [
      'تشفير كلمات المرور لحمايتها من الاختراق.',
      'معرفة عنوان الـ MAC الفيزيائي المقابل لعنوان IP معين داخل الشبكة المحلية.',
      'تحديد أفضل مسار جغرافي للوصول إلى سيرفرات الألعاب السريعة.',
      'إعادة تشغيل السويتش تلقائياً عند انقطاع التيار الكهربائي.'
    ],
    optionsEn: [
      'Encrypt passwords to prevent network intrusion.',
      'Resolve the physical MAC address corresponding to a known IPv4 address on the local LAN.',
      'Determine the best geographical routing path to remote gaming servers.',
      'Automatically reboot the switch upon power failure.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'إجابة دقيقة! بروتوكول ARP (Address Resolution Protocol) هو المترجم الذي يسأل في الشبكة: "من يملك هذا الـ IP؟ أخبرني بالـ MAC الخاص بك"، لكي يتمكن الحاسوب من تغليف فريم الإيثرنت بشكل صحيح.',
    explanationEn: 'Accurate! Address Resolution Protocol (ARP) translates an IP address to its corresponding Layer 2 MAC address so the host can properly build and encapsulate the Ethernet frame header.',
    realWorldAnalogyAr: 'مثل مناداة اسم شخص في صالة الانتظار للتعرف على وجهه قبل تسليمه الملف.',
    realWorldAnalogyEn: 'Like calling out someone’s name in a waiting lobby to locate their face before handing them the envelope.',
    difficulty: 'مبتدئ',
    difficultyEn: 'Beginner'
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
    optionsEn: [
      'To compress packet size and boost internet bandwidth.',
      'To meter bandwidth consumption for billing purposes.',
      'To prevent looping packets from circulating indefinitely (Routing Loops) and saturating bandwidth.',
      'To synchronize the router clock with NTP servers.'
    ],
    correctAnswerIndex: 2,
    explanationAr: 'ممتاز! حقل TTL يبدأ برقم محدد (مثل 64 أو 128)، وينقص 1 عند كل راوتر. إذا وصل إلى 0، يتم إتلاف الحزمة فوراً وإرسال تنبيه ICMP للمصدر، مما يمنع الحزم التائهة من إغراق كابلات الإنترنت إلى الأبد.',
    explanationEn: 'Excellent! TTL starts at a predefined value (e.g. 64, 128) and is decremented by 1 at every L3 hop. If it hits 0, the packet is discarded and an ICMP Time Exceeded message is sent back to the source, preventing endless routing loops.',
    realWorldAnalogyAr: 'مثل وضع تاريخ انتهاء صلاحية على الأطعمة؛ إذا لم تُستهلك في الوقت المحدد يتم إتلافها لحماية المستهلكين.',
    realWorldAnalogyEn: 'Like an expiration date on perishable goods: if not delivered within the allotted lifespan, it is safely disposed of.',
    difficulty: 'متوسط',
    difficultyEn: 'Intermediate'
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
    optionsEn: [
      'Switches block broadcasts, while routers propagate them worldwide.',
      'Switches flood broadcasts out all ports in the same VLAN, whereas routers stop and do not forward broadcasts across subnets.',
      'Both devices completely block broadcast traffic.',
      'There is no difference; both handle broadcast frames identically.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'صحيح 100%! السويتش يمثل مجال بث واحد (Single Broadcast Domain) فيمرر الـ Broadcast لجميع أجهزته، بينما الراوتر يقسم الشبكة إلى مجالات بث منفصلة (Separates Broadcast Domains) ويحمي شبكات العالم من التلوث ببث بعضها البعض.',
    explanationEn: '100% correct! A switch represents a single Layer 2 broadcast domain and floods broadcast frames, while routers boundary separate broadcast domains, stopping broadcast traffic from crossing subnets.',
    realWorldAnalogyAr: 'جدران المبنى تسمع فيها صوت الصراخ في الممر (السويتش)، بينما الجدران العازلة بين الأبراج تمنع انتقال الصراخ للمباني المجاورة (الراوتر).',
    realWorldAnalogyEn: 'Voices shouting in an open office hall are heard by everyone (Switch LAN), while soundproof building partitions prevent noise from spilling into adjacent towers (Router boundaries).',
    difficulty: 'متقدم',
    difficultyEn: 'Advanced'
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
    optionsEn: [
      'Immediately drops the frame.',
      'Sends it exclusively to the default gateway router port.',
      'Floods the frame out of all active ports within the VLAN except the ingress receiving port.',
      'Disables the ingress port for security.'
    ],
    correctAnswerIndex: 2,
    explanationAr: 'إجابة عبقرية! هذه العملية تُسمى Unknown Unicast Flooding. يقوم السويتش بإرسال الفريم لكل المنافذ آملاً أن يستجيب الجهاز صاحب الماك المطلوب، وعندما يستجيب يتعلم السويتش موقعه فوراً ويسجله في جدول الـ CAM للمستقبل.',
    explanationEn: 'Brilliant! This is Unknown Unicast Flooding. The switch sends the frame out of all member ports in that VLAN hoping the true owner responds. When it does, the switch immediately learns its MAC and port in the CAM table.',
    realWorldAnalogyAr: 'مثل طرق جميع أبواب الغرف في الفندق بحثاً عن نزيل لم يسجل اسمه في سجل الاستقبال بعد.',
    realWorldAnalogyEn: 'Like knocking on each hotel room door to find a guest who hasn’t checked in at the front desk yet.',
    difficulty: 'متقدم',
    difficultyEn: 'Advanced'
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
    optionsEn: [
      'Matching Area ID, Hello/Dead Timers, Subnet Mask on the link, and Authentication.',
      'Matching Router ID only.',
      'Matching Ethernet interface speed and operating system type.',
      'Matching chassis hostname and manufacturing year.'
    ],
    correctAnswerIndex: 0,
    explanationAr: 'دقيق جداً! يشترط بروتوكول OSPF تطابق: Area ID، و Hello/Dead Intervals (غالباً 10s/40s)، و Subnet Mask على نفس الوصلة، والـ Authentication، والـ MTU حجم الإطار لتجنب مشاكل التبادل.',
    explanationEn: 'Very precise! OSPF requires matching Area ID, Hello and Dead intervals (commonly 10s/40s), link subnet mask, MTU size, and matching authentication credentials before forming full neighbor adjacency.',
    realWorldAnalogyAr: 'مثل تبادل بطاقات العمل المشروطة بالتحدث بنفس اللغة ونفس وتيرة الحديث وموافقة الإدارة.',
    realWorldAnalogyEn: 'Like a business handshake that strictly requires speaking the same language, rhythm, and presenting authentic credentials.',
    difficulty: 'خبير (CCNA/CCNP)',
    difficultyEn: 'CCNA/CCNP Expert'
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
    optionsEn: [
      'OSPF wins because it is a dynamic routing protocol.',
      'Static Route wins because its Administrative Distance is lower (AD=1 vs AD=110 for OSPF).',
      'Traffic is load-balanced 50/50 between both routes.',
      'The route is blocked due to conflicting advertisements.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'رائع! المسافة الإدارية (Administrative Distance) هي معيار الثقة في مصدر المسار. كلما كان الرقم أقل، زادت الثقة. المسار الثابت له AD=1 بينما OSPF له AD=110، لذلك يفوز المسار الثابت دائماً.',
    explanationEn: 'Great! Administrative Distance (AD) is the measure of trustworthiness. Lower AD values win. A Static Route has AD=1 while OSPF has AD=110, so the static route is always preferred and installed in the FIB routing table.',
    realWorldAnalogyAr: 'المسار الثابت مثل أمر مباشر من رئيس مجلس الإدارة شخصياً، بينما OSPF هو اقتراح الزملاء في العمل؛ الأول له الأولوية المطلقة.',
    realWorldAnalogyEn: 'A static route is like an executive directive from the CTO, whereas OSPF is a peer team recommendation; the executive order always takes precedence.',
    difficulty: 'خبير (CCNP)',
    difficultyEn: 'CCNP Expert'
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
    optionsEn: [
      'Speed up PC boot times and lower electricity consumption.',
      'Prevent Layer 2 switching loops and broadcast storms by placing redundant switch ports into a Blocking state.',
      'Distribute IP addresses dynamically in place of a DHCP server.',
      'Block malicious websites in the browser.'
    ],
    correctAnswerIndex: 1,
    explanationAr: 'صحيح 100%! في Layer 2 لا يوجد حقل TTL مثل Layer 3، لذا فإن أي حلقة فيزيائية بين السويتشات تؤدي لتكرار الفريمات بلا نهاية وحدوث Broadcast Storm يغرق الشبكة في ثوانٍ. يقوم STP بانتخاب Root Bridge وحظر المنافذ الزائدة لحماية الشبكة.',
    explanationEn: '100% correct! Layer 2 Ethernet frames lack a TTL field. Any physical loop causes frames to circulate infinitely, generating catastrophic broadcast storms within seconds. STP elects a Root Bridge and disables redundant links to guarantee a loop-free tree topology.',
    realWorldAnalogyAr: 'مثل إشارات المرور الذكية التي تغلق مساراً احتياطياً لمنع التصادم والازدحام الدائري، وتفتحه فوراً إذا تعطل الطريق الرئيسي.',
    realWorldAnalogyEn: 'Like smart traffic signals that block redundant intersections to prevent gridlock, automatically opening the alternate road if the primary bridge fails.',
    difficulty: 'متقدم (CCNA)',
    difficultyEn: 'CCNA Advanced'
  }
];
