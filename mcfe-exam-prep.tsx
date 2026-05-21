import { useState, useCallback } from "react";

const MODULES = [
  "All Modules","Module 1 – Installation & Overview","Module 2 – Evidence Processing & Case Creation",
  "Module 3 – Magnet One","Module 4 – Axiom Examine Interface","Module 5 – Operating System Information",
  "Module 6 – Refined Results","Module 7 – Web Related","Module 8 – Communications",
  "Module 9 – Encryption & Anti-Forensic Tools","Module 10 – Cloud Introduction",
  "Module 11 – Media","Module 12 – Reporting",
];

const MIND_MAPS = [
  { mod:1,title:"Installation & Overview",icon:"⚙️", branches:[
    { label:"Case Files",color:"#0ea5e9",leaves:["Extension: .MFDB (SQL database)","Separate case & evidence files → better IOPS","Temp location: Tools → Settings → Custom Location"] },
    { label:"Processing",color:"#00d4a0",leaves:["Max 32 threads, 1 physical CPU at a time","Best performance gain at 8–12 cores","After 12 cores: clock speed > core count"] },
    { label:"User Guide",color:"#f59e0b",leaves:["Help → Documentation → User Guide","Or press F1 in Axiom Examine","What's New section = review after every update"] },
    { label:"Lewis Case",color:"#a78bfa",leaves:["Subject: Katie Lewis","Role: Account Manager, Tech-Odin Solutions","Suspected: fraud & data theft (fake contracts)"] },
    { label:"Devices",color:"#f87171",leaves:["Windows 11 Laptop (Katie's PC)","Samsung A12 Mobile Phone","SanDisk USB + Integral USB Drive","Cloud Accounts"] },
    { label:"Axiom Suite",color:"#34d399",leaves:["Axiom Process: image + process evidence","Axiom Examine: review, tag, report","Both combined in single platform"] },
  ]},
  { mod:2,title:"Evidence Processing",icon:"🔍", branches:[
    { label:"Evidence Sources",color:"#0ea5e9",leaves:["Computer (Windows, Mac, Linux)","Mobile (iOS, Android)","Cloud (Google, Microsoft, Dropbox)","Remote / Image files"] },
    { label:"Processing Options",color:"#00d4a0",leaves:["Keywords","OCR (text from images)","Hash matching (NSRL, custom)","Date Range Filter","Dynamic App Finder (DAF)","Magnet AI – Chats & Pictures"] },
    { label:"Artifacts",color:"#f59e0b",leaves:["Parsed = structured data extraction","Carved = from unallocated space","Privileged Content: mark/exclude legal material"] },
    { label:"Analyze Evidence",color:"#a78bfa",leaves:["Final review screen before committing","'Ready/Ready to Search' = process","'Ready to Image' = acquire first","Click ANALYZE EVIDENCE to start"] },
    { label:"Publishing",color:"#f87171",leaves:["Magnet Review: cloud collaborative review","Griffeye: media categorization","Griffeye needs: Processing Engine CLI + Org Profile"] },
  ]},
  { mod:3,title:"Magnet One",icon:"🏢", branches:[
    { label:"Purpose",color:"#0ea5e9",leaves:["Centralized forensic lab management","Case & workload management","Asset and license oversight","Integrate additional forensic tools"] },
    { label:"Naming Defaults",color:"#00d4a0",leaves:["Cases: CSE- prefix","Evidence: EVD- prefix","Both customizable via Settings"] },
    { label:"Configuration",color:"#f59e0b",leaves:["Cog icon → top right of dashboard","Tabs: Hardware, Software, Settings, Users","Set org name, date format, naming conventions"] },
    { label:"Dashboard",color:"#a78bfa",leaves:["Shows all open cases","Recent events: processing, assignments, additions","Real-time case information updates"] },
  ]},
  { mod:4,title:"Axiom Examine Interface",icon:"🖥️", branches:[
    { label:"Filters Bar",color:"#0ea5e9",leaves:["Turns YELLOW when any filter is active","Filtered criteria shown in bold","Absolute Date/Time: exact range","Relative Date/Time: around a moment","Save & share filters across cases"] },
    { label:"Mobile View",color:"#00d4a0",leaves:["Requires Axiom 8.0+","iOS: AFU, FFS (Graykey/Verakey), UFED Premium","Android: FFS, AFU, Logical+, UFED Premium","Apps NOT in original device order","WhatsApp → auto-launches Conversation View"] },
    { label:"Case Dashboard",color:"#f59e0b",leaves:["Case Overview","Event Snapshot (timeline of key events)","Evidence Sources","Insights – Potential Cloud Evidence Leads"] },
    { label:"Explorers",color:"#a78bfa",leaves:["Artifact Explorer (main view)","File System Explorer","Registry Explorer","Email Explorer","Timeline / Connections / Media Explorers"] },
  ]},
  { mod:5,title:"OS Information",icon:"🪟", branches:[
    { label:"Registry Hives",color:"#0ea5e9",leaves:["SAM – User accounts, passwords","SOFTWARE – OS version, installed programs","SYSTEM – Shutdown time, timezone","NTUSER.DAT – Per-user settings","UsrClass.dat – File associations"] },
    { label:"OS Info Key",color:"#00d4a0",leaves:["Key: SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion","Parses: version, build number, install date, registered owner","Build 1803: Windows Timeline feature added","OS Pro = potential BitLocker"] },
    { label:"Shutdown Time",color:"#f59e0b",leaves:["Value: ShutdownTime","Hive: SYSTEM → ControlSet###\\Control\\Windows","Format: 8-byte Windows 64-bit Little Endian","Decoded via DECODE card in Registry Explorer"] },
    { label:"User Accounts",color:"#a78bfa",leaves:["Source: SAM + SOFTWARE hives","Contains: SID, RID, login dates, password info","Win Vista+: deleted account recovery from registry = highly unlikely","Win XP: recovery was feasible"] },
    { label:"Prefetch",color:"#f87171",leaves:["Location: Windows\\Prefetch","Naming: APPNAME.HASH.pf","Max entries: XP=126 | Vista/7/8=129 | Win10/11=1024","Win10+ compressed: XPRESS HUFFMAN (MAM)","After max reached: keeps 32, deletes rest"] },
    { label:"USB Devices",color:"#34d399",leaves:["Category: CONNECTED DEVICES → USB Devices","Sources: SOFTWARE/SYSTEM, setupapi.dev.log, NTUSER.DAT, Event Logs","Captures: first connection time, drive letter, user profile"] },
  ]},
  { mod:6,title:"Refined Results",icon:"🔎", branches:[
    { label:"Locally Accessed",color:"#0ea5e9",leaves:["Source: WebCacheV01.dat","Also contains IE10+ and Edge browsing history","Stored in AppData → identifies Windows user","':Host:' entries = Windows path variables"] },
    { label:"Identifiers",color:"#00d4a0",leaves:["People: email, chat accounts, screen names, web forms","Device: info about devices attached to computer","Both under REFINED RESULTS category"] },
    { label:"Rebuilt Desktop",color:"#f59e0b",leaves:["Windows 10 ONLY","Reads NTUSER.dat + SYSTEM + SOFTWARE hives","Shows: wallpaper, Quick Launch, Desktop shortcuts","Icons NOT in exact original positions"] },
    { label:"Route View",color:"#a78bfa",leaves:["Max 2 hours of recording","Export: video → 'Export' folder in case directory","Supports DJI Log Files for drone flight paths"] },
    { label:"Search Artifacts",color:"#f87171",leaves:["Google Searches: extracted search terms","Parsed Search Queries: structured browser search terms","Cloud Services URLs: identifies cloud-related URLs"] },
  ]},
  { mod:7,title:"Web Related",icon:"🌐", branches:[
    { label:"Chrome Cache",color:"#0ea5e9",leaves:["Path: AppData\\Local\\Google\\Chrome\\User Data\\Default\\","Sub-folders: Cache | GPUCache | Media Cache","Content and metadata stored as SEPARATE components","Each folder: 1 index + 4 block files (data_0 to data_3)"] },
    { label:"Firefox Cache",color:"#00d4a0",leaves:["Path: AppData\\LOCAL (NOT Roaming)","Metadata APPENDED to end of cached file","Content Size ≠ file size on disk","Subfolders: entries (cached) + doomed (expired)"] },
    { label:"Bookmarks",color:"#f59e0b",leaves:["Firefox: places.sqlite (moz_places + moz_bookmarks)","Firefox file: in Roaming profile","Chrome: Chrome History file","Both: URL, Added Date/Time, Name, Parent"] },
    { label:"Timeline Explorer",color:"#a78bfa",leaves:["View all activity around a specific time","Built manually or auto-build on new evidence","Helps establish event sequences"] },
    { label:"SQLite Viewer",color:"#f87171",leaves:["Built into Axiom Examine","Used for browser artifact databases","Supports Chromium-based browsers (Chrome, Edge)"] },
  ]},
  { mod:8,title:"Communications",icon:"💬", branches:[
    { label:"Email Explorer",color:"#0ea5e9",leaves:["Participants filter: CASE SENSITIVE","Filter by Sender AND Recipient simultaneously","Switch via Explorer dropdown menu"] },
    { label:"Attachments",color:"#00d4a0",leaves:["Email Attachments artifact = ALL attachments in one place","Includes: Subject, Sender, Recipient","'Original Artifact' link → jumps to source email","Attachments also appear in Documents/Media categories"] },
    { label:"Email Export",color:"#f59e0b",leaves:["Export format: PST","Allows review in external PST viewer"] },
    { label:"Translation",color:"#a78bfa",leaves:["Module: Magnet Models","Download from Customer Support Portal","Right-click → Translate Selected Text","Multiple languages supported"] },
    { label:"Compound Files",color:"#f87171",leaves:[".OST = Outlook Offline Storage Table","Preview card may be blank for compound files","Use TEXT AND HEX card → TEXT view","Source link → File System Explorer"] },
    { label:"Conversation View",color:"#34d399",leaves:["Threaded, human-readable format","Auto-applied for WhatsApp in Mobile View","Reflects how conversation appeared to the user"] },
  ]},
  { mod:9,title:"Encryption & Anti-Forensics",icon:"🔐", branches:[
    { label:"Add Evidence",color:"#0ea5e9",leaves:["From Examine: Process → Add new evidence to case","Available while case is open","Updates Scanned By info + adds new source"] },
    { label:"BitLocker",color:"#00d4a0",leaves:["Encrypted drive = padlock icon in Axiom Process","Encryption type auto-identified","Find Recovery Key via BitLocker Recovery Key artifact","Enter key in Axiom Process to unlock","NEXT button grayed out until valid key entered"] },
    { label:"Post-Decryption",color:"#f59e0b",leaves:["Auto-builds: Timeline, Connections, World Map","Requires 'auto-build' setting enabled OR manual build","'Processing complete' → click OK to reload case"] },
    { label:"Connections",color:"#a78bfa",leaves:["Answers: WHO WHAT WHEN WHERE WHY HOW","Displays artifact relationships as network diagram","Auto-rebuild: Tools → Settings → Connections","Manual: Tools → Build Connections"] },
  ]},
  { mod:10,title:"Cloud Introduction",icon:"☁️", branches:[
    { label:"OneDrive",color:"#0ea5e9",leaves:["Local 'OneDrive' artifact: from .ini file in AppData","'Cloud OneDrive Files': acquired from cloud via Axiom Cloud","Cloud version: may have files NOT stored locally","Cloud version: shows file sharing info","File hash confirms identical files across locations"] },
    { label:"Dropbox",color:"#00d4a0",leaves:["Artifact: Cloud Dropbox Files","Includes: File ID, File Version ID","Server + client last modified timestamps","Original photo timestamp if present","Content preview"] },
    { label:"Passwords/Tokens",color:"#f59e0b",leaves:["Category: Cloud Accounts Information","Password field = TOKEN content","People reuse passwords → try against encrypted files","Useful for future cloud re-acquisition"] },
    { label:"Insights",color:"#a78bfa",leaves:["Feature: Insights – Potential Cloud Evidence Leads","Found on Case Dashboard","Surfaces cloud indicators from local device artifacts","Helps identify accounts worth acquiring"] },
    { label:"Google Cloud",color:"#f87171",leaves:["Google artifacts = very broad/useful","Acquired via Axiom Cloud","Contains: Drive files, Gmail, activity, location history"] },
  ]},
  { mod:11,title:"Media",icon:"🎬", branches:[
    { label:"Hit Stacking",color:"#0ea5e9",leaves:["Groups media with same MD5/SHA1 hash into 1 stack","Tag/grade one = applies to ALL copies","Stack icon shown in thumbnail bottom-right","Click stack icon → see all copies + sources"] },
    { label:"Quick Preview",color:"#00d4a0",leaves:["Hover over image → pan and zoom with mouse","Hover over video → drag mouse L→R to scrub","Scrub through entire video without full playback","Blocked/blurred media = no preview"] },
    { label:"Filter Groups",color:"#f59e0b",leaves:["INVESTIGATION LEADS: creation dates, geolocation, social media source","CAMERA DETAILS: EXIF → originating device","VICS ATTRIBUTES: Project VIC hash set matches","MEDIA ATTRIBUTES: size, skin tone percentage","VIDEO ATTRIBUTES: length, format, carving size","FILE ATTRIBUTES: deleted, EXIF status, recovery method"] },
    { label:"Media Explorer",color:"#a78bfa",leaves:["Must be built (or auto-build on case open)","Group by: creation date, evidence source, file extension, modified","Default: images stacked by hash value","CBIR and OCR on images supported"] },
    { label:"Related Artifacts",color:"#f87171",leaves:["Details pane shows Related Artifacts card","Right-click image → View Related Artifacts","Links media to other artifacts in case"] },
  ]},
  { mod:12,title:"Reporting",icon:"📋", branches:[
    { label:"MCFE Exam",color:"#0ea5e9",leaves:["75 questions | 120 minutes","Passing score: 80% or higher","Valid: 2 years from completion","Download + process evidence BEFORE timer starts"] },
    { label:"Attempt Rules",color:"#00d4a0",leaves:["Fail 1st → immediate 2nd attempt","Fail 2nd → 60-day lockout","Then retry after 60 days"] },
    { label:"Qualifying Courses",color:"#f59e0b",leaves:["AX200 (this course)","CY200","BCERT (offered at NCFI)","Eligible custom courses combining AX200 core content"] },
    { label:"Reporting in Axiom",color:"#a78bfa",leaves:["Export from Artifact View (multiple formats)","Case Reporting → Final Report","Email export: PST format","Timestamps: millisecond precision (3 decimal places)","Portable Cases: share a subset of artifacts"] },
    { label:"Tagging",color:"#f87171",leaves:["Tags applied via TAGS, PROFILES & MEDIA CATEGORIES pane","Tags shareable across cases","Grading in a hit stack → all copies updated","Profiles group related artifacts for reporting"] },
  ]},
];

const MODULE_SUMMARIES = [
  { mod:1,title:"Installation & Overview",icon:"⚙️",points:[
    "Axiom case files use .MFDB extension (SQL databases)",
    "Axiom Process: up to 32 threads; uses 1 physical CPU at a time",
    "Max performance gain at 8–12 cores; after that, clock speed matters more",
    "Temp file location: Tools → Settings → Custom Location (separate disk = faster)",
    "User Guide / What's New: Help → Documentation → User Guide OR F1 key",
    "Lewis Case: Katie Lewis, Account Manager, Tech-Odin Solutions — fraud & data theft",
    "Devices: Windows 11 Laptop, Samsung A12, SanDisk USB, Integral USB, Cloud Accounts",
  ]},
  { mod:2,title:"Evidence Processing & Case Creation",icon:"🔍",points:[
    "Evidence Sources: Computer (Windows/Mac/Linux), Mobile (iOS/Android), Cloud, Remote",
    "Processing options: Keywords, OCR, Hash matching, Magnet AI, Date Range Filter, DAF",
    "Artifacts = Parsed (structured data) vs. Carved (recovered from unallocated space)",
    "Publish to Magnet Review: cloud-based collaborative review platform",
    "Publish to Griffeye: requires Griffeye Processing Engine CLI + Organizational profile",
    "Analyze Evidence screen = final review before clicking ANALYZE EVIDENCE",
    "Status: 'Ready/Ready to Search' (process) or 'Ready to Image' (acquire)",
  ]},
  { mod:3,title:"Magnet One",icon:"🏢",points:[
    "Magnet One: centralized forensic lab management platform",
    "Features: case/workload management, centralized storage, asset & license oversight",
    "Default case prefix: CSE- | Default evidence prefix: EVD- (both customizable)",
    "Configuration: cog icon (top right) → Hardware, Software, Settings, Users tabs",
    "Dashboard shows: open cases, recent events (processing, assignments, additions)",
  ]},
  { mod:4,title:"Axiom Examine Interface",icon:"🖥️",points:[
    "Active filter = Filters bar turns YELLOW; filtered criteria shown in bold",
    "Date filter types: Absolute Date/Time (exact range) vs. Relative Date/Time (around a moment)",
    "Saved filters: shareable across cases; reappear every time Axiom is used",
    "Mobile View: Axiom 8.0+; iOS (AFU/FFS via Graykey/Verakey, UFED Premium) and Android",
    "Apps NOT shown in device order in Mobile View",
    "WhatsApp → auto-launches Conversation View with 'Use preferred view for app'",
    "Case Dashboard: Case Overview, Event Snapshot, Evidence Sources, Insights",
  ]},
  { mod:5,title:"Operating System Information",icon:"🪟",points:[
    "OS Info from: SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion",
    "Last Shutdown: ShutdownTime in SYSTEM hive → ControlSet###\\Control\\Windows (8-byte LE timestamp)",
    "User Accounts: SAM + SOFTWARE hives — includes SID, RID, login dates, password info",
    "Win Vista+: recovery of deleted accounts from registry unallocated space is highly unlikely",
    "Prefetch: Windows\\Prefetch | Max: XP=126, Vista/7/8=129, Win10/11=1024",
    "Prefetch naming: APPNAME.HASH.pf | Win10+ compressed with XPRESS HUFFMAN (MAM)",
    "USB tracking: CONNECTED DEVICES → USB Devices (multiple source files)",
    "Android Accounts: parsed from accounts_de.db",
  ]},
  { mod:6,title:"Refined Results",icon:"🔎",points:[
    "Locally Accessed Files/Folders: from WebCacheV01.dat (also contains IE10+ and Edge history)",
    "Identifiers – People: email addresses, chat accounts, screen names, doc metadata, web forms",
    "Identifiers – Device: info identifying devices that may have been attached",
    "Rebuilt Desktops (Windows): available for Windows 10 only; reads NTUSER.dat + SYSTEM/SOFTWARE",
    "Route View: max 2-hour recording; exported to 'Export' folder in case directory",
  ]},
  { mod:7,title:"Web Related",icon:"🌐",points:[
    "Chrome cache: AppData\\Local\\Google\\Chrome\\User Data\\Default\\{Cache, GPUCache, Media Cache}",
    "Chrome: content and metadata stored as SEPARATE components in cache",
    "Firefox cache: AppData\\LOCAL (NOT Roaming)\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\",
    "Firefox: appends metadata TO END of cached file (unlike Chrome)",
    "Firefox bookmarks: places.sqlite — tables: moz_places + moz_bookmarks (Roaming profile)",
    "Timeline Explorer: streamline/view all activity around a specific point in time",
  ]},
  { mod:8,title:"Communications",icon:"💬",points:[
    "Email Explorer Participants filter: CASE SENSITIVE",
    "Email Attachments artifact: ALL attachments from ALL email artifacts in one place",
    "Email can be exported as PST format for external review",
    "Translation module: part of Magnet Models; right-click → Translate Selected Text",
    "Conversation View: threaded, human-readable messaging format",
    ".OST files: compound files — preview card may be blank; use TEXT AND HEX card",
  ]},
  { mod:9,title:"Encryption & Anti-Forensic Tools",icon:"🔐",points:[
    "Add new evidence from Examine: Process → Add new evidence to case",
    "Encrypted drives shown with padlock icon in Axiom Process",
    "BitLocker: find Recovery Key via BitLocker Recovery Key artifact in Axiom Examine",
    "After decryption: auto-builds Timeline, Connections, World Map (if pre-configured)",
    "Connections explorer: answers Who, What, When, Where, Why, How",
    "Connections auto-rebuild: Tools → Settings → Connections → enable option",
  ]},
  { mod:10,title:"Cloud Introduction",icon:"☁️",points:[
    "Axiom Cloud acquires data from cloud services (Google, Microsoft 365, Dropbox, etc.)",
    "OneDrive local artifact: files in local OneDrive folder (from AppData .ini file)",
    "Cloud OneDrive Files: acquired from cloud — may have files not stored locally + sharing info",
    "Cloud Dropbox Files: includes File ID, Version ID, server/client timestamps, preview",
    "Passwords/Tokens category: people reuse passwords — check against encrypted files",
    "Insights – Potential Cloud Evidence Leads: surfaces cloud account indicators from local artifacts",
    "File hash confirms identical files across cloud, local drive, and USB",
  ]},
  { mod:11,title:"Media",icon:"🎬",points:[
    "Media Explorer: must be built manually or auto-build on case open",
    "Hit Stacking: groups identical files (same MD5/SHA1) — tag applies to ALL copies",
    "Quick Media Preview: hover to preview; for video, move mouse L→R to scrub",
    "Filter groups: Investigation Leads, Camera Details, VICS Attributes, Media/Video/File Attributes",
    "CAMERA DETAILS: uses EXIF metadata to identify originating device",
    "VICS ATTRIBUTES: Project VIC hash set matches for known media",
  ]},
  { mod:12,title:"Reporting",icon:"📋",points:[
    "MCFE exam: 75 questions, 120 minutes, passing score = 80%+",
    "MCFE certification valid: 2 years from completion date",
    "Fail once: immediate 2nd attempt; fail twice: 60-day lockout",
    "Qualifying courses: AX200, CY200, BCERT (NCFI), or eligible custom courses",
    "Axiom timestamps: millisecond precision (3 decimal places)",
  ]},
];

const ALL_QUESTIONS = [
  {id:1,module:1,q:"What file extension does Magnet Axiom use for its case files?",options:[".AXCASE",".MFDB",".AXIOM",".CASE"],answer:1,explanation:"Axiom case files use the .MFDB extension and are SQL databases. Separating case and evidence files on different physical media improves I/O performance."},
  {id:2,module:1,q:"How do you access the 'What's New' section in Magnet Axiom?",options:["Settings → About → What's New","Help → Documentation → User Guide, or press F1 in Axiom Examine","Tools → Update → Changelog","File → New → What's New"],answer:1,explanation:"The User Guide (including What's New) is accessed via Help → Documentation → User Guide, or by pressing F1 in Axiom Examine."},
  {id:3,module:1,q:"What is the maximum number of processing threads Axiom Process can create?",options:["16","24","32","64"],answer:2,explanation:"Axiom Process creates up to 32 threads (one per core) but uses only one physical CPU at a time. Drastic performance gains are seen up to 8–12 cores; beyond 12, clock speed matters more."},
  {id:4,module:1,q:"How is the temporary file location changed in Axiom Process?",options:["Edit → Preferences → Temp Location","File → Properties → Storage","Tools → Settings, then select Custom Location","View → Options → File Paths"],answer:2,explanation:"The temp file location is changed via Tools → Settings by selecting 'Custom Location.' A separate physical disk significantly improves processing speed."},
  {id:5,module:1,q:"The Lewis Case Scenario involves investigating which suspect?",options:["Michael Jones, a Finance Director","Katie Lewis, an Account Manager at Tech-Odin Solutions","Sarah Lewis, an IT Administrator","Karen Lewis, a Sales Representative"],answer:1,explanation:"The Lewis Case centers on Katie Lewis, Account Manager at Tech-Odin Solutions, suspected of fraud and data theft involving fake contracts and financial discrepancies."},
  {id:6,module:2,q:"When the Filters bar is active in Axiom Examine, what color does it turn?",options:["Red","Orange","Yellow","Blue"],answer:2,explanation:"When any filter is applied, the Filters bar turns YELLOW to alert the examiner that not all artifacts are in view. The filtered criteria are displayed in bold."},
  {id:7,module:2,q:"What are the two types of Date/Time filters in the Axiom Examine Filters bar?",options:["Fixed Range and Rolling Range","Absolute Date/Time and Relative Date/Time","Static and Dynamic Date filters","Specific Date and Approximate Date"],answer:1,explanation:"Absolute Date/Time sets an exact range. Relative Date/Time shows activity around a specific moment (e.g., 2 minutes before and 10 minutes after a given time)."},
  {id:8,module:2,q:"What does OCR stand for in Magnet Axiom processing?",options:["Optical Content Recovery","Original Characteristic Recording","Optical Character Recognition","Object Classification and Retrieval"],answer:2,explanation:"OCR = Optical Character Recognition. It extracts text from images during processing, enabling keyword searches across image-based content in evidence."},
  {id:9,module:2,q:"Where is the Axiom case temporary file location stored BY DEFAULT?",options:["C:\\Windows\\Temp","The same location as the case file","The evidence file location","A dedicated Magnet Forensics folder"],answer:1,explanation:"By default, Axiom Process uses the case file location as the temp file location. Changing this to a separate physical disk improves processing I/O speed."},
  {id:10,module:2,q:"What does the 'Analyze Evidence' screen show before clicking ANALYZE EVIDENCE?",options:["Keyword search terms","Hash matching configuration","Final review of evidence items and their status (Ready / Ready to Image)","The output report format selector"],answer:2,explanation:"The Analyze Evidence screen is the final review showing evidence items with status 'Ready'/'Ready to Search' (process) or 'Ready to Image' (acquire) before processing begins."},
  {id:11,module:2,q:"When publishing to Magnet Griffeye, what must be installed first?",options:["Griffeye Analysis Engine","Magnet Griffeye Processing Engine CLI","Magnet Media Categorization Engine","AXIOM Media Export Engine"],answer:1,explanation:"The Magnet Griffeye Processing Engine must be installed and an Organizational profile set before export. The profile ensures media is categorized per organizational/jurisdictional categories."},
  {id:12,module:2,q:"What is the difference between a 'Parsed' and a 'Carved' artifact?",options:["Parsed = from mobile; Carved = from computer","Parsed = structured data extraction; Carved = recovered from unallocated space","Parsed = from cloud; Carved = from local storage","Parsed = from registry; Carved = from file system"],answer:1,explanation:"Parsed artifacts come from structured data extraction (SQLite, registry). Carved artifacts are recovered from unallocated space — content deleted but not yet overwritten."},
  {id:13,module:3,q:"What is the default case naming convention prefix in Magnet One?",options:["MF-","CSE-","CASE-","AX-"],answer:1,explanation:"Magnet One defaults to 'CSE-' for cases and 'EVD-' for evidence. Both can be altered to match organizational policy via the Settings configuration tab."},
  {id:14,module:3,q:"What is Magnet One primarily designed for?",options:["Acquiring mobile device evidence","Overall management of a digital forensic lab including centralized storage, case management, and asset oversight","Decrypting BitLocker-protected drives","Generating forensic reports"],answer:1,explanation:"Magnet One is a multi-purpose platform for overall forensic lab management — centralized storage, case/workload management, asset/license oversight, and additional tool integration."},
  {id:15,module:3,q:"In Magnet One, where is the configuration menu accessed?",options:["File → Settings","The cog icon in the top right-hand corner of the dashboard","Edit → Organization Settings","View → Configure"],answer:1,explanation:"Configuration in Magnet One is accessed via the cog icon in the top right of the dashboard, presenting tabs for Hardware, Software, Settings, and Users."},
  {id:16,module:4,q:"Which iOS extraction types are supported for Mobile View in Axiom 8.0+?",options:["iTunes Backup and iCloud Backup only","AFU and FFS (acquired with Graykey or Verakey), and UFED Premium","Logical and Physical extractions only","All iOS extraction types are supported"],answer:1,explanation:"Supported iOS types for Mobile View: AFU (Graykey/Verakey), FFS (Graykey/Verakey), and UFED Premium. Android: FFS, AFU, Logical+, and UFED Premium FFS/AFU."},
  {id:17,module:4,q:"When selecting WhatsApp in Mobile View with 'Use preferred view for app' enabled, what view is applied?",options:["Timeline View","Conversation View","Artifact Explorer View","Map View"],answer:1,explanation:"WhatsApp auto-presents in Conversation View due to the nature of the application when 'Use preferred view for app' is selected."},
  {id:18,module:4,q:"Are applications presented in their original device order in Mobile View?",options:["Yes, always in the exact same order","Only for iOS devices","No — applications are NOT presented in the order they appear on the device","Only if the wallpaper is recovered"],answer:2,explanation:"Applications in Mobile View are NOT presented in their original device order. This is explicitly noted in the course — a common exam trick question."},
  {id:19,module:4,q:"What does saving a filter set in Axiom Examine allow you to do?",options:["Save filters for the current session only","Share complex filter configurations across cases and reapply them in future sessions","Export filter results to CSV","Lock the case from further evidence addition"],answer:1,explanation:"Saved filter sets allow the examiner to name and share complex filter configurations across cases, making them appear every time Axiom is used."},
  {id:20,module:5,q:"From which registry hives does Axiom parse the User Accounts artifact?",options:["NTUSER.DAT and UsrClass.dat only","SAM and SOFTWARE hives","SYSTEM and SECURITY hives","SAM and SECURITY hives"],answer:1,explanation:"User Accounts artifacts are parsed from the SAM and SOFTWARE hives at WINDOWS\\System32\\config, as well as Windows.Old folders, restore points, and volume shadow copies."},
  {id:21,module:5,q:"Where is the Windows Prefetch folder located?",options:["C:\\Users\\AppData\\Local\\Prefetch","C:\\Windows\\Prefetch","C:\\Windows\\System32\\Prefetch","C:\\ProgramData\\Prefetch"],answer:1,explanation:"The Windows Prefetch folder is at Windows\\Prefetch. In Windows 10/11, files are compressed with XPRESS HUFFMAN (MAM algorithm), which Axiom can decompress and parse."},
  {id:22,module:5,q:"What is the maximum number of Prefetch file entries in Windows 10/11?",options:["126","129","512","1024"],answer:3,explanation:"Max Prefetch entries: XP=126, Vista/7/8=129, Win10/11=1024. When max is reached, Windows auto-deletes all but 32 entries."},
  {id:23,module:5,q:"The Prefetch .pf naming convention for AXCRYPT.EXE would be:",options:["AXCRYPT.EXE.pf","AXCRYPT.EB7A4EAC.pf","AXCRYPT.HASH.pf","AXCRYPT_PREFETCH.pf"],answer:1,explanation:"Prefetch naming: Application name + extension + proprietary hash value + .pf. Example: AXCRYPT.EB7A4EAC.pf."},
  {id:24,module:5,q:"What compression algorithm is used for Windows 10 Prefetch files?",options:["LZ4","XPRESS HUFFMAN (MAM format)","DEFLATE","LZMA"],answer:1,explanation:"Windows 10 Prefetch/SuperFetch files are compressed with XPRESS HUFFMAN (MAM format). Axiom understands this and can decompress and parse the data."},
  {id:25,module:5,q:"From which registry key does Axiom parse the OS version, build number, and registered owner?",options:["HKLM\\SYSTEM\\CurrentControlSet\\Control\\Windows","HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion","HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion","HKLM\\SAM\\Domains\\Account"],answer:1,explanation:"Axiom parses OS version, build number, install date, digital product key, installation path, product name, and registered owner from SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion."},
  {id:26,module:5,q:"What registry value stores the last system shutdown time, and in which hive?",options:["LastShutdown in SAM hive","ShutdownTime in SYSTEM hive at ControlSet001\\Control\\Windows","ShutdownDate in SOFTWARE hive","LastBoot in SECURITY hive"],answer:1,explanation:"ShutdownTime is in the SYSTEM hive at ControlSet###\\Control\\Windows. It's an 8-byte Windows 64-bit little endian timestamp that Axiom decodes via the DECODE card."},
  {id:27,module:5,q:"USB device tracking information is stored in which Axiom artifact category?",options:["Operating System → USB History","Connected Devices → USB Devices","File System → Removable Media","Application Usage → Device Connections"],answer:1,explanation:"USB device info is in CONNECTED DEVICES → USB Devices. Sources include SOFTWARE/SYSTEM hives, setupapi.dev.log, pagefile.sys, Windows Event Logs, NTUSER.DAT, restore points."},
  {id:28,module:5,q:"Android Accounts Information is parsed from which database?",options:["system.db","accounts_de.db","contacts2.db","userdata.sqlite"],answer:1,explanation:"Android Accounts Information artifacts are pulled from the accounts_de.db database, listing recovered username and package name for each account."},
  {id:29,module:5,q:"Beginning with which Windows version did recovery of deleted user accounts from registry unallocated space become highly unlikely?",options:["Windows XP SP3","Windows Vista","Windows 7","Windows 8"],answer:1,explanation:"From Windows Vista onward, recovery of deleted accounts from registry unallocated space is highly unlikely due to improvements in Windows registry space management. In XP and earlier, recovery was feasible."},
  {id:30,module:6,q:"The 'Locally Accessed Files and Folders' artifact is extracted from which database?",options:["NTUSER.DAT","WebCacheV01.dat","AppData\\Local\\History.db","thumbcache.db"],answer:1,explanation:"This artifact comes from WebCacheV01.dat, which also contains IE10+ and Edge browsing history. Because it's in AppData, the associated Windows user account can be identified."},
  {id:31,module:6,q:"What does the 'Identifiers – People' category contain?",options:["Device serial numbers and hardware IDs","Email addresses, chat accounts, screen names, device user accounts, document metadata, and web form data","Registry SIDs and user profile paths","IP addresses and MAC addresses only"],answer:1,explanation:"Identifiers – People contains information identifying individuals: email addresses, chat accounts, screen names, device user accounts, document metadata, and web form data."},
  {id:32,module:6,q:"The 'Rebuilt Desktops (Windows)' artifact is available for which Windows version?",options:["Windows 7 and above","Windows 10 only","Windows 8.1 and 10","All Windows versions"],answer:1,explanation:"Rebuilt Desktops is currently only available for Windows 10. It reads NTUSER.dat and SYSTEM/SOFTWARE hives to reconstruct the desktop including wallpaper, Quick Launch icons, and Desktop items."},
  {id:33,module:6,q:"What is the maximum Route recording time in the Route View?",options:["30 minutes","1 hour","2 hours","4 hours"],answer:2,explanation:"Up to two hours of recording are permitted in Route View. During recording, zoom level, map position, playback speed, and timeline position can all be adjusted."},
  {id:34,module:7,q:"Where does Google Chrome store its main browsing cache?",options:["\\AppData\\Roaming\\Google\\Chrome\\Cache\\","\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\","\\ProgramData\\Google\\Chrome\\Cache\\","\\AppData\\Local\\Google\\ChromeCache\\"],answer:1,explanation:"Chrome stores cache in: AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\ (HTML/JS/CSS), \\GPUCache\\ (GPU data), and \\Media Cache\\ (large media). Each folder has 1 index + 4 block files (data_0 to data_3)."},
  {id:35,module:7,q:"Where does Firefox store its browsing cache for the default profile?",options:["AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\","AppData\\Local\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\","ProgramData\\Mozilla\\Firefox\\Cache\\","AppData\\Local\\Mozilla\\Firefox\\Cache\\"],answer:1,explanation:"Firefox cache is in the LOCAL profile (NOT Roaming): AppData\\Local\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\. Contains 'index' file, 'entries' (cached files), and 'doomed' (expired cache) subfolders."},
  {id:36,module:7,q:"Unlike Chrome, how does Firefox handle cached file content and metadata?",options:["Firefox stores content and metadata in separate files","Firefox appends the metadata to the END of the cached file","Firefox only stores metadata, not content","Firefox stores both in a central SQLite database"],answer:1,explanation:"Firefox appends metadata to the end of the cached file itself, unlike Chrome which separates them. The logical file on disk is always larger than the Content Size (Bytes) shown in Axiom because of the appended metadata."},
  {id:37,module:7,q:"Where does Firefox store its bookmarks?",options:["bookmarks.html in the Firefox profile","The places.sqlite database in the Firefox Roaming profile","The favicons.sqlite database","A dedicated bookmarks.db file"],answer:1,explanation:"Firefox bookmarks are in places.sqlite (Roaming profile folder). Relevant tables: moz_places and moz_bookmarks."},
  {id:38,module:8,q:"In the Email Explorer, the Participants filter (Sender/Recipient) is:",options:["Case insensitive","Case sensitive","Fuzzy match only","Pattern-based (regex) only"],answer:1,explanation:"The Participants search field in the Email Explorer is CASE SENSITIVE. This is explicitly highlighted in the course — a frequent exam trap question."},
  {id:39,module:8,q:"Where can ALL email attachments from all parsed emails be reviewed in one place?",options:["Communications → Email Inbox","Email category → Email Attachments artifact","File System Explorer → Attachments","Media Explorer → Documents"],answer:1,explanation:"The Email Attachments artifact under the EMAIL category aggregates ALL attachments from ALL parsed email artifacts in one place, including Subject, Sender, Recipient, and an 'Original Artifact' link."},
  {id:40,module:8,q:"Emails can be exported in which format for review in an external email client?",options:[".MSG",".EML",".PST",".MBOX"],answer:2,explanation:"Emails can be exported in PST format, allowing review in a PST viewer. This is covered in the Email Reports section of Module 8."},
  {id:41,module:8,q:"What translation capability does Axiom provide for foreign-language communications?",options:["Automatic real-time translation of all artifacts","A Translation module (Magnet Models) — right-click → Translate Selected Text","Integration with Google Translate API","Translation is available for chats only, not emails"],answer:1,explanation:"Axiom's Translation module (part of Magnet Models) supports multiple languages. Download from Customer Support Portal, enable in Artifact Explorer, then right-click → 'Translate Selected Text'."},
  {id:42,module:9,q:"How is new evidence added to an existing case from within Axiom Examine?",options:["File → Add Evidence","Process → Add new evidence to case","Tools → Import → New Evidence","Edit → Case Properties → Add Evidence"],answer:1,explanation:"To add evidence from within Axiom Examine (with the case open), select Process → Add new evidence to case from the menu."},
  {id:43,module:9,q:"The Connections explorer in Axiom answers which investigative framework?",options:["MITRE ATT&CK Framework","The 6 investigative questions: Who, What, When, Where, Why, and How","The SANS Incident Response Framework","The Diamond Model of Intrusion Analysis"],answer:1,explanation:"The Connections explorer helps examiners establish WHO, WHAT, WHEN, WHERE, WHY, and HOW — all six key investigative questions. It displays artifact relationships as a network diagram."},
  {id:44,module:9,q:"How can Connections be set to rebuild automatically in Axiom Examine?",options:["Connections rebuild automatically by default","Enable 'Automatically build connections on case open' in Tools → Settings → Connections","Set up in the Magnet One dashboard","Connections must always be built manually"],answer:1,explanation:"Enable 'Automatically build connections on case open' in Tools → Settings → Connections. Otherwise, they are built manually via Tools → Build Connections."},
  {id:45,module:10,q:"What does a 'Cloud OneDrive Files' artifact (vs. local 'OneDrive') indicate?",options:["Files stored only on the local hard drive in the OneDrive folder","Files acquired from Microsoft's OneDrive cloud — may include files not stored locally and file sharing information","Deleted OneDrive files from unallocated space","OneDrive sync configuration data"],answer:1,explanation:"'Cloud OneDrive Files' means data was acquired from Microsoft's cloud via Axiom Cloud. It may contain files NOT stored locally and can show if a file was shared — unlike the local OneDrive artifact."},
  {id:46,module:10,q:"Passwords and tokens in the Cloud Accounts Information category are forensically useful because:",options:["They can decrypt BitLocker volumes","People reuse passwords — they may open other encrypted content in the case","They contain the device unlock PIN","They provide access to deleted cloud messages"],answer:1,explanation:"People habitually reuse passwords across accounts and files. Found passwords/tokens should be checked against encrypted backups or files in the case. They may also allow future cloud re-acquisition."},
  {id:47,module:10,q:"What does 'Insights – Potential Cloud Evidence Leads' provide?",options:["Auto-login to cloud accounts for acquisition","Indicators from local device artifacts suggesting cloud accounts worth acquiring","A list of all cloud services in browser history","Configuration for Axiom Cloud credentials"],answer:1,explanation:"This Case Dashboard feature surfaces indicators within local artifacts suggesting associated cloud accounts worth acquiring — helping examiners identify sources they might miss."},
  {id:48,module:11,q:"What is 'Hit Stacking' in the Axiom Media Explorer?",options:["Filtering media by skin tone percentage","Combining media with the same MD5/SHA1 hash into a single 'stacked' item regardless of copy count","Stacking multiple search hit highlights in the preview pane","Layering EXIF metadata from multiple sources"],answer:1,explanation:"Hit stacking groups media with identical MD5/SHA1 hashes into a single stacked item regardless of copy count. Tagging or grading one item applies to ALL copies across all evidence."},
  {id:49,module:11,q:"The CAMERA DETAILS filter in the Media Explorer uses which data source?",options:["File creation metadata","EXIF metadata to identify the type of device that originally created the media","Windows registry device connection history","File path analysis"],answer:1,explanation:"CAMERA DETAILS uses available EXIF metadata to identify the originating device (camera model, phone model, etc.)."},
  {id:50,module:11,q:"The Quick Media Preview allows what for video files?",options:["Auto-transcription of video audio","'Scrubbing' the video by moving the mouse L→R to preview the entire contents without full playback","Frame-by-frame analysis with metadata overlay","Automatic thumbnail generation at fixed intervals"],answer:1,explanation:"Hovering over a video shows a popup preview. Moving the mouse L→R allows scrubbing through the entire video content — useful for quickly previewing lengthy videos."},
  {id:51,module:12,q:"What is the MCFE exam passing score requirement?",options:["70%","75%","80%","85%"],answer:2,explanation:"Students must attain 80% or higher to certify as an MCFE. The exam has 75 questions completed in 120 minutes."},
  {id:52,module:12,q:"If a student fails the MCFE exam twice, what happens?",options:["They must retake the full AX200 course","They are placed on a 60-day delay before another attempt","They are permanently disqualified","They must submit a written appeal to Magnet Forensics"],answer:1,explanation:"Fail once → immediate 2nd attempt allowed. Fail twice → 60-day lockout before the next attempt."},
  {id:53,module:12,q:"How long is the MCFE certification valid?",options:["1 year","2 years","3 years","5 years"],answer:1,explanation:"The MCFE certification for Magnet AXIOM is valid for 2 years from the date of successful completion."},
  {id:54,module:12,q:"Which course tracks qualify a student to sit for the MCFE-AXIOM exam?",options:["AX200, CY200, BCERT (NCFI), or qualifying custom courses","AX200 and AX250 only","Any Magnet Forensics certified course","AX200 and CY200 only"],answer:0,explanation:"Qualifying tracks: AX200, CY200, BCERT (offered at NCFI), or custom courses combining AX200 core competency components."},
  {id:55,module:11,q:"When a tag is applied to an item within a hit stack, what happens?",options:["Only the selected copy is tagged","The tag is applied to ALL copies of the file across the evidence","A prompt asks which copies to tag","Tags cannot be applied to stacked items"],answer:1,explanation:"When a stack is graded or tagged, the value is applied to ALL copies of the file across all evidence items — ensuring consistent evidence grading."},
  {id:56,module:5,q:"What does the File System Information artifact parse from?",options:["The MFT ($MFT) file","The Boot Record (MBR or VBR) of the processed drive","The NTFS Journal ($UsnJrnl)","The Volume Shadow Copy service logs"],answer:1,explanation:"File System Information is parsed from the Boot Record of the processed drive. The Volume Offset (Bytes) value distinguishes MBR from VBR. It includes drive geometry, file system, VSN, and fixed/removable status."},
  {id:57,module:2,q:"What does the 'Dynamic App Finder' (Find More Artifacts) feature do?",options:["Searches the internet for new artifact profiles","Dynamically identifies and extracts artifacts from apps not natively supported by Axiom","Finds artifacts in encrypted containers","Auto-generates keyword search terms from existing artifacts"],answer:1,explanation:"Dynamic App Finder (DAF) extends evidence recovery to unsupported applications — dynamically identifying and extracting artifacts from apps not natively supported by Axiom."},
  {id:58,module:8,q:"What is a compound file in the context of Axiom email examination?",options:["An email with more than 5 attachments","A file format like .OST that contains multiple data streams — the preview card may be blank","An email forwarded multiple times with embedded headers","A ZIP-compressed email archive"],answer:1,explanation:"A compound file (like .OST — Outlook Offline Storage Table) contains multiple data streams. The preview card in Axiom may be blank; use the TEXT AND HEX card in TEXT view."},
  {id:59,module:12,q:"How many questions are in the MCFE exam and what is the time limit?",options:["50 questions, 90 minutes","75 questions, 120 minutes","100 questions, 180 minutes","60 questions, 60 minutes"],answer:1,explanation:"The MCFE exam has 75 questions to be completed in 120 minutes (2 hours). Evidence materials must be downloaded and processed BEFORE starting the timed evaluation."},
  {id:60,module:3,q:"In Magnet One, what is the default evidence naming convention prefix?",options:["EVI-","EVD-","AX-EV-","MGF-"],answer:1,explanation:"Magnet One defaults to 'EVD-' for evidence and 'CSE-' for cases. Both are customizable via Settings to match organizational policy."},
  {id:61,module:9,q:"After BitLocker decryption completes, what does Axiom Examine automatically begin?",options:["Generating a preliminary report","Auto-building Timeline, Connections, and World Map","Exporting all artifacts to a portable case","Sending a notification to Magnet One"],answer:1,explanation:"Once decryption completes, Axiom Examine automatically begins to auto-build Timeline, Connections, and World Map — if pre-configured in settings. Otherwise, these must be initiated manually."},
  {id:62,module:10,q:"How does a file hash in Cloud/OneDrive connections help examiners?",options:["It decrypts the file if encrypted","It confirms that a file on cloud storage is the exact same file stored on a local drive or USB","It auto-generates a report for that file","It identifies the application that created the file"],answer:1,explanation:"File hashes confirm file identity across multiple storage locations. A hash match across cloud, local drive, and USB artifacts confirms they are the exact same file — critical for establishing data exfiltration paths."},
  {id:63,module:6,q:"The 'Identifiers – Device' category contains information useful for:",options:["Identifying individuals by their communication accounts","Identifying devices that may have been attached to the computer","Locating installed software license keys","Tracking browser session identifiers"],answer:1,explanation:"Identifiers – Device helps identify devices (not people) that might have been attached to the computer. Identifiers – People is the separate category for individual identification."},
  {id:64,module:7,q:"What is the Timeline Explorer used for in Axiom Examine?",options:["Creating a visual case report with timestamps","Viewing all case activity streamlined around a specific point in time","Generating a chain of custody timeline","Tracking examiner actions during investigation"],answer:1,explanation:"The Timeline Explorer allows the examiner to streamline and view activity across all evidence around a specific point in time, helping establish chronological sequences of events."},
  {id:65,module:4,q:"What does the Event Snapshot in the Case Dashboard show?",options:["System crash logs","A timeline overview of significant events across all evidence sources","USB connection events only","Export artifact actions"],answer:1,explanation:"The Event Snapshot provides a timeline-based overview of significant events across all evidence sources, giving examiners a high-level chronological view of case activity."},
  {id:66,module:11,q:"What does the VICS ATTRIBUTES filter group in the Media Explorer relate to?",options:["Video Integrity Checking System filters","Project VIC hash set matches — filtering for known media","Victim Identification and Case Support timeline data","Vehicle Identification in Crime Scene media"],answer:1,explanation:"VICS ATTRIBUTES filters apply when evidence was processed with a Project VIC hash set and matching results were found — used to narrow results for known media."},
  {id:67,module:5,q:"What Windows build number introduced the user activity Timeline feature?",options:["Build 1709","Build 1803","Build 1903","Build 2004"],answer:1,explanation:"Build 1803 introduced the Windows Timeline feature (Windows+Tab). Before 1803, pressing Windows+Tab cascaded open tiles. After 1803, it shows a user activity timeline. Knowing the build number explains artifact presence/absence."},
  {id:68,module:2,q:"What is 'Privileged Content' in Axiom Process used for?",options:["Marking artifacts as high priority","Marking or excluding legally protected material (attorney-client privilege, etc.)","Encrypting sensitive case findings","Restricting access to certain evidence files"],answer:1,explanation:"The Privileged Content option allows examiners to mark and/or exclude legally protected material (e.g., attorney-client privilege) during processing — important for legal compliance."},
  {id:69,module:6,q:"After Route View recording ends, where is the exported video file saved?",options:["The Windows Desktop","The Export folder within the case folder","The evidence file directory","C:\\Program Files\\Magnet Forensics\\Exports"],answer:1,explanation:"Route View recordings are exported as video files to the 'Export' folder located within the case folder."},
  {id:70,module:4,q:"In Mobile View, which iOS extraction type acquired via UFED Premium is supported?",options:["iTunes Backup","iCloud Backup","UFED Premium","Logical"],answer:2,explanation:"Supported iOS types for Mobile View include UFED Premium. AFU and FFS acquired with Graykey or Verakey are also supported. Standard logical extractions are not listed as supported types."},
  {id:71,module:7,q:"Chrome cache stores content and metadata as:",options:["A single combined file per cached item","Separate components within the same cache folder","A unified SQLite database entry","Individual encrypted blobs"],answer:1,explanation:"Chrome stores cached file content and its metadata as two SEPARATE components — both within the same cache folder. This is why Axiom shows two Evidence Information sections for Chrome cache records."},
  {id:72,module:8,q:"What view automatically presents messaging data in a threaded format?",options:["Timeline Explorer","Artifact Explorer","Conversation View","Media Explorer"],answer:2,explanation:"The Conversation View presents chat/messaging artifacts in a threaded, human-readable format reflecting how the conversation appeared to the user — most relevant for WhatsApp, SMS, and similar apps."},
  {id:73,module:9,q:"In the Lewis Case, what was the BitLocker Recovery Key ID found in Axiom Process?",options:["A47F2211-B312-4891-AA10-3C56D899F21A","7F6C6887-C345-4572-8C17-9B73F57BF68F","F1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D","5555AAAA-BBBB-CCCC-DDDD-EEEEFFFFAAAA"],answer:1,explanation:"The Recovery Key ID in the exercise was: 7F6C6887-C345-4572-8C17-9B73F57BF68F. The matching BitLocker Recovery Key artifact in Axiom Examine provided the decryption key value."},
  {id:74,module:10,q:"What information does the Cloud Dropbox Files artifact include?",options:["Only filename and download date","File location in Dropbox, File ID, File Version ID, server/client last modified timestamps, original photo timestamp, and content preview","Only file hash values","Dropbox account credentials and session tokens"],answer:1,explanation:"Cloud Dropbox Files includes: file location within Dropbox, File ID, File Version ID, server and client last modified timestamps, original photo timestamp (if present), and a content preview."},
  {id:75,module:5,q:"What does the Time Zone Information artifact parse from?",options:["The Windows Event Logs","Both the SYSTEM hive (ControlSet###\\Control\\TimeZoneInformation) and SOFTWARE hive","The NTUSER.DAT file only","The pagefile.sys"],answer:1,explanation:"Timezone Information is parsed from both the SYSTEM hive (ControlSet###\\Control\\TimeZoneInformation) and the SOFTWARE hive. Identifying the machine timezone lets the examiner set correct timezone in forensic tools."},
];

const TIPS = [
  "The MCFE exam uses the actual Lewis Case MFDB file — know WHERE artifacts live, not just WHAT they are.",
  "Expect questions referencing specific file paths (e.g., Chrome cache vs. Firefox cache locations).",
  "Know the difference: Parsing = structured data extraction. Carving = recovery from unallocated space.",
  "Filters bar turns YELLOW when active — a common exam visual-recognition question.",
  "Mobile View: apps are NOT in their original device order — a classic trick question.",
  "Email Explorer Participants filter is CASE SENSITIVE — easy to overlook.",
  "Prefetch max entries: XP=126, Vista/7/8=129, Win10/11=1024. Know all three.",
  "Win Vista+ registry: recovery of deleted accounts from unallocated space = highly unlikely.",
  "Hit Stacking: tagging one item in a stack applies the tag to ALL copies across all evidence.",
  "BitLocker Recovery Key artifact in Axiom Examine holds the key needed to unlock encrypted evidence.",
  "ShutdownTime = 8-byte Windows 64-bit Little Endian timestamp in SYSTEM hive.",
  "Cloud OneDrive Files ≠ local OneDrive artifact. Cloud version may show files not stored locally + sharing info.",
  "Connections auto-build: Tools → Settings → Connections. Manual: Tools → Build Connections.",
  "Quick video preview: hover and drag mouse LEFT → RIGHT to scrub through the entire video.",
  "Firefox cache is in AppData\\LOCAL — NOT Roaming. Chrome cache is also in LOCAL.",
  "Magnet One: CSE- for cases, EVD- for evidence. Both customizable.",
  "Build 1803 = Windows Timeline introduced. Build number determines which artifacts should exist.",
  "Rebuilt Desktops: Windows 10 ONLY. Do not confuse with other Windows versions.",
];

// ─── COMMUNITY INTEL ──────────────────────────────────────────────────────────

const REDDIT_COMMENTS = [
  {
    user: "barleyhogg1", upvotes: 6, label: "Taken it 4 times", color: "#00d4a0",
    text: "Way easier than SANS. Taken it 4 times now. Just process the case they give. Dig through it for a week and get really comfortable with the scenario. Get the PDF of the manual and read it, do all the exercises. The PDF can be used during the test and is searchable. Also open a session of Axiom Process and Examine. It's really easy to solve many questions by just going through the applications. Oh also, if you get stuck... skip it. You can go back later.",
    tip: "PDF manual is searchable DURING the exam. Skip hard questions and return later.",
  },
  {
    user: "etspiritussancti", upvotes: 3, label: "Completed it — full breakdown", color: "#0ea5e9",
    text: "Completed the cert test today. Pretty basic and no ultra technical questions. Open book, open case file with a data set and scenario. As long as you did the exercises in the AX200 class and are familiar with moving around Axiom, it's pretty easy. Even if you don't remember how to navigate to a file, using the search function will be sufficient to answer a bunch of the questions. About half the test is practical questions about the test case, a quarter are basic questions about the program's functions that you can just check the program to answer, and another portion are settings in Process and Reports.",
    tip: "~50% practical (case file) · ~25% program functions · ~25% Process/Reports settings.",
  },
  {
    user: "mdnrhardee", upvotes: 1, label: "Took it last November", color: "#a78bfa",
    text: "I've just taken my MCFE last November. The test was definitely manageable and open book. A portion of the questions were dedicated to Axiom Process and Examine software itself while the rest were related to the details of the processed case files — so a softcopy of the AX200 course materials would be best for quick reference. Tip: make sure to process the case files, build Connections and Timeline BEFORE you start the test. There were a few candidates who didn't and they weren't able to complete in time.",
    tip: "⚠️ Build Connections and Timeline BEFORE starting the timer. Candidates who didn't ran out of time.",
  },
  {
    user: "[deleted]", upvotes: 3, label: "Most upvoted tip", color: "#f59e0b",
    text: "Not super difficult, but don't wait too long after taking the class, and make sure you have the PDF of the class manual pulled up before you start.",
    tip: "Take the exam while the material is still fresh in your head.",
  },
  {
    user: "Nometu", upvotes: 2, label: "Taken it + recertified", color: "#34d399",
    text: "I've taken it and have done recertification. It isn't that difficult. Don't waste time though, I remember using most of my time.",
    tip: "Time management matters — 120 mins for 75 questions. Don't linger on any one question.",
  },
  {
    user: "CapObvious", upvotes: 2, label: "Compared to SANS", color: "#f87171",
    text: "Way easier than SANS. Questions are about 50/50 forensics vs Axiom usage.",
    tip: "If you have SANS experience, this will feel significantly lighter.",
  },
  {
    user: "etspiritussancti", upvotes: 2, label: "Format confirmed", color: "#60a5fa",
    text: "Multiple choice and true/false. It's not difficult. As long as you know the basics of how to navigate Axiom, the practical questions are easy and the book will guide you to any answers you may get stuck on.",
    tip: "Format: multiple choice + true/false. The PDF book is your safety net for tricky questions.",
  },
  {
    user: "etspiritussancti", upvotes: 2, label: "When you get exam access", color: "#818cf8",
    text: "I took it right after the course ended. I believe I was able to access it right away or at worst an hour later. I may have even had access to it while the course was still active, and downloaded the data sets while in the course so I could start right away.",
    tip: "Download the evidence data sets DURING the course — don't wait until exam day.",
  },
  {
    user: "bigt252002", upvotes: 2, label: "Honest skeptic perspective", color: "#94a3b8",
    text: "Never been a fan of vendor-specific certs, unless it is needed for court. You're talking about a tool-specific test that is meant to get you into the weeds to show you have competency in the tool. They'll throw a handful of 'forensic' questions in there to try and demonstrate it as being more than just a tool cert. If you're looking for another forensic cert that isn't SANS, look at CFCE then.",
    tip: "Counter-view: most valuable for court credibility. For broader DFIR, also consider CFCE.",
  },
];

const COMMUNITY_INTEL = [
  {
    type: "review",
    source: "ThinkDFIR (Phill Moore)",
    url: "https://thinkdfir.com/2019/06/09/ax200-magnet-axiom-examinations-review/",
    role: "DFIR Practitioner & SANS Instructor",
    date: "June 2019",
    rating: 5,
    tag: "Course + Exam Review",
    tagColor: "#0ea5e9",
    summary: "Highly recommended for anyone using AXIOM — even experienced users miss small details in the parts they already know.",
    keyPoints: [
      "Exam is 75 questions in 2 hours, 80% pass mark — all done online at your own pace",
      "Some questions are theory-based (from the manual), others are PRACTICAL based on actual evidence images",
      "Strongly recommended: download the case data, process it, and explore it BEFORE starting the timed exam",
      "Having the processed case open during the exam means you don't have to worry about processing time mid-exam",
      "The course goes beyond button-pushing — it covers forensic concepts behind the artifacts",
      "On-demand format is good for self-paced learners, but in-person gives a better experience",
    ],
    quote: "Download the case data, process it, and have a look through based on the scenario. I found that doing this meant that I didn't have to worry too much about processing time, and had a grasp of the data available to me during the exam.",
  },
  {
    type: "group_result",
    source: "Notre Dame CDT Program",
    url: "https://altech.nd.edu/events-news/news/seventeen-students-in-the-cdt-program-certified-as-magnet-certified-forensics-examiners-mcfe/",
    role: "Digital Forensic Analysis Course — 17 Students",
    date: "April 10, 2022",
    rating: 5,
    tag: "Class Results",
    tagColor: "#00d4a0",
    summary: "17 students passed on the same day — average score was 92%, well above the 80% pass mark.",
    keyPoints: [
      "ALL 17 students passed on the same sitting (April 10, 2022)",
      "Average score: 92% — 12 points above the minimum 80% pass mark",
      "Students came from the Digital Forensic Analysis course which covers proper digital forensic techniques",
      "The exam tests proficiency in computer, phone, and other electronic storage device examinations",
      "The exam is described as '75 knowledge-based and practical questions' — confirming the practical component",
      "Certification is administered worldwide, making it a globally recognized credential",
    ],
    quote: "17 students in the CDT Program successfully passed a test for certification as a Magnet Certified Forensics Examiner (MCFE). The average score for the 17 students who certified was 92%.",
  },
  {
    type: "community_tips",
    source: "Community Q&A (Quizlet / Stuvia / Docsity)",
    url: "https://quizlet.com/712212239/mcfe-exam-questions-flash-cards/",
    role: "Aggregated from multiple MCFE exam takers",
    date: "2022–2025",
    rating: 4,
    tag: "Exam Intelligence",
    tagColor: "#f59e0b",
    summary: "Recurring Q&A patterns from exam takers who shared their experience publicly — these question types come up repeatedly.",
    keyPoints: [
      "How does AXIOM identify encrypted files? → Passware plugins",
      "Does Encrypted Files artifact show what PROGRAM encrypted the file? → NO",
      "What does AXIOM search for in Encryption/Anti-forensics? → Known executables and data structures",
      "Google Searches vs Parsed Search Queries: Google Searches = Google only; Parsed = Bing, Yahoo, all others",
      "Profile creation uses ONLY: Identifiers – People AND Identifiers – Devices",
      "Artifact Reference location: Help → Documentation → Artifact Reference",
      "SQLite databases in Axiom Examine: viewed via SQLite Viewer within the File System Explorer",
      "Session Recovery data = last opened tabs stored when browser crashes or quits unexpectedly",
      "Two video previews: actual video preview AND filmstrip preview",
      "Filmstrip: Axiom takes still frames at every 10% of the video",
      "AXIOM Cloud authentication methods: Passwords and/or Tokens",
      "Keyword search from FILTERS bar on emails: searches ALL PARTS of the email",
      "Document content displayed in: Preview Card in the Details Pane",
      "Document Created Date/Time ≠ File System Created Date/Time (metadata vs filesystem timestamp)",
      "REFINED RESULTS purpose: helps examiner expedite investigation by placing useful artifacts in one category",
    ],
    quote: "These question patterns appeared consistently across multiple independently compiled MCFE exam notes from different cohorts. They are high-yield, frequently tested details.",
  },
  {
    type: "official",
    source: "Magnet Forensics — Official Exam Structure",
    url: "https://training.magnetforensics.com/w/courses/64-magnet-certified-forensics-examiner-mcfe",
    role: "Official Magnet Forensics Training Team",
    date: "2024–2026",
    rating: 5,
    tag: "Official Source",
    tagColor: "#a78bfa",
    summary: "The exam has two components: general knowledge AND practical questions derived from a real processed case file you create yourself.",
    keyPoints: [
      "STRUCTURE: General knowledge questions (AXIOM Process + Examine operations) + Practical questions (based on your own AXIOM case file)",
      "You MUST download and process the evidence files PROVIDED BEFORE starting the timed evaluation",
      "The practical questions use YOUR processed MFDB case file — you need it open during the exam",
      "The exam is delivered online, fully self-paced — take it after completing AX200",
      "Upon passing: Magnet mails you a physical certificate (and historically, a challenge coin)",
      "Recertification is available every 2 years — same exam format",
      "Magnet also launched official 'Certification Preparation' self-paced modules in 2025 to help candidates prepare",
      "The exam is FREE to qualifying course completers — no additional cost beyond the course",
    ],
    quote: "Students will complete both general knowledge questions around the operation and functions of both Magnet AXIOM Process and AXIOM Examine as well as practical questions formatted using the information derived from the AXIOM case file created by the examinee.",
  },
  {
    type: "strategy",
    source: "Techno Security / Magnet User Summit Guidance",
    url: "https://www.magnetforensics.com/techno-security-mcfe-axiom-certification",
    role: "Magnet Forensics Official Training Team",
    date: "2023–2025",
    rating: 4,
    tag: "Exam Strategy",
    tagColor: "#f87171",
    summary: "At conference-delivered MCFE exams, computers are provided with pre-processed evidence — but for self-paced, YOU must prepare the case beforehand.",
    keyPoints: [
      "At in-person conference delivery: computers are provided and the case is pre-processed for you",
      "For self-paced online exam: you are responsible for downloading and processing evidence BEFORE the timer starts",
      "The exam consists of two parts: knowledge-based questions + practical questions using the provided evidence set",
      "Score 80% out of 75 questions to pass — no partial credit",
      "Time management: 120 minutes for 75 questions = ~96 seconds per question. Don't overthink.",
      "Having the Magnet Axiom Artifact Reference open (Help → Documentation → Artifact Reference) during the exam is allowed — use it",
      "Practical questions will ask you to look things up in your processed case — know your way around the UI",
    ],
    quote: "The exam will take no longer than 120 minutes and is comprised of two parts: a set of knowledge-based questions around the functions of Magnet AXIOM and a practical-based set of questions using a prepared evidence set.",
  },
];

// ─── PRACTICAL / HANDS-ON QUESTIONS ───────────────────────────────────────────

const PRACTICAL_QS = [
  {
    id:"p1", category:"Evidence Processing",
    scenario:"You have just received a forensic image of Katie Lewis's Windows 11 laptop. You open Axiom Process to create a new case. What is the first thing you should configure to maximize processing speed?",
    answer:"Separate the temporary file location from the case file location. In Axiom Process: Tools → Settings → Custom Location. Placing the temp files on a separate physical disk prevents hitting the IOPS limit and significantly speeds up processing.",
    follow_up:"Also separate your case folder and evidence folder onto different physical disks if possible."
  },
  {
    id:"p2", category:"Evidence Processing",
    scenario:"During processing of the Lewis case, you want to find any text embedded inside scanned PDFs and screenshots. Which processing option must you enable, and where is it configured?",
    answer:"Enable OCR (Optical Character Recognition) in the Processing Details section of Axiom Process. OCR extracts text from images, enabling keyword searches across image-based content in the evidence.",
    follow_up:"OCR increases processing time but is essential for finding text in screenshots, scanned documents, and image files."
  },
  {
    id:"p3", category:"Encryption & Anti-Forensics",
    scenario:"You add the SanDisk USB drive image (SanDisk USB Device 32GB.E01) to the case. A padlock icon appears next to it in Axiom Process. How do you proceed?",
    answer:"The padlock icon indicates an encrypted drive. Axiom Process will auto-identify it as BitLocker. Navigate to Axiom Examine → find the BitLocker Recovery Key artifact → copy the key value → return to Axiom Process → enter the Recovery Key → click CHECK → the NEXT button becomes enabled.",
    follow_up:"Recovery Key ID in the exercise: 7F6C6887-C345-4572-8C17-9B73F57BF68F. The corresponding decryption key is found in the BitLocker Recovery Key artifact."
  },
  {
    id:"p4", category:"Encryption & Anti-Forensics",
    scenario:"A colleague asks: 'Does the Encrypted Files artifact in Axiom tell us which program was used to encrypt the files?' What do you tell them?",
    answer:"NO. The Encrypted Files artifact does NOT display what program was used to encrypt the files. Axiom identifies encrypted files by searching for known executables and data structures. The artifact flags that encryption exists, but not the specific tool.",
    follow_up:"Axiom Process uses Passware plugins to identify encrypted files during processing."
  },
  {
    id:"p5", category:"OS Artifacts",
    scenario:"You need to prove that Katie Lewis ran AxCrypt on her laptop. What artifact would you check, what is the exact file name format you'd expect to see, and what three pieces of key information does it provide?",
    answer:"Check the Prefetch Files artifact (Windows\\Prefetch folder). The file would be named AXCRYPT.EB7A4EAC.pf (application name + proprietary hash + .pf extension). Prefetch provides: (1) Name of the application, (2) Run count (number of times launched), and (3) Date/time of last launch (up to last 8 run times).",
    follow_up:"Prefetch is system-wide, not user-specific. It's compressed with XPRESS HUFFMAN (MAM) on Windows 10/11 — Axiom handles decompression automatically."
  },
  {
    id:"p6", category:"OS Artifacts",
    scenario:"You need to confirm the exact date and time Katie Lewis's laptop was last shut down. Walk through how you'd find and validate this in Axiom Examine.",
    answer:"Navigate to: Artifact Explorer → Operating System → Operating System Information. In the DETAILS pane, the Last Shutdown Date/Time field comes from the ShutdownTime value in the SYSTEM hive (ControlSet###\\Control\\Windows). To validate: click the Location source link → Registry Explorer opens → highlight the 8-byte hex value in the HEX card → scroll to DECODE card → Axiom interprets it as a Windows 64-bit Little Endian timestamp.",
    follow_up:"Axiom displays timestamps with millisecond precision (3 decimal places). Example: 20/03/2025 14:00:55.000"
  },
  {
    id:"p7", category:"OS Artifacts",
    scenario:"You want to confirm which USB devices were ever connected to Katie Lewis's laptop, including first connection time and which Windows user was associated with each device. Where do you look and what are the data sources?",
    answer:"Navigate to: CONNECTED DEVICES → USB Devices artifact. Sources include: SOFTWARE and SYSTEM registry hives, setupapi.dev.log files, pagefile.sys, Windows Event Logs, NTUSER.DAT hives, and restore points/volume shadow copies. The artifact captures: device name, manufacturer, device identifiers, first connection time, drive letter assigned, and which Windows user profile was associated.",
    follow_up:"Katie's SanDisk USB drive and Integral USB drive should both appear here."
  },
  {
    id:"p8", category:"Web & Browser",
    scenario:"You're looking for evidence of Katie Lewis's internet searches on her work laptop. What is the DIFFERENCE between the 'Google Searches' artifact and the 'Parsed Search Queries' artifact?",
    answer:"Google Searches = ONLY searches conducted specifically on Google. Parsed Search Queries = structured search terms from ALL other search engines (Bing, Yahoo, DuckDuckGo, etc.). Both are under the REFINED RESULTS category.",
    follow_up:"Use both artifacts to get a complete picture of the user's search activity across all search engines."
  },
  {
    id:"p9", category:"Web & Browser",
    scenario:"A suspect is believed to have researched competitor pricing using Firefox. You want to see the SQLite data behind the browser history. How do you access it directly in Axiom Examine?",
    answer:"From the File System Explorer, navigate to the Firefox profile folder. Firefox stores most of its data in SQLite databases (places.sqlite for history and bookmarks, etc.). The built-in SQLite Viewer within the File System Explorer allows direct inspection of these database files.",
    follow_up:"Firefox cache is in AppData\\LOCAL (not Roaming), while bookmarks/history are in AppData\\Roaming — know both paths."
  },
  {
    id:"p10", category:"Web & Browser",
    scenario:"What is 'Session Recovery' data in browser forensics, and why is it forensically valuable?",
    answer:"Session Recovery data contains information about the browser's last open tabs — stored when the browser quits unexpectedly or crashes. It is forensically valuable because it can reveal what websites the user was actively viewing at the time of the crash or unexpected shutdown, even if browsing history was cleared.",
    follow_up:"This data can corroborate or contradict a suspect's claimed browsing activity at a specific point in time."
  },
  {
    id:"p11", category:"Communications",
    scenario:"You suspect Katie Lewis was communicating with a buyer named 'Jones' via email. You open the Email Explorer and type 'jones' in the Participants filter but get no results. What is the most likely cause?",
    answer:"The Participants filter in the Email Explorer is CASE SENSITIVE. Typing 'jones' (lowercase) will not match entries where the name is stored as 'Jones' (capitalized). Try entering 'Jones' with the correct case.",
    follow_up:"You can filter for both Sender AND Recipient simultaneously — enter 'jones' OR 'lewis' to see both sides of the email thread."
  },
  {
    id:"p12", category:"Communications",
    scenario:"You need to find all files Katie Lewis attached to emails across all email sources in the case. What is the most efficient approach in Axiom Examine?",
    answer:"Navigate to: EMAIL category → Email Attachments artifact. This single artifact aggregates ALL attachments from ALL parsed email artifacts across all evidence sources. It includes Subject, Sender, Recipient, and an 'Original Artifact' hyperlink that jumps back to the parent email.",
    follow_up:"Email attachments also appear in the Documents and Media categories if they are documents or media files — useful for cross-referencing."
  },
  {
    id:"p13", category:"Communications",
    scenario:"You find an email in Spanish between Katie Lewis and a person named Michael. You need to understand the content. How do you translate it within Axiom Examine?",
    answer:"Use the Translation module (part of Magnet Models). It must be downloaded from the Customer Support Portal and enabled in the Artifact Explorer. Once enabled: select the foreign-language text in the Details pane → right-click → select 'Translate Selected Text'. A Translated Text dialog box appears with the translation.",
    follow_up:"Translation is available in multiple languages and works across emails, chats, and other communication artifacts."
  },
  {
    id:"p14", category:"Cloud & OneDrive",
    scenario:"You see two OneDrive artifacts in the case: 'OneDrive' and 'Cloud OneDrive Files'. What is the KEY DIFFERENCE between them, and which one would show if Katie shared a file with an external party?",
    answer:"'OneDrive' (local) = files stored in the local OneDrive folder on the device, parsed from an .ini file in AppData. 'Cloud OneDrive Files' = files acquired directly from Microsoft's OneDrive cloud via Axiom Cloud. Only the Cloud version may contain files NOT stored locally AND shows file sharing information (shared with other users). The Cloud OneDrive Files artifact would show if a file was shared externally.",
    follow_up:"File hashes can confirm if the same file exists across both the cloud artifact and local USB/hard drive artifacts — critical for proving data exfiltration."
  },
  {
    id:"p15", category:"Cloud & OneDrive",
    scenario:"In the Cloud Accounts Information category, you find password/token credentials for several accounts. Why should you always attempt these against encrypted files or backups found elsewhere in the case?",
    answer:"People habitually reuse passwords across multiple accounts and files. A password found for a cloud account may also open encrypted backups, AxCrypt files, BitLocker volumes, or ZIP archives found on USB drives or local storage. Additionally, the token/password may allow future re-acquisition of the cloud account if additional data is needed.",
    follow_up:"In the Lewis Case, AxCrypt was found running on the system (Prefetch artifact). Any recovered passwords should be tested against AxCrypt-encrypted files."
  },
  {
    id:"p16", category:"Media",
    scenario:"You're reviewing media from the evidence. You notice that several identical images appear as a single item with a stack icon in the bottom-right corner. If you tag this item as 'Evidence – Data Theft', which copies get tagged?",
    answer:"ALL copies of the file across ALL evidence sources get tagged. This is Hit Stacking — Axiom groups files with the same MD5/SHA1 hash into a single stack. Tagging or grading one item in the stack applies the action to every copy of that file across all evidence items in the case.",
    follow_up:"Clicking the stack icon shows the list of all individual copies with their file extensions and source locations."
  },
  {
    id:"p17", category:"Media",
    scenario:"You need to quickly review a 45-minute video file without playing it in full. What feature in the Axiom Media Explorer allows this, and how does it work?",
    answer:"The Quick Media Preview feature. Hover over the video thumbnail — a preview popup appears. Move your mouse LEFT → RIGHT across the preview to 'scrub' through the entire video content, allowing you to preview the full video quickly without playing it back in real time. For the filmstrip, Axiom takes still frames at every 10% of the video.",
    follow_up:"There are TWO video preview options in Axiom: the actual video preview and the filmstrip preview. Both are accessible from the Media Explorer."
  },
  {
    id:"p18", category:"Refined Results",
    scenario:"You want to understand what files Katie Lewis was browsing in Windows File Explorer on her laptop. Which artifact shows this, and where does its data come from?",
    answer:"The 'Locally Accessed Files and Folders' artifact in the REFINED RESULTS category. Data comes from the WebCacheV01.dat database (also contains IE10+ and Edge browsing history). Because it's stored in the user's AppData area, the specific Windows user account associated with the activity can be identified.",
    follow_up:"Entries showing ':Host: This PC' come from WebCache via File Explorer native path variables. An entry like 'E:\\Being monitored at work….' reveals the user browsed to that path from Windows File Explorer."
  },
  {
    id:"p19", category:"Refined Results",
    scenario:"Your supervisor asks: 'Which REFINED RESULTS artifacts do we use to create a Profile in Axiom Examine?' What is your answer?",
    answer:"ONLY Identifiers – People AND Identifiers – Devices. These are the only two REFINED RESULTS artifact categories used to create a Profile. Identifiers – People contains email addresses, chat accounts, screen names, and document metadata. Identifiers – Device contains information about devices that may have been attached to the computer.",
    follow_up:"Profiles in Axiom allow the examiner to filter case data to view only artifacts associated with a specific person or device — powerful for linking evidence to individuals."
  },
  {
    id:"p20", category:"Reporting & Connections",
    scenario:"You need to establish the full picture of HOW Katie Lewis exfiltrated company data — which tool/feature in Axiom Examine maps out the relationships between artifacts and helps answer Who, What, When, Where, Why, and How?",
    answer:"The Connections Explorer. It builds visual network diagrams showing relationships between artifacts across all evidence sources. It answers: WHO (who was involved, who owns files), WHAT (what files, applications, events), WHEN (timestamps), WHERE (local, USB, cloud), WHY (communication content, intent), and HOW (what applications, what transfer methods). Build via: Tools → Build Connections, or enable auto-build in Tools → Settings → Connections.",
    follow_up:"The Connections Explorer icon appears beside any artifact attribute that has been connected to another artifact. Return to it multiple times throughout the investigation as new evidence is added."
  },
];

// ─── MANUAL SEARCH ENTRIES ────────────────────────────────────────────────────

// ─── MANUAL SEARCH ENTRIES ────────────────────────────────────────────────────

const MANUAL = [
  // MODULE 1 - INSTALLATION & OVERVIEW
  {id:1,mod:1,tag:"Case Files",title:"Axiom case file extension",body:"Axiom case files use the .MFDB extension and are SQL databases. Separating case files from evidence files on different physical disks significantly improves I/O performance. The temporary file location should also be on a separate physical disk: Tools → Settings → Custom Location."},
  {id:2,mod:1,tag:"Performance",title:"Processing threads & CPU",body:"Axiom Process creates up to 32 threads (one per core) but uses only ONE physical CPU at a time. Significant performance gains up to 8–12 cores. After 12 cores, clock speed matters more than adding more cores. Change thread count: Tools → Settings → Search Speed."},
  {id:3,mod:1,tag:"User Guide",title:"Accessing What's New / User Guide",body:"Help → Documentation → User Guide from the menu bar OR press F1 in Axiom Examine. The User Guide includes a 'What's New' section listing newly added features. Review this after every Axiom update."},
  {id:4,mod:1,tag:"Lewis Case",title:"Lewis Case Scenario overview",body:"Subject: Katie Lewis, Account Manager at Tech-Odin Solutions. Suspected of fraud and data theft involving fake contracts and financial discrepancies. Devices: Windows 11 Laptop (Katie's PC), Samsung A12 Mobile Phone, SanDisk USB Drive (32GB), Integral USB Drive, Cloud Accounts."},
  {id:5,mod:1,tag:"Axiom Suite",title:"Axiom Process vs Axiom Examine",body:"Axiom Process: images and processes evidence from computers, mobile devices, and cloud in one step. Axiom Examine: reviews processed data, adds tags, generates reports, creates portable cases. Together they combine imaging, searching, analyzing, and reporting into a single platform."},
  {id:6,mod:1,tag:"Temp Files",title:"Temporary file location",body:"Default: same location as the case file. Change via Tools → Settings → Custom Location. Setting temp files to a separate physical disk avoids hitting the IOPS limit and significantly speeds up processing. IOPS = input/output operations per second."},

  // MODULE 2 - EVIDENCE PROCESSING & CASE CREATION
  {id:7,mod:2,tag:"Evidence Sources",title:"Computer evidence source types",body:"Computer sources: Windows, macOS, Linux. Load as: Drive (live acquisition), Image (E01, DD, AFF, etc.), Folder, or specific file types. Axiom can image directly or process from a pre-existing forensic image."},
  {id:8,mod:2,tag:"Evidence Sources",title:"Mobile evidence source types",body:"Mobile sources: iOS and Android. Add via: backup files, extraction files (UFED, GrayKey, Verakey), or direct acquisition. Supported extraction types for Mobile View (Axiom 8.0+): iOS: AFU/FFS (Graykey/Verakey), UFED Premium. Android: FFS, AFU, Logical+, UFED Premium."},
  {id:9,mod:2,tag:"Evidence Sources",title:"Cloud evidence acquisition",body:"Cloud sources: Google (Gmail, Drive, Photos, Activity), Microsoft 365 (OneDrive, Outlook), Dropbox, Instagram, Twitter/X, Snapchat, Facebook, Apple iCloud, and others. Authentication: Passwords and/or Tokens. Axiom Cloud can acquire from active accounts."},
  {id:10,mod:2,tag:"Processing",title:"Keywords in processing",body:"Enter keywords before processing to flag matching artifacts. Keywords can be plain text, regular expressions, or hash values. Results appear highlighted in Axiom Examine. Can be added/modified post-processing by re-processing the case."},
  {id:11,mod:2,tag:"Processing",title:"OCR — Optical Character Recognition",body:"Enables text extraction from images (screenshots, scanned PDFs, photos of documents). Allows keyword searches across image-based content. Must be enabled BEFORE processing — cannot add retroactively. Increases processing time."},
  {id:12,mod:2,tag:"Processing",title:"Hash matching",body:"Calculate Hashes and Find Matches: compare evidence file hashes against known hash sets (NSRL for known good, custom sets for known bad/suspect files). Identifies known files without examining content. Hash types: MD5, SHA1, SHA256."},
  {id:13,mod:2,tag:"Processing",title:"Magnet AI — Chats and Pictures",body:"Magnet AI categorizes pictures automatically: possible weapons, possible drugs, militants, vehicles, human faces, and others. Also assists with chat artifact analysis. Enabled as a processing option before case analysis."},
  {id:14,mod:2,tag:"Processing",title:"Dynamic App Finder (DAF)",body:"'Find More Artifacts' — dynamically identifies and extracts artifacts from applications not natively supported by Axiom. Extends evidence recovery to unsupported apps. Selected during processing stage. Results appear in Application Usage category."},
  {id:15,mod:2,tag:"Processing",title:"Date Range Filter",body:"Restricts artifact recovery to a specified date range. Reduces processing time and noise when investigation scope is time-bounded. Set start and end dates before clicking Analyze Evidence."},
  {id:16,mod:2,tag:"Processing",title:"Privileged Content",body:"Allows marking and/or excluding legally protected material (e.g., attorney-client privilege) during processing. Important for legal compliance. Marked content can be excluded from reports."},
  {id:17,mod:2,tag:"Artifacts",title:"Parsed vs Carved artifacts",body:"Parsed = structured data extraction from known file formats (SQLite DBs, registry hives, etc.). Carved = data recovery from unallocated/deleted space using file signatures. Both appear in Axiom Examine under their respective artifact categories."},
  {id:18,mod:2,tag:"Artifacts",title:"Artifact Details — Parsing and Carving",body:"Axiom attempts to parse known artifact types first. If an artifact file is deleted/damaged, carving may recover it from unallocated space. The recovery method is indicated in the artifact's Details pane."},
  {id:19,mod:2,tag:"Analyze Evidence",title:"Analyze Evidence screen",body:"Final review screen before processing begins. Evidence items show status: 'Ready' or 'Ready to Search' (process only) vs 'Ready to Image' (acquire first). Last chance to review/modify settings. Click ANALYZE EVIDENCE to start. Thread Details shows per-core processing activity."},
  {id:20,mod:2,tag:"Publishing",title:"Publish to Magnet Review",body:"Cloud-based collaborative review platform. Reviewers receive invitation to access case online. Examiner must acknowledge that data will be uploaded to the server in the specified location/region. Shows upload progress during processing."},
  {id:21,mod:2,tag:"Publishing",title:"Publish to Magnet Griffeye",body:"Sends all media items to a Magnet Griffeye Advanced case file for categorization. Requirements: Magnet Griffeye Processing Engine CLI must be installed, Organizational profile must be set (defines categorization per jurisdiction). Enabled from Publish Case menu."},
  {id:22,mod:2,tag:"Search",title:"Search for custom file types",body:"Axiom Process allows searching for specific file types not included in default processing. Add custom file extensions/signatures before processing. Results appear in the Artifacts Explorer under the specified custom category."},

  // MODULE 3 - MAGNET ONE
  {id:23,mod:3,tag:"Magnet One",title:"Magnet One purpose",body:"Multi-purpose platform for overall digital forensic lab management: centralized evidence storage, case and workload management, asset and license oversight, integration with additional forensic tools. Enables sharing investigation findings with investigators and stakeholders."},
  {id:24,mod:3,tag:"Magnet One",title:"Magnet One naming conventions",body:"Default case naming prefix: CSE- | Default evidence naming prefix: EVD- | Both are fully customizable via Settings → Organization configuration. Also customize date format and numbering systems."},
  {id:25,mod:3,tag:"Magnet One",title:"Magnet One configuration",body:"Access via cog icon (top right of dashboard). Configuration tabs: Hardware, Software, Settings, Users. Set organization name, date format, case/evidence naming conventions. User management for lab access control."},
  {id:26,mod:3,tag:"Magnet One",title:"Magnet One dashboard",body:"Overview of all open cases, recent events (processing started/completed, cases assigned, evidence added, processing canceled). Provides real-time case information updates. Each item can be individually accessed from the dashboard."},

  // MODULE 4 - AXIOM EXAMINE INTERFACE
  {id:27,mod:4,tag:"Filters",title:"Filters bar — active state",body:"When any filter is applied in Axiom Examine, the Filters bar turns YELLOW to alert the examiner that not all artifacts are in view. Filtered criteria are displayed in bold. Hovering over bold criteria shows the full filter name."},
  {id:28,mod:4,tag:"Filters",title:"Date and Time filter types",body:"Two types: (1) Absolute Date/Time — exact range (between, before, after specified dates). (2) Relative Date/Time — activity around a specific moment, e.g., 2 minutes before and 10 minutes after a specified time. Filter history is kept for reuse."},
  {id:29,mod:4,tag:"Filters",title:"Saved filter sets",body:"Save complex filter configurations with a custom name. Option to share across cases — filter appears every time Axiom is used. Manage via 'Manage Filter Set' option: change name, adjust case-sharing settings. Reapply in future sessions with one tap."},
  {id:30,mod:4,tag:"Case Dashboard",title:"Case Dashboard overview",body:"Provides high-level case overview. Components: Case Overview (evidence sources, case info), Event Snapshot (timeline of significant events), Evidence Sources (all processed sources), Insights – Potential Cloud Evidence Leads (cloud account indicators from local artifacts)."},
  {id:31,mod:4,tag:"Case Dashboard",title:"Event Snapshot",body:"Timeline-based overview of significant events across all evidence sources. Gives examiners a high-level chronological view of case activity. Located on the Case Dashboard. Helps identify key timeframes for deeper investigation."},
  {id:32,mod:4,tag:"Case Dashboard",title:"Insights — Potential Cloud Evidence Leads",body:"Feature on the Case Dashboard that surfaces indicators within local device artifacts suggesting associated cloud accounts worth acquiring. Helps examiners identify evidence sources they might otherwise miss."},
  {id:33,mod:4,tag:"Explorers",title:"Explorers in Axiom Examine",body:"Available explorers (select from dropdown): Artifact Explorer (primary view), File System Explorer, Registry Explorer, Email Explorer, Timeline Explorer, Connections Explorer, Media Explorer. Each provides a different lens on the same evidence."},
  {id:34,mod:4,tag:"Mobile View",title:"Mobile View overview",body:"Simulates the device home screen with installed applications. Available from Case Dashboard by clicking a mobile evidence source. Requires Axiom 8.0+. Apps are NOT in their original device order. Can apply device wallpaper if recovered."},
  {id:35,mod:4,tag:"Mobile View",title:"Mobile View extraction types",body:"iOS (Axiom 8.0+): AFU (Graykey/Verakey), FFS (Graykey/Verakey), UFED Premium. Android (Axiom 8.0+): Full File System (FFS), After First Unlock (AFU), Logical+, UFED Premium FFS and AFU. Standard logical extractions not supported."},
  {id:36,mod:4,tag:"Mobile View",title:"Mobile View app selection behavior",body:"Selecting an app in Mobile View applies a filter in Artifacts Explorer. If 'Use preferred view for app' is selected, most applicable view auto-applies (e.g., WhatsApp → Conversation View). Supported vs Unsupported Apps are separated."},
  {id:37,mod:4,tag:"Artifact Explorer",title:"Artifact Explorer pane layout",body:"Navigation Pane (left): artifact category tree. Evidence Pane (center): list of artifact instances. Details Pane (right): full details of selected artifact including ARTIFACT INFORMATION, EVIDENCE INFORMATION, TAGS, PROFILES & MEDIA CATEGORIES cards."},
  {id:38,mod:4,tag:"Artifact Explorer",title:"Connections icon in Artifact Explorer",body:"After Connections are built, a CONNECTIONS icon appears beside any artifact attribute that has been connected to another artifact in the case. Clicking it navigates to the Connections Explorer showing the relationship."},

  // MODULE 5 - OPERATING SYSTEM
  {id:39,mod:5,tag:"OS Information",title:"OS Information artifact — source",body:"Parsed from SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion. Contains: ProductName, CurrentVersion, CurrentBuild, InstallDate, RegisteredOwner, DigitalProductId, InstallLocation. Using Source Linking jumps to Registry Explorer at this key."},
  {id:40,mod:5,tag:"OS Information",title:"Windows version numbering",body:"Windows 8.1 and earlier: incremental version numbers (6.0, 6.1, 6.2, 6.3). Windows 10+: version number in parenthesis shows year+month (2009 = ready Sep 2020). Windows 10/11 later versions: year+half (25H1 = 2025 first half). Use version AND build together."},
  {id:41,mod:5,tag:"OS Information",title:"Build 1803 significance",body:"Windows build 1803 introduced the Windows Timeline feature (Win+Tab shows activity timeline). Before 1803: Win+Tab only cascades open windows. Use build number to explain presence/absence of specific artifacts."},
  {id:42,mod:5,tag:"OS Information",title:"Shutdown time — ShutdownTime",body:"Source: SYSTEM hive → ControlSet###\\Control\\Windows → ShutdownTime value. Format: 8-byte Windows 64-bit Little Endian timestamp. Decoded via: highlight 8 bytes in HEX card → scroll to DECODE card → Axiom identifies as Windows 64-bit LE timestamp."},
  {id:43,mod:5,tag:"Registry",title:"Windows Registry hives overview",body:"SAM: user accounts, passwords, SIDs. SECURITY: security policy, audit settings. SOFTWARE: installed apps, OS config. SYSTEM: hardware config, services, shutdown time. NTUSER.DAT: per-user settings, MRU lists, UserAssist. UsrClass.dat: file type associations. Location: Windows\\System32\\config (global) + user profile (NTUSER.DAT, UsrClass.dat)."},
  {id:44,mod:5,tag:"Registry",title:"Registry Explorer in Axiom Examine",body:"Accessed via Source Linking from artifact Details pane OR from Explorer dropdown. Allows deep exploration of hive keys, sub-keys, and values. Can create user-defined artifacts for specific registry values. HEX card + DECODE card for interpreting raw values."},
  {id:45,mod:5,tag:"Time Zone",title:"Time Zone Information — sources",body:"Parsed from: SYSTEM hive → ControlSet###\\Control\\TimeZoneInformation (most values) AND SOFTWARE hive → Microsoft\\Windows NT\\CurrentVersion\\TimeZones (display name). CRITICAL: identify and set Axiom timezone to match device before analyzing any timestamps."},
  {id:46,mod:5,tag:"User Accounts",title:"User Accounts — Windows sources",body:"Parsed from: SAM + SOFTWARE hives at Windows\\System32\\config. Also: Windows.Old folders, restore points, volume shadow copies. Contains: username, description, SID, RID (last value of SID), last login, last password change, account status, profile path, group membership."},
  {id:47,mod:5,tag:"User Accounts",title:"Deleted user account recovery",body:"Windows XP and earlier: recovery from registry unallocated space was feasible. Windows Vista through Windows 11: highly unlikely due to improvements in registry space management. Look in: restore points, volume shadow copies, Windows Event Logs, SOFTWARE hive ProfileList key (ProfileImagePath value)."},
  {id:48,mod:5,tag:"User Accounts",title:"User SID and RID structure",body:"SID (Security Identifier) is unique to each user account. RID (Relative Identifier) is the last numeric value of the SID. In SAM, the user's sub-key is labeled with the RID in hexadecimal. SID/RID used for filtering Windows Event Logs to specific user activity."},
  {id:49,mod:5,tag:"File System",title:"File System Information artifact",body:"Parsed from the Boot Record (MBR or VBR) of the processed drive. Volume Offset (Bytes) value determines if MBR or VBR. Contains: drive geometry, reported file system type, Volume Serial Number (VSN), fixed or removable indicator."},
  {id:50,mod:5,tag:"Prefetch",title:"Prefetch — location and naming",body:"Location: Windows\\Prefetch\\*.pf. Naming convention: APPLICATIONNAME.EXT.HASH.pf. Example: AXCRYPT.EB7A4EAC.pf. The hash is a proprietary value — NOT the file hash. Created on first launch of an application."},
  {id:51,mod:5,tag:"Prefetch",title:"Prefetch — what it tracks",body:"Three key pieces: (1) Application name, (2) Run count (number of times launched), (3) Last 8 run times (dates/times of last 8 launches). System-wide (not user-specific). Tracks application that was launched, not which user ran it."},
  {id:52,mod:5,tag:"Prefetch",title:"Prefetch — maximum entries by OS",body:"Windows XP: 126 entries maximum. Windows Vista/7/8/8.1: 129 entries maximum. Windows 10/11: 1024 entries maximum. When max reached: Windows auto-deletes all but 32 entries (may follow FIFO). Boot prefetching (not forensically valuable) vs Application prefetching (forensically valuable)."},
  {id:53,mod:5,tag:"Prefetch",title:"Prefetch — compression in Windows 10/11",body:"Windows 10/11 Prefetch files are compressed with XPRESS HUFFMAN algorithm (MAM format). Windows 8.1 uses MAM for SuperFetch only (not Prefetch). Axiom understands this compression and automatically decompresses before parsing. Checksum present in SuperFetch files only."},
  {id:54,mod:5,tag:"USB Devices",title:"USB Devices artifact — sources",body:"Multiple source files: SOFTWARE and SYSTEM registry hives, setupapi.dev.log files, pagefile.sys, Windows Event Logs, NTUSER.DAT hives, and system files within restore points and volume shadow copies. Category: CONNECTED DEVICES → USB Devices."},
  {id:55,mod:5,tag:"USB Devices",title:"USB Devices — what it captures",body:"First connection date/time (when Windows installed device driver), device name, manufacturer, device identifiers (VID/PID), serial number, drive letter assigned by Windows, Windows user profile associated with the device."},
  {id:56,mod:5,tag:"Android",title:"Android Device Information",body:"Parsed from accounts_de.db. Contains: User ID, Username, Device ID, IMSI, ICCID, IMEI(s), Advertising ID, MCC (Mobile Country Code), MNC (Mobile Network Code), device phone number, Bluetooth name and address, timezone, location service info, serial number."},
  {id:57,mod:5,tag:"Android",title:"Android Accounts Information",body:"Also from accounts_de.db. Lists package name and username for each installed account/app. Some apps (Google) store unique usernames; others (WhatsApp, O365) do not. Seeing a package name confirms the app is installed even without a username."},
  {id:58,mod:5,tag:"Installed Software",title:"Installed Programs vs Installed Microsoft Programs",body:"Installed Programs: non-Microsoft applications. Installed Microsoft Programs: Microsoft-published applications. Both in APPLICATION USAGE category. Show: app name, publisher, install date, key last updated date. Identifies potential evidence sources and user capabilities."},

  // MODULE 6 - REFINED RESULTS
  {id:59,mod:6,tag:"Locally Accessed",title:"Locally Accessed Files and Folders",body:"Source: WebCacheV01.dat (ESE database). Also contains IE v10/v11 and Edge browsing history. Stored in user's AppData area → identifies which Windows user performed the activity. Entries showing ':Host: This PC' come from Windows native path variables (navigated via File Explorer)."},
  {id:60,mod:6,tag:"Identifiers",title:"Identifiers – People",body:"Contains information identifying individuals: email addresses, chat accounts and screen names, device user accounts, data from document metadata, information entered in web forms. Extracted from Email, Chat, and OS artifact categories. Used to build Profiles in Axiom Examine."},
  {id:61,mod:6,tag:"Identifiers",title:"Identifiers – Device",body:"Contains information identifying devices that may have been attached to the computer. Complements Identifiers – People. Both are the ONLY Refined Results artifacts used to create a Profile in Axiom Examine."},
  {id:62,mod:6,tag:"Identifiers",title:"Profiles in Axiom Examine",body:"Profiles are created ONLY from Identifiers – People AND Identifiers – Devices. They allow filtering the entire case to show only artifacts associated with a specific individual or device. Powerful for linking evidence to a single subject across multiple evidence sources."},
  {id:63,mod:6,tag:"Rebuilt Desktop",title:"Rebuilt Desktops (Windows)",body:"Available for Windows 10 ONLY. Reads: NTUSER.dat hive + SYSTEM registry hive + SOFTWARE registry hive. Displays: chosen wallpaper, Quick Launch icons on taskbar, files/folders/shortcuts on Desktop. Note: icons NOT in exact original positions (placed top-to-bottom, left-to-right)."},
  {id:64,mod:6,tag:"Route View",title:"Route View in Axiom Examine",body:"Up to 2 hours of recording permitted. Parameters adjustable during recording: zoom level, map position, playback speed, timeline position. After recording: Axiom exports video file to the 'Export' folder within the case folder. Supports DJI Log Files artifact for drone flight path reconstruction."},
  {id:65,mod:6,tag:"Cloud URLs",title:"Cloud Services URLs",body:"Identifies URLs in browser history associated with known cloud services. Helps scope cloud acquisition targets. Useful for identifying cloud accounts the subject was using that haven't yet been acquired."},
  {id:66,mod:6,tag:"Search",title:"Google Searches vs Parsed Search Queries",body:"Google Searches: ONLY searches conducted on Google.com. Parsed Search Queries: searches conducted on ALL OTHER search engines (Bing, Yahoo, DuckDuckGo, Baidu, etc.). Use BOTH artifacts for a complete picture of user search activity."},

  // MODULE 7 - WEB RELATED
  {id:67,mod:7,tag:"Chrome",title:"Chrome cache locations",body:"Three cache folders in user profile: AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\ (HTML, CSS, JS, small graphics), \\GPUCache\\ (GPU-accelerated data), \\Media Cache\\ (large media files like video/audio). Each folder: 1 index file + 4 block files (data_0 through data_3)."},
  {id:68,mod:7,tag:"Chrome",title:"Chrome cache — content vs metadata",body:"Chrome stores cached file CONTENT and file METADATA as TWO SEPARATE COMPONENTS within the same cache folder. Axiom Examine shows two EVIDENCE INFORMATION sections for Chrome cache records. Video files: content in \\Media Cache\\, metadata also in \\Media Cache\\."},
  {id:69,mod:7,tag:"Chrome",title:"Chrome bookmarks",body:"Stored in the Chrome History file. DETAILS card includes: URL, Added Date/Time, Name (bookmark name as it appears in Chrome), Parent (parent bookmark folder), Type (URL or parent folder)."},
  {id:70,mod:7,tag:"Firefox",title:"Firefox cache location",body:"AppData\\LOCAL (NOT Roaming)\\Mozilla\\Firefox\\Profiles\\xxxxxxxx.default-release\\cache2\\. Contains: 'index' file (metadata about cache), 'entries' subfolder (cached files), 'doomed' subfolder (expired content, deleted when Firefox closes/restarts)."},
  {id:71,mod:7,tag:"Firefox",title:"Firefox cache — metadata handling",body:"Firefox APPENDS metadata to the END of each cached file (unlike Chrome which stores them separately). The Content Size (Bytes) field in Axiom shows content only — NOT the full file size on disk. The logical file in the cache folder is always larger than Content Size due to the appended metadata."},
  {id:72,mod:7,tag:"Firefox",title:"Firefox bookmarks location",body:"places.sqlite database in the ROAMING profile: AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxxxxxxx.default-release\\places.sqlite. Tables: moz_places (URLs + visit history) AND moz_bookmarks (bookmark structure). DETAILS: URL, Date Added, Title, Last Modified, Bookmark Type."},
  {id:73,mod:7,tag:"Browser",title:"Session Recovery data",body:"Information about last open browser tabs — stored when the browser quits unexpectedly or crashes. Forensically valuable: reveals what the user was actively viewing at the time of the crash/shutdown, even if browsing history was cleared."},
  {id:74,mod:7,tag:"Browser",title:"WebKit browser data",body:"WebKit engine used by Chromium-based browsers (Chrome, Edge). Built-in SQLite Viewer in Axiom Examine (File System Explorer) allows direct inspection of browser SQLite databases. Most Chrome/Edge artifacts stored in SQLite databases."},
  {id:75,mod:7,tag:"Browser",title:"Browsing Cache forensic value",body:"Browser cache = temporary storage of website component files (HTML, JS, CSS, images, video). Reduces bandwidth by caching previously visited content. Forensically: proves websites were visited, may contain page content no longer available online, shows media viewed."},
  {id:76,mod:7,tag:"Timeline",title:"Timeline Explorer",body:"Accessed from Explorer dropdown. Streamlines and visualizes all case activity around a specific point in time. Build manually via Tools → Build Timeline or enable auto-build in Settings. Essential for establishing event chronology and identifying suspicious activity patterns."},

  // MODULE 8 - COMMUNICATIONS
  {id:77,mod:8,tag:"Email",title:"Email Explorer — Participants filter",body:"The Participants filter (Sender/Recipient) in Email Explorer is CASE SENSITIVE. 'jones' will NOT match 'Jones'. Can filter for both Sender AND Recipient simultaneously using OR logic. Accessible from Explorer dropdown menu."},
  {id:78,mod:8,tag:"Email",title:"Email — keyword search scope",body:"When conducting a keyword search from the FILTERS bar on email artifacts, the search covers ALL PARTS of the email (subject, body, headers, sender, recipient, etc.)."},
  {id:79,mod:8,tag:"Email",title:"Email Attachments artifact",body:"Located at: Email & Calendar → Email Attachments. Aggregates ALL attachments from ALL parsed email artifacts across all evidence sources in one location. Includes: Subject, Sender, Recipient of source email, 'Original Artifact' hyperlink back to parent email. Attachments also appear in Documents and Media categories."},
  {id:80,mod:8,tag:"Email",title:"Email export format",body:"Emails can be exported in PST format for external review in a PST viewer. Email Reports section in Axiom allows this export. Available from the reporting/export functions."},
  {id:81,mod:8,tag:"Email",title:"Email Headers forensic value",body:"Email headers may contain: accurate timestamps from email servers, IP addresses of sending servers, true sender information (even if display name is spoofed), routing path through mail servers. Source: DETAILS pane of email artifact."},
  {id:82,mod:8,tag:"Email",title:"Email Source Linking",body:"Clicking the Source link in email artifact Details pane transitions to File System Explorer highlighting the source file. For .OST files: compound file format — preview card may be blank; use TEXT AND HEX card in TEXT view for content review."},
  {id:83,mod:8,tag:"Chat",title:"Conversation View",body:"Presents chat/messaging artifacts in a threaded, human-readable format reflecting how the conversation appeared to the user. Auto-applied for WhatsApp via Mobile View ('Use preferred view for app'). Available for all supported messaging apps."},
  {id:84,mod:8,tag:"Translation",title:"Translation module",body:"Part of Magnet Models. Download from Customer Support Portal. Enable from Artifact Explorer. Usage: select foreign-language text in Details pane → right-click → 'Translate Selected Text' → Translated Text dialog appears. Available in multiple languages. Works for emails, chats, and documents."},
  {id:85,mod:8,tag:"Email",title:"Compound files (.OST)",body:".OST = Outlook Offline Storage Table. Compound file containing multiple data streams. In Axiom: preview card is often blank for compound files. Use TEXT AND HEX card → switch to TEXT view for content. Source Linking opens File System Explorer."},

  // MODULE 9 - ENCRYPTION & ANTI-FORENSICS
  {id:86,mod:9,tag:"Encryption",title:"Encrypted Files artifact",body:"AXIOM Process identifies encrypted files using Passware plugins. The Encrypted Files artifact does NOT display which program was used to encrypt the files. Anti-forensics tools identified by searching for known executables and data structures."},
  {id:87,mod:9,tag:"Encryption",title:"BitLocker decryption workflow",body:"1. Add encrypted image → padlock icon appears in Axiom Process. 2. Encryption type auto-identified as BitLocker. 3. Find Recovery Key via BitLocker Recovery Key artifact in Axiom Examine. 4. Enter Recovery Key ID in Axiom Process. 5. NEXT button grayed out until valid key entered. 6. Click NEXT to proceed with decryption and processing."},
  {id:88,mod:9,tag:"Encryption",title:"BitLocker Recovery Key — Lewis Case",body:"Lewis Case exercise Recovery Key ID: 7F6C6887-C345-4572-8C17-9B73F57BF68F. Recovery key value (from BitLocker Recovery Key artifact): 586245-692846-693374-485111-198748-494252-599632-041833. After entering key, NEXT button becomes enabled."},
  {id:89,mod:9,tag:"Evidence",title:"Adding new evidence to open case",body:"From Axiom Examine (case already open): Process → Add new evidence to case. Update Scanned By information. Add new evidence source. Previously selected processing options still apply — no need to reconfigure keywords, hash sets, etc."},
  {id:90,mod:9,tag:"Post-Processing",title:"Post-decryption auto-build",body:"After BitLocker decryption completes and Axiom Examine reloads: automatically begins building Timeline, Connections, and World Map IF 'auto-build' options enabled in Settings. Otherwise must be triggered manually. 'Processing complete' message → click OK to reload case."},
  {id:91,mod:9,tag:"Connections",title:"Connections Explorer",body:"Displays artifact relationships as a network diagram. Answers: WHO (who was involved), WHAT (what happened), WHEN (when it occurred), WHERE (where did it take place), WHY (why did it happen), HOW (how did it happen). CONNECTIONS icon appears beside linked artifact attributes after build."},
  {id:92,mod:9,tag:"Connections",title:"Building Connections",body:"Manual build: Tools → Build Connections. Auto-build: Tools → Settings → Connections → enable 'Automatically build connections on case open'. Connection information collected from ALL evidence items regardless of source. Examiners expected to return to Connections Explorer multiple times throughout a case."},

  // MODULE 10 - CLOUD
  {id:93,mod:10,tag:"OneDrive",title:"OneDrive local artifact vs Cloud artifact",body:"Local 'OneDrive' artifact: files stored in local OneDrive sync folder, parsed from .ini file in AppData. 'Cloud OneDrive Files': data acquired from Microsoft's OneDrive cloud via Axiom Cloud. Cloud version may contain files NOT stored locally AND shows file sharing information. Local version does NOT show sharing."},
  {id:94,mod:10,tag:"OneDrive",title:"OneDrive file hash verification",body:"File hashes in Connections data confirm file identity across multiple storage locations. A hash match between cloud artifact, local hard drive artifact, and USB artifact confirms they are the exact same file. Critical for proving data exfiltration paths."},
  {id:95,mod:10,tag:"Dropbox",title:"Cloud Dropbox Files artifact",body:"Contains: file location within Dropbox account, File ID, File Version ID, server-side last modified date/time, client-side last modified date/time, original photo timestamp (if present), preview of file content."},
  {id:96,mod:10,tag:"Passwords",title:"Cloud passwords and tokens — forensic value",body:"Passwords/Token category in Cloud Accounts Information. Password field shows TOKEN content (not plaintext password). People habitually reuse passwords — test found passwords against encrypted files, backups, and AxCrypt files in the case. Tokens may allow future re-acquisition of cloud account."},
  {id:97,mod:10,tag:"Google",title:"Google Cloud artifacts",body:"Google platform artifacts are among the most broad and useful due to the scope of Google services. Acquired via Axiom Cloud from Google account. Can include: Gmail, Google Drive files, Google Photos, Google Account Activity, Location History, and more."},
  {id:98,mod:10,tag:"Cloud Auth",title:"Cloud authentication methods",body:"Axiom Cloud can access cloud accounts using: Passwords (account password) and/or Tokens (OAuth tokens, API tokens, session tokens). Both methods allow acquisition of cloud account data for evidence purposes."},

  // MODULE 11 - MEDIA
  {id:99,mod:11,tag:"Media Explorer",title:"Media Explorer overview",body:"Media-focused view of case evidence. Must be built manually or via auto-build on case open (Tools → Settings → Automatically build the media explorer on case open). Separate from Artifact Explorer. Provides media-specific filters, grouping, and preview capabilities."},
  {id:100,mod:11,tag:"Hit Stacking",title:"Hit Stacking definition",body:"Combines media items that have the same MD5/SHA1 hash into a single 'stacked' item, regardless of how many copies exist across all evidence items. Stack icon shown in bottom-right corner of thumbnail. Click stack icon to see all individual copies with file extension and source location."},
  {id:101,mod:11,tag:"Hit Stacking",title:"Hit Stacking — grading behavior",body:"When a stacked item is graded or tagged, the value is applied to ALL copies of the file across ALL evidence items — not just the selected instance. Prevents repeated exposure to identical content. Ensures consistent grading/tagging."},
  {id:102,mod:11,tag:"Preview",title:"Quick Media Preview",body:"Hover over image: pan and zoom with mouse. Hover over video: move mouse LEFT → RIGHT to scrub/preview entire video without full playback. Useful for quickly previewing lengthy videos. Preview pops up unless media is blurred/blocked. Does not require full playback."},
  {id:103,mod:11,tag:"Video",title:"Video previews — two types",body:"Two available video previews: (1) Actual video preview (playback), (2) Filmstrip preview (still frames). Axiom Process takes still frames at every 10% of the video duration to create the filmstrip. Use '+' key to grade all visible uncategorized images."},
  {id:104,mod:11,tag:"Filter Groups",title:"Media Explorer filter groups",body:"INVESTIGATION LEADS: original creation dates, geolocation data, social media-sourced media. CAMERA DETAILS: EXIF metadata → originating device type. VICS ATTRIBUTES: Project VIC hash set matches (known media). MEDIA ATTRIBUTES: file size, skin tone percentage. VIDEO ATTRIBUTES: length, format, carving size. FILE ATTRIBUTES: deleted source, EXIF status, extension, recovery method."},
  {id:105,mod:11,tag:"CBIR",title:"CBIR — Content-Based Image Retrieval",body:"Searches for visually similar images based on image content (not filename or metadata). Available in Media Explorer. Useful for finding related images or identifying copies of images stored under different names. Requires Magnet Models processing."},
  {id:106,mod:11,tag:"Related Artifacts",title:"Related Artifacts in Media",body:"Click image in Details pane → shows Related Artifacts card with hyperlink. Also accessible via right-click → View Related Artifacts. Links media items to other artifacts in the case (e.g., an image found in email, also on USB, also in cloud storage)."},

  // MODULE 12 - REPORTING
  {id:107,mod:12,tag:"MCFE Exam",title:"MCFE exam structure",body:"75 questions in 120 minutes. Passing score: 80% or higher. Format: multiple choice AND true/false. Open book (PDF manual searchable during exam), open case file (your processed MFDB). Two components: general knowledge questions (AXIOM Process/Examine functions) + practical questions (based on your processed case file)."},
  {id:108,mod:12,tag:"MCFE Exam",title:"MCFE exam attempts and validity",body:"Fail 1st attempt: immediate 2nd attempt allowed. Fail 2nd attempt: 60-day lockout before next attempt. Certification valid: 2 years from date of successful completion. Recertification available. Delivered online, self-paced after completing AX200 (or CY200, BCERT, eligible custom course)."},
  {id:109,mod:12,tag:"MCFE Exam",title:"MCFE qualifying courses",body:"AX200 (Magnet AXIOM Examinations), CY200, BCERT (offered at NCFI), or custom courses combining AX200 core competency components. Custom course eligibility evaluated based on planned/delivered curriculum prior to delivery."},
  {id:110,mod:12,tag:"Reporting",title:"Tagging artifacts in Axiom Examine",body:"Tags applied via TAGS, PROFILES & MEDIA CATEGORIES pane in the Details pane. Click 'ADD NEW TAG', enter tag name, click OKAY. Tags can be shared across cases. In Media: tagging one item in a hit stack applies tag to ALL copies. Tags appear in reports."},
  {id:111,mod:12,tag:"Reporting",title:"Timestamps in Axiom Examine",body:"Axiom displays all timestamps with millisecond precision — 3 decimal places. Example: 20/03/2025 14:00:55.000. Consistent across all artifact types. Critical for establishing precise event sequences."},
  {id:112,mod:12,tag:"Reporting",title:"Exporting from Artifacts Explorer",body:"Multiple export formats available from the Artifacts view. Case Reporting → Final Report includes tagged artifacts, timeline data, case information. Email export available in PST format. Saving files from Artifact/File System Explorers available for individual artifacts."},
  {id:113,mod:12,tag:"Reporting",title:"Portable Cases",body:"Axiom can generate portable cases — a subset of case artifacts that can be shared with others who have Axiom Examine installed, without sharing the full evidence. Useful for sharing specific findings with investigators or reviewers."},
  {id:114,mod:12,tag:"Reporting",title:"Magnet AI picture grading",body:"Magnet AI categorizes pictures into categories: possible weapons, possible drugs, militants, vehicles, human faces, and others. Grade all visible uncategorized images: press '+' key. Remove a category from one image: press '–' key. Bulk grading available."},

  // CROSS-MODULE FACTS
  {id:115,mod:0,tag:"Key Facts",title:"Artifact Reference location",body:"Help → Documentation → Artifact Reference. Lists ALL artifacts that Axiom searches for, their column meanings, source locations, and forensic context. Available in Axiom Examine and can be used during the MCFE exam. Essential reference for unfamiliar artifacts."},
  {id:116,mod:0,tag:"Key Facts",title:"SQLite viewer in Axiom Examine",body:"Built into the File System Explorer. Access: File System Explorer → navigate to SQLite database file → open in SQLite Viewer. Essential for viewing raw browser data (Chrome History, Firefox places.sqlite, etc.) and other SQLite-based artifacts."},
  {id:117,mod:0,tag:"Key Facts",title:"Document Created Date vs File System Created",body:"Document Created Date/Time: comes from the document's internal metadata (e.g., Word document properties). File System Created Date/Time: comes from the file system itself (when the file entry was created on disk). These can differ significantly — metadata can be manipulated."},
  {id:118,mod:0,tag:"Key Facts",title:"Document content display location",body:"The content of a document artifact is displayed in the PREVIEW CARD in the DETAILS PANE. Not in the Evidence Pane. The Preview Card shows the document content visually (for supported formats). The TEXT AND HEX card shows raw text/hex content."},
  {id:119,mod:0,tag:"Key Facts",title:"REFINED RESULTS purpose",body:"The REFINED RESULTS artifact category helps the examiner expedite their investigation by placing the most useful investigative artifacts in a single organized location. Includes: Google Searches, Parsed Search Queries, Cloud Services URLs, Locally Accessed Files, Identifiers, Rebuilt Desktops."},
  {id:120,mod:0,tag:"Key Facts",title:"Magnet One default naming",body:"Cases: CSE- prefix. Evidence: EVD- prefix. Both customizable via Magnet One Settings. Accessed via cog icon in top-right of Magnet One dashboard. Also configurable: organization name, date format, evidence numbering systems."},
];



// ─── RUNNING EXERCISES DATA ─────────────────────────────────────────────────────
const MANUAL_EXERCISES = [
  {
    mod:1,
    label:"M1",
    title:"Course Introduction & Installation",
    color:"#0ea5e9",
    running:[
      {name:"Installation & Initial Setup",steps:["1. Download and run the Magnet AXIOM installer","2. Open Axiom Process after installation","3. Navigate to Tools → Settings","4. Review Search Speed settings and set thread count to match physical core count (max 32)","5. Change the Temporary File Location to a separate physical disk: Tools → Settings → Custom Location","6. Enable auto-build: Tools → Settings → Connections → Automatically build connections on case open","7. Enable auto-build: Tools → Settings → Timeline → Automatically build timeline on case open","8. Review What's New: Help → Documentation → User Guide","9. Verify installation by checking the version number displayed in Axiom Process title bar"]},
    ],
    student:null,
  },
  {
    mod:2,
    label:"M2",
    title:"Evidence Processing & Case Creation",
    color:"#00d4a0",
    running:[
      {name:"Process Settings",steps:["1. If it is not already running, double click the desktop icon for Axiom Process to launch it.","2. From the menu bar, click on the Tools dropdown and then select Settings.","3. Review the ‘Preferences’ category with the instructor.","4. Review the ‘Imaging’ category with the instructor, ensure the following settings are enabled: b. Review the ‘Processing’ category with the instructor, ensure the following setting is enabled:","6. Image hashing: ensure both the boxes are ticked and enabled. (Calculate a hash value for each evidence source that’s being acquired) and (Verify the hash value of each acquired image file (E01 image files only)).","5. a. Review the ‘Product Integrations’ category.","8. Enable the Magnet One box. To connect Magnet One and Axiom an Integration File is needed which is a ‘JSON’ format.","7. Instructor Demo – Integrating Axiom and Magnet One As mentioned above, when integrating Magnet One to Magnet Axiom, it is a simple process that uses an integration file - Magnet_Integration.json that can be downloaded from Magnet One and imported into Axiom Process settings.","1. Navigate to Magnet One - https://us.sbx.magnetone.com/","2. Log in to Magnet One","3. Click on the cog dropdown, click on the settings. Module 1 – Course Introduction & Magnet Axiom Installation","4. Navigate to the Integrations tab."]},
      {name:"Creating a Case",steps:["1. Start Axiom Process from the icon on the Desktop","2. Click the Create New Case button.","3. The new case opens at the CASE DETAILS.","4. In the CASE INFORMATION section, enter a Case number of your choosing.","5. Under LOCATION FOR CASE FILES, change the Folder name to “AX200 Katie Lewis Case”.","6. Click BROWSE next to the File path and set the case folder location to be the \\Cases\\ folder on the Desktop.","7. Under LOCATION FOR ACQUIRED EVIDENCE, also change the Folder name to “Evidence” and set the File path as the \\Evidence\\ folder on the Desktop.","8. In the SCAN INFORMATION section, enter your name into the Scanned by field, and a short Description. Adding evidence to the case","1. Click the GO TO EVIDENCE SOURCES button.","2. This brings the user to the EVIDENCE SOURCES screen.","3. Under SELECT EVIDENCE SOURCE, click the COMPUTER icon, then the WINDOWS icon.","4. In the LOAD OR ACQUIRE window, click the LOAD EVIDENCE icon."]},
    ],
    student:null,
  },
  {
    mod:3,
    label:"M3",
    title:"Magnet One",
    color:"#a78bfa",
    running:[
      {name:"Magnet One Navigation",steps:["1. Open Magnet One and review the Dashboard overview","2. Click the cog icon (top right) to access Configuration","3. Review Hardware, Software, Settings, and Users configuration tabs","4. Note the default case naming prefix (CSE-) and evidence prefix (EVD-)","5. Create a test case using the default naming convention","6. Assign the case to an examiner from the Users list","7. Review the Recent Events feed on the dashboard"]},
    ],
    student:null,
  },
  {
    mod:4,
    label:"M4",
    title:"Axiom Examine Interface",
    color:"#f59e0b",
    running:[
      {name:"Event Snapshot & Case Dashboard",steps:["1. Click on the Event Snapshot panel and click on the CREATE A SNAPSHOT button.","2. Within the ‘Name of Snapshot’ enter: Snapshot Example, add a case type in the dropdown.","3. Within the Date of event enter the: 01 March 2025 and leave the default time as 12:00AM and click NEXT.","4. On the date and time ranges, enter a range between: 01 February 2025 and 01 September 2025, again leaving the start and end time as default and click NEXT.","5. Within the Evidence Sources, select all the available items, you can additionally mark them as the Suspect’s device, click NEXT.","6. From the items to include, the default should be ‘All evidence’, leave this option selected and then click NEXT.","7. On the ‘Dashboard cards’, Deselect the ‘Routes’ card and ensure all options are selected, then click CREATE.","8. Once the Snapshot has finished creating click the ‘ VIEW SNAPSHOT ’ to open the cards.","9. Review the available information. EVIDENCE SOURCES EVIDENCE SOURCES allows the examiner quick access to individual evidence details and identifiers such as the operating system information and mobile device details including IMEI,"]},
    ],
    student:null,
  },
  {
    mod:5,
    label:"M5",
    title:"Operating System Information",
    color:"#f87171",
    running:[
      {name:"Operating System Information",steps:["10. Navigate to Artifact Explorer → Operating System → Operating System Information","11. Select the entry in the EVIDENCE pane. Note the artifact path Windows\\System32\\config","12. In the DETAILS pane, note the SOFTWARE and SYSTEM files in the Source fields under EVIDENCE INFORMATION","13. Using the SOFTWARE file evidence, select the Location link Microsoft\\Windows NT\\CurrentVersion and view source in Registry Explorer","14. In the EVIDENCE pane, view the values from the CurrentVersion key","15. Return to Artifacts Explorer. Note multiple Location entries for SYSTEM evidence information","16. Follow the SYSTEM file Location link ControlSet001\\Control\\Windows","17. In EVIDENCE pane, note the ShutdownTime value. Select it and view in DETAILS pane and HEX card","18. Highlight the 8-byte value in the HEX card and scroll to the DECODE card. Note Axiom identifies this as a Windows 64-bit little endian timestamp. Compare decoded value to Last Shutdown Date/Time in Artifacts Explorer","19. Return to Artifacts Explorer and expand the TAGS, PROFILES & MEDIA CATEGORIES pane","20. Click ADD NEW TAG, enter OPERATING SYSTEM INFORMATION, click OKAY","21. In the EVIDENCE pane, notice the tag is now applied"]},
      {name:"Timezone Information",steps:["1. Return to Artifact Explorer, select the Timezone Information artifact from OPERATING SYSTEM category","2. In the EVIDENCE pane, select the entry and review information to determine which timezone offset applied to this device","3. In the DETAILS pane, note the data parsed from the SYSTEM and SOFTWARE registry hives","4. Expand the TAGS, PROFILES & MEDIA CATEGORIES pane, click ADD A NEW TAG, type: TIMEZONE INFORMATION, click OKAY","5. Notice the tag has been added to this artifact"]},
      {name:"Android Information",steps:["1. Expand the Application Usage category, select the Android Device Information artifact","2. Click on the entry relating to user Katie Lewis and in the DETAILS pane, review the data","3. Notice in the DETAILS pane the extracted details: Device ID, IMSI, IMEI(s), MNC, and MCC","4. Scroll down to Evidence Sources and review the locations"]},
      {name:"User Accounts",steps:["1. From Artifact Explorer, OPERATING SYSTEM category, select User Accounts – Windows artifact","2. Select the Katie Lewis entry in the EVIDENCE pane. Note the Security Identifier with Relative Identifier of 1001. Note the first part of the SID matches the ID in File System Information","3. View EVIDENCE INFORMATION entries for the SAM file and the Location keys. Review and corroborate in the Registry","4. Continue reviewing Katie Lewis account: email address, password information, relevant dates and times for account logins","5. Create a new tag called Lewis System Information and add this information to the tag"]},
      {name:"USB Devices",steps:["1. Clear any filters that may be in place","2. Navigate to Connected Devices category, expand dropdown and select USB Devices","3. Explore the available columns: Device VID and PID, serial numbers, friendly name, and dates/times","4. Click on the Friendly Name column header to sort the data","5. Review entries for external devices such as USB 1 and Katie's A12","6. Scroll across the Evidence pane to see dates/times: Install Date and Time, last insertion, last removal dates","7. Click on the entry with friendly name USB 1","8. In Details Pane review the Last connected date and time on 7th March 2025","9. Review the device description and manufacturer details"]},
      {name:"LNK Files",steps:["1. Clear any filters that may be in place","2. Navigate to and expand Operating System Category, locate LNK Files artifacts","3. Click on the Created Date/Time column header to sort data","4. Notice the large number of LNK files (user and system created). Narrow down with filtering","5. Right-click on the Linked Path column, select Filter on Column from dropdown","6. In the filter window, select the Advanced option","7. Click on the Regex pattern matching radio button","8. In the search box enter: ^(?!.*(%|System|Windows|Program)).*[A-Z]:\\\\.*","   NOTE: ^ = start of string. (?!.*(%|system|windows|program)) = negative lookahead blocking system paths. .*[A-Z]:\\\\.* = matches Windows drive paths (C:\\, E:\\). This removes system/Windows paths and shows only user profile and external drive entries.","9. Click SEARCH","10. Review LNK files relating to the Katie Lewis account","11. Click on one entry and review the DETAILS PANE","12. Note: Created/Modified/Accessed dates = LNK file itself. Target Created/Modified/Accessed = the linked file or folder","13. Clear all filters"]},
      {name:"Jump Lists",steps:["1. Clear any filters in place","2. Click on the Linked Path column to sort the data","3. Right click on the Potential App Name column and select Filter on Column from dropdown","4. In search box type: Libre, then click SEARCH","5. Locate the entry with Volume Serial Number (VSN) of 34D98C3E","6. This entry is linked to a file called Customer Data Export - Q1-Q2 2025.xlsx — review details in DETAILS PANE"]},
      {name:"Windows Prefetch Files",steps:["1. Clear any filters in place","2. Navigate to Prefetch Files – Windows 8/10/11 artifact","3. Right click on Application Name column and select Filter on Column","4. In the search bar, type and search for: OneDrive","5. In DETAILS PANE, review dates and times for all available run times. Notice the difference between the 4th run time and the last run time","6. The Last Run Date/Time is the most recent instance. Each additional instance (2nd, 3rd, 4th) is progressively further away in time"]},
      {name:"Windows Event Logs",steps:["1. Click CLEAR FILTERS to clear any filters in place","2. In the OPERATING SYSTEM category, scroll to Windows Event Logs and review the subcategories","3. Click on Windows Event Logs – User Events","4. Click on Created Date/Time column to sort data","5. On filters bar, click ADVANCED to open filtering box","6. In SEARCH BY TERM apply filter: 4624, then click ADD ANOTHER TERM and enter: 4634. (4624 = logon, 4634 = logoff)","7. Set search logic to OR and hit SEARCH","8. Scroll and locate the Target User SID column, apply Filter on Column for user account security identifiers","9. Enter filter term: 1001 (the Relative Identifier for Katie Lewis discovered earlier)","10. Review dates/times for account logins, logon types, and Target Username","11. Clear these filters by clicking CLEAR FILTER","12. In the global search bar, type: BitLocker and click GO","13. Navigate to Windows Event Logs artifact","14. Right-click on Security Identifier column and select Filter on Column","15. Type: 1001 and click SEARCH, then click Created Date and Time column header to sort","16. Click on first entry on 07-Mar-2025 15:29:10.568, review in Details pane","17. Review Event Data information — reference to a device being BitLocker encrypted with volume mount point E:"]},
    ],
    student:{questions:["1. Clear any filters that may be in place","2. Review the Operating System Information for the Windows 11 PC. Using the build number and online research, what is the associated version number?","3. Using the User Accounts – Windows artifact only, does it appear the suspect could claim the Guest account was used to steal or access this information? Explain your reasoning.","4. Review the USB Devices artifacts, locate the device with a Last Assigned Drive Letter. Determine the Vendor ID and Product ID for this artifact.","5. Using various operating system artifacts relating to AxCrypt.exe: (a) Has it been run more than once? If so, what is the most recent date and time? (b) Can you determine which User Account or Security Identifier this application is associated with?"],answers:["","Build 26100 = Windows 11 version 24H2 (October 2024 release). Use the build number from OS Information artifact and cross-reference with Microsoft documentation.","No. The Guest account (RID 501) shows a disabled status and zero Local Login Count. All activity is attributed to Katie Lewis (RID 1001), who is the sole active user account with login history.","VID: 0781 (SanDisk Corporation), PID: 5583. Found in Connected Devices → USB Devices → select the device with a Last Assigned Drive Letter → check DETAILS pane for VID/PID fields.","(a) Yes. Prefetch Files artifact shows AXCRYPT.EB7A4EAC.pf with Run Count greater than 1. Most recent date/time is in the Last Run Date/Time column. (b) Cross-reference: Prefetch is system-wide. Check UserAssist key in NTUSER.DAT (user-specific execution) to attribute to Katie Lewis (SID ending 1001). Windows Event Logs (Event ID 4688 process creation if available) also provide per-user attribution."]},
  },
  {
    mod:6,
    label:"M6",
    title:"Refined Results",
    color:"#34d399",
    running:[
      {name:"Windows Prefetch Files (continued)",steps:["1. Clear any filters in place","2. Navigate to Operating System → Prefetch Files – Windows 8/10/11","3. Right click Application Name and select Filter on Column","4. Search for OneDrive and review run times in DETAILS pane","5. Note the difference between the 4th run time and the Last Run Date/Time"]},
      {name:"Windows Event Logs",steps:["1. Clear all filters","2. Expand OPERATING SYSTEM → Windows Event Logs → review subcategories","3. Select Windows Event Logs – User Events","4. Sort by Created Date/Time","5. Apply ADVANCED filter: search term 4624, ADD ANOTHER TERM 4634, set logic to OR, click SEARCH","6. Apply Filter on Column for Target User SID = 1001 (Katie Lewis RID)","7. Review account login events, logon types, Target Username","8. Clear filters, search globally for BitLocker","9. In Windows Event Logs, Filter on Column Security Identifier = 1001","10. Review entry on 07-Mar-2025 showing BitLocker associated with volume E:"]},
      {name:"Google Searches",steps:["1. Clear any filters in place","2. Navigate to Refined Results → Google Searches","3. Review the searches present and note dates and times","4. Identify any searches relevant to the investigation","5. Tag relevant entries"]},
      {name:"Parsed Search Queries",steps:["1. Navigate to Refined Results → Parsed Search Queries","2. Review the search queries extracted from non-Google browsers (Bing, Yahoo, DuckDuckGo)","3. Note the Search Engine column identifying which service was used","4. Compare with Google Searches for a complete picture of user search activity"]},
      {name:"Cloud Services URLs",steps:["1. Navigate to Refined Results → Cloud Services URLs","2. Review the cloud services identified from browser history","3. Note which cloud platforms the user was accessing","4. These can be used to identify targets for cloud acquisition warrants"]},
      {name:"Locally Accessed Files",steps:["1. Navigate to Refined Results → Locally Accessed Files and Folders","2. Review entries — note those starting with :Host: This PC (Windows Explorer navigation)","3. Note entries starting with file:/// (files opened in Edge browser)","4. Identify any file paths pointing to external drives (e.g. E:\\) or specific document folders","5. Cross-reference with LNK Files for the same file paths to confirm access pattern"]},
    ],
    student:{questions:["1. Using Refined Results artifacts, identify any cloud services Baldwin accessed regularly","2. In the Locally Accessed Files artifact, can you find evidence of Baldwin navigating to external USB drive contents? What path shows this?","3. What search terms did Baldwin use that may be relevant to the investigation?"],answers:["1. Check Cloud Services URLs artifact. Look for OneDrive, Dropbox, Google Drive, or any cloud storage URL patterns.","2. Look for :Host: This PC\\E:\\ or similar external drive path entries. The :Host: prefix indicates Windows File Explorer navigation.","3. Check both Google Searches AND Parsed Search Queries for terms related to the investigation subject matter. Note the timestamps relative to other activities."]},
  },
  {
    mod:7,
    label:"M7",
    title:"Web Related",
    color:"#60a5fa",
    running:[
      {name:"Route View",steps:["1. Navigate to Refined Results → Route View (or access from Map view)","2. Select the evidence source containing location data","3. Select the relevant artifact type (DJI Log Files, or GPS artifacts from mobile)","4. Configure start/end date-time for the route","5. Click Calculate Routes","6. Select a route by duration","7. Review the animated map showing the route","8. Use recording controls if you wish to record the route for reporting (max 2 hours)"]},
      {name:"Chrome History",steps:["1. Clear any filters in place","2. Navigate to Web Related → Chrome Browser Visits","3. Sort by Date/Time descending to review most recent browsing activity","4. Review the URL column and Title column — titles often reveal more than URLs","5. Note visit count for frequently visited sites","6. Use Source Linking to view the raw Chrome History SQLite database in File System Explorer → SQLite Viewer","7. Tag any relevant browsing entries"]},
      {name:"Typed URLs",steps:["1. Navigate to Web Related → Typed URLs","2. Review URLs manually typed by the user into IE/Edge address bar","3. Note timestamps associated with each typed URL","4. These represent deliberate direct navigation — strong evidence of intent","5. Cross-reference with browser history to see if the same URLs appear in visit history"]},
      {name:"Timeline Explorer",steps:["1. Build the Timeline if not already built: Tools → Build Timeline","2. Switch to Timeline Explorer via the Explorer dropdown","3. Navigate to the time period of interest using the timeline controls","4. Observe all artifact types aggregated chronologically","5. Apply Relative Date/Time filter around a specific event to see all activity within that window","6. Use the Timeline to establish event sequence and corroborate artifact timestamps across evidence sources"]},
    ],
    student:{questions:["1. Review Chrome Browser Visits — what sites did the subject access that may be relevant to the investigation?","2. Using the Timeline Explorer, build a chronological narrative of the key events for the day of the incident.","3. Are there any Typed URLs that show deliberate direct navigation to sites of interest?"],answers:["1. Navigate to Web Related → Chrome Browser Visits, sort by date, look for cloud storage URLs, communication platforms, and any sites relevant to the case facts.","2. Build Timeline (Tools → Build Timeline), navigate to the relevant date, apply date range filter, screenshot the sequence of events. Cross-reference timestamps across artifact types.","3. Typed URLs show deliberate manual navigation — much stronger intent evidence than clicked links. Cross-reference with Chrome History and identify if these URLs also appear in browser cache (proving the page was fully loaded)."]},
  },
  {
    mod:8,
    label:"M8",
    title:"Communications",
    color:"#818cf8",
    running:[
      {name:"Emails",steps:["1. Switch to Email Explorer via Explorer dropdown","2. In the NAVIGATION pane, review available email sources","3. Apply the Participants filter — enter a name or email address in CORRECT CAPITALISATION (CASE SENSITIVE)","4. Review the filtered emails in the EVIDENCE pane","5. Apply keyword search from the Filters bar (searches ALL PARTS of email: subject, body, headers, sender, recipient)","6. Click on an email and review DETAILS pane including headers","7. For Outlook OST files: if the Preview card is blank, switch to TEXT AND HEX card → TEXT view","8. Tag relevant emails with appropriate tags"]},
      {name:"Email Attachments",steps:["1. Navigate to Email & Calendar → Email Attachments","2. This single artifact aggregates ALL attachments from ALL email sources across all evidence","3. Review the Subject, Sender, Recipient columns","4. Click the Original Artifact hyperlink to jump back to the parent email for full context","5. Note that attachments also appear in Documents and Media categories for cross-reference","6. Filter by date range if needed to focus on relevant period","7. Use file hashes from attachments to search for the same files in File System Explorer and USB device evidence"]},
    ],
    student:{questions:["1. Using the Email Explorer, find all communications between the two main subjects. What was the nature of their correspondence?","2. Review the Email Attachments artifact — are there any documents shared between subjects that are relevant to the investigation?","3. What is the earliest communication between subjects found in the email evidence?"],answers:["1. Switch to Email Explorer, apply Participants filter with correct capitalisation for each subject. Review email threads chronologically. Note subject lines, attachment presence, and tone of communications.","2. Navigate to Email & Calendar → Email Attachments. Filter by the relevant sender/recipient. Note filenames, file sizes, and use Original Artifact link to see full email context. Check if attachment file hashes match files found elsewhere in evidence.","3. Sort by Date/Time ascending in Email Explorer. The earliest email establishes when the subjects first began communicating via this channel — useful for timeline construction."]},
  },
  {
    mod:9,
    label:"M9",
    title:"Encryption & Anti-Forensic Tools",
    color:"#fb923c",
    running:[
      {name:"Connections Explorer",steps:["1. Navigate to Tools → Build Connections (or verify auto-build completed)","2. Switch to Connections Explorer via Explorer dropdown","3. Review the network diagram showing nodes (artifacts/entities) and edges (relationships)","4. Return to Artifact Explorer — look for CONNECTIONS icons beside artifact attribute values in Details pane","5. Click a CONNECTIONS icon to jump to Connections Explorer focused on that specific relationship","6. Trace the path between a document on the laptop and the same document in other evidence sources (same hash)","7. Use Connections to answer: WHO (user accounts), WHAT (files/apps), WHEN (timestamps), WHERE (devices), WHY (communication intent), HOW (transfer method)","8. Note that Connections must be REBUILT after any new evidence is added"]},
      {name:"BitLocker Decryption",steps:["1. In Axiom Examine: Process → Add new evidence to case","2. Add the encrypted USB drive image — note the PADLOCK ICON indicating encrypted drive","3. Axiom Process auto-identifies the encryption as BitLocker and displays the Recovery Key ID","4. WITHOUT closing Process, switch to Axiom Examine","5. Navigate to Encryption and Credentials → BitLocker Recovery Keys","6. Find the entry matching the Key ID shown in Process","7. Copy the 48-digit Recovery Key value","8. Switch back to Axiom Process, enter the Recovery Key value in the Recovery Key field","9. Click CHECK — if valid, the NEXT button becomes enabled","10. Proceed through processing. After completion: Axiom Examine auto-builds Timeline, Connections, World Map"]},
    ],
    student:{questions:["1. Using the Connections Explorer, can you establish a link between files found on the laptop and files found on the USB drive?","2. What encryption tools were found on the system? How did you identify them?","3. Using the BitLocker artifact, what was the Recovery Key ID for the encrypted USB device?"],answers:["1. Build Connections (Tools → Build Connections). In Connections Explorer, find file hash nodes that appear in both laptop File System and USB drive evidence. A matching hash = mathematically conclusive proof it is the same file across both devices.","2. Check: Prefetch Files for AXCRYPT.EXE, VERACRYPT.EXE etc (proves execution). Installed Programs (proves installation). Encrypted Files artifact (identifies encrypted files but NOT which tool). Windows Event Logs Event ID 4688 (process creation with encryption tool name).","3. Navigate to Encryption and Credentials → BitLocker Recovery Keys. The Key ID field shows the unique identifier matching what Axiom Process displayed when the encrypted drive was added."]},
  },
  {
    mod:10,
    label:"M10",
    title:"Cloud Introduction",
    color:"#4ade80",
    running:[
      {name:"Reviewing Cloud Artifacts",steps:["1. Navigate to Case Dashboard → INSIGHTS → Potential Cloud Evidence Leads","2. Review the cloud accounts identified from local device artifacts","3. Note account identifiers (email addresses, usernames) and associated cloud services","4. Navigate to Cloud Storage → Cloud OneDrive Files (if cloud acquisition available)","5. Compare with local OneDrive artifact — identify files present only in cloud (not synced locally)","6. Review the Shared With column for any Cloud OneDrive Files — identifies external sharing","7. Navigate to Cloud Storage → Cloud Accounts Information","8. Review Passwords/Tokens fields — even tokens may allow re-acquisition","9. Check Cloud Storage → Cloud Dropbox Files if present — note File ID, Version ID, server/client timestamps","10. Use file hashes from cloud artifacts in Connections Explorer to link to laptop and USB evidence"]},
    ],
    student:{questions:["1. What cloud accounts were identified in the Potential Cloud Evidence Leads? What local evidence triggered these leads?","2. Are there files in the cloud evidence that are NOT present on the local device? What does this suggest?","3. Using file hashes, can you confirm that any cloud file is the same as a file found on the laptop or USB drive?"],answers:["1. Case Dashboard → INSIGHTS → Potential Cloud Evidence Leads. Each lead shows: account identifier, cloud service, and the local artifact that triggered it (browser cookie, config file, credential). These provide justification for cloud search warrants.","2. Compare Cloud OneDrive Files artifact with local OneDrive artifact. Files in cloud-only = deliberate decision to keep off the device (operational security) OR files shared by another party. Cloud-only files may be the most important evidence not found on seized hardware.","3. Note the MD5/SHA1 hash from a cloud artifact. Build Connections (Tools → Build Connections). In Connections Explorer, find the hash node — it should show edges to laptop File System artifacts and/or USB drive artifacts if the same file exists there. A hash match is mathematically conclusive proof of file identity."]},
  },
  {
    mod:11,
    label:"M11",
    title:"Media",
    color:"#e879f9",
    running:[
      {name:"Media Explorer Review",steps:["1. Build Media Explorer if not built: check auto-build or open via Explorer dropdown and accept build prompt","2. Switch to Media Explorer via Explorer dropdown","3. Observe thumbnail grid — items with numeric badges = hit-stacked (multiple copies exist)","4. Click a stack badge to see all copies across evidence sources with individual file paths","5. Select a stacked item → apply category/tag from TAGS PROFILES AND MEDIA CATEGORIES pane","6. Confirm tag applies to ALL copies in the stack automatically","7. Hover over a video thumbnail → popup preview appears","8. While hovering: drag mouse LEFT to RIGHT to scrub through the entire video","9. Click on a video → Details Pane → FILMSTRIP section → observe still frames at every 10% interval","10. Apply INVESTIGATION LEADS filter group: enable Has original creation date, Has geolocation, From social media","11. Use CAMERA DETAILS filter to see originating device type from EXIF","12. Press + key to grade all visible uncategorised items in current filtered view"]},
      {name:"Video Transcription",steps:["1. Locate a video artifact in Media Explorer","2. Right-click on the video → select Transcribe (requires Magnet Models)","3. Wait for transcription to complete","4. Review the transcribed text in the Details pane","5. Note that transcription makes video audio content keyword-searchable","6. Run a keyword search after transcription to find specific spoken content"]},
      {name:"CBIR Search",steps:["1. Right-click on any image in Media Explorer","2. Select Search Similar (CBIR - Content-Based Image Retrieval)","3. Axiom searches all media for visually similar images based on content","4. Review the similar images found across all evidence sources","5. CBIR finds copies stored under different filenames that hash-based search would miss"]},
      {name:"Media Categorisation",steps:["1. Apply relevant filters in Media Explorer (INVESTIGATION LEADS, CAMERA DETAILS, VICS ATTRIBUTES)","2. Review filtered results","3. Apply appropriate categories from TAGS PROFILES AND MEDIA CATEGORIES pane","4. Use + key for bulk grading of all visible uncategorised items","5. Review the RELATED ARTIFACTS card in Details pane to find other evidence linked to a media item","6. Note that for hit-stacked items, tagging one item tags ALL copies across all evidence"]},
    ],
    student:{questions:["1. In the Media Explorer, how many unique images (after hit stacking) were recovered from all evidence sources?","2. Using the Investigation Leads filters, identify any photos with GPS coordinates. What location do they show?","3. Using CAMERA DETAILS filter, which device model was used to take most of the photos in evidence?"],answers:["1. Open Media Explorer → count the items in the thumbnail view (each stacked item represents one unique image regardless of copy count). The number badge shows how many copies exist.","2. Apply INVESTIGATION LEADS → Has geolocation filter. Click each geotagged image → Details pane → GPS Latitude/Longitude fields. Cross-reference with World Map (if built) to see all geolocation pins simultaneously.","3. Apply CAMERA DETAILS filter and look at the camera model distribution. Click individual images to see full EXIF data in Details pane including Make and Model fields. Cross-reference Camera Model with device specifications of the seized devices to confirm which physical device took the photos."]},
  },
  {
    mod:12,
    label:"M12",
    title:"Reporting",
    color:"#fbbf24",
    running:[
      {name:"Media Explorer (Review before Report)",steps:["1. Verify all relevant artifacts have been tagged appropriately before generating any reports","2. Review tags in the TAGS section of Navigation pane — ensure tag names are professional and accurate","3. In Media Explorer, verify all media has been graded/categorised consistently","4. Check that hit-stacked items are correctly categorised (one grade applies to all copies)","5. Clear any remaining filters to ensure full case visibility before reporting"]},
      {name:"Reporting from the File Menu",steps:["1. Navigate to File → Case Reports → Final Report","2. Configure report content: select tags to include, set date range, choose evidence sources and artifact categories","3. Add Case Summary text, investigator narrative, and chain of custody information","4. Preview the report before generating","5. Generate the report in desired format (PDF, HTML)","6. For email export: File → Email Reports → export as PST format for review in Outlook/PST viewers","7. For individual artifact export: select artifacts → right-click → Export → CSV format"]},
      {name:"Creating a Portable Case",steps:["1. Navigate to File → Portable Case","2. Select which tagged artifacts to include in the portable case","3. Configure output path for the portable case file","4. Generate the portable case","5. Verify the portable case can be opened by a colleague with Axiom Examine installed","6. Note: recipient must have Magnet Axiom Examine installed — it is not a standalone viewer"]},
      {name:"Connections and World Map",steps:["1. Verify Connections have been built: Tools → Build Connections (or confirm auto-build completed)","2. Navigate to Connections Explorer via Explorer dropdown","3. Review the network diagram for cross-evidence relationships","4. Screenshot the Connections diagram for inclusion in the case report","5. Build World Map: Tools → Build World Map (if not auto-built)","6. Review the geographic visualization of location-based artifacts","7. Note any GPS coordinates from photo EXIF data and their forensic significance"]},
    ],
    student:{questions:["1. Generate a Final Report for the Katie Lewis case including all tagged artifacts. What key evidence categories are included?","2. Export the email evidence as a PST file. What is the purpose of this format?","3. Create a Portable Case containing only the key tagged artifacts. What do recipients need to open it?"],answers:["1. File → Case Reports → Final Report. Select all relevant tags (Operating System Information, Lewis System Information, etc.). Configure date range covering investigation period. Key categories: OS Information, Accounts, USB Devices, LNK Files, Email, Web Activity.","2. File → Email Reports → Export as PST. PST format allows legal teams and prosecutors to review email evidence in Outlook or any PST viewer without needing Axiom installed. PST preserves email threading, attachments, and metadata.","3. File → Portable Case → select tagged artifacts. Recipients MUST have Magnet Axiom Examine installed — a Portable Case is not a standalone viewer. It packages a subset of case artifacts for sharing with other examiners or investigators with Axiom access."]},
  },
];



// ─── LAB REFERENCE DATA ───────────────────────────────────────────────────────

// ─── LAB REFERENCE DATA ───────────────────────────────────────────────────────

const LAB_REF = {
  artifacts: [
    {
      category: "Operating System",
      color: "#0ea5e9", icon: "🪟",
      items: [
        {
          name: "OS Information",
          path: "Operating System → Operating System Information",
          source: "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion + SYSTEM hive (ShutdownTime)",
          notes: "Version, build number, install date, registered owner, last shutdown time",
          meaning: "Technical fingerprint of the device — what OS was running, when it was set up, and who registered it",
          identifies: "OS edition (Pro = BitLocker available), build number (1803+ = Timeline artifacts exist, 19041+ = Win10 2004), registered owner name, exact last shutdown timestamp",
          supports: "Establishing device context for all other artifacts. Build number determines which artifacts SHOULD exist — if expected artifacts are absent, anti-forensics may have occurred",
          interpret: "Pro edition + high build number = BitLocker likely configured, Windows Timeline data present, modern Prefetch format (MAM compressed). Registered owner discrepancy from primary user account = corporate device or shared machine. ShutdownTime before seizure = clean shutdown; no recent shutdown = device was running when seized"
        },
        {
          name: "Time Zone Information",
          path: "Operating System → Time Zone Information",
          source: "SYSTEM hive ControlSet###\\Control\\TimeZoneInformation + SOFTWARE hive (display name)",
          notes: "CRITICAL: set Axiom to match before ANY timestamp analysis. Tools → Settings → Date and Time",
          meaning: "The timezone the device was configured to operate in — determines the true local time of every event",
          identifies: "Device local timezone, standard vs daylight saving offset, timezone name (e.g. Eastern Standard Time = UTC-5)",
          supports: "Accurate interpretation of every single timestamp in the case. A 5-hour timezone error turns a 3am suspicious activity into an innocent 8pm evening event",
          interpret: "UTC+00:00 on a device from Indiana USA = wrong timezone (should be UTC-5 or UTC-6). Mismatch between device timezone and user location = possible attempt to confuse timeline analysis or device was used in a different time zone. Always set Axiom to match BEFORE reviewing any artifact timestamps"
        },
        {
          name: "User Accounts – Windows",
          path: "Operating System → User Accounts – Windows",
          source: "SAM + SOFTWARE hives at Windows\\System32\\config",
          notes: "SID, RID, login dates, password info, profile path, group membership. Vista+: deleted account recovery from unallocated registry = highly unlikely",
          meaning: "The complete list of people (accounts) who have or had access to this device",
          identifies: "Primary user (RID 1000+ with highest login count), built-in accounts (RID 500=Admin, 501=Guest), last login timestamps, whether account is linked to Microsoft account (local login count stays 0), admin group membership",
          supports: "Attributing all file access, browser activity, and application execution to a specific user. Cross-referencing with NTUSER.DAT hives to confirm user-specific activity",
          interpret: "RID 1000+ = real user account. Local Login Count = 0 despite active use = Microsoft account (authenticate server-side). Multiple RID 1000+ accounts = multiple users shared the device. Admin group membership = user could install software and modify system settings. Last Login matching key event timestamps = confirms user was active during that period"
        },
        {
          name: "USB Devices",
          path: "Connected Devices → USB Devices",
          source: "SOFTWARE/SYSTEM hives, setupapi.dev.log, NTUSER.DAT, Windows Event Logs, pagefile.sys",
          notes: "First connection time from setupapi.dev.log. Drive letter, device serial, associated Windows user",
          meaning: "Every external USB storage device that was ever connected to this machine — including devices that were later removed or destroyed",
          identifies: "Specific device identity (serial number = hardware fingerprint), first connection date/time, drive letter assigned, which Windows user was logged in during connection",
          supports: "Proving external data transfer. Combined with LNK files (what files were opened from the drive) and File System Information VSN matching (proving the exact physical device), establishes a complete data exfiltration evidence chain",
          interpret: "Multiple connections of the same device = regular/deliberate use. Drive letter tells you what regex to use in LNK filter (^E:\\\\). First connection time before key event = device was present and available. Serial number unique to physical device = can prove in court it was the SAME device. User name field = proves which account was active during USB use"
        },
        {
          name: "Prefetch Files",
          path: "Operating System → Prefetch Files – Windows 8/10/11",
          source: "Windows\\Prefetch\\*.pf (Win10/11: XPRESS HUFFMAN MAM compressed)",
          notes: "APPNAME.HASH.pf naming. Max entries: XP=126, Vista/7/8=129, Win10/11=1024. System-wide not user-specific",
          meaning: "A record of every application executed on the device, when it was last run, and how many times — even if the application was later deleted",
          identifies: "Application execution history (name, path, run count, last 8 timestamps), anti-forensic tool use (CCleaner, AxCrypt, VeraCrypt), whether an app was run from a USB drive (different hash from installed version), execution timeline for specific applications",
          supports: "Proving the suspect ran a specific application. Anti-forensics irony: tools used to destroy evidence leave their own Prefetch entries. Different hash for same EXE = run from different path (e.g. USB portable version vs installed)",
          interpret: "Run count correlates with how regularly an application was used. AXCRYPT.EXE in Prefetch + encrypted files = deliberate encryption by this user. Same application with two different hashes = run from two locations (installed + portable on USB). Last run time of anti-forensic tool immediately before suspicious gap in other artifacts = evidence deletion attempt. Win10/11 MAM compression = Axiom handles automatically"
        },
        {
          name: "LNK Files",
          path: "Operating System → LNK Files",
          source: "Users\\[user]\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk",
          notes: "Regex filter technique: Filters bar → Target Path → REGEX mode → ^E:\\\\ to find all files accessed from E: drive",
          meaning: "Automatic Windows shortcuts created every time a file is opened via File Explorer — survive even after the original file is deleted",
          identifies: "Specific files accessed (name and full path), when accessed (MAC timestamps of target at time of access), which physical drive hosted the file (Volume Serial Number), machine name of source device",
          supports: "Proving a specific file was opened by this user on this device, even if the file was deleted afterward. VSN fingerprinting links LNK to a specific physical USB drive. Combined with USB Devices artifact = complete file access evidence chain",
          interpret: "LNK pointing to a drive letter matching a USB device connection = file was accessed from that external device. VSN in LNK matches USB drive image File System VSN = mathematical proof the SAME physical device was used. Creation time of LNK = first time file was accessed. Modified time = most recent access. Target file deleted but LNK remains = suspect deleted evidence but Windows kept the access record"
        },
        {
          name: "Jump Lists",
          path: "Operating System → Jump Lists",
          source: "Users\\[user]\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations\\ and CustomDestinations\\",
          notes: "Per-application MRU lists. Two types: Automatic (system-generated) and Custom (app-pinned items)",
          meaning: "Per-application lists of recently accessed files — more granular than LNK files because they are organized by which application was used to open each file",
          identifies: "Which application was used to open specific files, recent file access per application, pinned/frequently used items that a user deliberately kept for quick access",
          supports: "Corroborating LNK file evidence with application-level context. Proving a specific file was opened in a specific application (e.g. classified.pdf opened in Adobe Reader not just File Explorer)",
          interpret: "Application App ID in Jump List filename identifies which program. Files pinned in CustomDestinations = user deliberately wanted quick access = regular, intentional use. Automatic Jump Lists show recent access pattern. Jump List entries for remote/network paths = user was accessing files over network. Absence of Jump List entries despite LNK files = application may have been uninstalled or used a portable version"
        },
        {
          name: "Windows Event Logs",
          path: "Operating System → Windows Event Logs",
          source: "Windows\\System32\\winevt\\Logs\\*.evtx",
          notes: "Key event IDs: 4624 logon, 4625 failed logon, 4634 logoff, 4688 process creation, 4698 scheduled task, 7045 service install",
          meaning: "The operating system's own audit trail — records security events, logons, process execution, and system changes independently of user-controlled artifacts",
          identifies: "User login/logout times (4624/4634), failed login attempts (4625), specific process execution with command line (4688), account changes (4720/4726), scheduled task creation (4698), service installations (7045), privilege escalation",
          supports: "Corroborating timeline from other artifacts with OS-level audit evidence. Independently attributing activity to specific user accounts via SID filtering. Detecting attacker lateral movement or privilege escalation",
          interpret: "Multiple 4625 (failed logon) followed by 4624 = brute force attempt then success. 4688 for known malware or anti-forensic tools = execution confirmed via OS audit log (harder to fake than Prefetch). 4698 (scheduled task created) at an unusual time = persistence mechanism. Gap in 4624/4634 logon events during a period where other artifacts show activity = possible timestamp manipulation or another user account was active"
        },
        {
          name: "Installed Programs",
          path: "Application Usage → Installed Programs / Installed Microsoft Programs",
          source: "SOFTWARE hive Uninstall keys. Split: non-Microsoft apps vs Microsoft apps",
          notes: "Includes install dates, version numbers, publisher. Two separate artifacts: Installed Programs + Installed Microsoft Programs",
          meaning: "Complete inventory of software the user chose to install — reveals capabilities, tools, and intent",
          identifies: "Encryption tools (AxCrypt, VeraCrypt, Cryptomator), secure messaging apps, VPN clients, file wiping tools, remote access software, hacking/OSINT tools, forensic tools, custom/unauthorised software",
          supports: "Establishing the suspect had access to specific capabilities. Anti-forensic tool installation = awareness of forensic investigation and intent to conceal. Specialised software installation = user had technical knowledge beyond average user",
          interpret: "Encryption tool installed + encrypted files found = deliberate use. VPN client installed + VPN traffic in browser history = deliberate anonymisation. Remote access software (TeamViewer, AnyDesk) installed = capability to receive remote connections or remotely control other devices. Install date correlated with key events = software was installed in preparation for suspected activity"
        },
        {
          name: "Android Device Information",
          path: "Application Usage → Android Device Information",
          source: "accounts_de.db",
          notes: "IMEI, IMSI, ICCID, MCC/MNC, Bluetooth name/address, timezone, serial number",
          meaning: "Hardware identity and network registration details of the Android device — uniquely identifies the physical device and its SIM card",
          identifies: "Device IMEI (hardware fingerprint, unique per device), IMSI (identifies the SIM/subscriber), carrier and country via MCC/MNC, device timezone (for timestamp correlation), Bluetooth device name (may match other evidence)",
          supports: "Confirming device identity in legal proceedings. Cross-referencing with carrier records. Establishing device ownership. Bluetooth name may match names seen in other connection logs",
          interpret: "IMEI matches a device purchased by/for the suspect = device ownership evidence. MCC/MNC = 420 (Saudi Arabia) or 310 (USA) etc — confirms country where SIM was registered, useful if suspect claims device was not in a specific location. Multiple IMEIs = device has dual SIM slots. Bluetooth name matching another device in the case = devices were in proximity"
        },
      ]
    },
    {
      category: "Web & Browser",
      color: "#a78bfa", icon: "🌐",
      items: [
        {
          name: "Chrome Browser History",
          path: "Web Related → Chrome Browser Visits",
          source: "AppData\\Local\\Google\\Chrome\\User Data\\Default\\History (SQLite: urls + visits tables)",
          notes: "URL, title, visit count, last visit time. View raw DB in File System Explorer → SQLite Viewer",
          meaning: "A record of every website the user deliberately visited — the URL AND the page title (which often reveals more than the URL alone)",
          identifies: "Websites visited (URL and readable title), visit frequency, time of visits, research patterns, specific pages viewed within a site",
          supports: "Establishing intent and awareness. Visit to a secure communications guide before communicating = prior planning. Research on classified material before accessing it = demonstrates knowledge and intent",
          interpret: "Visit count > 1 = deliberate repeated access, not accidental. Page title often reveals content even when URL is ambiguous (e.g. URL = docs.company.com/file/123 but title = 'TOP SECRET JSOC Brief'). Browser history paired with cache = history proves visit, cache proves what was SEEN. Absence of history with cache entries present = history was cleared but cache was not"
        },
        {
          name: "Chrome Cache Records",
          path: "Web Related → Chrome Cache Records",
          source: "AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache\\ + GPUCache\\ + Media Cache\\",
          notes: "Content and metadata stored SEPARATELY (two Evidence Information sections in Details Pane). Video = Media Cache\\ not Cache\\",
          meaning: "The actual content of web pages visited — not just that a site was visited, but WHAT WAS SEEN at the time of the visit",
          identifies: "Page content at time of visit (recoverable even if the original page was deleted or modified), downloaded media files, JavaScript and CSS (confirms full page load not just URL access), cached video and audio",
          supports: "Recovering web content no longer publicly available. Proving what the user actually read/viewed as opposed to merely visiting a URL. Cache timestamps prove when specific content was retrieved",
          interpret: "Cache entry exists without corresponding history entry = history was deleted but cache was not. Large cache entries for specific sites = user spent significant time on those pages. Media Cache entries for video = user watched video content from that site. Content Size in cache matches known classified document size = possible cached classified content"
        },
        {
          name: "Firefox Cache Records",
          path: "Web Related → Firefox Cache Records",
          source: "AppData\\LOCAL (NOT Roaming)\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\",
          notes: "Metadata APPENDED to end of cached file — Content Size (Bytes) is smaller than actual file on disk. entries\\ = cached, doomed\\ = expired",
          meaning: "Same forensic value as Chrome cache — actual page content at time of visit — but with a different structural format requiring different interpretation",
          identifies: "Cached web content, session recovery data (last open tabs before crash), favicon data confirming site visits",
          supports: "Cache survives selective history deletion. Session recovery data (sessionstore.jsonlz4) shows last active browser session even after history cleared",
          interpret: "File size on disk > Content Size in Axiom = normal for Firefox (metadata appended). doomed\\ subfolder = expired cache not yet cleaned = user did not restart Firefox after these pages were visited. Cache entries without history = Firefox history cleared but cache intact — look for cache entries during gaps in browser history"
        },
        {
          name: "Firefox / Chrome Bookmarks",
          path: "Web Related → Firefox Bookmarks / Chrome Bookmarks",
          source: "Firefox: places.sqlite in ROAMING profile. Chrome: Chrome History file",
          notes: "Firefox Bookmarks in ROAMING profile — different from Firefox Cache which is in LOCAL. Chrome bookmarks in Chrome History file",
          meaning: "Sites the user deliberately chose to save for repeated reference — proves persistent interest and familiarity, not accidental or one-time access",
          identifies: "Sites of persistent interest, organizational folder structure revealing mental categories (e.g. folder named 'Work Resources' containing military intel sites), when bookmarks were added",
          supports: "Proving deliberate and sustained interest in specific websites. Bookmark folder names provide insight into how the user categorised their activities",
          interpret: "Bookmark = deliberate action requiring conscious effort — significantly stronger evidence of intentional access than a single browser history entry. Folder named after a classified operation or organization = user was organizing classified research. Date Added timestamp correlated with case timeline = bookmark created in preparation for or during the suspected activity period"
        },
        {
          name: "Google Searches",
          path: "Refined Results → Google Searches",
          source: "Extracted and parsed from browser history artifacts",
          notes: "Google.com ONLY. For Bing/Yahoo/DuckDuckGo and all other engines: use Parsed Search Queries instead",
          meaning: "The exact words the user typed into Google — the most direct window into their intentions and state of mind",
          identifies: "Research topics, questions the user needed answered, names and organisations they were researching, specific documents or information they were seeking",
          supports: "Establishing intent before an action. Searching 'how to encrypt files without leaving traces' before using AxCrypt = premeditation. Searching a victim's name = establishes prior knowledge and interest",
          interpret: "Search terms are user-generated intentional input — difficult to argue was accidental. Time between search and subsequent action (e.g. search for 'secure file transfer' then cloud upload) = planning and execution sequence. Absence of searches with other evidence of knowledge = user already knew the information (expert vs. novice distinction)"
        },
        {
          name: "Parsed Search Queries",
          path: "Refined Results → Parsed Search Queries",
          source: "Extracted from browser history for all search engines except Google",
          notes: "Covers Bing, Yahoo, DuckDuckGo, Baidu, Ask, AOL, and all other search engines. Always use alongside Google Searches",
          meaning: "Search queries from non-Google engines — critically important because users who want to avoid Google may specifically use alternative engines",
          identifies: "Same intent evidence as Google Searches but for ALL other search engines. Users aware of Google's data retention may deliberately use Bing or DuckDuckGo for sensitive searches",
          supports: "Complete search activity picture. Missing from Google Searches but present in Parsed Search Queries = user deliberately avoided Google for these searches = heightened awareness",
          interpret: "Sensitive searches appearing only in Parsed Search Queries (not Google Searches) = user was deliberately avoiding Google for these specific topics — a conscious choice that itself indicates awareness of surveillance. Cross-reference both artifacts for every investigation — relying only on Google Searches misses all non-Google activity"
        },
      ]
    },
    {
      category: "Communications",
      color: "#00d4a0", icon: "💬",
      items: [
        {
          name: "Email Artifacts (All Sources)",
          path: "Email & Calendar → [various] | Explorer dropdown → Email Explorer",
          source: "OST files (Outlook cache), PST files (archives), Google Takeout (Gmail), Cloud acquisition",
          notes: "Email Explorer Participants filter is CASE SENSITIVE. Keyword search from Filters bar = searches ALL PARTS of email simultaneously",
          meaning: "The full communication record between individuals — content, timing, attachments, and routing information",
          identifies: "Communications between specific individuals, document sharing via attachments, timing of communications relative to key events, true sender identity (from headers vs display name), forwarding chains showing information spread",
          supports: "Establishing relationships between subjects, proving document transfer, demonstrating knowledge or coordination. Email headers can reveal true sender even when display name is spoofed",
          interpret: "Display name can be anything — always verify Original Email Address in headers. Email timestamps may be in different timezone than device — check both Sent time and server-recorded Received time. Large attachment sent to external address + same file found on USB = document exfiltration chain. Communications ceasing suddenly before a key event = possible switch to alternative communication channel (check messaging apps)"
        },
        {
          name: "Email Attachments",
          path: "Email & Calendar → Email Attachments",
          source: "All parsed email artifacts across all evidence sources",
          notes: "Single location aggregating ALL attachments. Original Artifact link jumps back to parent email. Also appears in Documents and Media categories",
          meaning: "Every file that was sent or received as an email attachment across all email sources — the fastest way to find document evidence",
          identifies: "Specific documents shared between parties, file names and sizes, who sent what to whom and when, whether classified or sensitive files were emailed to unauthorized recipients",
          supports: "Proving specific document transfer. File hash of attachment compared with File System Explorer = confirms same file was also saved locally or on USB. Cross-reference with cloud storage artifacts for same file",
          interpret: "Attachment file name containing 'classified', 'secret', 'FOUO' etc = explicit classification marking visible to sender and recipient. Same attachment sent to multiple external recipients = widespread distribution. Attachment file hash matching a file found on USB drive = the emailed file was later transferred to physical media (or vice versa)"
        },
        {
          name: "WhatsApp / Chat Artifacts",
          path: "Communications → WhatsApp / SMS-MMS Messages / [other chat apps]",
          source: "Mobile: msgstore.db (WhatsApp), sms.db (iOS SMS/iMessage), mmssms.db (Android SMS)",
          notes: "Conversation View auto-applied. For mobile: acquisition type depth determines available data",
          meaning: "Direct messaging communications — often more candid than email and used for communications the sender believes are more private",
          identifies: "Direct messages between subjects, media shared in chats, deletion of messages (gaps in message ID sequences), group membership, read receipts confirming message was seen",
          supports: "Communications evidence that may be more candid than formal email. Message gaps or deletions may indicate concealment. Media shared in chats (photos of documents, location shares) provides additional evidence",
          interpret: "WhatsApp messages on one device but not the other = messages selectively deleted on the other device. Media received in WhatsApp + same image found in Photos app = user saved the received media to device. Message timestamps cross-referenced with email activity = communication pattern analysis (switched from email to WhatsApp for sensitive content = awareness). Read receipt = recipient definitely saw the message at that time"
        },
        {
          name: "Connections Explorer",
          path: "Explorer dropdown → Connections Explorer",
          source: "Built from ALL artifact relationships across ALL evidence sources",
          notes: "Build via Tools → Build Connections. Must REBUILD after new evidence added. Answers WHO WHAT WHEN WHERE WHY HOW",
          meaning: "A visual map of all relationships between artifacts — shows how evidence across different devices and sources connects into a single narrative",
          identifies: "File hash matches across devices (proving same file), shared identifiers (phone numbers, email addresses appearing on multiple devices), communication patterns, data movement paths",
          supports: "Synthesising evidence from multiple sources into a coherent narrative. File hash match across three devices = irrefutable proof of file transfer. Identifier links = proves relationship between two subjects even without direct communication evidence",
          interpret: "Hash node connecting laptop + USB + cloud = file existed on all three = exfiltration chain. Phone number node connecting suspect device + victim contact = relationship established from both sides. Dense cluster of connections between two evidence sources = significant relationship. Isolated artifact (no connections to anything) = may be unrelated to investigation OR may be worth investigating WHY it has no connections (deliberate compartmentalization)"
        },
      ]
    },
    {
      category: "Cloud & Storage",
      color: "#f59e0b", icon: "☁️",
      items: [
        {
          name: "OneDrive (Local vs Cloud)",
          path: "Cloud Storage → OneDrive (local) | Cloud Storage → Cloud OneDrive Files (cloud)",
          source: "Local: AppData\\Local\\Microsoft\\OneDrive\\settings\\*.ini | Cloud: Microsoft cloud via Axiom Cloud",
          notes: "LOCAL artifact: no sharing info, local sync folder only. CLOUD artifact: shows sharing info + cloud-only files",
          meaning: "Evidence of files stored or shared via Microsoft OneDrive — the LOCAL and CLOUD artifacts provide complementary and non-overlapping evidence",
          identifies: "Files synced to OneDrive (local artifact), files shared with other users (cloud artifact only), cloud-only files never stored on the device (cloud artifact only), file versions and modification history (cloud artifact)",
          supports: "Proving document sharing to external parties. Cloud-only files = deliberate decision to keep files off the device (harder to find during device seizure). Shared With field = identifies who received the document",
          interpret: "File present in Cloud OneDrive Files but absent from local OneDrive artifact = file existed only in the cloud, never downloaded to the device — possible deliberate operational security. Shared With field showing external email = document was actively shared with another person. File hash match between cloud artifact and laptop File System = confirmed the cloud version is the same file as the local version (or different versions of the same document)"
        },
        {
          name: "Cloud Dropbox Files",
          path: "Cloud Storage → Cloud Dropbox Files",
          source: "Acquired via Axiom Cloud (Dropbox account credentials or token)",
          notes: "Includes: File ID, File Version ID, server-side AND client-side last modified timestamps, original photo timestamp if present",
          meaning: "Evidence of files stored or shared via Dropbox — a frequently used alternative to corporate cloud storage for moving files outside organizational controls",
          identifies: "Files stored in Dropbox, sharing status, version history (File Version ID), when file was last modified on the device vs the server, original photo metadata if uploaded from a camera",
          supports: "Proving use of non-corporate cloud storage for file transfer (particularly relevant in insider threat cases where corporate OneDrive is monitored). Server vs client timestamp discrepancy = file was modified locally after download",
          interpret: "Server last modified time = when Dropbox recorded the change. Client last modified time = when the local device claimed to have modified it. Discrepancy = file was modified on a different device. Original photo timestamp in a Dropbox file = photo was taken on a specific date/time even if the Dropbox upload was later. File Version ID change = document was updated and re-uploaded"
        },
        {
          name: "Cloud Accounts Information (Passwords/Tokens)",
          path: "Cloud Storage → Cloud Accounts Information",
          source: "Cloud account acquisition data, cached credentials",
          notes: "Password field often shows TOKEN not plaintext. People reuse passwords — test against encrypted files and other accounts",
          meaning: "Authentication credentials found in the case — tokens that may allow re-acquisition of cloud accounts and passwords that may unlock encrypted files",
          identifies: "Cloud service tokens (Gmail, OneDrive, Dropbox, Facebook etc), credential reuse patterns, which cloud services the subject was authenticated to at time of investigation",
          supports: "Enabling further cloud acquisition using found tokens (must act quickly — tokens expire). Testing found passwords against encrypted AxCrypt files, VeraCrypt volumes, ZIP archives in the case",
          interpret: "Found token still valid = immediate cloud acquisition opportunity. Password found in one account = test against ALL encrypted content in the case AND all other cloud accounts (credential reuse is extremely common). Multiple cloud service tokens = subject was actively using multiple cloud platforms (each may contain relevant evidence requiring separate acquisition warrants)"
        },
        {
          name: "Insights — Potential Cloud Evidence Leads",
          path: "Case Dashboard → INSIGHTS → Potential Cloud Evidence Leads",
          source: "Derived by Axiom analysis of local device artifacts (browser cookies, config files, cached credentials)",
          notes: "Identifies cloud accounts from LOCAL evidence without cloud acquisition. Provides justification for cloud acquisition warrants",
          meaning: "Cloud accounts identified as likely relevant based on traces found on the local device — the bridge between local device analysis and cloud evidence acquisition",
          identifies: "Cloud service accounts the subject was using (email, Facebook, Dropbox etc), account identifiers (email addresses, usernames), which services had active sessions on the device at time of seizure",
          supports: "Building reasonable grounds for cloud search warrants. Identifying evidence sources that may not have been seized as physical devices. Discovering alternative communication channels (Facebook Messenger, Instagram DM) not captured in primary email acquisition",
          interpret: "Each entry = a potential additional evidence source requiring its own acquisition action. Facebook account identified from laptop = Facebook Messenger communications may exist that are not in email evidence. Multiple cloud services identified = subject was using a range of platforms, possibly deliberately compartmentalizing communications across services to avoid single-point evidence collection"
        },
      ]
    },
    {
      category: "Media & Files",
      color: "#f87171", icon: "🎬",
      items: [
        {
          name: "Media Explorer (Hit Stacking)",
          path: "Explorer dropdown → Media Explorer",
          source: "All media artifacts across all evidence sources",
          notes: "Build first. Hit Stacking: same MD5/SHA1 = one stack. Tag one = tags ALL copies. Filmstrip at every 10% of video",
          meaning: "A unified view of all images and videos across all evidence — with intelligent deduplication that groups identical files regardless of where they are stored",
          identifies: "Photos and videos present on multiple devices (proving transfer), geolocation data in photo EXIF (where photos were taken), camera identification from EXIF (which device took a photo), visual content analysis (weapons, drugs, faces via Magnet AI)",
          supports: "Proving media was transferred between devices via hash matching. Geolocation from photo EXIF = proves device was at a specific location at a specific time (stronger than GPS logs because embedded in the file itself). Camera identification links a photo to a specific device",
          interpret: "Same image hash on laptop + iPhone + USB = image was distributed across all three devices. EXIF GPS coordinates in photo taken in a restricted area = device (and user) was physically in that location. Camera Model in EXIF = identifies which device took the photo (cross-reference with iPhone model in case). Absence of EXIF = photo was screenshotted, edited, or taken with a privacy-focused camera app (itself suspicious)"
        },
        {
          name: "Documents",
          path: "Documents → [PDF / Word / Excel / etc]",
          source: "File system artifacts, email attachment extractions, cloud storage artifacts",
          notes: "Document Created Date is different from File System Created Date. Content shown in Preview Card in Details Pane",
          meaning: "The actual files — documents, spreadsheets, presentations — that are the subject of the investigation",
          identifies: "Classified documents (by name, content, markings), document author and creation timestamps from metadata, revision history, last edited by (may differ from primary user), content via Preview Card or OCR",
          supports: "Proving possession of specific documents. Document metadata author field = may reveal the document was created on a different device or by a different user. OCR on scanned documents = keyword-searchable content",
          interpret: "Document Created Date in metadata = when the document was originally created (may predate arrival on this device). File System Created Date = when the file was placed on THIS device's file system. Discrepancy = document was created elsewhere and transferred. Last Modified By = may show a different username than the device owner (corporate document with author from classified system). File System Created Date + time of USB connection = document was copied from USB at that exact moment"
        },
      ]
    },
    {
      category: "Refined Results",
      color: "#34d399", icon: "🔎",
      items: [
        {
          name: "Locally Accessed Files and Folders",
          path: "Refined Results → Locally Accessed Files and Folders",
          source: "AppData\\Local\\Microsoft\\Windows\\WebCache\\WebCacheV01.dat (also contains IE/Edge history)",
          notes: "':Host: This PC' = Windows File Explorer navigation. 'file:///' = file opened in Edge browser. Per-user (AppData location identifies the Windows account)",
          meaning: "A record of every file and folder the user browsed in Windows File Explorer — including access to external drives, network shares, and specific folder locations",
          identifies: "Folders browsed on USB drives (showing deliberate navigation to specific locations), specific file paths accessed, network share navigation, folders containing deleted files (proves the folder existed and was accessed even if contents deleted)",
          supports: "Corroborating LNK file evidence (LNK = file opened, Locally Accessed = folder browsed). Together they provide complete file system navigation evidence. ':Host: This PC\\E:\\' entries = deliberate navigation to USB drive contents",
          interpret: "Entry showing USB drive path (e.g. 'E:\\Classified Documents\\') = user deliberately navigated to that folder on the external drive. Entry for a specific folder immediately before LNK file timestamp for a file in that folder = browsed the folder then opened the file (sequential access pattern). Network share paths = evidence of corporate network access. 'file:///' entries = files opened directly in browser (e.g. PDF viewed in Edge) rather than downloaded first"
        },
        {
          name: "Identifiers – People",
          path: "Refined Results → Identifiers – People",
          source: "Extracted from Email, Chat, OS, and Web artifacts automatically",
          notes: "Used to create PROFILES in Axiom. Only Identifiers-People AND Identifiers-Devices can be used to create a Profile",
          meaning: "A consolidated list of all identifiers that can be linked to a specific individual — emails, usernames, screen names, and other personal identifiers found across all artifacts",
          identifies: "Email addresses used by the subject, chat accounts and screen names, web form data (submitted names, addresses), document metadata author names",
          supports: "Building a comprehensive identity picture of the subject. Creating an Axiom Profile to filter the entire case to show only artifacts associated with this individual. Discovering alternative identities or accounts the subject used",
          interpret: "Multiple email addresses found = subject was using different accounts for different activities (possible deliberate compartmentalization). Screen name found in chat artifacts matching known username = confirms identity across platforms. Document metadata author name different from device owner name = document originated from a different system or user"
        },
        {
          name: "Identifiers – Device",
          path: "Refined Results → Identifiers – Device",
          source: "Extracted from multiple artifact categories across case",
          notes: "Used with Identifiers-People to create Profiles. Captures hardware identifiers seen across all artifacts",
          meaning: "Hardware and device identifiers found throughout the case — linking physical devices to digital activity",
          identifies: "Device serial numbers, MAC addresses, IMEI values, hardware IDs, device model information found in artifacts across the case",
          supports: "Identifying additional devices that interacted with the primary evidence. Creating device-specific Profiles. Corroborating USB Device history with device identifiers found in other artifacts",
          interpret: "A device identifier appearing in both OS artifacts AND cloud account information = the same device was used for both local and cloud activity. Unknown device identifier in artifacts = evidence of a device not yet seized. Device identifier in email headers = email was sent from that specific device"
        },
      ]
    },
  ],
  registry: [
    { hive:"SAM", key:"SAM\\Domains\\Account\\Users\\[RID]", artifact:"User Accounts – Windows", contains:"Username, SID, RID (last value), last login, last password change, login count, profile path", forensic:"RID 1000+ = real user. Login count = 0 with MS account = server-side auth. Login times establish when user was active" },
    { hive:"SOFTWARE", key:"Microsoft\\Windows NT\\CurrentVersion", artifact:"OS Information", contains:"ProductName, CurrentBuild, InstallDate, RegisteredOwner, DigitalProductId", forensic:"Build number determines which artifacts exist. Pro edition = BitLocker available. Registered owner may differ from actual user" },
    { hive:"SYSTEM", key:"ControlSet###\\Control\\Windows", artifact:"Shutdown Time", contains:"ShutdownTime — 8-byte Windows 64-bit Little Endian timestamp", forensic:"Last clean shutdown. Decode via HEX card → DECODE card in Registry Explorer. Missing = hard power-off or crash" },
    { hive:"SYSTEM", key:"ControlSet###\\Control\\TimeZoneInformation", artifact:"Time Zone Information", contains:"TimeZoneKeyName, ActiveTimeBias, Bias, DaylightBias", forensic:"CRITICAL: determines correct local time for every timestamp. Must match Axiom timezone setting before any analysis" },
    { hive:"SOFTWARE", key:"Microsoft\\Windows\\CurrentVersion\\Uninstall\\[AppGUID]", artifact:"Installed Programs", contains:"DisplayName, Publisher, InstallDate, InstallLocation, Version, UninstallString", forensic:"InstallDate + key events = software installed in preparation. Anti-forensic tools here = deliberate evidence destruction capability" },
    { hive:"NTUSER.DAT", key:"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\UserAssist\\{GUID}\\Count\\", artifact:"UserAssist (Application Execution)", contains:"Application execution count and last execution time. Key names ROT-13 encoded", forensic:"User-specific execution evidence. Cross-reference with Prefetch (system-wide) for complete attribution. ROT-13 decode to read app names" },
    { hive:"NTUSER.DAT", key:"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\RecentDocs", artifact:"Recent Files MRU", contains:"Most recently accessed files organized by extension. MRU order", forensic:"Shows recent file access pattern. Ordered list = most recent first. Cross-reference with LNK files for timestamps" },
    { hive:"SYSTEM", key:"ControlSet###\\Enum\\USBSTOR\\[DeviceClass]\\[SerialNumber]", artifact:"USB Devices (Serial)", contains:"Device friendly name, serial number, first install", forensic:"Serial number uniquely identifies the physical device. Hardware-assigned, cannot be changed without specialist tools. Primary court identifier for specific USB device" },
    { hive:"SOFTWARE", key:"Microsoft\\Windows Portable Devices\\Devices\\[GUID]", artifact:"USB Devices (Drive Letter)", contains:"Drive letter and friendly name assigned to USB device", forensic:"Drive letter used for LNK regex filter (^[LETTER]:\\\\). Links USB device identity to file access evidence" },
    { hive:"NTUSER.DAT", key:"Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\TypedPaths", artifact:"Typed Paths", contains:"Paths manually typed into Windows Explorer address bar", forensic:"Deliberate navigation to specific paths — user knew the path existed and typed it manually. Proves awareness of specific folder location" },
  ],
  paths: [
    { category:"Registry Hives", color:"#0ea5e9", entries:[
      { label:"Global hives", path:"Windows\\System32\\config\\", files:"SAM, SECURITY, SOFTWARE, SYSTEM, DEFAULT" },
      { label:"User hive (current user)", path:"Users\\[username]\\NTUSER.DAT", files:"Per-user settings, MRU lists, UserAssist, typed paths" },
      { label:"User shell hive", path:"Users\\[username]\\AppData\\Local\\Microsoft\\Windows\\UsrClass.dat", files:"File type associations, ShellBags (folder browsing history)" },
    ]},
    { category:"Windows Event Logs", color:"#a78bfa", entries:[
      { label:"Security log", path:"Windows\\System32\\winevt\\Logs\\Security.evtx", files:"Logon/logoff (4624/4634), failed logon (4625), account changes, privilege use" },
      { label:"System log", path:"Windows\\System32\\winevt\\Logs\\System.evtx", files:"Service starts/stops, driver loads, USB device events" },
      { label:"Application log", path:"Windows\\System32\\winevt\\Logs\\Application.evtx", files:"Application crashes, errors, information events" },
      { label:"PowerShell log", path:"Windows\\System32\\winevt\\Logs\\Microsoft-Windows-PowerShell%4Operational.evtx", files:"PowerShell script execution, commands run" },
    ]},
    { category:"Browser Artifacts", color:"#00d4a0", entries:[
      { label:"Chrome history, downloads, bookmarks", path:"AppData\\Local\\Google\\Chrome\\User Data\\Default\\History", files:"SQLite DB — tables: urls, visits, downloads, keyword_search_terms" },
      { label:"Chrome cache (main / GPU / media)", path:"AppData\\Local\\Google\\Chrome\\User Data\\Default\\{Cache, GPUCache, Media Cache}\\", files:"1 index + 4 block files per folder. Video = Media Cache\\" },
      { label:"Firefox history + bookmarks", path:"AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\places.sqlite", files:"Tables: moz_places, moz_bookmarks. ROAMING profile" },
      { label:"Firefox cache", path:"AppData\\Local\\Mozilla\\Firefox\\Profiles\\xxx.default-release\\cache2\\", files:"entries\\ (cached) + doomed\\ (expired). Metadata appended to file end. LOCAL profile" },
      { label:"Edge/IE WebCache (also Locally Accessed Files)", path:"AppData\\Local\\Microsoft\\Windows\\WebCache\\WebCacheV01.dat", files:"ESE database — IE/Edge history + Windows File Explorer navigation" },
    ]},
    { category:"User Activity", color:"#f59e0b", entries:[
      { label:"LNK files (recent files)", path:"Users\\[user]\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk", files:"Target path, MAC times of target, Volume Serial Number, machine name" },
      { label:"Jump lists (automatic)", path:"Users\\[user]\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\AutomaticDestinations\\", files:"Per-application MRU. App ID in filename identifies the application" },
      { label:"Prefetch files", path:"Windows\\Prefetch\\[APPNAME].[HASH].pf", files:"Win10/11: MAM compressed. App name, run count, last 8 launch times" },
      { label:"Recycle Bin", path:"$Recycle.Bin\\[SID]\\$I[filename] + $R[filename]", files:"$I = metadata (original path, deletion time, size). $R = actual file content" },
      { label:"Shellbags (folder browsing history)", path:"NTUSER.DAT + UsrClass.dat → Shell key", files:"Folders accessed in Explorer. Persists after folder/drive deletion" },
    ]},
    { category:"Mobile — iOS", color:"#f87171", entries:[
      { label:"SMS and iMessages", path:"private/var/mobile/Library/SMS/sms.db", files:"Tables: message, chat, handle. Both SMS and iMessage in one database" },
      { label:"Contacts", path:"private/var/mobile/Library/AddressBook/AddressBook.sqlitedb", files:"Contact names, numbers, emails, photos" },
      { label:"Call history", path:"private/var/mobile/Library/CallHistoryDB/CallHistory.storedata", files:"Calls in/out/missed with timestamps and duration" },
      { label:"Safari history", path:"private/var/mobile/Library/Safari/History.db", files:"Table: history_visits + history_items" },
    ]},
    { category:"Mobile — Android", color:"#34d399", entries:[
      { label:"SMS/MMS messages", path:"data/data/com.android.providers.telephony/databases/mmssms.db", files:"Tables: sms, mms, threads" },
      { label:"WhatsApp messages", path:"data/data/com.whatsapp/databases/msgstore.db", files:"Tables: messages, chat_list, jid. Encrypted backup may need key" },
      { label:"Account info", path:"data/system/accounts_de.db", files:"Package name and username for each account — basis for Android Accounts Information artifact" },
    ]},
  ],
  playbooks: [
    {
      title: "Data Exfiltration Investigation",
      icon: "📤", color: "#f87171",
      steps: [
        { step:1, action:"Establish timeline scope", detail:"Check OS Information for OS version, timezone, shutdown time. Set Axiom timezone to match device settings." },
        { step:2, action:"Check USB device activity", detail:"Connected Devices → USB Devices. Document device names, first connection times, assigned drive letters, associated user account." },
        { step:3, action:"LNK regex filter", detail:"Filters bar → Target Path → REGEX → ^[DRIVE]:\\\\ — instantly shows all files accessed from that drive." },
        { step:4, action:"VSN fingerprinting", detail:"LNK file VSN field vs File System Information VSN for USB image. Match = mathematically proves which physical device." },
        { step:5, action:"Check cloud storage artifacts", detail:"Cloud Storage → OneDrive/Dropbox/Google Drive. File hash matches confirm same file across multiple locations." },
        { step:6, action:"Review email attachments", detail:"Email and Calendar → Email Attachments. Filter by date range. Original Artifact link for full email context." },
        { step:7, action:"Build and review Connections", detail:"Tools → Build Connections. Network diagram shows data movement paths across all evidence." },
        { step:8, action:"Check Prefetch for transfer tools", detail:"Look for: compression tools (7-Zip, WinRAR), encryption tools (AxCrypt), cloud sync apps, USB file managers." },
        { step:9, action:"Build subject Profile", detail:"Refined Results → Identifiers-People + Identifiers-Device → Create Profile to filter all case to this subject." },
      ]
    },
    {
      title: "Insider Threat Investigation",
      icon: "🕵️", color: "#a78bfa",
      steps: [
        { step:1, action:"Identify the user", detail:"OS → User Accounts – Windows. SID, RID, last login, password info, group membership (admin?)." },
        { step:2, action:"Check application execution", detail:"Prefetch Files + UserAssist (Registry Explorer → NTUSER.DAT). Establish what programs were run and when." },
        { step:3, action:"Review installed software", detail:"Application Usage → Installed Programs. Unauthorized tools, VPN clients, cloud sync, encryption tools, remote access software." },
        { step:4, action:"Check browser and search activity", detail:"Chrome/Firefox history + Google Searches + Parsed Search Queries. Look for competitor searches, job sites, personal email, sensitive topics." },
        { step:5, action:"Review all communications", detail:"Email Explorer → CASE SENSITIVE filter by subject email. Check all chat artifacts in Conversation View." },
        { step:6, action:"Check cloud and USB access", detail:"Cloud Storage artifacts + Connected Devices → USB Devices. Correlate with Locally Accessed Files timestamps." },
        { step:7, action:"Map the timeline", detail:"Timeline Explorer. Build narrative of activity over investigation period. Look for out-of-hours activity." },
      ]
    },
    {
      title: "New Case Setup — Pre-exam Checklist",
      icon: "✅", color: "#00d4a0",
      steps: [
        { step:1, action:"Configure before creating case", detail:"Tools → Settings → Temp file = separate disk. Thread count = core count (max 32). Auto-build Connections and Timeline = On." },
        { step:2, action:"Create case with correct metadata", detail:"Case Number, Scanned By (examiner name for reports), separate case and evidence folders on different physical disks." },
        { step:3, action:"Add all evidence sources correctly", detail:"Computer → Windows → IMAGE for disk images. Cloud → Google → Takeout for Google data. Mobile → iOS for iPhone extractions." },
        { step:4, action:"Configure all processing options", detail:"Keywords (import list), OCR (PDF and pictures), Hash matching, DAF, Date range = All dates, Parsing AND carving." },
        { step:5, action:"Final review — Analyze Evidence screen", detail:"Confirm all items show Ready or Ready to Search. Check for padlock icons (encrypted drives). Click ANALYZE EVIDENCE." },
        { step:6, action:"Post-processing setup", detail:"Check OS Information → confirm timezone → set Axiom timezone: Tools → Settings → Date and Time. Build Connections and Timeline." },
      ]
    },
  ],
  quickref: [
    {
      title: "Axiom Examine — Key Navigation",
      color: "#0ea5e9", icon: "⌨️",
      items: [
        { key:"F1", action:"Open User Guide / Artifact Reference / What's New" },
        { key:"Filters bar → YELLOW", action:"Active filter is hiding artifacts — clear filters to see all" },
        { key:"Right-click any value", action:"Filter on Column — fastest exam navigation technique" },
        { key:"Click Location hyperlink", action:"Opens Registry or File System Explorer at exact source" },
        { key:"Hover + drag L→R on video", action:"Scrub through entire video without playback" },
        { key:"+ key (Media Explorer)", action:"Grade ALL visible uncategorised items in current view" },
        { key:"Help → Documentation → Artifact Reference", action:"Lists ALL artifacts, column meanings, source locations" },
      ]
    },
    {
      title: "Key Numbers — Exam Ready",
      color: "#f87171", icon: "🔢",
      items: [
        { key:"MCFE: 75 Qs / 120 min / 80%", action:"Pass = 60/75 correct. Fail 1st = immediate retry. Fail 2nd = 60-day wait" },
        { key:"Prefetch: XP=126 / Vista-8=129 / Win10-11=1024", action:"At max: Windows keeps 32, deletes rest" },
        { key:"Max threads: 32", action:"Axiom uses ONE physical CPU. Best gain at 8-12 cores" },
        { key:"ShutdownTime: 8 bytes LE", action:"SYSTEM hive ControlSet###\\Control\\Windows. Decode via HEX+DECODE card" },
        { key:"Filmstrip: every 10%", action:"10-minute video = 10 frames at 0,1,2...9 minute marks" },
        { key:"Chrome cache: 3 folders", action:"Cache\\ (HTML/CSS/JS) + GPUCache\\ + Media Cache\\ (video)" },
      ]
    },
    {
      title: "Fast Artifact Lookup",
      color: "#00d4a0", icon: "📋",
      items: [
        { key:"Case file extension", action:".MFDB (SQL database)" },
        { key:"Email filter: CASE SENSITIVE", action:"Participants filter in Email Explorer — check capitalisation" },
        { key:"Profiles created from", action:"ONLY Identifiers-People AND Identifiers-Devices" },
        { key:"Google Searches vs Parsed Search Queries", action:"Google = Google only. Parsed = all other engines (Bing, Yahoo etc)" },
        { key:"Firefox cache location", action:"AppData\\LOCAL (NOT Roaming) — cache2\\ subfolder" },
        { key:"Firefox bookmarks location", action:"AppData\\ROAMING — places.sqlite (moz_places + moz_bookmarks)" },
        { key:"Rebuilt Desktop available for", action:"Windows 10 ONLY — not 7, 8, or 11" },
        { key:"Encrypted Files artifact", action:"Does NOT show which program encrypted the files" },
        { key:"Hit stacking tag behaviour", action:"Tag one = tags ALL copies across ALL evidence sources" },
      ]
    },
  ],
};





// ─── SVG MIND MAP ─────────────────────────────────────────────────────────────

function MindMapSVG({ data, selectedBranch, onSelect }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 110;
  const n = data.branches.length;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width:"100%", maxWidth:340, display:"block", margin:"0 auto" }}>
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={46} fill="url(#cg)"/>
      {data.branches.map((b, i) => {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        const bx = cx + r * Math.cos(angle);
        const by = cy + r * Math.sin(angle);
        const isActive = selectedBranch === i;
        const isDim = selectedBranch !== null && !isActive;
        const words = b.label.split(" ");
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={bx} y2={by}
              stroke={b.color} strokeWidth={isActive ? 2.5 : 1.2}
              strokeOpacity={isDim ? 0.15 : 0.75}
              strokeDasharray={isActive ? "none" : "5 3"}
            />
            <g onClick={() => onSelect(isActive ? null : i)} style={{ cursor:"pointer" }}>
              <circle cx={bx} cy={by} r={isActive ? 31 : 26}
                fill={isActive ? b.color : "#111827"}
                stroke={b.color} strokeWidth={isActive ? 0 : 1.5}
                opacity={isDim ? 0.2 : 1}
              />
              {words.map((w, wi) => (
                <text key={wi} x={bx} y={by + (wi - (words.length-1)/2) * 8.5}
                  textAnchor="middle"
                  fill={isActive ? "#0a0f1e" : b.color}
                  fontSize={6.5} fontWeight="700" fontFamily="Courier New"
                  opacity={isDim ? 0.2 : 1}
                >{w}</text>
              ))}
            </g>
          </g>
        );
      })}
      {/* Center node */}
      <circle cx={cx} cy={cy} r={33} fill="#111827" stroke="#0ea5e9" strokeWidth={2}/>
      <text x={cx} y={cy-7} textAnchor="middle" fill="#e2e8f0" fontSize={14}>{data.icon}</text>
      <text x={cx} y={cy+6} textAnchor="middle" fill="#0ea5e9" fontSize={7.5} fontWeight="700" fontFamily="Courier New">M{data.mod}</text>
      <text x={cx} y={cy+17} textAnchor="middle" fill="#64748b" fontSize={5.5} fontFamily="Courier New">
        {data.title.length > 16 ? data.title.substring(0,15)+"…" : data.title}
      </text>
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────


function ExamQA({ q, a, color }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{background:"#111827",borderRadius:8,padding:"11px 13px",marginBottom:8,borderLeft:`3px solid ${color}`}}>
      <div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",lineHeight:1.5,marginBottom:open?10:0}}>{q}</div>
      {open ? (
        <>
          <div style={{background:"#0f1a12",borderRadius:6,padding:"10px 12px",marginBottom:8}}>
            <div style={{fontSize:11,color:"#86efac",lineHeight:1.6}}>{a}</div>
          </div>
          <button onClick={()=>setOpen(false)} style={{fontSize:11,color:"#64748b",background:"none",border:"none",cursor:"pointer",padding:0}}>Hide answer</button>
        </>
      ) : (
        <button onClick={()=>setOpen(true)} style={{fontSize:11,color:color,background:`${color}15`,border:`1px solid ${color}40`,borderRadius:6,padding:"4px 10px",cursor:"pointer",marginTop:6}}>Reveal answer</button>
      )}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [selMod, setSelMod] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [curQ, setCurQ] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]);
  const [done, setDone] = useState(false);
  const [qCount, setQCount] = useState(20);
  const [studyIdx, setStudyIdx] = useState(0);
  const [mapIdx, setMapIdx] = useState(0);
  const [selBranch, setSelBranch] = useState(null);
  const [practIdx, setPractIdx] = useState(0);
  const [practOpen, setPractOpen] = useState(false);
  const [commTab, setCommTab] = useState("reddit");
  const [labTab, setLabTab] = useState("artifacts");
  const [manualQ, setManualQ] = useState("");
  const [manualMod, setManualMod] = useState(0);
  const [exIdx, setExIdx] = useState(0);
  const [exMod, setExMod] = useState(0);
  const [exTab, setExTab] = useState("intent");
  const [exOpen, setExOpen] = useState({});
  const [examTab, setExamTab] = useState("briefing");
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [calmTab, setCalmTab] = useState("mindset");

  const startQuiz = useCallback(() => {
    let pool = selMod === 0 ? [...ALL_QUESTIONS] : ALL_QUESTIONS.filter(q => q.module === selMod);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(qCount, pool.length));
    setQuestions(shuffled); setCurQ(0); setPicked(null); setScore(0); setLog([]); setDone(false); setView("quiz");
  }, [selMod, qCount]);

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === questions[curQ].answer;
    if (ok) setScore(s => s + 1);
    setLog(l => [...l, { qi: curQ, ok, picked: i }]);
  };

  const next = () => {
    if (curQ + 1 >= questions.length) setDone(true);
    else { setCurQ(c => c+1); setPicked(null); }
  };

  const changeMap = (i) => { setMapIdx(i); setSelBranch(null); };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const pctColor = pct >= 80 ? "#00d4a0" : pct >= 65 ? "#fbbf24" : "#f87171";

  // HOME
  if (view === "home") return (
    <div style={S.root}>
      <div style={S.hdr}>
        <div style={S.badge}>MCFE EXAM PREP</div>
        <h1 style={S.title}>Magnet AXIOM<br/><span style={{color:"#0ea5e9"}}>Certification Trainer</span></h1>
        <p style={{color:"#64748b",fontSize:13,marginTop:8}}>AX200 v2604 · 75 Questions · 80% to Pass · 2-Year Validity</p>
      </div>
      <button onClick={()=>setView("yourexam")} style={{width:"100%",background:"linear-gradient(135deg,#1a0000,#3b0000,#1a0000)",border:"2px solid #f87171",borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"left",marginBottom:8,display:"flex",alignItems:"center",gap:12,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,background:"#f87171",color:"#0a0f1e",fontSize:9,fontWeight:900,padding:"3px 10px",borderRadius:"0 10px 0 8px",letterSpacing:1}}>YOUR ACTUAL EXAM</div>
        <span style={{fontSize:26,flexShrink:0}}>🎯</span>
        <div><div style={{fontSize:14,fontWeight:800,color:"#f87171",marginBottom:2}}>Baldwin / Burgess Case</div><div style={{fontSize:11,color:"#94a3b8",lineHeight:1.4}}>Case briefing - Evidence prep - Practical Q&A - Pre-exam checklist</div></div>
        <span style={{color:"#f87171",fontSize:18,marginLeft:"auto",flexShrink:0}}>→</span>
      </button>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <button onClick={()=>setView("aiassist")} style={{flex:1,background:"linear-gradient(135deg,#0a0a1a,#1a1040,#0a0a1a)",border:"2px solid #a78bfa",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22,flexShrink:0}}>🔍</span>
          <div><div style={{fontSize:12,fontWeight:800,color:"#a78bfa",marginBottom:2}}>AXIOM Smart Search</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.3}}>276 entries - Instant - Offline - Use during exam</div></div>
        </button>
        <button onClick={()=>setView("calm")} style={{flex:1,background:"linear-gradient(135deg,#0a1a0a,#0f2d0f,#0a1a0a)",border:"2px solid #00d4a0",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22,flexShrink:0}}>🧠</span>
          <div><div style={{fontSize:12,fontWeight:800,color:"#00d4a0",marginBottom:2}}>You Got This</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.3}}>Mindset - Cheat sheet - Navigation - If stuck</div></div>
        </button>
      </div>
      <button onClick={()=>setView("exercises")} style={{width:"100%",background:"linear-gradient(135deg,#071a00,#0f2e00,#071a00)",border:"1px solid #4ade8070",borderRadius:10,padding:"13px 16px",cursor:"pointer",textAlign:"left",marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:24,flexShrink:0}}>🧪</span>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:"#4ade80",marginBottom:3}}>Manual Exercises</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>15 exercises per the AX200 manual - running exercises + student exercises - exact steps, model answers, tricks</div></div>
        <span style={{color:"#4ade80",fontSize:16,flexShrink:0}}>→</span>
      </button>
      <div style={{display:"flex",gap:10,marginBottom:8}}>
        <button onClick={()=>setView("labref")} style={{flex:1,background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)",border:"1px solid #0ea5e940",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22,flexShrink:0}}>🔬</span>
          <div><div style={{fontSize:12,fontWeight:700,color:"#0ea5e9",marginBottom:2}}>DFIR Lab Reference</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>Artifacts - Registry - Paths - Playbooks - Quick ref</div></div>
          <span style={{color:"#0ea5e9",fontSize:16,marginLeft:"auto",flexShrink:0}}>→</span>
        </button>
        <button onClick={()=>setView("manual")} style={{flex:1,background:"linear-gradient(135deg,#1a0533,#2d1b69,#1a0533)",border:"1px solid #a78bfa40",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22,flexShrink:0}}>📖</span>
          <div><div style={{fontSize:12,fontWeight:700,color:"#a78bfa",marginBottom:2}}>Manual Quick Search</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>276 entries - Instant search - Use during exam</div></div>
          <span style={{color:"#a78bfa",fontSize:16,marginLeft:"auto",flexShrink:0}}>→</span>
        </button>
      </div>
      <div style={S.grid4}>
        {[
          {icon:"📚",label:"Study Guide",desc:"Concise summaries for all 12 modules",v:"study",c:"#0ea5e9"},
          {icon:"🗺️",label:"Mind Maps",desc:"Interactive visual concept maps per module",v:"mindmap",c:"#a78bfa"},
          {icon:"🎯",label:"Practice Exam",desc:"75-question format with full explanations",v:"qsetup",c:"#00d4a0"},
          {icon:"⚡",label:"Exam Tips",desc:"Critical details & trick question traps",v:"tips",c:"#f59e0b"},
          {icon:"🧪",label:"Hands-On Lab",desc:"Scenario-based practical investigation Q&A",v:"practical",c:"#f87171"},
          {icon:"🌐",label:"Community Intel",desc:"Real experiences from the DFIR community",v:"community",c:"#34d399"},
        ].map((c,i)=>(
          <button key={i} style={{...S.card,borderTop:`2px solid ${c.c}`}} onClick={()=>setView(c.v)}>
            <div style={{fontSize:22,marginBottom:7}}>{c.icon}</div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:4,color:"#e2e8f0"}}>{c.label}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{c.desc}</div>
          </button>
        ))}
      </div>
      <div style={S.stats}>
        {[["75","Questions"],["120","Minutes"],["80%","Pass Mark"],["12","Modules"]].map(([n,l],i,a)=>(
          <div key={i} style={{display:"flex",alignItems:"center"}}>
            <div style={S.stat}><span style={S.sn}>{n}</span><span style={S.sl}>{l}</span></div>
            {i<a.length-1&&<div style={S.sdiv}/>}
          </div>
        ))}
      </div>
    </div>
  );

  // MIND MAPS
  if (view === "mindmap") {
    const md = MIND_MAPS[mapIdx];
    const br = selBranch !== null ? md.branches[selBranch] : null;
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <h2 style={S.ptitle}>🗺️ Mind Maps</h2>
        <div style={S.chips}>
          {MIND_MAPS.map((m,i)=>(
            <button key={i} style={{...S.chip,...(mapIdx===i?S.chipA:{})}} onClick={()=>changeMap(i)}>
              {m.icon} M{m.mod}
            </button>
          ))}
        </div>
        <div style={S.mapBox}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,fontWeight:700,color:"#0ea5e9"}}>{md.icon} Module {md.mod}: {md.title}</span>
            <span style={{fontSize:10,color:"#475569"}}>{selBranch!==null?"Tap to deselect":"Tap a node"}</span>
          </div>
          <MindMapSVG data={md} selectedBranch={selBranch} onSelect={setSelBranch}/>
          {br ? (
            <div style={{...S.leafBox,borderLeft:`3px solid ${br.color}`}}>
              <div style={{fontSize:13,fontWeight:700,color:br.color,marginBottom:10}}>{br.label}</div>
              {br.leaves.map((lf,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                  <span style={{color:br.color,fontSize:10,minWidth:12,paddingTop:3}}>▸</span>
                  <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{lf}</span>
                </div>
              ))}
            </div>
          ):(
            <div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 0 8px",gap:4}}>
                <span style={{fontSize:22}}>☝️</span>
                <span style={{fontSize:11,color:"#64748b"}}>Tap any branch node to expand its key facts</span>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
                {md.branches.map((b,i)=>(
                  <button key={i} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:20,background:"transparent",border:`1px solid ${b.color}`,cursor:"pointer",fontSize:11,color:"#e2e8f0"}} onClick={()=>setSelBranch(i)}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:b.color,display:"inline-block",flexShrink:0}}/>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={S.navrow}>
          <button style={S.navbtn} onClick={()=>changeMap(Math.max(0,mapIdx-1))} disabled={mapIdx===0}>← Previous</button>
          <button style={S.navbtn} onClick={()=>changeMap(Math.min(MIND_MAPS.length-1,mapIdx+1))} disabled={mapIdx===MIND_MAPS.length-1}>Next →</button>
        </div>
      </div>
    );
  }

  // QUIZ SETUP
  if (view === "qsetup") return (
    <div style={S.root}>
      <button style={S.back} onClick={()=>setView("home")}>← Back</button>
      <h2 style={S.ptitle}>Configure Practice Exam</h2>
      <div style={S.block}>
        <label style={S.lbl}>Module Filter</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {MODULES.map((m,i)=>(
            <button key={i} style={{...S.chip,...(selMod===i?S.chipA:{})}} onClick={()=>setSelMod(i)}>{i===0?"All":`M${i}`}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:"#0ea5e9",marginTop:10}}>{MODULES[selMod]}</div>
      </div>
      <div style={S.block}>
        <label style={S.lbl}>Number of Questions</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[10,20,30,40,75].map(n=>(
            <button key={n} style={{...S.cntbtn,...(qCount===n?S.cntA:{})}} onClick={()=>setQCount(n)}>{n===75?"Full (75)":n}</button>
          ))}
        </div>
      </div>
      <button style={S.primary} onClick={startQuiz}>Start Exam →</button>
    </div>
  );

  // QUIZ ACTIVE
  if (view === "quiz" && !done) {
    const q = questions[curQ];
    return (
      <div style={S.root}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:13,color:"#64748b"}}>Q{curQ+1}/{questions.length}</span>
          <span style={{fontSize:12,background:"#111827",border:"1px solid #1e293b",padding:"3px 10px",borderRadius:20,color:"#94a3b8"}}>
            Score: {score}/{curQ+(picked!==null?1:0)}
          </span>
        </div>
        <div style={{height:4,background:"#1e293b",borderRadius:2,marginBottom:14}}>
          <div style={{height:"100%",background:"#0ea5e9",borderRadius:2,width:`${(curQ/questions.length)*100}%`,transition:"width 0.3s"}}/>
        </div>
        <div style={{fontSize:11,color:"#0ea5e9",letterSpacing:1,marginBottom:12,textTransform:"uppercase"}}>
          Module {q.module} — {MODULES[q.module]?.replace(`Module ${q.module} – `,"") || ""}
        </div>
        <div style={{fontSize:15,fontWeight:600,lineHeight:1.5,marginBottom:18,background:"#111827",padding:16,borderRadius:8,border:"1px solid #1e293b"}}>{q.q}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map((opt,i)=>{
            let bg = {background:"#111827",border:"1px solid #1e293b"};
            if (picked!==null){ if(i===q.answer) bg={background:"#064e3b",border:"1px solid #00d4a0"}; else if(i===picked) bg={background:"#450a0a",border:"1px solid #f87171"}; }
            return (
              <button key={i} style={{...S.opt,...bg}} onClick={()=>pick(i)}>
                <span style={{fontSize:12,fontWeight:700,color:"#0ea5e9",minWidth:20}}>{["A","B","C","D"][i]}</span>
                <span style={{fontSize:13,lineHeight:1.4}}>{opt}</span>
              </button>
            );
          })}
        </div>
        {picked!==null&&(
          <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:8,padding:14,marginTop:14}}>
            <strong style={{color:picked===q.answer?"#00d4a0":"#f87171"}}>
              {picked===q.answer?"✅ Correct!":"❌ Incorrect — Answer: "+["A","B","C","D"][q.answer]}
            </strong>
            <p style={{fontSize:13,color:"#94a3b8",marginTop:6,lineHeight:1.5}}>{q.explanation}</p>
          </div>
        )}
        {picked!==null&&<button style={{...S.primary,marginTop:16}} onClick={next}>{curQ+1>=questions.length?"See Results →":"Next →"}</button>}
      </div>
    );
  }

  // RESULTS
  if (view === "quiz" && done) {
    const pass = pct >= 80;
    return (
      <div style={S.root}>
        <div style={{textAlign:"center",padding:"24px 0 16px"}}>
          <div style={{fontSize:48,marginBottom:8}}>{pass?"🏆":pct>=65?"📈":"📖"}</div>
          <h2 style={{fontSize:24,fontWeight:800,margin:"0 0 8px"}}>{pass?"PASSED!":pct>=65?"Almost There":"Keep Studying"}</h2>
          <div style={{fontSize:52,fontWeight:900,color:pctColor,margin:"8px 0 4px"}}>{pct}%</div>
          <div style={{fontSize:15,color:"#94a3b8"}}>{score}/{questions.length} correct</div>
          <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Pass threshold: 80%</div>
          {!pass&&<p style={{fontSize:13,color:"#64748b",marginTop:8}}>Review the mind maps for weak modules, then retry.</p>}
        </div>
        <div style={{maxHeight:240,overflowY:"auto",margin:"12px 0",display:"flex",flexDirection:"column",gap:4}}>
          {log.map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"6px 10px",background:"#111827",borderRadius:4,fontSize:12,alignItems:"center",borderLeft:`3px solid ${a.ok?"#00d4a0":"#f87171"}`}}>
              <span style={{color:a.ok?"#00d4a0":"#f87171"}}>{a.ok?"✓":"✗"}</span>
              <span style={{color:"#64748b",flex:1}}>{questions[a.qi]?.q?.substring(0,58)}…</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button style={S.primary} onClick={startQuiz}>Retry Exam</button>
          <button style={{...S.primary,background:"#1e293b"}} onClick={()=>setView("qsetup")}>Change Setup</button>
          <button style={{...S.primary,background:"#1e293b"}} onClick={()=>setView("home")}>Home</button>
        </div>
      </div>
    );
  }

  // STUDY GUIDE
  if (view === "study") return (
    <div style={S.root}>
      <button style={S.back} onClick={()=>setView("home")}>← Back</button>
      <h2 style={S.ptitle}>Study Guide — All Modules</h2>
      <div style={S.chips}>
        {MODULE_SUMMARIES.map((m,i)=>(
          <button key={i} style={{...S.chip,...(studyIdx===i?S.chipA:{})}} onClick={()=>setStudyIdx(i)}>{m.icon} M{m.mod}</button>
        ))}
      </div>
      <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:18,marginBottom:14}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"#0ea5e9",margin:"0 0 14px"}}>
          {MODULE_SUMMARIES[studyIdx].icon} Module {MODULE_SUMMARIES[studyIdx].mod}: {MODULE_SUMMARIES[studyIdx].title}
        </h3>
        {MODULE_SUMMARIES[studyIdx].points.map((pt,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:9,fontSize:13,lineHeight:1.5}}>
            <span style={{color:"#0ea5e9",minWidth:12}}>▸</span><span>{pt}</span>
          </div>
        ))}
      </div>
      <div style={S.navrow}>
        <button style={S.navbtn} onClick={()=>setStudyIdx(m=>Math.max(0,m-1))} disabled={studyIdx===0}>← Previous</button>
        <button style={S.navbtn} onClick={()=>setStudyIdx(m=>Math.min(MODULE_SUMMARIES.length-1,m+1))} disabled={studyIdx===MODULE_SUMMARIES.length-1}>Next →</button>
      </div>
    </div>
  );

  // TIPS
  if (view === "tips") return (
    <div style={S.root}>
      <button style={S.back} onClick={()=>setView("home")}>← Back</button>
      <h2 style={S.ptitle}>⚡ Exam Tips & Critical Details</h2>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13}}>Details that separate a 75% from a 90%.</p>
      {TIPS.map((tip,i)=>(
        <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#111827",border:"1px solid #1e293b",borderRadius:8,padding:"12px 14px",marginBottom:8}}>
          <span style={{fontSize:11,color:"#0ea5e9",fontWeight:700,minWidth:26,paddingTop:2}}>{String(i+1).padStart(2,"0")}</span>
          <span style={{fontSize:13,color:"#cbd5e1",lineHeight:1.5}}>{tip}</span>
        </div>
      ))}
      <button style={{...S.primary,marginTop:16}} onClick={()=>setView("home")}>← Back to Home</button>
    </div>
  );

  // HANDS-ON PRACTICAL
  if (view === "practical") {
    const q = PRACTICAL_QS[practIdx];
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <h2 style={S.ptitle}>🧪 Hands-On Lab</h2>
        <p style={{color:"#64748b",fontSize:12,marginBottom:14}}>Scenario-based questions modelling the MCFE practical component. Work through the scenario before revealing the answer.</p>

        <div style={S.chips}>
          {PRACTICAL_QS.map((pq,i)=>(
            <button key={i} style={{...S.chip,...(practIdx===i?{...S.chipA,background:"#f87171",borderColor:"#f87171"}:{})}} onClick={()=>{setPractOpen(false);setPractIdx(i);}}>
              P{i+1}
            </button>
          ))}
        </div>

        <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:16,marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:11,background:"#1e1b4b",color:"#a78bfa",padding:"3px 10px",borderRadius:12,fontWeight:700}}>{q.category}</span>
            <span style={{fontSize:11,color:"#475569"}}>Scenario {practIdx+1} / {PRACTICAL_QS.length}</span>
          </div>
          <p style={{fontSize:14,fontWeight:600,lineHeight:1.6,color:"#e2e8f0",margin:0}}>{q.scenario}</p>
        </div>

        {!practOpen ? (
          <button style={{...S.primary,background:"#f87171",marginBottom:12}} onClick={()=>setPractOpen(true)}>
            Reveal Answer ↓
          </button>
        ) : (
          <div style={{background:"#0f1a12",border:"1px solid #166534",borderRadius:10,padding:16,marginBottom:12}}>
            <div style={{fontSize:11,color:"#00d4a0",fontWeight:700,marginBottom:8,letterSpacing:1}}>✅ ANSWER</div>
            <p style={{fontSize:13,color:"#d1fae5",lineHeight:1.6,margin:"0 0 12px"}}>{q.answer}</p>
            {q.follow_up && (
              <div style={{borderTop:"1px solid #166534",paddingTop:10}}>
                <span style={{fontSize:11,color:"#4ade80",fontWeight:700}}>💡 Follow-up note: </span>
                <span style={{fontSize:12,color:"#86efac"}}>{q.follow_up}</span>
              </div>
            )}
          </div>
        )}

        <div style={S.navrow}>
          <button style={S.navbtn} onClick={()=>{setPractOpen(false);setPractIdx(p=>Math.max(0,p-1));}} disabled={practIdx===0}>← Previous</button>
          <button style={S.navbtn} onClick={()=>{setPractOpen(false);setPractIdx(p=>Math.min(PRACTICAL_QS.length-1,p+1));}} disabled={practIdx===PRACTICAL_QS.length-1}>Next →</button>
        </div>
      </div>
    );
  }

  // COMMUNITY INTEL
  if (view === "community") {
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <h2 style={S.ptitle}>🌐 Community Intel</h2>
        <p style={{color:"#64748b",fontSize:12,marginBottom:16}}>Real experiences, reviews, and exam intelligence from the DFIR community — sourced from ThinkDFIR, Notre Dame CDT Program, Magnet official docs, and community Q&A platforms (Quizlet, Stuvia, Docsity).</p>

        {COMMUNITY_INTEL.map((item,i)=>(
          <div key={i} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,flexWrap:"wrap",gap:6}}>
              <div>
                <span style={{fontSize:11,background:"#0f172a",color:item.tagColor,padding:"3px 10px",borderRadius:12,fontWeight:700,border:`1px solid ${item.tagColor}40`}}>{item.tag}</span>
              </div>
              <div style={{display:"flex",gap:2}}>
                {[1,2,3,4,5].map(s=>(
                  <span key={s} style={{fontSize:12,color:s<=item.rating?"#fbbf24":"#1e293b"}}>★</span>
                ))}
              </div>
            </div>

            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{item.source}</div>
            <div style={{fontSize:11,color:"#475569",marginBottom:8}}>{item.role} · {item.date}</div>
            <div style={{fontSize:13,color:"#94a3b8",marginBottom:12,lineHeight:1.5}}>{item.summary}</div>

            <div style={{borderLeft:"3px solid #1e40af",background:"#0f172a",borderRadius:"0 6px 6px 0",padding:"10px 14px",marginBottom:12}}>
              <div style={{fontSize:11,color:"#60a5fa",fontWeight:700,marginBottom:4}}>📣 KEY QUOTE</div>
              <p style={{fontSize:12,color:"#93c5fd",fontStyle:"italic",lineHeight:1.6,margin:0}}>"{item.quote}"</p>
            </div>

            <div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Key Takeaways</div>
            {item.keyPoints.map((pt,j)=>(
              <div key={j} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                <span style={{color:item.tagColor,fontSize:10,minWidth:12,paddingTop:3}}>▸</span>
                <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{pt}</span>
              </div>
            ))}

            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:11,color:"#475569",textDecoration:"none"}}>
              🔗 Source: {item.url.replace("https://","").split("/")[0]}
            </a>
          </div>
        ))}

        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:14,marginTop:4}}>
          <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:8}}>📊 Community Consensus — What to Expect</div>
          {[
            ["Avg score reported by CDT cohort","92% (well above 80% threshold)"],
            ["Most commonly missed detail","Email Participants filter is CASE SENSITIVE"],
            ["#1 exam prep advice","Process the evidence files BEFORE starting the timer"],
            ["Common practical Q pattern","Look up specific artifact values in your case file"],
            ["Biggest time waster","Not knowing where to navigate — drill the UI beforehand"],
            ["Is the Artifact Reference available?","Yes — Help → Documentation → Artifact Reference (use it!)"],
          ].map(([k,v],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #1e293b",gap:10}}>
              <span style={{fontSize:12,color:"#64748b",flex:1}}>{k}</span>
              <span style={{fontSize:12,color:"#0ea5e9",fontWeight:700,textAlign:"right",flex:1}}>{v}</span>
            </div>
          ))}
        </div>

        <button style={{...S.primary,marginTop:16}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  // YOUR ACTUAL EXAM
  if (view === "yourexam") {
    const tabs = [
      {id:"briefing",label:"📋 Case Briefing",c:"#f87171"},
      {id:"evidence",label:"💾 Evidence Files",c:"#0ea5e9"},
      {id:"checklist",label:"✅ Pre-Exam Checklist",c:"#00d4a0"},
      {id:"practicals",label:"🧪 Practical Q&A",c:"#a78bfa"},
      {id:"strategy",label:"⚡ Exam Strategy",c:"#f59e0b"},
    ];

    const EXAM_PRACTICALS = [
      {
        cat:"Dell Laptop — Item 1",color:"#0ea5e9",
        qs:[
          {q:"Where would you check to see what applications Brenda Baldwin ran on her Dell laptop, how many times, and when?",a:"Prefetch Files artifact: Operating System → Prefetch Files – Windows 8/10/11. Located in Windows\\Prefetch\\. Naming: APPNAME.HASH.pf. Provides: application name, run count, and last 8 launch times. On Windows 10/11: files are XPRESS HUFFMAN (MAM) compressed — Axiom handles this automatically."},
          {q:"How would you determine when Brenda Baldwin's laptop was last shut down before it was seized?",a:"Operating System → Operating System Information artifact. The 'Last Shutdown Date/Time' field comes from the ShutdownTime value in the SYSTEM hive (ControlSet###\\Control\\Windows). Format: 8-byte Windows 64-bit Little Endian timestamp. Verify by using Source Linking → Registry Explorer → HEX card → DECODE card."},
          {q:"You want to confirm the OS build number of Baldwin's Dell laptop to understand which artifacts should exist. Where do you look?",a:"Operating System → Operating System Information. Parsed from SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion. Contains: ProductName, CurrentBuild, CurrentBuildNumber. Build 1803+ = Windows Timeline artifacts may be present. OS Pro version = BitLocker likely configured."},
          {q:"What artifact shows which USB drives were ever connected to Baldwin's Dell laptop?",a:"Connected Devices → USB Devices. Sources: SOFTWARE and SYSTEM registry hives, setupapi.dev.log, pagefile.sys, Windows Event Logs, NTUSER.DAT, restore points, VSC. Captures: device name, manufacturer, first connection time, drive letter assigned, Windows user profile associated."},
          {q:"Where would you find evidence of files Baldwin recently accessed in Windows File Explorer on her laptop?",a:"Refined Results → Locally Accessed Files and Folders. Source: WebCacheV01.dat (also contains IE/Edge history). ':Host: This PC' entries = navigation via Windows File Explorer. Stored in user's AppData area → identifies which Windows user performed the activity."},
          {q:"How would you find evidence that Baldwin searched for something specific on her laptop?",a:"Two artifacts: (1) Refined Results → Google Searches (Google only), (2) Refined Results → Parsed Search Queries (Bing, Yahoo, DuckDuckGo, and all others). Use BOTH for complete picture. Also check Web Related → Chrome/Firefox Browser Visits for direct URL navigation."},
          {q:"You suspect Baldwin communicated via email from her laptop. What is the most efficient way to find ALL email attachments she sent or received?",a:"Email & Calendar → Email Attachments artifact. Aggregates ALL attachments from ALL parsed email artifacts across all evidence sources in one location. Includes Subject, Sender, Recipient, and 'Original Artifact' hyperlink back to parent email. REMEMBER: Participants filter in Email Explorer is CASE SENSITIVE."},
          {q:"How would you find LNK files on Baldwin's laptop and what do they prove?",a:"Operating System → LNK Files. Created automatically when files are accessed via Windows Explorer. Location: Users\\[user]\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\. Proves: target file name and full path, MAC times of the target file at time of access, Volume Serial Number (proves which drive the file was on), machine identifier. Proves file access even if original file deleted."},
        ]
      },
      {
        cat:"Google Takeout — Item 2 (BrendaBaldwin420@gmail.com)",color:"#00d4a0",
        qs:[
          {q:"The Google Takeout is 160MB. What types of data might this contain and where do you find it in Axiom?",a:"Google Takeout is a ZIP archive of Google account data. In Axiom: Email & Calendar → Gmail Emails (or Cloud Gmail Messages). May also contain: Google Drive files (Cloud Storage), Google Photos (Media), Google Calendar (Calendar artifacts), Google Account Activity (OS/Application Usage). Process it as a Computer → Windows → Folder evidence source pointing to the extracted Takeout folder."},
          {q:"How do you process a Google Takeout file in Axiom Process? What evidence source type do you select?",a:"Google Takeout is processed as a CLOUD evidence source type: CLOUD → Google → Takeout (ZIP file or extracted folder). Alternatively if extracted: Computer → Windows → Folder. Check with course materials — most likely CLOUD → Google → Takeout. Axiom will automatically parse Gmail, Drive, and other Google data from the Takeout format."},
          {q:"What does 'Cloud Gmail Messages' artifact contain vs 'Gmail Emails' from local cache?",a:"Gmail Emails: parsed from local Gmail cache (browser or app data on device). Cloud Gmail Messages: acquired directly from Google account (live acquisition via Axiom Cloud OR from Google Takeout). Cloud/Takeout version has more complete data and may include emails not cached locally. Cloud version is more authoritative and complete."},
          {q:"If you find a suspicious email in the Google Takeout, how do you find all attachments from that sender?",a:"Email Explorer → set Participants filter (Sender field) to the sender's email address. CASE SENSITIVE — must match exact case. Then check Email & Calendar → Email Attachments artifact filtered by sender. Right-click artifact → 'Filter on Column' → Sender = [email]. 'Original Artifact' link jumps back to parent email for full context."},
          {q:"How do you confirm that an email from the Google Takeout is authentic and from the real sender?",a:"Check email headers in the Details pane. Headers contain: server timestamps (may differ from display timestamp), originating IP address, DKIM/SPF authentication results, routing through mail servers. Even with a spoofed display name, headers reveal the true sending server. Axiom parses headers and displays them in the ARTIFACT INFORMATION section."},
        ]
      },
      {
        cat:"Apple iPhone 12 — Item 3 (Steve Burgess, Logical+)",color:"#a78bfa",
        qs:[
          {q:"Item 3 is a Logical+ acquisition of Steve Burgess's iPhone 12. What does Logical+ extraction contain compared to a standard Logical extraction?",a:"Logical+ (also called Advanced Logical): includes everything from a standard logical backup PLUS additional data such as: shared app group containers, some protected app data, Keychain items, and additional database files not accessible in standard logical. More data than standard logical but less than a full file system or AFU extraction. Axiom parses Logical+ extractions natively."},
          {q:"How would you review Burgess's iPhone in Axiom Examine to see his app layout?",a:"Case Dashboard → click the iPhone 12 evidence source → Mobile View opens. Note: apps are NOT in their original device order — this is a known limitation. Click any supported app to view its artifacts filtered in Artifact Explorer. 'Use preferred view for app' applies the best view (e.g., Conversation View for messaging apps). Requires Axiom 8.0+."},
          {q:"Where would you find SMS messages and iMessages from Burgess's iPhone 12?",a:"Communications → SMS/MMS Messages artifact. Parsed from sms.db on iOS. Contains: message content, timestamps, sender/recipient phone numbers, read/unread status, thread structure. iMessages and standard SMS both appear here. Also check if WhatsApp or other messaging apps are installed for additional communication channels."},
          {q:"What would prove that Burgess communicated with Baldwin via his iPhone?",a:"Multiple artifacts corroborate this: (1) SMS/MMS Messages: filter by Baldwin's phone number or email. (2) Call History: shows calls between devices with duration and timestamps. (3) Email artifacts if iPhone syncs email. (4) Contacts: Baldwin's contact entry shows saved contact relationship. (5) Connections Explorer: links between phone number/email across all evidence items. CRITICALLY: use Connections Explorer after building Connections to see cross-device links."},
          {q:"How would you find evidence of classified documents on Burgess's iPhone?",a:"Check: (1) Files app artifacts / file system data for document files. (2) Email attachments if email synced to iPhone. (3) Cloud Storage artifacts (iCloud Drive if acquired). (4) Media → Documents for PDFs, Word docs, etc. (5) Web Related → browser history for URLs of classified document repositories. (6) Connections Explorer to link document files across iPhone and any cloud acquisition. Also check if Logical+ captured any shared app containers with document viewers."},
          {q:"You need to establish where Burgess was at the time of the incident. What mobile artifacts could help?",a:"Location data from iPhone Logical+: (1) Media → Pictures → EXIF GPS coordinates from photos (timestamp + location). (2) Application artifacts from Maps/navigation apps if accessible in Logical+. (3) Any location-embedded EXIF in photos. (4) Call logs and SMS timestamps to establish proximity/movement. (5) If World Map built in Axiom: geographic visualization of all location-based artifacts. Build World Map from Tools menu."},
        ]
      },
      {
        cat:"Cross-Evidence / Connections",color:"#f59e0b",
        qs:[
          {q:"How do you prove that a file found on Burgess's iPhone is the SAME file found on Baldwin's laptop or in her Gmail?",a:"File hash verification via Connections Explorer. After building Connections (Tools → Build Connections), the Connections Explorer shows hash matches across evidence sources. A matching MD5 or SHA1 hash across iPhone, laptop, and Gmail confirms they are the exact same file — this is the single strongest proof of file transfer between individuals and devices."},
          {q:"After processing all three evidence items, what is the FIRST thing you should build in Axiom Examine and why?",a:"Build Connections immediately: Tools → Build Connections. This links artifacts across ALL three evidence sources — Dell laptop, Google Takeout, and iPhone. Finding connections between evidence items (same files, same email addresses, same phone numbers) is critical for establishing the relationship between Baldwin and Burgess. Also build Timeline to establish chronological event sequence."},
          {q:"How would you establish a timeline of communications between Baldwin and Burgess?",a:"Timeline Explorer after building Timeline (Tools → Build Timeline). Filter by relevant date range (around time of incident). Look for: email exchanges in Gmail, SMS/iMessage timestamps from iPhone, file access times on laptop correlated with communications. Also: Connections Explorer shows relationships between communication artifacts across all three devices/accounts."},
          {q:"What does the Connections Explorer specifically show when linking the three evidence items in this case?",a:"After building Connections: email addresses (Baldwin's Gmail linked to emails on her laptop and messages on Burgess's phone), phone numbers (Burgess's number linked to iPhone artifacts and any contact entries on laptop), file hashes (documents shared via email or cloud), usernames/screen names (Identifiers – People linked across all evidence). This answers the WHO WHAT WHEN WHERE WHY HOW of the investigation."},
        ]
      },
    ];

    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>

        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#1a0000,#3b0000)",border:"2px solid #f8717160",borderRadius:12,padding:16,marginBottom:14}}>
          <div style={{fontSize:10,color:"#f87171",fontWeight:800,letterSpacing:2,marginBottom:6}}>YOUR ACTUAL MCFE EXAM</div>
          <h2 style={{fontSize:18,fontWeight:800,color:"#f87171",margin:"0 0 4px"}}>Baldwin / Burgess Case</h2>
          <p style={{fontSize:11,color:"#94a3b8",margin:0,lineHeight:1.5}}>Homicide investigation · South Bend, Indiana · 3 evidence items · 120 minutes · 80% to pass</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
          {tabs.map(t=>(
            <button key={t.id} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${examTab===t.id?t.c:"#1e293b"}`,background:examTab===t.id?`${t.c}20`:"transparent",color:examTab===t.id?t.c:"#64748b",cursor:"pointer",fontSize:11,fontWeight:examTab===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setExamTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* BRIEFING TAB */}
        {examTab === "briefing" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #f8717130",borderRadius:10,padding:16,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f87171",marginBottom:10,letterSpacing:1}}>📂 CASE OVERVIEW</div>
              <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.7}}>
                This case originated as a <span style={{color:"#f87171",fontWeight:700}}>homicide investigation</span> involving the shooting death of <span style={{color:"#fbbf24",fontWeight:700}}>Brenda Baldwin</span> at a bar in South Bend, Indiana.
              </div>
              <div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.7,marginTop:8}}>
                During the investigation, it was discovered that Baldwin had been in communication with <span style={{color:"#fbbf24",fontWeight:700}}>Steve Burgess</span> prior to her death. It was further revealed that Burgess was affiliated with the <span style={{color:"#f87171",fontWeight:700}}>United States military</span> and there were suspicions of him sharing <span style={{color:"#f87171",fontWeight:700}}>classified documents</span> with Baldwin.
              </div>
              <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7,marginTop:8}}>
                The exact connection between these communications and the homicide remains unknown. Three items of evidence were seized during the investigation.
              </div>
            </div>

            {/* Subjects */}
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              {[
                {name:"Brenda Baldwin",role:"Victim",details:["Killed at a bar in South Bend, IN","Owned: Dell Latitude Laptop","Google account: BrendaBaldwin420@gmail.com","Suspected: received classified documents"],color:"#f87171"},
                {name:"Steve Burgess",role:"Suspect",details:["US military affiliation","Owned: Apple iPhone 12","Suspected: shared classified docs with Baldwin","Relationship to homicide: unknown"],color:"#a78bfa"},
              ].map((p,i)=>(
                <div key={i} style={{flex:1,background:"#0f172a",border:`1px solid ${p.color}40`,borderRadius:10,padding:12}}>
                  <div style={{fontSize:10,fontWeight:800,color:p.color,letterSpacing:1,marginBottom:4}}>{p.role}</div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{p.name}</div>
                  {p.details.map((d,j)=>(
                    <div key={j} style={{fontSize:11,color:"#64748b",lineHeight:1.5,marginBottom:3}}>▸ {d}</div>
                  ))}
                </div>
              ))}
            </div>

            {/* Key investigation questions */}
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fbbf24",marginBottom:10}}>🔑 Key Investigative Questions</div>
              {[
                "What classified documents (if any) were shared between Baldwin and Burgess?",
                "What was the nature of their communication — email, messaging, phone calls?",
                "What is the timeline of their communications relative to the shooting?",
                "What evidence of document transfer exists across laptop, Gmail, and iPhone?",
                "Were there any other individuals involved in their communications?",
                "What does the Google Takeout reveal about Baldwin's online activity?",
              ].map((q,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{color:"#fbbf24",fontSize:10,minWidth:16,paddingTop:3}}>Q{i+1}</span>
                  <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{q}</span>
                </div>
              ))}
            </div>

            {/* Official instructions */}
            <div style={{background:"#0f1a0f",border:"1px solid #16653440",borderRadius:10,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00d4a0",marginBottom:10}}>📢 Official Exam Instructions (from Magnet portal)</div>
              {[
                "Process all THREE evidence files before starting the exam timer",
                "Default artifacts must be enabled for ALL of the images during processing",
                "Build Connections for the data after processing (explicitly required)",
                "You can and SHOULD work with these images in depth BEFORE attempting the exam",
                "Timer does NOT start until you begin the question portion",
                "Several practical-based questions reference the analysis of these images in Axiom",
                "Need Axiom temp license? Email: Training@magnetforensics.com",
                "After passing: fill out Postal Address Form to receive printed, embossed certificate",
              ].map((note,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{color:"#00d4a0",fontSize:10,minWidth:12,paddingTop:2}}>✓</span>
                  <span style={{fontSize:12,color:"#d1fae5",lineHeight:1.5}}>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE FILES TAB */}
        {examTab === "evidence" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Three evidence items. All must be processed BEFORE starting the 120-minute timer.</p>

            {[
              {
                item:"Item 1", label:"Dell Latitude Laptop", icon:"💻",
                owner:"Brenda Baldwin", color:"#0ea5e9",
                type:"Logical acquisition of C: Drive", size:"40.6 GB",
                format:"Likely .E01 forensic image",
                addInAxiom:"Computer → Windows → Load Evidence → IMAGE",
                keyArtifacts:["OS Information (build number, install date)","User Accounts – Windows (SID, login dates)","Prefetch Files (apps run + timestamps)","USB Devices (external drives connected)","Browser History + Bookmarks (Chrome/Firefox/Edge)","Email artifacts (Outlook OST/PST if present)","LNK Files + Jump Lists (recently accessed files)","Windows Event Logs (logon events)","Locally Accessed Files (Windows Explorer activity)","Documents (Word, Excel, PDF files)"],
                notes:"Largest file. Process first. Logical acquisition = only C: drive (no unallocated space carving possible). Focus on file system artifacts, registry, user activity.",
              },
              {
                item:"Item 2", label:"Google Takeout", icon:"📧",
                owner:"Brenda Baldwin (BrendaBaldwin420@gmail.com)", color:"#00d4a0",
                type:"Google Takeout ZIP archive", size:"160 MB",
                format:"ZIP file containing Google account data",
                addInAxiom:"CLOUD → Google → Takeout (point to ZIP file)",
                keyArtifacts:["Cloud Gmail Messages (full email history)","Email Attachments (all attached files)","Google Drive files (if included in Takeout)","Google Photos (if included)","Google Calendar events","Google Account Activity (search/browsing history)","Contacts (address book)"],
                notes:"Smallest file — process quickly. Google Takeout = SNAPSHOT of entire Google account. Critical for email communications with Burgess. Email addresses, attachments, and document sharing evidence.",
              },
              {
                item:"Item 3", label:"Apple iPhone 12", icon:"📱",
                owner:"Steve Burgess", color:"#a78bfa",
                type:"Logical+ acquisition", size:"6.35 GB",
                format:"iTunes-format backup or Logical+ extraction",
                addInAxiom:"Mobile → iOS → Load Evidence → point to extraction files",
                keyArtifacts:["SMS/MMS Messages (sms.db — texts and iMessages)","Call History (calls with Baldwin, unknown numbers)","Contacts (Baldwin's entry, military contacts)","Notes app (any classified document content)","Photos + Videos (EXIF location data, document photos)","Email app (if synced — may overlap with Item 2)","Installed Apps (what was on the device)","Browser History (Safari or Chrome)","Location artifacts (GPS from EXIF, location services)"],
                notes:"Logical+ gives more than standard backup. Look for: communications with Baldwin, military-related apps, document viewer apps, cloud storage apps (iCloud, Dropbox). Mobile View available if acquisition type is supported.",
              },
            ].map((ev,i)=>(
              <div key={i} style={{background:"#111827",border:`1px solid ${ev.color}30`,borderRadius:12,padding:16,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                  <span style={{fontSize:24}}>{ev.icon}</span>
                  <div>
                    <div style={{fontSize:11,color:ev.color,fontWeight:800,letterSpacing:1}}>{ev.item}</div>
                    <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{ev.label}</div>
                    <div style={{fontSize:11,color:"#64748b"}}>{ev.owner}</div>
                  </div>
                  <div style={{marginLeft:"auto",textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:700,color:ev.color}}>{ev.size}</div>
                    <div style={{fontSize:10,color:"#475569"}}>acquisition size</div>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                  <div style={{background:"#0f172a",borderRadius:6,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#475569",marginBottom:3}}>TYPE</div>
                    <div style={{fontSize:11,color:"#cbd5e1"}}>{ev.type}</div>
                  </div>
                  <div style={{background:"#0f172a",borderRadius:6,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#475569",marginBottom:3}}>ADD IN AXIOM</div>
                    <div style={{fontSize:10,color:ev.color,fontFamily:"monospace",lineHeight:1.4}}>{ev.addInAxiom}</div>
                  </div>
                </div>

                <div style={{fontSize:11,color:ev.color,fontWeight:700,marginBottom:6}}>Key Artifacts to Review</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
                  {ev.keyArtifacts.map((a,j)=>(
                    <span key={j} style={{fontSize:10,background:`${ev.color}15`,color:ev.color,padding:"2px 8px",borderRadius:10,border:`1px solid ${ev.color}30`}}>{a}</span>
                  ))}
                </div>

                <div style={{background:"#0f172a",borderRadius:6,padding:"8px 10px",borderLeft:`3px solid ${ev.color}`}}>
                  <span style={{fontSize:10,color:ev.color,fontWeight:700}}>💡 Note: </span>
                  <span style={{fontSize:11,color:"#94a3b8"}}>{ev.notes}</span>
                </div>
              </div>
            ))}

            {/* Download hashes */}
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#64748b",marginBottom:10}}>🔐 Download File MD5 Hashes (for verification)</div>
              {[
                {file:"MCFE2023Evidence.7z.001",size:"11.7 GB",md5:"CFE5331E56E47ADD6D64CCB64B5FB7AB"},
                {file:"MCFE2023Evidence.7z.002",size:"11.7 GB",md5:"09B37D01E7094F84028BB06GA874AA8A"},
                {file:"MCFE2023Evidence.7z.003",size:"11.7 GB",md5:"58A58CE8D8F7C94BD57C93984D697731"},
                {file:"MCFE2023Evidence.7z.004",size:"10.2 GB",md5:"63F5E9F2A4D45ACC555E7752485A6AAD"},
              ].map((f,i)=>(
                <div key={i} style={{padding:"6px 0",borderBottom:"1px solid #1e293b20"}}>
                  <div style={{fontSize:11,color:"#0ea5e9",fontWeight:700,marginBottom:2}}>{f.file} <span style={{color:"#475569",fontWeight:400}}>({f.size})</span></div>
                  <div style={{fontSize:10,color:"#64748b",fontFamily:"monospace"}}>{f.md5}</div>
                </div>
              ))}
              <div style={{fontSize:11,color:"#f59e0b",marginTop:8}}>⚠️ All 4 files must be in the same folder when extracting with 7-Zip. Extract the .7z.001 file — 7-Zip will automatically handle all parts.</div>
            </div>
          </div>
        )}

        {/* PRE-EXAM CHECKLIST */}
        {examTab === "checklist" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Complete EVERYTHING below BEFORE clicking "Start the MCFE Exam". The timer does NOT start until you begin the question portion.</p>

            {[
              {
                phase:"PHASE 1 — Download & Verify", color:"#0ea5e9", icon:"⬇️",
                steps:[
                  "Download all 4 MCFE2023Evidence.7z files from the Magnet portal",
                  "Place ALL 4 files in the SAME folder before extracting",
                  "Extract using 7-Zip: right-click MCFE2023Evidence.7z.001 → Extract Here",
                  "Verify MD5 hashes of downloaded files against portal values",
                  "Confirm you have 3 extracted evidence files (Item 1, 2, 3)",
                  "Request temporary Axiom license key: Training@magnetforensics.com (if needed)",
                ]
              },
              {
                phase:"PHASE 2 — Create Axiom Case", color:"#a78bfa", icon:"📁",
                steps:[
                  "Open Axiom Process → Create New Case",
                  "Set Case Number, Examiner Name (Scanned By = your name)",
                  "CRITICAL: Set temp file location to a SEPARATE physical disk (Tools → Settings → Custom Location)",
                  "Separate case folder and evidence folder on different physical disks for max speed",
                  "Enable default artifacts for ALL images (as instructed by Magnet portal)",
                ]
              },
              {
                phase:"PHASE 3 — Add All 3 Evidence Items", color:"#f59e0b", icon:"💾",
                steps:[
                  "Item 1: Computer → Windows → Load Evidence → IMAGE → select Dell Latitude .E01",
                  "Item 2: CLOUD → Google → Takeout → select Google Takeout ZIP",
                  "Item 3: Mobile → iOS → Load Evidence → select iPhone 12 extraction files",
                  "Verify all 3 items show 'Ready' or 'Ready to Search' status in Analyze Evidence screen",
                  "Enable Keywords processing (add any relevant terms: Baldwin, Burgess, classified, military)",
                  "Enable Hash Matching if hash set available",
                  "Click ANALYZE EVIDENCE — monitor Thread Details during processing",
                ]
              },
              {
                phase:"PHASE 4 — Post-Processing Setup", color:"#00d4a0", icon:"🔧",
                steps:[
                  "CRITICAL: Check OS Information artifact → confirm device timezone → set Axiom timezone to match",
                  "Build Connections: Tools → Build Connections (explicitly required by exam instructions)",
                  "Build Timeline: Tools → Build Timeline",
                  "Build World Map (optional but useful for iPhone GPS data)",
                  "Verify all 3 evidence sources show artifacts in the Case Dashboard",
                  "Quick check: Connections Explorer shows links between evidence items",
                ]
              },
              {
                phase:"PHASE 5 — Pre-Exam Case Exploration", color:"#f87171", icon:"🔍",
                steps:[
                  "Review Case Dashboard — Event Snapshot, Evidence Sources, Insights",
                  "Review OS Information — confirm build number, user accounts, shutdown time",
                  "Browse Gmail artifacts (Item 2) — get familiar with Baldwin's email history",
                  "Review iPhone SMS/iMessage artifacts (Item 3) — find Baldwin-Burgess communications",
                  "Check Connections Explorer — what links between the 3 evidence items?",
                  "Note key artifact counts per category — helps speed up exam navigation",
                  "Tag any clearly significant artifacts you spot during exploration",
                  "Open PDF manual (searchable): Help → Documentation → User Guide",
                  "Open Artifact Reference: Help → Documentation → Artifact Reference",
                  "NOW you are ready to click 'Start the MCFE Exam' — timer begins",
                ]
              },
            ].map((phase,pi)=>(
              <div key={pi} style={{background:"#111827",border:`1px solid ${phase.color}30`,borderRadius:10,padding:14,marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:16}}>{phase.icon}</span>
                  <span style={{fontSize:12,fontWeight:700,color:phase.color}}>{phase.phase}</span>
                </div>
                {phase.steps.map((step,si)=>(
                  <div key={si} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
                    <div style={{minWidth:20,height:20,borderRadius:"50%",background:`${phase.color}20`,border:`1px solid ${phase.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:phase.color,fontWeight:700,flexShrink:0}}>{si+1}</div>
                    <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{step}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PRACTICALS TAB */}
        {examTab === "practicals" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Scenario-based Q&A built around YOUR actual exam evidence items. Work through each before revealing the answer.</p>
            {EXAM_PRACTICALS.map((section,si)=>(
              <div key={si} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"7px 12px",background:`${section.color}15`,borderRadius:8,border:`1px solid ${section.color}30`}}>
                  <span style={{fontSize:12,fontWeight:700,color:section.color}}>{section.cat}</span>
                </div>
                {section.qs.map((qa,qi)=>(
                  <ExamQA key={qi} q={qa.q} a={qa.a} color={section.color} />
                ))}
              </div>
            ))}
          </div>
        )}

        {/* STRATEGY TAB */}
        {examTab === "strategy" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #f8717130",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f87171",marginBottom:10}}>⏱️ Time Management — 120 Minutes, 75 Questions</div>
              <div style={{fontSize:12,color:"#94a3b8",marginBottom:8}}>Average: <span style={{color:"#fbbf24",fontWeight:700}}>96 seconds per question</span>. Questions divide roughly as:</div>
              {[
                {type:"~38 questions (50%)", desc:"Practical: specific values from YOUR processed case files", time:"~90 sec each — navigate Axiom to find the answer", color:"#f87171"},
                {type:"~19 questions (25%)", desc:"Program functions: how to do things in AXIOM Process/Examine", time:"~60 sec each — check program or PDF manual", color:"#a78bfa"},
                {type:"~18 questions (25%)", desc:"Settings: Process settings, Reports, configuration options", time:"~60 sec each — use PDF manual search", color:"#0ea5e9"},
              ].map((t,i)=>(
                <div key={i} style={{background:"#0f172a",borderRadius:6,padding:"10px 12px",marginBottom:6,borderLeft:`3px solid ${t.color}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:t.color,marginBottom:3}}>{t.type}</div>
                  <div style={{fontSize:11,color:"#cbd5e1",marginBottom:3}}>{t.desc}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{t.time}</div>
                </div>
              ))}
            </div>

            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00d4a0",marginBottom:10}}>🧭 During the Exam — Navigation Strategy</div>
              {[
                ["Keep 3 windows open","Axiom Examine (case open) + PDF manual (searchable) + exam portal"],
                ["Practical questions","Go straight to the relevant artifact category in Axiom Examine. Use global search or Filters bar."],
                ["If stuck on a question","SKIP IT — come back. The Reddit community confirmed skip-and-return works."],
                ["Use Artifact Reference","Help → Documentation → Artifact Reference explains every field if you're unsure what a column means"],
                ["Use global search","Ctrl+F or Filters bar keyword search finds specific values across all artifacts"],
                ["Use Filter on Column","Right-click any value → Filter on Column — faster than manually configuring Filters bar"],
                ["PDF manual is searchable","The PDF can be open and searched — press Ctrl+F in your PDF viewer to find terms instantly"],
                ["Don't over-think","The exam is 'pretty basic' and 'no ultra technical questions' — per Reddit. Trust the manual."],
              ].map(([k,v],i)=>(
                <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:"1px solid #1e293b20",alignItems:"flex-start"}}>
                  <span style={{fontSize:10,fontWeight:700,color:"#00d4a0",background:"#00d4a015",padding:"3px 8px",borderRadius:6,minWidth:100,textAlign:"center",flexShrink:0,lineHeight:1.4}}>{k}</span>
                  <span style={{fontSize:11,color:"#cbd5e1",lineHeight:1.5,flex:1}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:"#0f1a12",border:"1px solid #166534",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00d4a0",marginBottom:10}}>✅ Youre Ready When...</div>
              {[
                "All 3 evidence items are processed and show artifacts in Axiom Examine",
                "Connections are built — Connections Explorer shows cross-evidence links",
                "Timeline is built — you can see chronological event sequence",
                "You've spent time in the case — browsed Gmail, reviewed iPhone messages, checked laptop OS info",
                "You know your way around each artifact category for all 3 evidence types",
                "PDF manual is open and you've tested Ctrl+F search",
                "Artifact Reference is bookmarked: Help → Documentation → Artifact Reference",
                "You know the Baldwin-Burgess communication timeline at a high level",
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{color:"#00d4a0",fontSize:12,flexShrink:0}}>☐</span>
                  <span style={{fontSize:12,color:"#d1fae5",lineHeight:1.5}}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{background:"#111827",border:"1px solid #fbbf2440",borderRadius:10,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fbbf24",marginBottom:8}}>💬 What Reddit Said About THIS Format</div>
              {[
                {u:"etspiritussancti",q:"About half the test is practical questions about the test case, a quarter are basic questions about the program's functions that you can just check the program to answer, and another portion are settings in Process and Reports."},
                {u:"mdnrhardee",q:"Make sure to process the case files, build connections and timeline BEFORE you start the test. There were a few candidates who didn't and they weren't able to complete in time."},
                {u:"barleyhogg1",q:"Just process the case they give. Dig through it for a week and get really comfortable with the scenario. The PDF can be used during the test and is searchable."},
              ].map((c,i)=>(
                <div key={i} style={{background:"#0f172a",borderRadius:6,padding:"8px 10px",marginBottom:6,borderLeft:"3px solid #fbbf24"}}>
                  <div style={{fontSize:10,color:"#fbbf24",fontWeight:700,marginBottom:3}}>u/{c.u}</div>
                  <div style={{fontSize:11,color:"#94a3b8",fontStyle:"italic",lineHeight:1.5}}>"{c.q}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button style={{...S.primary,marginTop:12}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  // ─── AI AXIOM ASSISTANT ───────────────────────────────────────────────────────
  if (view === "aiassist") {
    const SYSTEM_PROMPT = `You are an expert Magnet AXIOM forensic examiner assistant helping a cybersecurity analyst named Yousef prepare for and pass the MCFE (Magnet Certified Forensics Examiner) exam. 

The exam case is: Baldwin/Burgess homicide and classified documents case.
- Item 1: Dell Latitude Laptop (Brenda Baldwin) - 40.6 GB logical acquisition of C drive
- Item 2: Google Takeout (BrendaBaldwin420@gmail.com) - 160 MB
- Item 3: Apple iPhone 12 (Steve Burgess) - 6.35 GB Logical+ acquisition

You have expert knowledge of:
- Magnet AXIOM Process and Axiom Examine (AX200 v2604 course)
- All Windows OS artifacts: Prefetch (naming: APPNAME.HASH.pf, max entries XP=126/Vista-8=129/Win10-11=1024, XPRESS HUFFMAN compression on Win10+), Registry hives (SAM/SOFTWARE/SYSTEM/NTUSER.DAT), ShutdownTime (8-byte Windows 64-bit LE timestamp in SYSTEM hive ControlSet###\\Control\\Windows), User Accounts (SAM+SOFTWARE hives), USB Devices (CONNECTED DEVICES category, sources: SOFTWARE/SYSTEM/setupapi.dev.log/NTUSER.DAT/Event Logs)
- Browser forensics: Chrome cache (AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache - content and metadata SEPARATE), Firefox cache (AppData\\LOCAL NOT Roaming, metadata APPENDED to file), Firefox bookmarks (places.sqlite in Roaming - tables moz_places+moz_bookmarks)
- Email: Email Explorer Participants filter is CASE SENSITIVE, Email Attachments artifact aggregates ALL attachments, OST=compound file (preview may be blank - use TEXT AND HEX card)
- Cloud: OneDrive local vs Cloud OneDrive Files (cloud shows sharing info, may have files not stored locally), Dropbox artifact fields (File ID, Version ID, server/client timestamps), Passwords/Tokens (people reuse passwords - try against encrypted files)
- Media: Hit Stacking (same MD5/SHA1 = one stack, tag one = tags ALL copies), Quick Preview (hover video + drag L→R to scrub), Filmstrip (still frames every 10% of video)
- Connections Explorer: answers WHO WHAT WHEN WHERE WHY HOW, build via Tools→Build Connections
- Filters bar turns YELLOW when active, criteria in bold
- Mobile View: apps NOT in original device order, iOS supported types: AFU/FFS (Graykey/Verakey)/UFED Premium, Android: FFS/AFU/Logical+/UFED Premium
- Case files use .MFDB extension (SQL database)
- REFINED RESULTS: Profiles created ONLY from Identifiers-People AND Identifiers-Devices
- Google Searches=Google only, Parsed Search Queries=all other search engines
- Email keyword search from Filters bar = searches ALL PARTS of email
- Document content shown in PREVIEW CARD in DETAILS PANE
- Created Date vs File System Created Date are different things
- Axiom timestamps: millisecond precision (3 decimal places)
- MCFE exam: 75 questions, 120 minutes, 80% pass mark, open book (PDF searchable), open case file
- Artifact Reference: Help→Documentation→Artifact Reference

Answer questions directly, specifically, and concisely. For navigation questions, give the exact path (category → subcategory → artifact name). For "where is" questions, give the exact location in Axiom Examine. Be direct like a colleague next to them in the exam room. Max 150 words per answer unless a detailed walkthrough is needed. If asked something case-specific (Baldwin/Burgess), apply your knowledge to that specific evidence scenario.`;

    const sendMessage = async () => {
      if (!aiInput.trim() || aiLoading) return;
      const userMsg = aiInput.trim();
      setAiInput("");
      setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
      setAiLoading(true);
      try {
        const history = [...aiMessages, { role: "user", content: userMsg }];
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: history.map(m => ({ role: m.role, content: m.content })),
          })
        });
        const data = await response.json();
        const reply = data.content?.map(b => b.text || "").join("") || "No response received.";
        setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        setAiMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Check your connection and try again." }]);
      }
      setAiLoading(false);
    };

    const QUICK_QS = [
      "Where is the Email Attachments artifact?",
      "How do I find USB devices connected to Baldwin's laptop?",
      "Email Participants filter — case sensitive?",
      "Where is Prefetch in Axiom Examine?",
      "How do I build Connections?",
      "What's the difference between OneDrive and Cloud OneDrive Files?",
      "Where is shutdown time in the registry?",
      "How do I find what apps Burgess ran on his iPhone?",
      "Where are Google Searches vs Parsed Search Queries?",
      "How do I find files recently accessed in Windows Explorer?",
      "Where is the Artifact Reference?",
      "What does the Filters bar turning yellow mean?",
    ];

    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <div style={{marginBottom:14}}>
          <h2 style={{...S.ptitle,marginBottom:4}}>🤖 AI AXIOM Assistant</h2>
          <p style={{color:"#475569",fontSize:11,margin:0}}>Ask anything about AXIOM, the Baldwin/Burgess case, or exam navigation. Powered by Claude — your expert examiner in your pocket.</p>
        </div>

        {/* Quick question chips */}
        {aiMessages.length === 0 && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#475569",marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Quick questions</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {QUICK_QS.map((q,i)=>(
                <button key={i} style={{padding:"5px 10px",borderRadius:14,background:"#111827",border:"1px solid #1e293b",color:"#60a5fa",cursor:"pointer",fontSize:11,textAlign:"left"}} onClick={()=>{setAiInput(q);}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14,minHeight:200}}>
          {aiMessages.length === 0 && (
            <div style={{textAlign:"center",padding:"24px 0",color:"#475569"}}>
              <div style={{fontSize:28,marginBottom:8}}>🤖</div>
              <div style={{fontSize:13,color:"#64748b"}}>Ask me anything about AXIOM or the exam</div>
              <div style={{fontSize:11,color:"#475569",marginTop:4}}>I know the full AX200 manual and your Baldwin/Burgess case</div>
            </div>
          )}
          {aiMessages.map((msg, i) => (
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",flexDirection:msg.role==="user"?"row-reverse":"row"}}>
              <div style={{minWidth:28,height:28,borderRadius:"50%",background:msg.role==="user"?"#0ea5e920":"#a78bfa20",border:`1px solid ${msg.role==="user"?"#0ea5e9":"#a78bfa"}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>
                {msg.role==="user"?"👤":"🤖"}
              </div>
              <div style={{background:msg.role==="user"?"#0ea5e915":"#111827",border:`1px solid ${msg.role==="user"?"#0ea5e930":"#1e293b"}`,borderRadius:msg.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"10px 13px",maxWidth:"85%"}}>
                <div style={{fontSize:12,color:msg.role==="user"?"#bae6fd":"#cbd5e1",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{msg.content}</div>
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{minWidth:28,height:28,borderRadius:"50%",background:"#a78bfa20",border:"1px solid #a78bfa40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤖</div>
              <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:"12px 12px 12px 4px",padding:"10px 14px"}}>
                <div style={{display:"flex",gap:4}}>
                  {[0,1,2].map(j=>(<div key={j} style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa",animation:`pulse ${0.6+j*0.2}s ease-in-out infinite alternate`}}/>))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{position:"sticky",bottom:0,background:"#0a0f1e",paddingTop:8,paddingBottom:8}}>
          <div style={{display:"flex",gap:8}}>
            <input
              type="text"
              placeholder="Ask about AXIOM, the Baldwin/Burgess case, exam navigation..."
              value={aiInput}
              onChange={e=>setAiInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
              style={{flex:1,padding:"11px 14px",background:"#111827",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0",fontSize:13,fontFamily:"'Courier New',monospace",outline:"none"}}
              autoComplete="off" autoCorrect="off"
            />
            <button onClick={sendMessage} disabled={aiLoading||!aiInput.trim()} style={{padding:"11px 16px",background:aiLoading||!aiInput.trim()?"#1e293b":"#0ea5e9",color:aiLoading||!aiInput.trim()?"#475569":"#0a0f1e",border:"none",borderRadius:8,cursor:aiLoading||!aiInput.trim()?"not-allowed":"pointer",fontSize:14,fontWeight:700,flexShrink:0}}>
              {aiLoading?"...":"→"}
            </button>
          </div>
          {aiMessages.length > 0 && (
            <button onClick={()=>setAiMessages([])} style={{fontSize:10,color:"#475569",background:"none",border:"none",cursor:"pointer",padding:"6px 0",display:"block"}}>
              Clear conversation
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── EXAM DAY CALM MODE ───────────────────────────────────────────────────────
  if (view === "calm") {
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>

        {/* Header */}
        <div style={{textAlign:"center",padding:"8px 0 20px"}}>
          <div style={{fontSize:36,marginBottom:8}}>🧠</div>
          <h2 style={{fontSize:22,fontWeight:800,color:"#e2e8f0",margin:"0 0 6px"}}>Youve Got This, Yousef</h2>
          <p style={{color:"#64748b",fontSize:12,margin:0}}>Everything you need to walk into the exam calm and ready</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {[
            {id:"mindset",label:"🧠 Mindset",c:"#0ea5e9"},
            {id:"facts",label:"📊 The Facts",c:"#00d4a0"},
            {id:"cheatsheet",label:"⚡ Cheat Sheet",c:"#f59e0b"},
            {id:"navigation",label:"🗺️ Navigation",c:"#a78bfa"},
            {id:"stuck",label:"🆘 If Stuck",c:"#f87171"},
          ].map(t=>(
            <button key={t.id} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${calmTab===t.id?t.c:"#1e293b"}`,background:calmTab===t.id?`${t.c}20`:"transparent",color:calmTab===t.id?t.c:"#64748b",cursor:"pointer",fontSize:11,fontWeight:calmTab===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setCalmTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MINDSET */}
        {calmTab === "mindset" && (
          <div>
            <div style={{background:"linear-gradient(135deg,#0f2027,#203a43)",border:"1px solid #0ea5e940",borderRadius:12,padding:18,marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:14,color:"#94a3b8",lineHeight:1.8}}>
                The Reddit community — experienced DFIR practitioners who sat this exam — called it:<br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Pretty basic. No ultra technical questions."</span><br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Way easier than SANS."</span><br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Not difficult."</span>
              </div>
            </div>

            {[
              {icon:"💼",title:"You have real-world experience",body:"You're a Cybersecurity Senior Analyst at SABIC leading SOC and Incident Response. You understand digital forensics at an operational level. This exam tests tool proficiency — and you've done the course. That combination is exactly what passes MCFE."},
              {icon:"📖",title:"It's open book",body:"The PDF manual is SEARCHABLE during the exam. Axiom Examine is OPEN during the exam. Your processed case file is OPEN. This is not a memory test — it's an applied skills test. If you forget something, you look it up. That's how real forensics works too."},
              {icon:"🎯",title:"You've prepared more than most",body:"You have 276 manual entries, 75 practice questions, 12 mind maps, practical scenarios, community intel, a lab reference, and case-specific prep — all built from your actual AX200 manual. Most people walk in with just the course. You've done the work."},
              {icon:"⏱️",title:"Time is not your enemy",body:"96 seconds per question. Multiple choice or true/false — no essay, no typing long answers. If a practical question requires navigating Axiom, you have 1.5 minutes to click to the artifact and find the value. That's plenty if you know where to look."},
              {icon:"🔁",title:"You can skip and return",body:"Don't know an answer immediately? SKIP IT. Reddit confirmed: skip and return is explicitly allowed. Come back at the end. Never spend 5 minutes on one question when you can answer 3 others in that time."},
              {icon:"🏆",title:"The NDU cohort averaged 92%",body:"17 students from the Notre Dame CDT program sat this exam on the same day. Average score: 92%. That's 12 points above the pass mark. These were students — you're a working senior analyst who has just spent days deeply preparing."},
            ].map((card,i)=>(
              <div key={i} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{card.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:5}}>{card.title}</div>
                  <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{card.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* THE FACTS */}
        {calmTab === "facts" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00d4a0",marginBottom:12}}>📊 What the exam actually looks like</div>
              {[
                ["Total questions","75 — multiple choice + true/false"],
                ["Time allowed","120 minutes (96 sec/question average)"],
                ["Pass mark","80% = 60 correct out of 75"],
                ["Format","Open book · Open Axiom case · Open PDF manual"],
                ["Question split","~50% practical from your case · ~25% program functions · ~25% settings"],
                ["Fail attempt 1","Immediate 2nd attempt — no waiting"],
                ["Fail attempt 2","60-day wait, then try again"],
                ["If you pass","Certificate mailed to you (embossed, frame-worthy)"],
                ["Certification valid","2 years"],
                ["Community avg score","92% (Notre Dame CDT Program, 2022)"],
              ].map(([k,v],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e293b",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                  <span style={{fontSize:12,color:"#e2e8f0",fontWeight:700,textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fbbf24",marginBottom:12}}>🎯 What practical questions look like</div>
              <p style={{fontSize:12,color:"#94a3b8",marginBottom:10,lineHeight:1.6}}>Practical questions ask you to look something up IN YOUR PROCESSED CASE FILE. Examples:</p>
              {[
                "What is the last shutdown time of Brenda Baldwin's laptop?",
                "What is the MD5 hash of [specific file] found on the laptop?",
                "How many times was [application] run on the device?",
                "What email address sent the attachment titled [filename]?",
                "What was the first connection date of the USB device named [X]?",
                "What cloud service did Baldwin access on [date]?",
              ].map((ex,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{color:"#fbbf24",fontSize:10,minWidth:14,paddingTop:3}}>Q</span>
                  <span style={{fontSize:12,color:"#cbd5e1",fontStyle:"italic"}}>{ex}</span>
                </div>
              ))}
              <div style={{marginTop:10,padding:"8px 10px",background:"#0f172a",borderRadius:6,fontSize:12,color:"#00d4a0"}}>
                ✓ Answer: navigate to the artifact in Axiom → check the Details pane → done.
              </div>
            </div>
          </div>
        )}

        {/* CHEAT SHEET */}
        {calmTab === "cheatsheet" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:12}}>The most commonly tested facts. Read once before you start the exam timer.</p>
            {[
              {
                title:"🔴 These are CASE SENSITIVE",color:"#f87171",
                items:["Email Explorer → Participants filter (Sender/Recipient) — CASE SENSITIVE","Type 'Jones' not 'jones' — will not match otherwise"]
              },
              {
                title:"🟡 Filters Bar = YELLOW when active",color:"#fbbf24",
                items:["Yellow bar = not all artifacts visible","Filtered criteria shown in BOLD","Always check for active filters before concluding 'no results'"]
              },
              {
                title:"🟢 Key Numbers to Remember",color:"#00d4a0",
                items:["Prefetch max: XP=126 | Vista/7/8=129 | Win10/11=1024","MCFE: 75 questions | 120 min | 80% pass | 2-year validity","Fail twice → 60-day lockout","Max threads: 32 (one physical CPU at a time)","Filmstrip: still frames at every 10% of video"]
              },
              {
                title:"🔵 Key Navigation Shortcuts",color:"#0ea5e9",
                items:["F1 = User Guide / Artifact Reference / What's New","Help → Documentation → Artifact Reference (know this cold)","Tools → Build Connections (do this before exam timer)","Tools → Build Timeline (do this before exam timer)","Process → Add new evidence to case (from within Examine)"]
              },
              {
                title:"🟣 Easy to Confuse — Don't Mix These Up",color:"#a78bfa",
                items:["Google Searches = Google ONLY | Parsed Search Queries = everything else","OneDrive (local) = no sharing info | Cloud OneDrive Files = shows sharing info","Parsed artifact = structured extraction | Carved artifact = from unallocated space","Identifiers–People = email/chat/screen names | Identifiers–Device = hardware IDs","Rebuilt Desktop = Windows 10 ONLY (not 7, not 8, not 11)"]
              },
              {
                title:"⚡ Things Worth A LOT in the Exam",color:"#f59e0b",
                items:["Profiles created ONLY from Identifiers–People AND Identifiers–Device","Email Attachments artifact = ALL attachments from ALL emails in one place","Hit Stacking: tag one = tags ALL copies across ALL evidence","BitLocker: find Recovery Key in Axiom Examine FIRST, then enter in Process","Connections Explorer: WHO WHAT WHEN WHERE WHY HOW — built via Tools→Build Connections"]
              },
            ].map((section,i)=>(
              <div key={i} style={{background:"#111827",borderLeft:`3px solid ${section.color}`,borderRadius:"0 8px 8px 0",padding:"11px 13px",marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:700,color:section.color,marginBottom:8}}>{section.title}</div>
                {section.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",gap:7,marginBottom:5,alignItems:"flex-start"}}>
                    <span style={{color:section.color,fontSize:9,minWidth:8,paddingTop:4}}>▸</span>
                    <span style={{fontSize:11,color:"#cbd5e1",lineHeight:1.5}}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* NAVIGATION GUIDE */}
        {calmTab === "navigation" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:12}}>Exact navigation paths for the most common exam question types. Memorise these flows.</p>
            {[
              {q:"Where was this file accessed?",path:"Refined Results → Locally Accessed Files and Folders",note:"Source: WebCacheV01.dat. Look for Windows Explorer paths.",color:"#0ea5e9"},
              {q:"When was the OS last shut down?",path:"Operating System → Operating System Information → Last Shutdown Date/Time",note:"Source: ShutdownTime in SYSTEM hive. Verify with Registry Explorer DECODE card.",color:"#0ea5e9"},
              {q:"What applications were run?",path:"Operating System → Prefetch Files – Windows 8/10/11",note:"App name + run count + last 8 launch times. System-wide, not user-specific.",color:"#0ea5e9"},
              {q:"What USB devices were connected?",path:"Connected Devices → USB Devices",note:"First connection time, device name, drive letter, associated user profile.",color:"#a78bfa"},
              {q:"What was searched on Google?",path:"Refined Results → Google Searches",note:"Google only. For Bing/Yahoo/other: Refined Results → Parsed Search Queries.",color:"#a78bfa"},
              {q:"What was browsed on Chrome?",path:"Web Related → Chrome Browser Visits",note:"Source: AppData\\Local\\Google\\Chrome\\User Data\\Default\\History",color:"#a78bfa"},
              {q:"What emails were sent/received?",path:"Explorer dropdown → Email Explorer",note:"CASE SENSITIVE participants filter. Check Email & Calendar → Email Attachments for all attached files.",color:"#00d4a0"},
              {q:"What files were attached to emails?",path:"Email & Calendar → Email Attachments",note:"ALL attachments from ALL email sources in one place. 'Original Artifact' link → parent email.",color:"#00d4a0"},
              {q:"What cloud files exist?",path:"Cloud Storage → [OneDrive/Dropbox/Google Drive]",note:"Cloud OneDrive Files = acquired from cloud, shows sharing. Local OneDrive = sync folder only.",color:"#00d4a0"},
              {q:"What are the connections between evidence?",path:"Explorer dropdown → Connections Explorer",note:"Build via Tools→Build Connections. Shows WHO WHAT WHEN WHERE WHY HOW relationships.",color:"#f59e0b"},
              {q:"What is the Windows build / OS version?",path:"Operating System → Operating System Information",note:"Source: SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion. Check ProductName + CurrentBuild.",color:"#f59e0b"},
              {q:"What user accounts exist on the device?",path:"Operating System → User Accounts – Windows",note:"Source: SAM + SOFTWARE hives. Shows SID, RID, last login, profile path.",color:"#f59e0b"},
              {q:"What is the hash of a specific file?",path:"File System Explorer → navigate to file → Details pane → ARTIFACT INFORMATION",note:"Or in any artifact's EVIDENCE INFORMATION card. MD5 and SHA1 shown.",color:"#f87171"},
              {q:"What texts/iMessages were on the iPhone?",path:"Communications → SMS/MMS Messages",note:"Source: sms.db. Contains iMessages and SMS. Shows content, timestamps, thread structure.",color:"#f87171"},
              {q:"Where is the Artifact Reference?",path:"Help → Documentation → Artifact Reference",note:"Lists ALL artifacts, their column meanings, and source locations. USE DURING EXAM.",color:"#f87171"},
            ].map((item,i)=>(
              <div key={i} style={{background:"#111827",borderRadius:8,padding:"10px 12px",marginBottom:7,borderLeft:`3px solid ${item.color}`}}>
                <div style={{fontSize:11,color:"#64748b",marginBottom:3,fontStyle:"italic"}}>"{item.q}"</div>
                <div style={{fontSize:12,fontWeight:700,color:item.color,marginBottom:3}}>→ {item.path}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{item.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* IF STUCK */}
        {calmTab === "stuck" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #f8717130",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#f87171",marginBottom:12}}>🆘 First rule: BREATHE. Then follow this.</div>
              {[
                {step:"1",title:"Can't find the artifact?",action:"Type a keyword from the question into the global SEARCH bar in Axiom Examine (Filters bar). It will search across ALL artifact types. Also try the Artifact Reference: Help → Documentation → Artifact Reference.",color:"#0ea5e9"},
                {step:"2",title:"Not sure what the question is asking?",action:"Open the PDF manual (Ctrl+F) and search the key term from the question. It will jump to the relevant section. The manual explains every artifact category.",color:"#a78bfa"},
                {step:"3",title:"Confused about an artifact field/column?",action:"Artifact Reference: Help → Documentation → Artifact Reference. Find the artifact name, read what each column means. This is specifically designed for moments like this.",color:"#00d4a0"},
                {step:"4",title:"Practical question — can't find the value?",action:"Check: (1) Is a filter active? (Filters bar yellow = filtered view). (2) Are you in the right evidence source? (3) Try right-click → Filter on Column on a related value to narrow down.",color:"#f59e0b"},
                {step:"5",title:"Running out of time?",action:"SKIP the question. Mark it mentally. Answer everything else first. Return to skipped questions at the end. 1 uncertain answer costs less than 3 answers rushed.",color:"#f87171"},
                {step:"6",title:"Mind going blank?",action:"Stop. Look at the question category (it's multiple choice — one of the 4 answers is right). Eliminate what's obviously wrong. You now have a 50/50 at worst. Make your best choice and move on. Don't freeze.",color:"#fbbf24"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <div style={{minWidth:26,height:26,borderRadius:"50%",background:`${item.color}20`,border:`1px solid ${item.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:item.color,fontWeight:700,flexShrink:0}}>{item.step}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{item.title}</div>
                    <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{item.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:14,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>💪</div>
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>Remember why youre doing this</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>
                You work at SABIC as a Senior Cybersecurity Analyst leading SOC and Incident Response across the Greater China Region.<br/>
                You have real-world DFIR experience that most exam-takers dont.<br/>
                This certification <span style={{color:"#00d4a0",fontWeight:700}}>validates what you already know.</span><br/><br/>
                <span style={{color:"#fbbf24",fontWeight:700}}>You didnt come this far to stop here.</span>
              </div>
            </div>
          </div>
        )}

        <button style={{...S.primary,marginTop:16}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  // ─── MANUAL EXERCISES ─────────────────────────────────────────────────────────
  if (view === "exercises") {
    const mod = MANUAL_EXERCISES[exIdx];
    const toggleRE = (i) => setExOpen(p => ({...p, [exIdx]: {...(p[exIdx]||{}), [i]: !(p[exIdx]||{})[i]}}));

    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>Back</button>
        <div style={{marginBottom:12}}>
          <h2 style={{...S.ptitle,marginBottom:4}}>📘 Manual Exercises</h2>
          <p style={{color:"#475569",fontSize:11,margin:0}}>All AX200 running exercises and student exercises — exact steps from the manual.</p>
        </div>

        {/* Module selector */}
        <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4,flexWrap:"nowrap"}}>
          {MANUAL_EXERCISES.map((m,i)=>(
            <button key={i} style={{padding:"5px 9px",borderRadius:12,border:`1px solid ${exIdx===i?m.color:"#1e293b"}`,background:exIdx===i?`${m.color}20`:"transparent",color:exIdx===i?m.color:"#64748b",cursor:"pointer",fontSize:10,whiteSpace:"nowrap",flexShrink:0,fontWeight:exIdx===i?700:400}}
              onClick={()=>{setExIdx(i);setExOpen(p=>({...p,[exIdx]:{}}));;}}>
              {m.label}
            </button>
          ))}
        </div>

        {/* Module header */}
        <div style={{background:`${mod.color}12`,border:`1px solid ${mod.color}40`,borderRadius:10,padding:"11px 14px",marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <span style={{fontSize:10,background:`${mod.color}25`,color:mod.color,padding:"2px 8px",borderRadius:10,fontWeight:700,marginRight:6}}>{mod.label}</span>
              <span style={{fontSize:13,fontWeight:800,color:"#e2e8f0"}}>{mod.title}</span>
            </div>
            <span style={{fontSize:10,color:"#475569"}}>{mod.running.length} exercise{mod.running.length!==1?"s":""}{mod.student?" + student":""}</span>
          </div>
        </div>

        {/* Running exercises — collapsible */}
        {mod.running.map((re,ri)=>(
          <div key={ri} style={{marginBottom:8}}>
            <button onClick={()=>toggleRE(ri)} style={{width:"100%",background:"#111827",border:`1px solid ${(exOpen[exIdx]||{})[ri]?mod.color:"#1e293b"}`,borderRadius:(exOpen[exIdx]||{})[ri]?"8px 8px 0 0":8,padding:"10px 13px",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:9,background:`${mod.color}20`,color:mod.color,padding:"2px 6px",borderRadius:8,fontWeight:700,flexShrink:0}}>RE</span>
                <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{re.name}</span>
              </div>
              <span style={{color:mod.color,fontSize:13,transition:"transform 0.2s",transform:(exOpen[exIdx]||{})[ri]?"rotate(180deg)":"rotate(0deg)"}}>▾</span>
            </button>
            {(exOpen[exIdx]||{})[ri] && (
              <div style={{background:"#0a0f1e",border:`1px solid ${mod.color}40`,borderTop:"none",borderRadius:"0 0 8px 8px",padding:"10px 13px"}}>
                {re.steps.map((step,si)=>(
                  <div key={si} style={{display:"flex",gap:9,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{minWidth:20,height:20,borderRadius:"50%",background:`${mod.color}15`,border:`1px solid ${mod.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:mod.color,fontWeight:800,flexShrink:0}}>
                      {(step.match(/^(\d+)\./) || [])[1] || (si+1)}
                    </div>
                    <span style={{fontSize:11,color:"#cbd5e1",lineHeight:1.6}}>
                      {step.replace(/^\d+[.]\s*/,'')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Student Exercise */}
        {mod.student && (
          <div style={{marginTop:8,background:"#0a0011",border:"2px solid #a78bfa50",borderRadius:10,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <span style={{fontSize:14}}>🎓</span>
              <span style={{fontSize:13,fontWeight:800,color:"#a78bfa"}}>Student Exercise</span>
              <span style={{fontSize:10,color:"#475569",marginLeft:"auto"}}>{mod.label} — end of module</span>
            </div>
            {mod.student.questions.map((q,qi)=>(
              <div key={qi} style={{marginBottom:8}}>
                <ExamQA
                  q={q}
                  a={mod.student.answers[qi] || "Review artifacts from this module to answer. Cross-reference OS artifacts, registry, and event logs as appropriate."}
                  color="#a78bfa"
                />
              </div>
            ))}
          </div>
        )}

        {!mod.student && (
          <div style={{marginTop:8,padding:"10px 12px",background:"#111827",borderRadius:8,border:"1px solid #1e293b"}}>
            <span style={{fontSize:11,color:"#475569"}}>No student exercise for this module in the AX200 manual.</span>
          </div>
        )}

        {/* Navigation */}
        <div style={{...S.navrow,marginTop:14}}>
          <button style={{...S.navbtn,opacity:exIdx===0?0.4:1}} onClick={()=>{setExIdx(p=>Math.max(0,p-1));setExOpen(p=>({...p,[exIdx]:{}}));;}} disabled={exIdx===0}>Previous Module</button>
          <button style={{...S.navbtn,opacity:exIdx===MANUAL_EXERCISES.length-1?0.4:1}} onClick={()=>{setExIdx(p=>Math.min(MANUAL_EXERCISES.length-1,p+1));setExOpen(p=>({...p,[exIdx]:{}}));;}} disabled={exIdx===MANUAL_EXERCISES.length-1}>Next Module</button>
        </div>
        <button style={{...S.primary,marginTop:10}} onClick={()=>setView("home")}>Back to Home</button>
      </div>
    );
  }

  // ─── AI AXIOM ASSISTANT ───────────────────────────────────────────────────────
  if (view === "aiassist") {
    const SYSTEM_PROMPT = `You are an expert Magnet AXIOM forensic examiner assistant helping a cybersecurity analyst named Yousef prepare for and pass the MCFE (Magnet Certified Forensics Examiner) exam. 

The exam case is: Baldwin/Burgess homicide and classified documents case.
- Item 1: Dell Latitude Laptop (Brenda Baldwin) - 40.6 GB logical acquisition of C drive
- Item 2: Google Takeout (BrendaBaldwin420@gmail.com) - 160 MB
- Item 3: Apple iPhone 12 (Steve Burgess) - 6.35 GB Logical+ acquisition

You have expert knowledge of:
- Magnet AXIOM Process and Axiom Examine (AX200 v2604 course)
- All Windows OS artifacts: Prefetch (naming: APPNAME.HASH.pf, max entries XP=126/Vista-8=129/Win10-11=1024, XPRESS HUFFMAN compression on Win10+), Registry hives (SAM/SOFTWARE/SYSTEM/NTUSER.DAT), ShutdownTime (8-byte Windows 64-bit LE timestamp in SYSTEM hive ControlSet###\\Control\\Windows), User Accounts (SAM+SOFTWARE hives), USB Devices (CONNECTED DEVICES category, sources: SOFTWARE/SYSTEM/setupapi.dev.log/NTUSER.DAT/Event Logs)
- Browser forensics: Chrome cache (AppData\\Local\\Google\\Chrome\\User Data\\Default\\Cache - content and metadata SEPARATE), Firefox cache (AppData\\LOCAL NOT Roaming, metadata APPENDED to file), Firefox bookmarks (places.sqlite in Roaming - tables moz_places+moz_bookmarks)
- Email: Email Explorer Participants filter is CASE SENSITIVE, Email Attachments artifact aggregates ALL attachments, OST=compound file (preview may be blank - use TEXT AND HEX card)
- Cloud: OneDrive local vs Cloud OneDrive Files (cloud shows sharing info, may have files not stored locally), Dropbox artifact fields (File ID, Version ID, server/client timestamps), Passwords/Tokens (people reuse passwords - try against encrypted files)
- Media: Hit Stacking (same MD5/SHA1 = one stack, tag one = tags ALL copies), Quick Preview (hover video + drag L→R to scrub), Filmstrip (still frames every 10% of video)
- Connections Explorer: answers WHO WHAT WHEN WHERE WHY HOW, build via Tools→Build Connections
- Filters bar turns YELLOW when active, criteria in bold
- Mobile View: apps NOT in original device order, iOS supported types: AFU/FFS (Graykey/Verakey)/UFED Premium, Android: FFS/AFU/Logical+/UFED Premium
- Case files use .MFDB extension (SQL database)
- REFINED RESULTS: Profiles created ONLY from Identifiers-People AND Identifiers-Devices
- Google Searches=Google only, Parsed Search Queries=all other search engines
- Email keyword search from Filters bar = searches ALL PARTS of email
- Document content shown in PREVIEW CARD in DETAILS PANE
- Created Date vs File System Created Date are different things
- Axiom timestamps: millisecond precision (3 decimal places)
- MCFE exam: 75 questions, 120 minutes, 80% pass mark, open book (PDF searchable), open case file
- Artifact Reference: Help→Documentation→Artifact Reference

Answer questions directly, specifically, and concisely. For navigation questions, give the exact path (category → subcategory → artifact name). For "where is" questions, give the exact location in Axiom Examine. Be direct like a colleague next to them in the exam room. Max 150 words per answer unless a detailed walkthrough is needed. If asked something case-specific (Baldwin/Burgess), apply your knowledge to that specific evidence scenario.`;

    const sendMessage = async () => {
      if (!aiInput.trim() || aiLoading) return;
      const userMsg = aiInput.trim();
      setAiInput("");
      setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
      setAiLoading(true);
      try {
        const history = [...aiMessages, { role: "user", content: userMsg }];
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: history.map(m => ({ role: m.role, content: m.content })),
          })
        });
        const data = await response.json();
        const reply = data.content?.map(b => b.text || "").join("") || "No response received.";
        setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
      } catch (err) {
        setAiMessages(prev => [...prev, { role: "assistant", content: "Error connecting to AI. Check your connection and try again." }]);
      }
      setAiLoading(false);
    };

    const QUICK_QS = [
      "Where is the Email Attachments artifact?",
      "How do I find USB devices connected to Baldwin's laptop?",
      "Email Participants filter — case sensitive?",
      "Where is Prefetch in Axiom Examine?",
      "How do I build Connections?",
      "What's the difference between OneDrive and Cloud OneDrive Files?",
      "Where is shutdown time in the registry?",
      "How do I find what apps Burgess ran on his iPhone?",
      "Where are Google Searches vs Parsed Search Queries?",
      "How do I find files recently accessed in Windows Explorer?",
      "Where is the Artifact Reference?",
      "What does the Filters bar turning yellow mean?",
    ];

    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <div style={{marginBottom:14}}>
          <h2 style={{...S.ptitle,marginBottom:4}}>🤖 AI AXIOM Assistant</h2>
          <p style={{color:"#475569",fontSize:11,margin:0}}>Ask anything about AXIOM, the Baldwin/Burgess case, or exam navigation. Powered by Claude — your expert examiner in your pocket.</p>
        </div>

        {/* Quick question chips */}
        {aiMessages.length === 0 && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:"#475569",marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Quick questions</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {QUICK_QS.map((q,i)=>(
                <button key={i} style={{padding:"5px 10px",borderRadius:14,background:"#111827",border:"1px solid #1e293b",color:"#60a5fa",cursor:"pointer",fontSize:11,textAlign:"left"}} onClick={()=>{setAiInput(q);}}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14,minHeight:200}}>
          {aiMessages.length === 0 && (
            <div style={{textAlign:"center",padding:"24px 0",color:"#475569"}}>
              <div style={{fontSize:28,marginBottom:8}}>🤖</div>
              <div style={{fontSize:13,color:"#64748b"}}>Ask me anything about AXIOM or the exam</div>
              <div style={{fontSize:11,color:"#475569",marginTop:4}}>I know the full AX200 manual and your Baldwin/Burgess case</div>
            </div>
          )}
          {aiMessages.map((msg, i) => (
            <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",flexDirection:msg.role==="user"?"row-reverse":"row"}}>
              <div style={{minWidth:28,height:28,borderRadius:"50%",background:msg.role==="user"?"#0ea5e920":"#a78bfa20",border:`1px solid ${msg.role==="user"?"#0ea5e9":"#a78bfa"}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>
                {msg.role==="user"?"👤":"🤖"}
              </div>
              <div style={{background:msg.role==="user"?"#0ea5e915":"#111827",border:`1px solid ${msg.role==="user"?"#0ea5e930":"#1e293b"}`,borderRadius:msg.role==="user"?"12px 12px 4px 12px":"12px 12px 12px 4px",padding:"10px 13px",maxWidth:"85%"}}>
                <div style={{fontSize:12,color:msg.role==="user"?"#bae6fd":"#cbd5e1",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{msg.content}</div>
              </div>
            </div>
          ))}
          {aiLoading && (
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{minWidth:28,height:28,borderRadius:"50%",background:"#a78bfa20",border:"1px solid #a78bfa40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🤖</div>
              <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:"12px 12px 12px 4px",padding:"10px 14px"}}>
                <div style={{display:"flex",gap:4}}>
                  {[0,1,2].map(j=>(<div key={j} style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa",animation:`pulse ${0.6+j*0.2}s ease-in-out infinite alternate`}}/>))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{position:"sticky",bottom:0,background:"#0a0f1e",paddingTop:8,paddingBottom:8}}>
          <div style={{display:"flex",gap:8}}>
            <input
              type="text"
              placeholder="Ask about AXIOM, the Baldwin/Burgess case, exam navigation..."
              value={aiInput}
              onChange={e=>setAiInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}
              style={{flex:1,padding:"11px 14px",background:"#111827",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0",fontSize:13,fontFamily:"'Courier New',monospace",outline:"none"}}
              autoComplete="off" autoCorrect="off"
            />
            <button onClick={sendMessage} disabled={aiLoading||!aiInput.trim()} style={{padding:"11px 16px",background:aiLoading||!aiInput.trim()?"#1e293b":"#0ea5e9",color:aiLoading||!aiInput.trim()?"#475569":"#0a0f1e",border:"none",borderRadius:8,cursor:aiLoading||!aiInput.trim()?"not-allowed":"pointer",fontSize:14,fontWeight:700,flexShrink:0}}>
              {aiLoading?"...":"→"}
            </button>
          </div>
          {aiMessages.length > 0 && (
            <button onClick={()=>setAiMessages([])} style={{fontSize:10,color:"#475569",background:"none",border:"none",cursor:"pointer",padding:"6px 0",display:"block"}}>
              Clear conversation
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── EXAM DAY CALM MODE ───────────────────────────────────────────────────────
  if (view === "calm") {
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>

        {/* Header */}
        <div style={{textAlign:"center",padding:"8px 0 20px"}}>
          <div style={{fontSize:36,marginBottom:8}}>🧠</div>
          <h2 style={{fontSize:22,fontWeight:800,color:"#e2e8f0",margin:"0 0 6px"}}>Youve Got This, Yousef</h2>
          <p style={{color:"#64748b",fontSize:12,margin:0}}>Everything you need to walk into the exam calm and ready</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {[
            {id:"mindset",label:"🧠 Mindset",c:"#0ea5e9"},
            {id:"facts",label:"📊 The Facts",c:"#00d4a0"},
            {id:"cheatsheet",label:"⚡ Cheat Sheet",c:"#f59e0b"},
            {id:"navigation",label:"🗺️ Navigation",c:"#a78bfa"},
            {id:"stuck",label:"🆘 If Stuck",c:"#f87171"},
          ].map(t=>(
            <button key={t.id} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${calmTab===t.id?t.c:"#1e293b"}`,background:calmTab===t.id?`${t.c}20`:"transparent",color:calmTab===t.id?t.c:"#64748b",cursor:"pointer",fontSize:11,fontWeight:calmTab===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setCalmTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* MINDSET */}
        {calmTab === "mindset" && (
          <div>
            <div style={{background:"linear-gradient(135deg,#0f2027,#203a43)",border:"1px solid #0ea5e940",borderRadius:12,padding:18,marginBottom:12,textAlign:"center"}}>
              <div style={{fontSize:14,color:"#94a3b8",lineHeight:1.8}}>
                The Reddit community — experienced DFIR practitioners who sat this exam — called it:<br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Pretty basic. No ultra technical questions."</span><br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Way easier than SANS."</span><br/>
                <span style={{color:"#00d4a0",fontWeight:700,fontSize:16}}>"Not difficult."</span>
              </div>
            </div>

            {[
              {icon:"💼",title:"You have real-world experience",body:"You're a Cybersecurity Senior Analyst at SABIC leading SOC and Incident Response. You understand digital forensics at an operational level. This exam tests tool proficiency — and you've done the course. That combination is exactly what passes MCFE."},
              {icon:"📖",title:"It's open book",body:"The PDF manual is SEARCHABLE during the exam. Axiom Examine is OPEN during the exam. Your processed case file is OPEN. This is not a memory test — it's an applied skills test. If you forget something, you look it up. That's how real forensics works too."},
              {icon:"🎯",title:"You've prepared more than most",body:"You have 276 manual entries, 75 practice questions, 12 mind maps, practical scenarios, community intel, a lab reference, and case-specific prep — all built from your actual AX200 manual. Most people walk in with just the course. You've done the work."},
              {icon:"⏱️",title:"Time is not your enemy",body:"96 seconds per question. Multiple choice or true/false — no essay, no typing long answers. If a practical question requires navigating Axiom, you have 1.5 minutes to click to the artifact and find the value. That's plenty if you know where to look."},
              {icon:"🔁",title:"You can skip and return",body:"Don't know an answer immediately? SKIP IT. Reddit confirmed: skip and return is explicitly allowed. Come back at the end. Never spend 5 minutes on one question when you can answer 3 others in that time."},
              {icon:"🏆",title:"The NDU cohort averaged 92%",body:"17 students from the Notre Dame CDT program sat this exam on the same day. Average score: 92%. That's 12 points above the pass mark. These were students — you're a working senior analyst who has just spent days deeply preparing."},
            ].map((card,i)=>(
              <div key={i} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
                <span style={{fontSize:20,flexShrink:0}}>{card.icon}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:5}}>{card.title}</div>
                  <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{card.body}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* THE FACTS */}
        {calmTab === "facts" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00d4a0",marginBottom:12}}>📊 What the exam actually looks like</div>
              {[
                ["Total questions","75 — multiple choice + true/false"],
                ["Time allowed","120 minutes (96 sec/question average)"],
                ["Pass mark","80% = 60 correct out of 75"],
                ["Format","Open book · Open Axiom case · Open PDF manual"],
                ["Question split","~50% practical from your case · ~25% program functions · ~25% settings"],
                ["Fail attempt 1","Immediate 2nd attempt — no waiting"],
                ["Fail attempt 2","60-day wait, then try again"],
                ["If you pass","Certificate mailed to you (embossed, frame-worthy)"],
                ["Certification valid","2 years"],
                ["Community avg score","92% (Notre Dame CDT Program, 2022)"],
              ].map(([k,v],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1e293b",gap:12,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,color:"#64748b"}}>{k}</span>
                  <span style={{fontSize:12,color:"#e2e8f0",fontWeight:700,textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#fbbf24",marginBottom:12}}>🎯 What practical questions look like</div>
              <p style={{fontSize:12,color:"#94a3b8",marginBottom:10,lineHeight:1.6}}>Practical questions ask you to look something up IN YOUR PROCESSED CASE FILE. Examples:</p>
              {[
                "What is the last shutdown time of Brenda Baldwin's laptop?",
                "What is the MD5 hash of [specific file] found on the laptop?",
                "How many times was [application] run on the device?",
                "What email address sent the attachment titled [filename]?",
                "What was the first connection date of the USB device named [X]?",
                "What cloud service did Baldwin access on [date]?",
              ].map((ex,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <span style={{color:"#fbbf24",fontSize:10,minWidth:14,paddingTop:3}}>Q</span>
                  <span style={{fontSize:12,color:"#cbd5e1",fontStyle:"italic"}}>{ex}</span>
                </div>
              ))}
              <div style={{marginTop:10,padding:"8px 10px",background:"#0f172a",borderRadius:6,fontSize:12,color:"#00d4a0"}}>
                ✓ Answer: navigate to the artifact in Axiom → check the Details pane → done.
              </div>
            </div>
          </div>
        )}

        {/* CHEAT SHEET */}
        {calmTab === "cheatsheet" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:12}}>The most commonly tested facts. Read once before you start the exam timer.</p>
            {[
              {
                title:"🔴 These are CASE SENSITIVE",color:"#f87171",
                items:["Email Explorer → Participants filter (Sender/Recipient) — CASE SENSITIVE","Type 'Jones' not 'jones' — will not match otherwise"]
              },
              {
                title:"🟡 Filters Bar = YELLOW when active",color:"#fbbf24",
                items:["Yellow bar = not all artifacts visible","Filtered criteria shown in BOLD","Always check for active filters before concluding 'no results'"]
              },
              {
                title:"🟢 Key Numbers to Remember",color:"#00d4a0",
                items:["Prefetch max: XP=126 | Vista/7/8=129 | Win10/11=1024","MCFE: 75 questions | 120 min | 80% pass | 2-year validity","Fail twice → 60-day lockout","Max threads: 32 (one physical CPU at a time)","Filmstrip: still frames at every 10% of video"]
              },
              {
                title:"🔵 Key Navigation Shortcuts",color:"#0ea5e9",
                items:["F1 = User Guide / Artifact Reference / What's New","Help → Documentation → Artifact Reference (know this cold)","Tools → Build Connections (do this before exam timer)","Tools → Build Timeline (do this before exam timer)","Process → Add new evidence to case (from within Examine)"]
              },
              {
                title:"🟣 Easy to Confuse — Don't Mix These Up",color:"#a78bfa",
                items:["Google Searches = Google ONLY | Parsed Search Queries = everything else","OneDrive (local) = no sharing info | Cloud OneDrive Files = shows sharing info","Parsed artifact = structured extraction | Carved artifact = from unallocated space","Identifiers–People = email/chat/screen names | Identifiers–Device = hardware IDs","Rebuilt Desktop = Windows 10 ONLY (not 7, not 8, not 11)"]
              },
              {
                title:"⚡ Things Worth A LOT in the Exam",color:"#f59e0b",
                items:["Profiles created ONLY from Identifiers–People AND Identifiers–Device","Email Attachments artifact = ALL attachments from ALL emails in one place","Hit Stacking: tag one = tags ALL copies across ALL evidence","BitLocker: find Recovery Key in Axiom Examine FIRST, then enter in Process","Connections Explorer: WHO WHAT WHEN WHERE WHY HOW — built via Tools→Build Connections"]
              },
            ].map((section,i)=>(
              <div key={i} style={{background:"#111827",borderLeft:`3px solid ${section.color}`,borderRadius:"0 8px 8px 0",padding:"11px 13px",marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:700,color:section.color,marginBottom:8}}>{section.title}</div>
                {section.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",gap:7,marginBottom:5,alignItems:"flex-start"}}>
                    <span style={{color:section.color,fontSize:9,minWidth:8,paddingTop:4}}>▸</span>
                    <span style={{fontSize:11,color:"#cbd5e1",lineHeight:1.5}}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* NAVIGATION GUIDE */}
        {calmTab === "navigation" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:12}}>Exact navigation paths for the most common exam question types. Memorise these flows.</p>
            {[
              {q:"Where was this file accessed?",path:"Refined Results → Locally Accessed Files and Folders",note:"Source: WebCacheV01.dat. Look for Windows Explorer paths.",color:"#0ea5e9"},
              {q:"When was the OS last shut down?",path:"Operating System → Operating System Information → Last Shutdown Date/Time",note:"Source: ShutdownTime in SYSTEM hive. Verify with Registry Explorer DECODE card.",color:"#0ea5e9"},
              {q:"What applications were run?",path:"Operating System → Prefetch Files – Windows 8/10/11",note:"App name + run count + last 8 launch times. System-wide, not user-specific.",color:"#0ea5e9"},
              {q:"What USB devices were connected?",path:"Connected Devices → USB Devices",note:"First connection time, device name, drive letter, associated user profile.",color:"#a78bfa"},
              {q:"What was searched on Google?",path:"Refined Results → Google Searches",note:"Google only. For Bing/Yahoo/other: Refined Results → Parsed Search Queries.",color:"#a78bfa"},
              {q:"What was browsed on Chrome?",path:"Web Related → Chrome Browser Visits",note:"Source: AppData\\Local\\Google\\Chrome\\User Data\\Default\\History",color:"#a78bfa"},
              {q:"What emails were sent/received?",path:"Explorer dropdown → Email Explorer",note:"CASE SENSITIVE participants filter. Check Email & Calendar → Email Attachments for all attached files.",color:"#00d4a0"},
              {q:"What files were attached to emails?",path:"Email & Calendar → Email Attachments",note:"ALL attachments from ALL email sources in one place. 'Original Artifact' link → parent email.",color:"#00d4a0"},
              {q:"What cloud files exist?",path:"Cloud Storage → [OneDrive/Dropbox/Google Drive]",note:"Cloud OneDrive Files = acquired from cloud, shows sharing. Local OneDrive = sync folder only.",color:"#00d4a0"},
              {q:"What are the connections between evidence?",path:"Explorer dropdown → Connections Explorer",note:"Build via Tools→Build Connections. Shows WHO WHAT WHEN WHERE WHY HOW relationships.",color:"#f59e0b"},
              {q:"What is the Windows build / OS version?",path:"Operating System → Operating System Information",note:"Source: SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion. Check ProductName + CurrentBuild.",color:"#f59e0b"},
              {q:"What user accounts exist on the device?",path:"Operating System → User Accounts – Windows",note:"Source: SAM + SOFTWARE hives. Shows SID, RID, last login, profile path.",color:"#f59e0b"},
              {q:"What is the hash of a specific file?",path:"File System Explorer → navigate to file → Details pane → ARTIFACT INFORMATION",note:"Or in any artifact's EVIDENCE INFORMATION card. MD5 and SHA1 shown.",color:"#f87171"},
              {q:"What texts/iMessages were on the iPhone?",path:"Communications → SMS/MMS Messages",note:"Source: sms.db. Contains iMessages and SMS. Shows content, timestamps, thread structure.",color:"#f87171"},
              {q:"Where is the Artifact Reference?",path:"Help → Documentation → Artifact Reference",note:"Lists ALL artifacts, their column meanings, and source locations. USE DURING EXAM.",color:"#f87171"},
            ].map((item,i)=>(
              <div key={i} style={{background:"#111827",borderRadius:8,padding:"10px 12px",marginBottom:7,borderLeft:`3px solid ${item.color}`}}>
                <div style={{fontSize:11,color:"#64748b",marginBottom:3,fontStyle:"italic"}}>"{item.q}"</div>
                <div style={{fontSize:12,fontWeight:700,color:item.color,marginBottom:3}}>→ {item.path}</div>
                <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{item.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* IF STUCK */}
        {calmTab === "stuck" && (
          <div>
            <div style={{background:"#111827",border:"1px solid #f8717130",borderRadius:10,padding:14,marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#f87171",marginBottom:12}}>🆘 First rule: BREATHE. Then follow this.</div>
              {[
                {step:"1",title:"Can't find the artifact?",action:"Type a keyword from the question into the global SEARCH bar in Axiom Examine (Filters bar). It will search across ALL artifact types. Also try the Artifact Reference: Help → Documentation → Artifact Reference.",color:"#0ea5e9"},
                {step:"2",title:"Not sure what the question is asking?",action:"Open the PDF manual (Ctrl+F) and search the key term from the question. It will jump to the relevant section. The manual explains every artifact category.",color:"#a78bfa"},
                {step:"3",title:"Confused about an artifact field/column?",action:"Artifact Reference: Help → Documentation → Artifact Reference. Find the artifact name, read what each column means. This is specifically designed for moments like this.",color:"#00d4a0"},
                {step:"4",title:"Practical question — can't find the value?",action:"Check: (1) Is a filter active? (Filters bar yellow = filtered view). (2) Are you in the right evidence source? (3) Try right-click → Filter on Column on a related value to narrow down.",color:"#f59e0b"},
                {step:"5",title:"Running out of time?",action:"SKIP the question. Mark it mentally. Answer everything else first. Return to skipped questions at the end. 1 uncertain answer costs less than 3 answers rushed.",color:"#f87171"},
                {step:"6",title:"Mind going blank?",action:"Stop. Look at the question category (it's multiple choice — one of the 4 answers is right). Eliminate what's obviously wrong. You now have a 50/50 at worst. Make your best choice and move on. Don't freeze.",color:"#fbbf24"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                  <div style={{minWidth:26,height:26,borderRadius:"50%",background:`${item.color}20`,border:`1px solid ${item.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:item.color,fontWeight:700,flexShrink:0}}>{item.step}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{item.title}</div>
                    <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{item.action}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:14,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:8}}>💪</div>
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>Remember why youre doing this</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>
                You work at SABIC as a Senior Cybersecurity Analyst leading SOC and Incident Response across the Greater China Region.<br/>
                You have real-world DFIR experience that most exam-takers dont.<br/>
                This certification <span style={{color:"#00d4a0",fontWeight:700}}>validates what you already know.</span><br/><br/>
                <span style={{color:"#fbbf24",fontWeight:700}}>You didnt come this far to stop here.</span>
              </div>
            </div>
          </div>
        )}

        <button style={{...S.primary,marginTop:16}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  // ─── RUNNING EXERCISES ────────────────────────────────────────────────────
  if (view === "exercises") {
    const ex = EXERCISES[exIdx];
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>Back</button>
        <div style={{marginBottom:12}}>
          <h2 style={{...S.ptitle,marginBottom:4}}>📘 Manual Exercises</h2>
          <p style={{color:"#475569",fontSize:11,margin:0}}>All AX200 manual exercises — running exercises per sub-module + student exercises — exact steps and model answers.</p>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
          {EXERCISES.map((e,i)=>(
            <button key={i} style={{padding:"4px 9px",borderRadius:12,border:`1px solid ${exIdx===i?e.color:"#1e293b"}`,background:exIdx===i?`${e.color}20`:"transparent",color:exIdx===i?e.color:"#64748b",cursor:"pointer",fontSize:10,whiteSpace:"nowrap",flexShrink:0,fontWeight:exIdx===i?700:400}}
              onClick={()=>{setExIdx(i);setExTab("intent");}}>
              M{e.mod} {e.title.split(" ").slice(0,3).join(" ")}
            </button>
          ))}
        </div>
        <div style={{background:`${ex.color}12`,border:`1px solid ${ex.color}40`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <div style={{display:"flex",gap:5}}>
              <span style={{fontSize:9,background:`${ex.color}20`,color:ex.color,padding:"2px 7px",borderRadius:10,fontWeight:700}}>MODULE {ex.mod}</span>
              <span style={{fontSize:9,background:"#1e293b",color:"#64748b",padding:"2px 7px",borderRadius:10}}>{ex.category}</span>
            </div>
            <span style={{fontSize:10,color:"#475569"}}>{exIdx+1} of {EXERCISES.length}</span>
          </div>
          <div style={{fontSize:14,fontWeight:800,color:"#e2e8f0",marginBottom:5}}>{ex.title}</div>
          <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}><span style={{color:ex.color,fontWeight:600}}>Objective: </span>{ex.objective}</div>
        </div>
        <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:2}}>
          {[
            {id:"intent",label:"Why It Matters",icon:"🎯"},
            {id:"manual",label:"Manual Steps",icon:"📋"},
            {id:"student",label:"Student Exercises",icon:"🧠"},
            {id:"tricks",label:"Tricks and Traps",icon:"💡"},
            {id:"exam",label:"Exam Relevance",icon:"🎓"},
          ].map(t=>(
            <button key={t.id} style={{padding:"5px 10px",borderRadius:14,border:`1px solid ${exTab===t.id?ex.color:"#1e293b"}`,background:exTab===t.id?`${ex.color}20`:"transparent",color:exTab===t.id?ex.color:"#64748b",cursor:"pointer",fontSize:11,fontWeight:exTab===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}}
              onClick={()=>setExTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        {exTab === "intent" && (
          <div style={{background:"#0a0f1e",border:`1px solid ${ex.color}30`,borderRadius:10,padding:14,marginBottom:10}}>
            <div style={{fontSize:11,color:ex.color,fontWeight:700,marginBottom:8,letterSpacing:1}}>WHY THIS EXERCISE EXISTS</div>
            <p style={{fontSize:12,color:"#cbd5e1",lineHeight:1.7,margin:0}}>{ex.intent}</p>
          </div>
        )}
        {exTab === "manual" && (
          <div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:10,padding:"4px 8px",background:"#1e293b",borderRadius:5,display:"inline-block"}}>Exact steps from the AX200 manual</div>
            {ex.manualSteps.map((step,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:9,alignItems:"flex-start",background:"#111827",borderRadius:7,padding:"9px 12px",borderLeft:`3px solid ${ex.color}`}}>
                <div style={{minWidth:22,height:22,borderRadius:"50%",background:`${ex.color}20`,border:`1px solid ${ex.color}50`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:ex.color,fontWeight:800,flexShrink:0}}>{i+1}</div>
                <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.55}}>{step}</span>
              </div>
            ))}
          </div>
        )}
        {exTab === "student" && (
          <div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:10,padding:"4px 8px",background:"#1e293b",borderRadius:5,display:"inline-block"}}>Practice questions with full model answers</div>
            {ex.studentExercises.map((item,i)=>(
              <ExamQA key={i} q={item.q} a={item.a} color={ex.color} />
            ))}
          </div>
        )}
        {exTab === "tricks" && (
          <div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:10,padding:"4px 8px",background:"#1e293b",borderRadius:5,display:"inline-block"}}>Details not mentioned anywhere else in the course</div>
            {ex.tricks.map((trick,i)=>(
              <div key={i} style={{background:"#071a00",border:"1px solid #00d4a030",borderRadius:8,padding:"11px 13px",marginBottom:8}}>
                <div style={{display:"flex",gap:7,alignItems:"flex-start",marginBottom:6}}>
                  <span style={{fontSize:14,flexShrink:0}}>💡</span>
                  <span style={{fontSize:12,fontWeight:700,color:"#00d4a0"}}>{trick.label}</span>
                </div>
                <div style={{fontSize:11,color:"#86efac",lineHeight:1.65,paddingLeft:22}}>{trick.detail}</div>
              </div>
            ))}
          </div>
        )}
        {exTab === "exam" && (
          <div style={{background:"#0a001a",border:"1px solid #a78bfa30",borderRadius:10,padding:14}}>
            <div style={{fontSize:11,color:"#a78bfa",fontWeight:700,marginBottom:8,letterSpacing:1}}>WHAT THE EXAM TESTS FROM THIS EXERCISE</div>
            <p style={{fontSize:12,color:"#c4b5fd",lineHeight:1.7,margin:0}}>{ex.examRelevance}</p>
          </div>
        )}
        <div style={{...S.navrow,marginTop:12}}>
          <button style={{...S.navbtn,opacity:exIdx===0?0.4:1}} onClick={()=>{setExIdx(p=>Math.max(0,p-1));setExTab("intent");}} disabled={exIdx===0}>Previous</button>
          <button style={{...S.navbtn,opacity:exIdx===EXERCISES.length-1?0.4:1}} onClick={()=>{setExIdx(p=>Math.min(EXERCISES.length-1,p+1));setExTab("intent");}} disabled={exIdx===EXERCISES.length-1}>Next</button>
        </div>
        <button style={{...S.primary,marginTop:10}} onClick={()=>setView("home")}>Back to Home</button>
      </div>
    );
  }


  // LAB REFERENCE
  if (view === "labref") {
    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <div style={{marginBottom:16}}>
          <h2 style={{...S.ptitle,marginBottom:4}}>🔬 DFIR Lab Manual Reference</h2>
          <p style={{color:"#475569",fontSize:11,margin:0}}>Quick-reference for live AXIOM investigations · AX200 v2604</p>
        </div>

        {/* Tab bar */}
        <div style={{display:"flex",gap:5,marginBottom:16,overflowX:"auto",paddingBottom:4}}>
          {[
            {id:"artifacts",label:"📂 Artifacts",c:"#0ea5e9"},
            {id:"registry",label:"🗃️ Registry",c:"#a78bfa"},
            {id:"paths",label:"📁 File Paths",c:"#00d4a0"},
            {id:"playbooks",label:"📋 Playbooks",c:"#f87171"},
            {id:"quickref",label:"⚡ Quick Ref",c:"#f59e0b"},
          ].map(t=>(
            <button key={t.id} style={{padding:"7px 13px",borderRadius:20,border:`1px solid ${labTab===t.id?t.c:"#1e293b"}`,background:labTab===t.id?`${t.c}20`:"transparent",color:labTab===t.id?t.c:"#64748b",cursor:"pointer",fontSize:11,fontWeight:labTab===t.id?700:400,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setLabTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ARTIFACTS TAB */}
        {labTab === "artifacts" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Where to find key artifacts in Axiom Examine — category path, source files, and key notes.</p>
            {LAB_REF.artifacts.map((cat,ci)=>(
              <div key={ci} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"6px 10px",background:`${cat.color}15`,borderRadius:6,border:`1px solid ${cat.color}30`}}>
                  <span style={{fontSize:14}}>{cat.icon}</span>
                  <span style={{fontSize:12,fontWeight:700,color:cat.color}}>{cat.category}</span>
                </div>
                {cat.items.map((item,ii)=>(
                  <div key={ii} style={{background:"#111827",borderRadius:8,padding:"11px 13px",marginBottom:8,borderLeft:`3px solid ${cat.color}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{item.name}</div>
                    <div style={{fontSize:11,color:cat.color,marginBottom:3}}>📍 {item.path}</div>
                    <div style={{fontSize:10,color:"#475569",marginBottom:6,fontFamily:"monospace",lineHeight:1.4}}>{item.source}</div>
                    {item.notes && <div style={{fontSize:11,color:"#64748b",lineHeight:1.5,marginBottom:8}}>⚙️ {item.notes}</div>}
                    {item.meaning && (
                      <div style={{background:"#0f172a",borderRadius:6,padding:"8px 10px",marginBottom:5,borderLeft:`2px solid ${cat.color}60`}}>
                        <div style={{fontSize:9,color:cat.color,fontWeight:700,marginBottom:3,letterSpacing:1}}>WHAT IT MEANS</div>
                        <div style={{fontSize:11,color:"#cbd5e1",lineHeight:1.5}}>{item.meaning}</div>
                      </div>
                    )}
                    {item.identifies && (
                      <div style={{background:"#0f1a0f",borderRadius:6,padding:"8px 10px",marginBottom:5,borderLeft:"2px solid #00d4a060"}}>
                        <div style={{fontSize:9,color:"#00d4a0",fontWeight:700,marginBottom:3,letterSpacing:1}}>HELPS IDENTIFY</div>
                        <div style={{fontSize:11,color:"#86efac",lineHeight:1.5}}>{item.identifies}</div>
                      </div>
                    )}
                    {item.supports && (
                      <div style={{background:"#0f0f1a",borderRadius:6,padding:"8px 10px",marginBottom:5,borderLeft:"2px solid #a78bfa60"}}>
                        <div style={{fontSize:9,color:"#a78bfa",fontWeight:700,marginBottom:3,letterSpacing:1}}>SUPPORTS / PROVES</div>
                        <div style={{fontSize:11,color:"#c4b5fd",lineHeight:1.5}}>{item.supports}</div>
                      </div>
                    )}
                    {item.interpret && (
                      <div style={{background:"#1a0f00",borderRadius:6,padding:"8px 10px",borderLeft:"2px solid #f59e0b60"}}>
                        <div style={{fontSize:9,color:"#f59e0b",fontWeight:700,marginBottom:3,letterSpacing:1}}>HOW TO INTERPRET IN FINDINGS</div>
                        <div style={{fontSize:11,color:"#fde68a",lineHeight:1.55}}>{item.interpret}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* REGISTRY TAB */}
        {labTab === "registry" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Key registry hives, paths, the Axiom artifact they produce, and what data they contain.</p>
            {LAB_REF.registry.map((r,i)=>(
              <div key={i} style={{background:"#111827",borderRadius:8,padding:"10px 12px",marginBottom:8,borderLeft:"3px solid #a78bfa"}}>
                <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontSize:10,background:"#1e1b4b",color:"#a78bfa",padding:"2px 8px",borderRadius:10,fontWeight:700,flexShrink:0}}>{r.hive}</span>
                  <span style={{fontSize:10,color:"#34d399",fontWeight:700,flexShrink:0}}>→ {r.artifact}</span>
                </div>
                <div style={{fontSize:10,color:"#60a5fa",fontFamily:"monospace",marginBottom:5,lineHeight:1.5,wordBreak:"break-all"}}>{r.key}</div>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5,marginBottom:r.forensic?5:0}}>{r.contains}</div>
                {r.forensic && <div style={{fontSize:11,color:"#fde68a",lineHeight:1.5,background:"#1a0f00",borderRadius:5,padding:"6px 8px",borderLeft:"2px solid #f59e0b60"}}><span style={{fontSize:9,color:"#f59e0b",fontWeight:700}}>FORENSIC VALUE: </span>{r.forensic}</div>}
              </div>
            ))}
          </div>
        )}

        {/* FILE PATHS TAB */}
        {labTab === "paths" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Forensically important file locations on disk — useful for File System Explorer navigation and source link verification.</p>
            {LAB_REF.paths.map((section,si)=>(
              <div key={si} style={{marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,padding:"6px 10px",background:`${section.color}15`,borderRadius:6,border:`1px solid ${section.color}30`}}>
                  <span style={{fontSize:12,fontWeight:700,color:section.color}}>{section.category}</span>
                </div>
                {section.entries.map((e,ei)=>(
                  <div key={ei} style={{background:"#111827",borderRadius:8,padding:"9px 12px",marginBottom:5,borderLeft:`3px solid ${section.color}`}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{e.label}</div>
                    <div style={{fontSize:10,color:"#60a5fa",fontFamily:"monospace",marginBottom:3,wordBreak:"break-all",lineHeight:1.5}}>{e.path}</div>
                    <div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>{e.files}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* PLAYBOOKS TAB */}
        {labTab === "playbooks" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Step-by-step investigation workflows for common DFIR scenarios using Magnet AXIOM.</p>
            {LAB_REF.playbooks.map((pb,pi)=>(
              <div key={pi} style={{background:"#111827",border:`1px solid ${pb.color}30`,borderRadius:10,padding:14,marginBottom:16}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                  <span style={{fontSize:18}}>{pb.icon}</span>
                  <span style={{fontSize:13,fontWeight:700,color:pb.color}}>{pb.title}</span>
                </div>
                {pb.steps.map((s,si)=>(
                  <div key={si} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                    <div style={{minWidth:22,height:22,borderRadius:"50%",background:`${pb.color}20`,border:`1px solid ${pb.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:pb.color,fontWeight:700,flexShrink:0}}>{s.step}</div>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:2}}>{s.action}</div>
                      <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* QUICK REF TAB */}
        {labTab === "quickref" && (
          <div>
            <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Keyboard shortcuts, key settings, fast-lookup artifact details, and acquisition reference.</p>
            {LAB_REF.quickref.map((section,si)=>(
              <div key={si} style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{fontSize:14}}>{section.icon}</span>
                  <span style={{fontSize:12,fontWeight:700,color:section.color}}>{section.title}</span>
                </div>
                {section.items.map((item,ii)=>(
                  <div key={ii} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #1e293b20",alignItems:"flex-start"}}>
                    <div style={{fontSize:10,fontWeight:700,color:section.color,background:`${section.color}15`,padding:"3px 8px",borderRadius:6,minWidth:80,textAlign:"center",flexShrink:0,lineHeight:1.4}}>{item.key}</div>
                    <div style={{fontSize:11,color:"#cbd5e1",lineHeight:1.5,flex:1}}>{item.action}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <button style={{...S.primary,marginTop:8}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  // MANUAL SEARCH
  if (view === "manual") {
    const q = manualQ.toLowerCase().trim();
    const modF = manualMod;
    const filtered = MANUAL.filter(e => {
      const matchMod = modF === 0 || e.mod === modF || (modF === 0 && true);
      if (!matchMod) return false;
      if (!q) return true;
      return (e.title + " " + e.body + " " + e.tag).toLowerCase().includes(q);
    });

    const highlight = (text) => {
      if (!q || q.length < 2) return text;
      const idx = text.toLowerCase().indexOf(q);
      if (idx === -1) return text;
      return (
        <>
          {text.slice(0, idx)}
          <mark style={{background:"#fbbf2440",color:"#fbbf24",borderRadius:2}}>{text.slice(idx, idx+q.length)}</mark>
          {text.slice(idx + q.length)}
        </>
      );
    };

    const modColors = ["#64748b","#0ea5e9","#00d4a0","#a78bfa","#f59e0b","#f87171","#34d399","#60a5fa","#818cf8","#fb923c","#4ade80","#e879f9","#fbbf24"];
    const modLabels = ["All","M1","M2","M3","M4","M5","M6","M7","M8","M9","M10","M11","M12"];
    const modFull = ["All","Installation","Processing","Magnet One","Examine UI","OS Info","Refined Results","Web","Communications","Encryption","Cloud","Media","Reporting"];

    return (
      <div style={S.root}>
        <button style={S.back} onClick={()=>setView("home")}>← Back</button>
        <h2 style={{...S.ptitle,marginBottom:6}}>📖 Manual Quick Search</h2>
        <p style={{color:"#475569",fontSize:11,marginBottom:14}}>Full AX200 manual — {MANUAL.length} entries. Search anything, filter by module. Use during the exam for instant lookup.</p>

        {/* Search box */}
        <div style={{position:"relative",marginBottom:10}}>
          <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#475569",fontSize:14}}>🔍</span>
          <input
            type="text"
            placeholder="Search artifact, path, key, concept..."
            value={manualQ}
            onChange={e=>setManualQ(e.target.value)}
            style={{width:"100%",padding:"11px 12px 11px 36px",background:"#111827",border:"1px solid #1e293b",borderRadius:8,color:"#e2e8f0",fontSize:14,fontFamily:"'Courier New',monospace",outline:"none",boxSizing:"border-box"}}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {manualQ && (
            <button onClick={()=>setManualQ("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:16,padding:"0 4px"}}>✕</button>
          )}
        </div>

        {/* Module filter pills */}
        <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
          {modLabels.map((ml,i)=>(
            <button key={i} style={{padding:"4px 10px",borderRadius:14,border:`1px solid ${manualMod===i?modColors[i]:"#1e293b"}`,background:manualMod===i?`${modColors[i]}25`:"transparent",color:manualMod===i?modColors[i]:"#64748b",cursor:"pointer",fontSize:11,fontWeight:manualMod===i?700:400,whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setManualMod(i)}>
              {ml}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{fontSize:11,color:"#475569",marginBottom:10}}>
          {q || modF>0 ? `${filtered.length} result${filtered.length!==1?"s":""}${q?` for "${manualQ}"`:""}${modF>0?` in ${modFull[modF]}`:""}` : `${MANUAL.length} entries across 12 modules`}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"32px 0",color:"#475569"}}>
            <div style={{fontSize:28,marginBottom:8}}>🔍</div>
            <div style={{fontSize:13}}>No results for "{manualQ}"</div>
            <div style={{fontSize:11,marginTop:4}}>Try a shorter term or different keyword</div>
          </div>
        ) : (
          filtered.map((entry,i)=>{
            const mc = entry.mod === 0 ? "#64748b" : modColors[entry.mod] || "#64748b";
            return (
              <div key={entry.id} style={{background:"#111827",borderRadius:8,padding:"11px 13px",marginBottom:8,borderLeft:`3px solid ${mc}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,gap:8,flexWrap:"wrap"}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",flex:1,lineHeight:1.4}}>{highlight(entry.title)}</div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <span style={{fontSize:9,background:`${mc}20`,color:mc,padding:"2px 7px",borderRadius:10,fontWeight:700}}>{entry.mod===0?"CORE":`M${entry.mod}`}</span>
                    <span style={{fontSize:9,background:"#1e293b",color:"#64748b",padding:"2px 7px",borderRadius:10}}>{entry.tag}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.6}}>{highlight(entry.body)}</div>
              </div>
            );
          })
        )}

        {/* Quick search suggestions when empty */}
        {!q && modF===0 && (
          <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid #1e293b"}}>
            <div style={{fontSize:11,color:"#475569",marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Quick searches</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {["prefetch","registry","chrome","firefox","bitlocker","usb","connections","email","onedrive","mfdb","hash","timestamp","carving","parsed","OCR","timeline","profile","identifier"].map(s=>(
                <button key={s} style={{padding:"4px 10px",borderRadius:14,background:"#0f172a",border:"1px solid #1e293b",color:"#60a5fa",cursor:"pointer",fontSize:11}} onClick={()=>setManualQ(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button style={{...S.primary,marginTop:16}} onClick={()=>setView("home")}>← Back to Home</button>
      </div>
    );
  }


  return null;
}



// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  root:{minHeight:"100vh",background:"#0a0f1e",color:"#e2e8f0",fontFamily:"'Courier New',Courier,monospace",padding:"20px 16px 40px",maxWidth:680,margin:"0 auto"},
  hdr:{textAlign:"center",paddingBottom:24},
  badge:{display:"inline-block",background:"#0ea5e9",color:"#0a0f1e",padding:"4px 14px",borderRadius:4,fontSize:11,fontWeight:700,letterSpacing:2,marginBottom:12},
  title:{fontSize:30,fontWeight:800,margin:0,lineHeight:1.2},
  grid4:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16},
  card:{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"15px 10px",cursor:"pointer",textAlign:"center"},
  stats:{display:"flex",alignItems:"center",justifyContent:"center",background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"12px 8px"},
  stat:{display:"flex",flexDirection:"column",alignItems:"center",padding:"0 12px"},
  sn:{fontSize:18,fontWeight:700,color:"#0ea5e9"},
  sl:{fontSize:10,color:"#64748b",marginTop:2},
  sdiv:{width:1,height:30,background:"#1e293b"},
  back:{background:"none",border:"1px solid #1e293b",color:"#94a3b8",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontSize:12,marginBottom:16},
  ptitle:{fontSize:20,fontWeight:700,marginBottom:20,color:"#e2e8f0"},
  block:{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:16,marginBottom:14},
  lbl:{fontSize:12,color:"#64748b",marginBottom:10,display:"block",letterSpacing:1,textTransform:"uppercase"},
  chips:{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16},
  chip:{padding:"5px 11px",borderRadius:5,border:"1px solid #1e293b",background:"#0a0f1e",color:"#64748b",cursor:"pointer",fontSize:12},
  chipA:{background:"#0ea5e9",color:"#0a0f1e",border:"1px solid #0ea5e9",fontWeight:700},
  cntbtn:{padding:"6px 16px",borderRadius:6,border:"1px solid #1e293b",background:"#0a0f1e",color:"#64748b",cursor:"pointer",fontSize:13},
  cntA:{background:"#00d4a0",color:"#0a0f1e",border:"1px solid #00d4a0",fontWeight:700},
  primary:{width:"100%",padding:"13px",background:"#0ea5e9",color:"#0a0f1e",border:"none",borderRadius:8,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10},
  opt:{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 14px",borderRadius:8,cursor:"pointer",textAlign:"left",color:"#e2e8f0"},
  mapBox:{background:"#111827",border:"1px solid #1e293b",borderRadius:12,padding:16,marginBottom:14},
  leafBox:{background:"#0f172a",borderRadius:8,padding:"12px 14px",marginTop:14},
  navrow:{display:"flex",gap:8},
  navbtn:{flex:1,padding:"10px",background:"#111827",border:"1px solid #1e293b",color:"#e2e8f0",borderRadius:8,cursor:"pointer",fontSize:13},
};
