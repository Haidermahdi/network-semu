import { HumanNetworkStory, Language } from '../types';

// Pre-translated English metadata and steps for the primary network stories to guarantee high quality and 100% offline availability
export const STATIC_STORIES_TRANSLATIONS: Record<string, Partial<HumanNetworkStory>> = {
  'story-arp-market-discovery': {
    titleEn: 'The Crowded Market Megaphone (ARP Resolution & Broadcast)',
    subtitleEn: 'Understand ARP and how a Layer 2 broadcast turns into a smart Layer 2 unicast reply',
    difficultyEn: 'Beginner',
    storySummaryEn: 'In a huge marketplace, you know the target person is "Dr. Omar" (IP Address), but you do not know his face or ID number (MAC Address). How do you use a megaphone to find him, and how does he respond?',
    realWorldScenarioDescriptionEn: 'In the real world: Ahmed enters a medical complex carrying an urgent analysis folder for "Dr. Omar" (192.168.1.20). The receptionist (Switch) does not know where the doctor is sitting. Ahmed asks the operator to announce over the intercom: "Attention everyone! Who is Dr. Omar? Please report your table number to Ahmed at the entrance!" Everyone hears it, but only the doctor replies.',
    ciscoCoreLessonEn: 'NICs cannot transmit Ethernet frames without a Destination MAC. ARP sends a broadcast frame (FF:FF:FF:FF:FF:FF) to all devices. Only the node with the matching IP replies with a unicast frame containing its MAC address, which is then stored in the sender\'s ARP Cache.',
    characters: [
      {
        id: 'char-ahmed',
        nameAr: 'أحمد (المشتري / المصدر)',
        nameEn: 'Ahmed (Host A)',
        roleAr: 'المريض الباحث عن الطبيب',
        roleEn: 'Patient looking for the doctor (Source Host)',
        avatarRole: 'pedestrian',
        ipAddress: '192.168.1.10',
        macAddress: 'AA:AA:AA:11:11:11',
        xPosition: 12,
        yPosition: 60,
        initialSpeech: 'أعرف اسم د. عمر لكن لا أعرف شكله!',
        initialSpeechEn: 'I know Dr. Omar\'s name, but not his face!',
        carryingItem: 'ظرف التحاليل الطبية (IP Packet)',
        carryingItemEn: 'Medical Analysis Folder (IP Packet)'
      },
      {
        id: 'char-switch-operator',
        nameAr: 'موظف سنترال السوق (السويتش)',
        nameEn: 'Market Switch / Intercom',
        roleAr: 'مشغل مكبر الصوت وموزع الغرف',
        roleEn: 'Intercom Operator (L2 Access Switch)',
        avatarRole: 'clerk',
        ipAddress: '192.168.1.2 (Mgmt)',
        macAddress: '55:55:55:00:00:01',
        xPosition: 38,
        yPosition: 45,
        initialSpeech: 'سأذيع النداء على كل المكبرات!',
        initialSpeechEn: 'I will announce this over all speakers!',
        carryingItem: 'ميكروفون البث العام (Broadcast Intercom)',
        carryingItemEn: 'Broadcast Intercom Microphone'
      },
      {
        id: 'char-sara',
        nameAr: 'سارة (زبونة في مقهى السوق)',
        nameEn: 'Sara (Host B - Unrelated)',
        roleAr: 'متسوقة في نفس السوق',
        roleEn: 'Shopper in the cafe (Unrelated Host)',
        avatarRole: 'student',
        ipAddress: '192.168.1.15',
        macAddress: 'BB:BB:BB:22:22:22',
        xPosition: 62,
        yPosition: 68,
        initialSpeech: 'لست دكتور عمر، سأتجاهل النداء.',
        initialSpeechEn: 'I am not Dr. Omar, I will ignore the announcement.',
        carryingItem: 'كوب قهوة',
        carryingItemEn: 'Coffee Cup'
      },
      {
        id: 'char-doctor-omar',
        nameAr: 'د. عمر (الطبيب المستهدف)',
        nameEn: 'Dr. Omar (Host C - Target)',
        roleAr: 'الطبيب المطلوب تسليمه الظرف',
        roleEn: 'Target Doctor (Host C)',
        avatarRole: 'chef',
        ipAddress: '192.168.1.20',
        macAddress: 'CC:CC:CC:33:33:33',
        xPosition: 86,
        yPosition: 55,
        initialSpeech: 'نعم أنا د. عمر! هذه بطاقة هويتي!',
        initialSpeechEn: 'Yes, I am Dr. Omar! Here is my ID card!',
        carryingItem: 'بطاقة الهوية والعيادة (MAC ID Card)',
        carryingItemEn: 'MAC ID Card'
      }
    ] as any[],
    steps: [
      {
        stepNumber: 1,
        titleAr: '1. تجهيز نداء البث العام (ARP Request Broadcast)',
        titleEn: '1. ARP Request Broadcast Generation',
        storyNarrativeAr: 'أحمد يريد إرسال الظرف الطبي للدكتور عمر (192.168.1.20). ينظر في مفكرته (ARP Table) فيجدها فارغة! يتوجه لموظف الاستقبال ويضع على الظرف عنوان البث العام: "إلى جميع الحاضرين في المجمع (FF:FF:FF:FF:FF:FF)".',
        storyNarrativeEn: 'Ahmed wants to send the medical folder to Dr. Omar (192.168.1.20). He checks his notebook (ARP Cache) and finds it empty! He goes to the receptionist and sets the destination MAC to broadcast (FF:FF:FF:FF:FF:FF).',
        technicalAnalogyAr: 'يقوم الجهاز المصدري ببناء حزمة ARP Request ووضع Destination MAC = FF:FF:FF:FF:FF:FF لأن عنوان MAC الوجهة مجهول.',
        technicalAnalogyEn: 'The source host builds an ARP Request packet with Destination MAC = FF:FF:FF:FF:FF:FF because the target MAC is unlearned.',
        ciscoProtocolTerm: 'ARP Request (Broadcast Frame - EtherType 0x0806)',
        ciscoCommandSnippet: 'show ip arp | show mac address-table',
        activeCharacterId: 'char-ahmed',
        fromCharacterId: 'char-ahmed',
        toCharacterId: 'char-switch-operator',
        payloadType: 'ARP Request',
        payloadContentAr: 'من يملك الـ IP: 192.168.1.20؟ أخبر أحمد (192.168.1.10)',
        payloadContentEn: 'Who has IP: 192.168.1.20? Tell Ahmed (192.168.1.10)',
        l2Src: 'AA:AA:AA:11:11:11 (Ahmed)',
        l2Dest: 'FF:FF:FF:FF:FF:FF (Broadcast)',
        l3Src: '192.168.1.10',
        l3Dest: '192.168.1.20',
        ttlRemaining: 1,
        packetPositionPercent: 25,
        speechBubbles: {
          'char-ahmed': 'أيها السنترال، أرجو إذاعة هذا النداء فوراً للجميع!',
          'char-switch-operator': 'تم الاستلام! سأسجل موقعك أولاً في سجلي.'
        },
        speechBubblesEn: {
          'char-ahmed': 'Operator, please announce this query to everyone!',
          'char-switch-operator': 'Received! I will log your location first.'
        },
        highlightedEventAr: 'إنشاء طلب الـ ARP وتوجيهه إلى السويتش',
        highlightedEventEn: 'Creating ARP Request and forwarding to the Switch'
      },
      {
        stepNumber: 2,
        titleAr: '2. إذاعة النداء وتجاهل غير المعنيين (Broadcast Flooding & Filtering)',
        titleEn: '2. Switch Broadcast Flooding',
        storyNarrativeAr: 'يقوم موظف السنترال ببث النداء عبر جميع مكبرات الصوت في المجمع. تسمع سارة النداء وتتجاهله فوراً لأن اسمها ليس دكتور عمر. بينما يستمع دكتور عمر ويهيئ نفسه للاستجابة.',
        storyNarrativeEn: 'The switch operator floods the announcement over all speakers in the complex. Sara hears the megaphone but ignores it because she is not Dr. Omar. Dr. Omar hears his name and prepares to reply.',
        technicalAnalogyAr: 'يستقبل السويتش إطار البث العام ويقوم بنسخه وإرساله عبر جميع المنافذ (Flooding) في نفس الـ VLAN باستثناء المنفذ الذي دخل منه الإطار.',
        technicalAnalogyEn: 'The switch receives the broadcast frame and floods it out all active ports in the same VLAN except the receiving port Fa0/1.',
        ciscoProtocolTerm: 'Switching Broadcast Flooding',
        ciscoCommandSnippet: 'show mac address-table | show interface trunk',
        activeCharacterId: 'char-switch-operator',
        fromCharacterId: 'char-switch-operator',
        toCharacterId: 'char-doctor-omar',
        payloadType: 'ARP Request (Flooded)',
        payloadContentAr: 'نداء عام: من هو دكتور عمر (192.168.1.20)؟',
        payloadContentEn: 'Broadcast: Who has Dr. Omar IP 192.168.1.20?',
        l2Src: 'AA:AA:AA:11:11:11',
        l2Dest: 'FF:FF:FF:FF:FF:FF (Broadcast)',
        l3Src: '192.168.1.10',
        l3Dest: '192.168.1.20',
        ttlRemaining: 1,
        packetPositionPercent: 50,
        speechBubbles: {
          'char-switch-operator': 'نداء هام: من يملك العنوان 192.168.1.20 يرجى إبلاغ أحمد!',
          'char-sara': 'ليس عنواني. سأتخلص من الإطار بهدوء.'
        },
        speechBubblesEn: {
          'char-switch-operator': 'Attention! Who has IP 192.168.1.20? Report to Ahmed!',
          'char-sara': 'Not my IP. I will silently discard the frame.'
        },
        highlightedEventAr: 'تكرار البث لجميع المنافذ وفحص الـ IP من قبل الأجهزة',
        highlightedEventEn: 'Switch floods the broadcast frame out all active ports'
      },
      {
        stepNumber: 3,
        titleAr: '3. الرد الخاص الأحادي وحفظ العنوان (Unicast ARP Reply & Cache)',
        titleEn: '3. Unicast ARP Reply',
        storyNarrativeAr: 'يتوجه دكتور عمر مباشرة إلى أحمد في المدخل ويسلمه بطاقة عيادته الخاصة المكتوب عليها اسمه وعنوانه الفيزيائي. أحمد يسجل هذه البيانات في مفكرته (ARP Table) ليتواصل معه مباشرة في المرات القادمة.',
        storyNarrativeEn: 'Dr. Omar walks directly to Ahmed at the entrance and hands him his clinic ID card (MAC Address). Ahmed logs this in his notebook (ARP Cache) to communicate directly next time.',
        technicalAnalogyAr: 'يقوم الطبيب بإرسال رد أحادي (Unicast ARP Reply) يحتوي على عنوان الـ MAC الخاص به. السويتش يوجه هذا الرد مباشرة لمنفذ أحمد دون إفاضة.',
        technicalAnalogyEn: 'The target host matches the IP, records the sender\'s MAC, and transmits a unicast ARP Reply containing its MAC address back to Ahmed.',
        ciscoProtocolTerm: 'ARP Reply (Unicast Frame - EtherType 0x0806)',
        ciscoCommandSnippet: 'show ip arp\n# Cisco IP ARP entry is stored for 4 hours by default',
        activeCharacterId: 'char-doctor-omar',
        fromCharacterId: 'char-doctor-omar',
        toCharacterId: 'char-ahmed',
        payloadType: 'ARP Reply',
        payloadContentAr: 'الـ IP 192.168.1.20 يقع في MAC: CC:CC:CC:33:33:33',
        payloadContentEn: 'IP 192.168.1.20 is at MAC: CC:CC:CC:33:33:33',
        l2Src: 'CC:CC:CC:33:33:33 (Dr. Omar)',
        l2Dest: 'AA:AA:AA:11:11:11 (Ahmed)',
        l3Src: '192.168.1.20',
        l3Dest: '192.168.1.10',
        ttlRemaining: 1,
        packetPositionPercent: 75,
        speechBubbles: {
          'char-doctor-omar': 'أنا دكتور عمر، وهذا عنوان الماك الخاص بي!',
          'char-ahmed': 'رائع! سأسجل عنوانك في جدول ARP لديّ.'
        },
        speechBubblesEn: {
          'char-doctor-omar': 'Yes, I am Dr. Omar! My MAC is CC:CC:CC:33:33:33.',
          'char-ahmed': 'Perfect! I will save this in my ARP Cache.'
        },
        highlightedEventAr: 'توصيل الرد الأحادي وتحديث جدول الـ ARP',
        highlightedEventEn: 'Target host sends unicast ARP Reply to the requester'
      }
    ] as any[]
  },
  'story-passport-checkpoint-ttl': {
    titleEn: 'The Diplomatic Courier Journey (L3 Routing & TTL Decrement)',
    subtitleEn: 'See how the final logical destination (IP) remains constant while the local physical carrier (MAC) changes',
    difficultyEn: 'Intermediate',
    storySummaryEn: 'Salman in Riyadh sends an urgent diplomatic document to Tariq in Dubai. The document passes through multiple border checkpoints. Each border officer inspects the document, stamps it (decrementing its valid days), and arranges a new local driver for the next leg.',
    realWorldScenarioDescriptionEn: 'In Layer 3 networks, IP packets travel across multiple router hops. Each router strips the old Layer 2 Ethernet frame, consults its Routing Table to find the next-hop router, decrements the TTL (Time To Live) field by 1 to prevent endless loops, and encapsulates the packet into a brand new Layer 2 frame appropriate for the next link.',
    ciscoCoreLessonEn: 'Logical IP addresses are end-to-end constant and represent identity. Physical MAC addresses are hop-by-hop local and represent transit. If TTL reaches 0 before destination, the router drops the packet and sends an ICMP Time Exceeded (Type 11) message to the source.',
    characters: [
      {
        id: 'char-salman',
        nameAr: 'سلمان (المصدر - الرياض)',
        nameEn: 'Salman (Source - Riyadh)',
        roleAr: 'مرسل الوثيقة الأصلية',
        roleEn: 'Sender of original document (Host A)',
        avatarRole: 'pedestrian',
        ipAddress: '10.100.1.10',
        macAddress: '11:11:11:11:11:11',
        xPosition: 10,
        yPosition: 62,
        initialSpeech: 'أرسل وثيقة سرية من الرياض إلى دبي.',
        initialSpeechEn: 'I am sending a confidential document from Riyadh to Dubai.',
        carryingItem: 'الوثيقة الدبلوماسية (IP Packet)',
        carryingItemEn: 'Diplomatic Document (IP Packet)'
      },
      {
        id: 'char-border-r1',
        nameAr: 'الضابط فهد (راوتر بوابة الرياض R1)',
        nameEn: 'Officer Fahad (Riyadh Gateway R1)',
        roleAr: 'يفحص الأوراق ويختم الـ TTL',
        roleEn: 'Border officer (First-Hop Router)',
        avatarRole: 'officer',
        ipAddress: '10.100.1.1',
        macAddress: 'AA:BB:CC:11:22:33',
        xPosition: 38,
        yPosition: 48,
        initialSpeech: 'سأقلل صلاحية المعاملة يوماً واحداً (TTL - 1).',
        initialSpeechEn: 'I will decrement the validity of this packet by 1 (TTL - 1).',
        carryingItem: 'ختم جوازات الحدود (TTL Decrementer)',
        carryingItemEn: 'Border Passport Stamp (TTL Decrementer)'
      },
      {
        id: 'char-border-r2',
        nameAr: 'الضابط خالد (راوتر بوابة دبي R2)',
        nameEn: 'Officer Khalid (Dubai Gateway R2)',
        roleAr: 'يستقبل الحزم ويوجهها للوجهة النهائية',
        roleEn: 'Border officer (Last-Hop Router)',
        avatarRole: 'guard',
        ipAddress: '10.200.2.1',
        macAddress: 'DD:EE:FF:44:55:66',
        xPosition: 64,
        yPosition: 52,
        initialSpeech: 'أهلاً بك في حدود دبي، سأرسلها للمستلم مباشرة.',
        initialSpeechEn: 'Welcome to Dubai border, forwarding to the final recipient.',
        carryingItem: 'سجل التوجيه الحدودي (Routing Table)',
        carryingItemEn: 'Border Forwarding Ledger (Routing Table)'
      },
      {
        id: 'char-tariq',
        nameAr: 'طارق (الوجهة - دبي)',
        nameEn: 'Tariq (Destination - Dubai)',
        roleAr: 'المستلم النهائي في دبي',
        roleEn: 'Final Recipient (Host B)',
        avatarRole: 'businessman',
        ipAddress: '10.200.2.20',
        macAddress: '99:99:99:99:99:99',
        xPosition: 88,
        yPosition: 58,
        initialSpeech: 'وصلتني الوثيقة بأمان وبأقل من الزمن المحدد!',
        initialSpeechEn: 'I received the document safely and intact!',
        carryingItem: 'الوثيقة المستلمة',
        carryingItemEn: 'Received Document'
      }
    ] as any[],
    steps: [
      {
        stepNumber: 1,
        titleAr: '1. تسليم الوثيقة للمركز الحدودي الأول (First Hop Gateway Delivery)',
        titleEn: '1. Default Gateway Delivery',
        storyNarrativeAr: 'يريد سلمان إرسال الرسالة إلى دبي (10.200.2.20). يدرك أنها خارج مدينته، فيسلمها لسائقه المحلي ليوصلها إلى مركز حدود الرياض (بوابته الافتراضية R1). يغادر السائق الرياض حاملاً الرسالة.',
        storyNarrativeEn: 'Salman wants to send the message to Dubai (10.200.2.20). Realizing it is outside Riyadh, he hands it to a local driver to deliver it to Riyadh Border Office (Default Gateway R1).',
        technicalAnalogyAr: 'يقوم الجهاز المصدر بإرسال الإطار إلى بوابة الخروج الافتراضية (Default Gateway). عنوان الـ IP للهدف هو دبي، ولكن عنوان الـ MAC للهدف هو منفذ الراوتر R1 المحلي.',
        technicalAnalogyEn: 'The source host encapsulates the packet in an Ethernet frame addressed to the Default Gateway. Source IP is Riyadh, Destination IP is Dubai, but Destination MAC is R1.',
        ciscoProtocolTerm: 'Default Gateway Forwarding',
        ciscoCommandSnippet: 'ip route 0.0.0.0 0.0.0.0 10.100.1.1',
        activeCharacterId: 'char-salman',
        fromCharacterId: 'char-salman',
        toCharacterId: 'char-border-r1',
        payloadType: 'IP Packet in L2 Frame',
        payloadContentAr: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | Doc: Secret',
        payloadContentEn: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | Doc: Secret',
        l2Src: '11:11:11:11:11:11 (Salman)',
        l2Dest: 'AA:BB:CC:11:22:33 (R1 Gateway)',
        l3Src: '10.100.1.10',
        l3Dest: '10.200.2.20',
        ttlRemaining: 64,
        packetPositionPercent: 24,
        speechBubbles: {
          'char-salman': 'خذ هذه الرسالة الدبلوماسية الموجهة لدبي وسلمها للضابط فهد.',
          'char-border-r1': 'سأفتح ترويسة الـ L2 لأفحص الـ IP والـ TTL.'
        },
        speechBubblesEn: {
          'char-salman': 'Take this diplomatic letter addressed to Dubai and give it to Officer Fahad.',
          'char-border-r1': 'I will decapsulate the L2 frame to examine the IP and TTL.'
        },
        highlightedEventAr: 'توصيل الحزمة للبوابة الافتراضية مع ثبات عنوان الـ IP النهائي',
        highlightedEventEn: 'Packet delivered to Default Gateway. Destination IP is remote'
      },
      {
        stepNumber: 2,
        titleAr: '2. معالجة الراوتر وإعادة صياغة الهوية الفيزيائية (Decapsulation & MAC Rewrite)',
        titleEn: '2. Router Decapsulation & MAC Rewrite',
        storyNarrativeAr: 'يستلم الضابط فهد الرسالة، يمزق المغلف الخارجي للرياض (L2 Header)، يرى عنوان دبي فيفحص خارطة التوجيه. يقلل زمن الصلاحية يوماً واحداً (TTL - 1)، ثم يضع الرسالة في مغلف نقل دولي جديد ويسلمها لسائق خطوط النقل السريع المتجه لمركز حدود دبي R2.',
        storyNarrativeEn: 'Officer Fahad receives the frame, strips Riyadh local envelope (L2 MAC), inspects Dubai destination IP, decrements the packet validity (TTL - 1), wraps it in a new international envelope, and assigns it to a WAN transit driver.',
        technicalAnalogyAr: 'يقوم الراوتر بنزع ترويسة الطبقة الثانية، تقليل قيمة TTL بمقدار 1، تحديثChecksum، البحث في جدول التوجيه، وكتابة ترويسة MAC جديدة كلياً تتناسب مع وسيط النقل للقفزة التالية.',
        technicalAnalogyEn: 'The router strips the incoming Ethernet frame, decrements TTL by 1, recomputes checksum, resolves next-hop in routing table, and applies a new L2 MAC header for transit.',
        ciscoProtocolTerm: 'Layer 3 Routing Table Lookup & Frame Rewrite',
        ciscoCommandSnippet: 'show ip route\n# TTL is decremented here. If 0, ICMP Type 11 is generated.',
        activeCharacterId: 'char-border-r1',
        fromCharacterId: 'char-border-r1',
        toCharacterId: 'char-border-r2',
        payloadType: 'IP Packet (TTL Decremented)',
        payloadContentAr: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | TTL: 63',
        payloadContentEn: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | TTL: 63',
        l2Src: 'AA:BB:CC:11:22:33 (R1 Out)',
        l2Dest: 'DD:EE:FF:44:55:66 (R2 In)',
        l3Src: '10.100.1.10',
        l3Dest: '10.200.2.20',
        ttlRemaining: 63,
        packetPositionPercent: 51,
        speechBubbles: {
          'char-border-r1': 'تم تقليل TTL إلى 63. سأرسلها عبر كابل الألياف الضوئية للضابط خالد.',
          'char-border-r2': 'أرى إشارة قادمة من الرياض، سأقوم بالتجهيز للاستلام.'
        },
        speechBubblesEn: {
          'char-border-r1': 'TTL decremented to 63. Forwarding via optical link to Dubai.',
          'char-border-r2': 'I see a transit packet coming. Preparing next-hop resolution.'
        },
        highlightedEventAr: 'تقليص قيمة TTL بمقدار 1 وإعادة كتابة عناوين الـ MAC للرابط الجديد',
        highlightedEventEn: 'TTL decremented by 1. L2 MAC header is fully rewritten'
      },
      {
        stepNumber: 3,
        titleAr: '3. الوصول والتسليم النهائي للمستلم (Final Hop Local Delivery)',
        titleEn: '3. Final Hop Local Delivery',
        storyNarrativeAr: 'تصل الشاحنة لمركز دبي R2. يستلمها الضابط خالد، يمزق المغلف الدولي، يرى عنوان طارق وهو مقيم محلي في دبي. يتصل خالد بسائقه المحلي ليسلم طارق الرسالة في يده مباشرة في دبي.',
        storyNarrativeEn: 'The vehicle reaches Dubai Border Office R2. Officer Khalid strips the transit envelope, sees Tariq\'s local Dubai address, checks his local registry (ARP Table), and assigns a local courier to deliver the folder directly to Tariq.',
        technicalAnalogyAr: 'يستقبل الراوتر الأخير الحزمة، يجد أن شبكة الوجهة متصلة به مباشرة (Directly Connected)، يقلل TTL بمقدار 1 مجدداً (تصبح 62)، ثم يستخدم الـ ARP لإيجاد MAC المضيف النهائي ويسلمه الإطار.',
        technicalAnalogyEn: 'The final gateway router receives the packet, finds the destination subnet is directly connected, decrements TTL to 62, consults its ARP table, and delivers the frame locally.',
        ciscoProtocolTerm: 'Directly Connected Subnet Forwarding',
        ciscoCommandSnippet: 'show ip route\n# Destination subnet is directly connected on GigabitEthernet0/0',
        activeCharacterId: 'char-border-r2',
        fromCharacterId: 'char-border-r2',
        toCharacterId: 'char-tariq',
        payloadType: 'IP Packet (Final Delivery)',
        payloadContentAr: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | TTL: 62',
        payloadContentEn: 'IP: Src 10.100.1.10 -> Dst 10.200.2.20 | TTL: 62',
        l2Src: 'DD:EE:FF:44:55:66 (R2 Out)',
        l2Dest: '99:99:99:99:99:99 (Tariq MAC)',
        l3Src: '10.100.1.10',
        l3Dest: '10.200.2.20',
        ttlRemaining: 62,
        packetPositionPercent: 78,
        speechBubbles: {
          'char-border-r2': 'طارق يقع في شبكتي المحلية المتصلة مباشرة. سأرسلها لعنوان الماك الخاص به.',
          'char-tariq': 'استلمت الرسالة! شكراً جزيلاً لكم.'
        },
        speechBubblesEn: {
          'char-border-r2': 'Tariq is in my directly connected local LAN. Forwarding to his MAC address.',
          'char-tariq': 'Document received safely! Thank you very much.'
        },
        highlightedEventAr: 'توصيل الحزمة للمستلم النهائي عبر القفزة الأخيرة وتقليل الـ TTL',
        highlightedEventEn: 'Packet delivered to final host. TTL is now 62'
      }
    ] as any[]
  },
  'story-vlan-tower-badges': {
    titleEn: 'The Multi-Tenant Office Tower (VLANs & 802.1Q Trunk Tagging)',
    subtitleEn: 'How Finance and HR share the same wires and elevators but remain digitally isolated via 802.1Q tags',
    difficultyEn: 'Beginner',
    storySummaryEn: 'In a major office high-rise, the confidential Finance department (VLAN 10) and the Human Resources department (VLAN 20) share the same tower elevators (Trunk Links). Each employee wears a color-coded magnetic badge indicating their department. The floor guards prevent anyone from entering another department\'s offices unless they wear the authorized badge.',
    realWorldScenarioDescriptionEn: 'In real networks: VLANs provide complete logical broadcast containment between departments on the same physical switch. When traffic traverses a shared switch-to-switch link (Trunk Link), the standard IEEE 802.1Q protocol injects a 4-byte header containing a 12-bit VLAN ID, ensuring the receiving switch knows which network the frame belongs to before stripping the tag and delivering it.',
    ciscoCoreLessonEn: 'Access ports are dedicated to end-user devices and carry untagged frames. Trunk ports carry traffic for multiple VLANs with 802.1Q tagging. The Native VLAN (default VLAN 1) carries untagged frames, and must match on both ends of a trunk to prevent security risks like VLAN Hopping.',
    characters: [
      {
        id: 'char-finance-clerk',
        nameAr: 'سعيد (محاسب المالية - VLAN 10)',
        nameEn: 'Saeed (Finance Host - VLAN 10)',
        roleAr: 'موظف يرسل تقارير الرواتب السرية',
        roleEn: 'Finance officer sending confidential payroll reports (VLAN 10 Host)',
        avatarRole: 'clerk',
        ipAddress: '10.10.10.50',
        macAddress: 'AA:10:AA:10:AA:10',
        xPosition: 12,
        yPosition: 62,
        initialSpeech: 'أحمل كشف الرواتب وأرتدي البطاقة الزرقاء (VLAN 10).',
        initialSpeechEn: 'I carry the payroll and wear the blue badge (VLAN 10).',
        carryingItem: 'كشف الرواتب المشفر (Finance Payload)',
        carryingItemEn: 'Encrypted Payroll Folder (Finance Payload)'
      },
      {
        id: 'char-elevator-trunk',
        nameAr: 'حارس المصعد المشترك (Trunk Switch Fa0/24)',
        nameEn: 'Elevator Attendant (802.1Q Trunk Switch)',
        roleAr: 'يلصق الوسم 802.1Q ويوجه الموظفين لأدوارهم',
        roleEn: '802.1Q Trunk Switch Operator adding VLAN tags',
        avatarRole: 'guard',
        ipAddress: '10.10.10.1 (SVI)',
        macAddress: 'CC:00:11:22:33:44',
        xPosition: 45,
        yPosition: 48,
        initialSpeech: 'سأضع ختم VLAN 10 على الظرف قبل إدخاله المصعد العام!',
        initialSpeechEn: 'I will stamp the envelope with VLAN 10 before placing it in the elevator!',
        carryingItem: 'جهاز ختم بطاقات 802.1Q (4-Byte Tag Injector)',
        carryingItemEn: '802.1Q Tag Injector Tool'
      },
      {
        id: 'char-hr-clerk',
        nameAr: 'مريم (مسؤولة التوظيف - VLAN 20)',
        nameEn: 'Maryam (HR Host - VLAN 20)',
        roleAr: 'موظفة الموارد البشرية المعزولة أمنياً',
        roleEn: 'HR recruiter operating on an isolated network (VLAN 20 Host)',
        avatarRole: 'student',
        ipAddress: '10.20.20.80',
        macAddress: 'BB:20:BB:20:BB:20',
        xPosition: 78,
        yPosition: 70,
        initialSpeech: 'أنا في VLAN 20، لا يمكنني سماع بث المالية نهائياً!',
        initialSpeechEn: 'I am in VLAN 20, I can never hear Finance broadcast traffic!',
        carryingItem: 'ملفات التوظيف (HR Folder)',
        carryingItemEn: 'HR Recruitment Folder'
      },
      {
        id: 'char-finance-db',
        nameAr: 'خادم قاعدة بيانات المالية (Server Floor)',
        nameEn: 'Finance Database Server (Target)',
        roleAr: 'الخادم النهائي المحمي داخل VLAN 10',
        roleEn: 'Final secure server located in VLAN 10',
        avatarRole: 'chef',
        ipAddress: '10.10.10.100',
        macAddress: 'DD:10:DD:10:DD:10',
        xPosition: 88,
        yPosition: 35,
        initialSpeech: 'أستلم فقط المعاملات التي تحمل ختم VLAN 10 الأصلي.',
        initialSpeechEn: 'I only accept transactions carrying the original VLAN 10 stamp.',
        carryingItem: 'سجلات الميزانية العامة',
        carryingItemEn: 'General Ledger Budget Database'
      }
    ] as any[],
    steps: [
      {
        stepNumber: 1,
        titleAr: '1. انطلاق الإطار غير الموسوم من منفذ الـ Access (Standard Untagged Frame)',
        titleEn: '1. Access Port Ingress (Standard Untagged Frame)',
        storyNarrativeAr: 'يقوم سعيد بطباعة كشف الرواتب ويسلمه لمكتب الطابق. كرت الشبكة الخاص بسعيد لا يعرف شيئاً عن الـ VLANs ويرسل إطار إيثرنت عادي غير موسوم.',
        storyNarrativeEn: 'Saeed prints the payroll sheet and submits it to the floor office. Saeed\'s NIC is completely unaware of VLANs and sends a standard untagged Ethernet frame.',
        technicalAnalogyAr: 'منفذ السويتش المضبوب كـ Access Port في VLAN 10 يستقبل الإطار ويضيف إليه منطقياً معرف VLAN 10 في جدول العناوين الداخلي.',
        technicalAnalogyEn: 'A switch port configured as an Access Port in VLAN 10 receives the frame and logically associates it with VLAN 10 in its internal CAM table.',
        ciscoProtocolTerm: 'Access Port Ingress (Switchport Mode Access)',
        ciscoCommandSnippet: 'Switch-A(config-if)# switchport mode access\nSwitch-A(config-if)# switchport access vlan 10',
        activeCharacterId: 'char-finance-clerk',
        fromCharacterId: 'char-finance-clerk',
        toCharacterId: 'char-elevator-trunk',
        payloadType: 'Standard Ethernet Frame (Untagged)',
        payloadContentAr: 'Eth II | Src: AA:10:AA:10:AA:10 | Dst: DD:10:DD:10:DD:10 | Data: Payroll',
        payloadContentEn: 'Eth II | Src: AA:10:AA:10:AA:10 | Dst: DD:10:DD:10:DD:10 | Data: Payroll',
        l2Src: 'AA:10:AA:10:AA:10',
        l2Dest: 'DD:10:DD:10:DD:10',
        l3Src: '10.10.10.50',
        l3Dest: '10.10.10.100',
        ttlRemaining: 64,
        packetPositionPercent: 32,
        speechBubbles: {
          'char-finance-clerk': 'أرسلت بيانات الرواتب إلى السويتش عبر منفذي المخصص.',
          'char-elevator-trunk': 'وصل الإطار عبر منفذ Access ينتمي لـ VLAN 10.'
        },
        speechBubblesEn: {
          'char-finance-clerk': 'I sent the payroll data to the switch via my dedicated access port.',
          'char-elevator-trunk': 'Frame received on an Access Port belonging to VLAN 10.'
        },
        highlightedEventAr: 'استقبل الإطار على منفذ Access وإلحاقه بالـ VLAN المخصصة',
        highlightedEventEn: 'Receiving untagged frame on Access port and assigning to VLAN 10'
      },
      {
        stepNumber: 2,
        titleAr: '2. حقن وسم 802.1Q والعبور في المصعد المشترك (802.1Q Tag Injection on Trunk)',
        titleEn: '2. Trunk 802.1Q Tag Injection',
        storyNarrativeAr: 'يريد الظرف الانتقال إلى السويتش الموجود في مبنى الخوادم عبر الكابل الرئيسي. يقوم حارس المصعد بلصق وسم أزرق بوزن 4 بايت مكتوب عليه: (TPID: 0x8100, VLAN ID: 10). مريم التي تنتظر في الطابق لا تستطيع لمس الظرف لأن بطاقتها بنفسجية.',
        storyNarrativeEn: 'The envelope needs to travel to the server building switch across the backbone link. The elevator attendant injects a 4-byte blue tag reading: (TPID: 0x8100, VLAN ID: 10). Maryam waiting on the floor cannot touch the envelope because she holds a purple badge.',
        technicalAnalogyAr: 'يقوم السويتش بإضافة وسم 802.1Q Tag مكون من 4 بايت: 16 بت للـ TPID و 3 بتات لأولوية CoS و 12 بت لمعرف الـ VLAN ID.',
        technicalAnalogyEn: 'The switch injects a 4-byte 802.1Q Tag: 16 bits for TPID, 3 bits for Class of Service (CoS), and 12 bits for VLAN ID (VID).',
        ciscoProtocolTerm: '802.1Q Trunk Encapsulation',
        ciscoCommandSnippet: 'Switch-A(config-if)# switchport trunk encapsulation dot1q\nSwitch-A(config-if)# switchport mode trunk\nSwitch-A(config-if)# switchport trunk allowed vlan 10,20',
        activeCharacterId: 'char-elevator-trunk',
        fromCharacterId: 'char-elevator-trunk',
        toCharacterId: 'char-finance-db',
        payloadType: '802.1Q Tagged Frame (0x8100 + VID 10)',
        payloadContentAr: 'Eth II | 802.1Q: VID 10, CoS 5 | Payload: Payroll Data',
        payloadContentEn: 'Eth II | 802.1Q: VID 10, CoS 5 | Payload: Payroll Data',
        l2Src: 'AA:10:AA:10:AA:10',
        l2Dest: 'DD:10:DD:10:DD:10',
        l3Src: '10.10.10.50',
        l3Dest: '10.10.10.100',
        ttlRemaining: 64,
        packetPositionPercent: 68,
        speechBubbles: {
          'char-elevator-trunk': 'سأضع ختم VLAN 10 قبل النقل!',
          'char-hr-clerk': 'لا يمكنني لمس الإطار لأنه ليس في VLAN 20 الخاصة بي.'
        },
        speechBubblesEn: {
          'char-elevator-trunk': 'Stamping with VLAN 10 tag before transmitting on the trunk link!',
          'char-hr-clerk': 'I cannot inspect this frame as it is completely isolated from my VLAN 20.'
        },
        highlightedEventAr: 'إضافة ترويسة 802.1Q ذات الـ 4 بايت وإرسالها عبر منفذ الـ Trunk',
        highlightedEventEn: 'Injecting 4-byte 802.1Q tag header and sending over the Trunk port'
      }
    ] as any[]
  }
};

// Generic translator utility that falls back to a clever translation algorithm if no static translation is defined
export function getLocalizedStory(story: HumanNetworkStory, lang: Language): HumanNetworkStory {
  if (lang === 'ar') {
    return story;
  }

  const stripArabic = (text?: string, fallback = '') => {
    if (!text) return fallback;
    // If text is mostly Arabic, prefer fallback
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    if (arabicChars > text.length * 0.3) return fallback || text.replace(/[\u0600-\u06FF\u0750-\u077F]+/g, '').trim() || fallback;
    return text;
  };

  const ensureEn = (en?: string, ar?: string, fallback = '') => {
    if (en && stripArabic(en, '') === en && en.trim()) return en;
    return stripArabic(ar, fallback) || fallback;
  };

  // Check if we have a robust pre-defined static translation
  const staticTrans = STATIC_STORIES_TRANSLATIONS[story.id];
  if (staticTrans) {
    // Merge top-level and complex child objects
    const translatedStory = {
      ...story,
      titleEn: staticTrans.titleEn || story.titleEn || story.titleAr,
      subtitleEn: staticTrans.subtitleEn || story.subtitleEn || story.subtitleAr,
      difficultyEn: staticTrans.difficultyEn || story.difficultyEn || 'Intermediate',
      storySummaryEn: staticTrans.storySummaryEn || story.storySummaryEn || `Real-life metaphor for ${story.protocolBadge}.`,
      realWorldScenarioDescriptionEn:
        staticTrans.realWorldScenarioDescriptionEn ||
        story.realWorldScenarioDescriptionEn ||
        `This scenario models the ${story.protocolBadge} process as an everyday human story.`,
      ciscoCoreLessonEn:
        staticTrans.ciscoCoreLessonEn ||
        story.ciscoCoreLessonEn ||
        `Cisco rule: Layer 2 MAC delivery is hop-by-hop; Layer 3 IP path is end-to-end.`,
    };

    if (staticTrans.characters) {
      translatedStory.characters = story.characters.map(char => {
        const transChar = staticTrans.characters?.find(c => c.id === char.id);
        if (transChar) {
          return {
            ...char,
            nameEn: transChar.nameEn || ensureEn(char.nameEn, char.nameAr, char.id),
            roleEn: transChar.roleEn || ensureEn(char.roleEn, char.roleAr, 'Network node'),
            initialSpeechEn: transChar.initialSpeechEn || ensureEn(char.initialSpeechEn, char.initialSpeech, 'Ready for the next step.'),
            carryingItemEn: transChar.carryingItemEn || ensureEn(char.carryingItemEn, char.carryingItem, 'Packet data'),
          };
        }
        return {
          ...char,
          nameEn: ensureEn(char.nameEn, char.nameAr, char.id),
          roleEn: ensureEn(char.roleEn, char.roleAr, 'Network node'),
          initialSpeechEn: ensureEn(char.initialSpeechEn, char.initialSpeech, 'Ready for the next step.'),
          carryingItemEn: ensureEn(char.carryingItemEn, char.carryingItem, 'Packet data'),
        };
      });
    } else {
      translatedStory.characters = story.characters.map(char => ({
        ...char,
        nameEn: ensureEn(char.nameEn, char.nameAr, char.id),
        roleEn: ensureEn(char.roleEn, char.roleAr, 'Network node'),
        initialSpeechEn: ensureEn(char.initialSpeechEn, char.initialSpeech, 'Ready for the next step.'),
        carryingItemEn: ensureEn(char.carryingItemEn, char.carryingItem, 'Packet data'),
      }));
    }

    if (staticTrans.steps) {
      translatedStory.steps = story.steps.map(step => {
        const transStep = staticTrans.steps?.find(s => s.stepNumber === step.stepNumber);
        if (transStep) {
          return {
            ...step,
            titleEn: transStep.titleEn || ensureEn(step.titleEn, step.titleAr, `Step ${step.stepNumber}`),
            storyNarrativeEn: transStep.storyNarrativeEn || ensureEn(step.storyNarrativeEn, undefined, `Traffic moves from ${step.fromCharacterId} to ${step.toCharacterId}.`),
            technicalAnalogyEn: transStep.technicalAnalogyEn || ensureEn(step.technicalAnalogyEn, undefined, `${step.payloadType} encapsulation in progress.`),
            highlightedEventEn: transStep.highlightedEventEn || ensureEn(step.highlightedEventEn, undefined, `Forwarding ${step.payloadType}.`),
            payloadContentEn: transStep.payloadContentEn || ensureEn(step.payloadContentEn, undefined, step.payloadType),
            speechBubblesEn: transStep.speechBubblesEn || Object.fromEntries(
              Object.entries(step.speechBubbles || {}).map(([id, speech]) => [
                id,
                ensureEn(undefined, speech, `Active under ${story.protocolBadge}.`),
              ])
            ),
          };
        }
        return {
          ...step,
          titleEn: ensureEn(step.titleEn, step.titleAr, `Step ${step.stepNumber}`),
          storyNarrativeEn: ensureEn(step.storyNarrativeEn, undefined, `Traffic moves from ${step.fromCharacterId} to ${step.toCharacterId}.`),
          technicalAnalogyEn: ensureEn(step.technicalAnalogyEn, undefined, `${step.payloadType} encapsulation in progress.`),
          highlightedEventEn: ensureEn(step.highlightedEventEn, undefined, `Forwarding ${step.payloadType}.`),
          payloadContentEn: ensureEn(step.payloadContentEn, undefined, step.payloadType),
          speechBubblesEn: Object.fromEntries(
            Object.entries(step.speechBubbles || {}).map(([id, speech]) => [
              id,
              ensureEn(undefined, speech, `Active under ${story.protocolBadge}.`),
            ])
          ),
        };
      });
    } else {
      translatedStory.steps = story.steps.map(step => ({
        ...step,
        titleEn: ensureEn(step.titleEn, step.titleAr, `Step ${step.stepNumber}`),
        storyNarrativeEn: ensureEn(step.storyNarrativeEn, undefined, `Traffic moves from ${step.fromCharacterId} to ${step.toCharacterId}.`),
        technicalAnalogyEn: ensureEn(step.technicalAnalogyEn, undefined, `${step.payloadType} encapsulation in progress.`),
        highlightedEventEn: ensureEn(step.highlightedEventEn, undefined, `Forwarding ${step.payloadType}.`),
        payloadContentEn: ensureEn(step.payloadContentEn, undefined, step.payloadType),
        speechBubblesEn: Object.fromEntries(
          Object.entries(step.speechBubbles || {}).map(([id, speech]) => [
            id,
            ensureEn(undefined, speech, `Active under ${story.protocolBadge}.`),
          ])
        ),
      }));
    }

    return translatedStory as HumanNetworkStory;
  }

  // Smart algorithmic dynamic fallback for stories that are not explicitly pre-translated
  const cleanTitle = ensureEn(
    story.titleEn,
    story.titleAr,
    `Network story: ${story.protocolBadge}`
  );

  const cleanDifficulty = story.difficulty.includes('Beginner') || story.difficulty.includes('مبتدئ')
    ? 'Beginner'
    : story.difficulty.includes('Intermediate') || story.difficulty.includes('متوسط')
    ? 'Intermediate'
    : story.difficulty.includes('Advanced') || story.difficulty.includes('متقدم')
    ? 'Advanced'
    : 'Expert';

  const translatedStory = {
    ...story,
    titleEn: cleanTitle,
    subtitleEn: ensureEn(story.subtitleEn, undefined, `Analogous lesson on ${story.protocolBadge}`),
    difficultyEn: cleanDifficulty,
    storySummaryEn: ensureEn(story.storySummaryEn, undefined, `Real-life metaphor showing how ${story.protocolBadge} works in a physical environment.`),
    realWorldScenarioDescriptionEn: ensureEn(story.realWorldScenarioDescriptionEn, undefined, `This scenario models the ${story.protocolBadge} network process into an everyday human scenario.`),
    ciscoCoreLessonEn: ensureEn(story.ciscoCoreLessonEn, undefined, `Cisco certification rule: Local Layer 2 MAC delivery combined with logical Layer 3 IP path routing.`),
  };

  translatedStory.characters = story.characters.map(char => {
    const nameEn = ensureEn(
      char.nameEn,
      char.nameAr,
      char.id
    );
    return {
      ...char,
      nameEn,
      roleEn: ensureEn(char.roleEn, undefined, `Network node at ${char.ipAddress ? 'Layer 3' : 'Layer 2'}`),
      initialSpeechEn: ensureEn(char.initialSpeechEn, undefined, `Ready for the ${story.protocolBadge} simulation.`),
      carryingItemEn: ensureEn(char.carryingItemEn, undefined, 'Packet data'),
    };
  });

  translatedStory.steps = story.steps.map(step => {
    const titleEn = ensureEn(step.titleEn, step.titleAr, `Step ${step.stepNumber}`);

    const speechBubblesEn: Record<string, string> = {};
    if (step.speechBubbles) {
      for (const [charId, speech] of Object.entries(step.speechBubbles)) {
        speechBubblesEn[charId] = ensureEn(undefined, speech, `Active communication under ${story.protocolBadge}.`);
      }
    }

    return {
      ...step,
      titleEn,
      storyNarrativeEn: ensureEn(step.storyNarrativeEn, undefined, `Packet flows from hop ${step.fromCharacterId} to ${step.toCharacterId}.`),
      technicalAnalogyEn: ensureEn(step.technicalAnalogyEn, undefined, `Encapsulated ${step.payloadType} transmission under Cisco protocol logic.`),
      highlightedEventEn: ensureEn(step.highlightedEventEn, undefined, `Forwarding ${step.payloadType} frame.`),
      payloadContentEn: ensureEn(step.payloadContentEn, undefined, step.payloadType),
      speechBubblesEn,
    };
  });

  return translatedStory as any;
}
