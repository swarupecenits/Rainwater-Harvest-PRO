import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("preferredLanguage") || "en";

i18n.use(initReactI18next).init({
    debug: true,
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    resources: {
        en: {
            translation: {
                assessment: {
                    title: "Rainwater Harvesting Assessment",
                    subtitle: "Fill in the details to get a personalized assessment",
                    roofTypes: {
                        metal: "Metal Roof",
                        tile: "Tile Roof",
                        concrete: "Concrete Roof",
                        asphalt: "Asphalt Shingles",
                        thatch: "Thatch Roof"
                    },

                    soilTypes: {
                        sandy: "Sandy",
                        loamy: "Loamy",
                        clay: "Clay",
                        silt: "Silt",
                        peaty: "Peaty",
                        chalky: "Chalky"
                    },
                    steps: {
                        basicInfo: "Basic Info",
                        propertyDetails: "Property Details",
                        location: "Location"
                    },

                    basicInfo: {
                        heading: "Basic Information",
                        name: "Assessment Name",
                        namePlaceholder: "e.g. My Home Assessment",
                        dwellers: "Number of Dwellers",
                        dwellersPlaceholder: "e.g. 4",
                        phone: "Phone Number",
                        phonePlaceholder: "e.g. +1 234 567 8900",
                        email: "Email",
                        emailPlaceholder: "your@email.com"
                    },

                    propertyDetails: {
                        heading: "Property Details",
                        roofArea: "Roof Area (sq. meters)",
                        roofAreaPlaceholder: "e.g. 100",
                        openSpace: "Open Space Area (sq. meters)",
                        openSpacePlaceholder: "e.g. 50",
                        roofType: "Roof Type",
                        soilType: "Soil Type",
                        roofPhoto: "Roof Photo (Optional)",
                        dragDrop: "Drag and drop a photo of your roof",
                        orBrowse: "or browse files"
                    },

                    locationDetails: {
                        heading: "Location Details",
                        address: "Address",
                        addressPlaceholder: "Enter your full address",
                        mapPin: "Pin Location on Map",
                        latitude: "Latitude",
                        latitudePlaceholder: "e.g. 40.7128",
                        longitude: "Longitude",
                        longitudePlaceholder: "e.g. -74.0060",
                        rainfall: "Annual Rainfall (mm)",
                        rainfallPlaceholder: "e.g. 1200"
                    },

                    buttons: {
                        previous: "Previous",
                        next: "Next",
                        submit: "Submit Assessment"
                    }
                },
                mapExplorer: {
                    title: "Map Explorer",
                    subtitle: "Explore rainwater harvesting data in your area",
                    yourLocation: "Your location",
                    searchPlaceholder: "Search for a place...",
                    searchButton: "Search",
                    zoomButton: "Zoom to My Location"
                },
                navbar: {
                    home: "Home",
                    assessment: "Assessment",
                    map: "Map",
                    reports: "Reports",
                    learn: "Learn",
                    community: "Community",
                    settings: "Settings",
                    roofAI: "Roof AI",
                },
                reports: {
                AssessmentReports: "Assessment Reports",
                "View and manage your past assessments": "View and manage your past assessments",
                "New Assessment": "New Assessment",
                "Search reports...": "Search reports...",
                Filter: "Filter",
                "Newest First": "Newest First",
                "Oldest First": "Oldest First",
                "Highest Potential": "Highest Potential",
                "Highly Suitable": "Highly Suitable",
                "Conditionally Suitable": "Conditionally Suitable",
                "Not Recommended": "Not Recommended",
                View: "View",
                Download: "Download",
                "No reports yet": "No reports yet",
                "Start your first assessment to generate a report.": "Start your first assessment to generate a report.",
                "Start Assessment": "Start Assessment"
                },
                settings: {
                    title: "Settings",
                    subtitle: "Manage your account preferences",
                    profile: "Profile",
                    notifications: "Notifications",
                    language: "Language",
                    appearance: "Appearance",
                    privacy: "Privacy",
                    help: "Help & Support",

                    profileInformation: "Profile Information",
                    changePhoto: "Change Photo",
                    defaultAddress: "Default Address",
                    saveChanges: "Save Changes",

                    notificationPreferences: "Notification Preferences",
                    assessmentReports: "Assessment Reports",
                    assessmentReportsDesc: "Receive notifications when your assessments are complete",
                    rainfallAlerts: "Rainfall Alerts",
                    rainfallAlertsDesc: "Get notified about significant rainfall events in your area",
                    newsUpdates: "News & Updates",
                    newsUpdatesDesc: "Stay informed about new features and app updates",
                    maintenanceReminders: "Maintenance Reminders",
                    maintenanceRemindersDesc: "Get reminders for maintaining your rainwater harvesting systems",
                    notificationChannels: "Notification Channels",
                    email: "Email",
                    sms: "SMS",
                    push: "Push Notifications",
                    savePreferences: "Save Preferences",

                    appearanceSettings: "Appearance Settings",
                    theme: "Theme",
                    light: "Light",
                    dark: "Dark",
                    system: "System",
                    textSize: "Text Size",
                    applyChanges: "Apply Changes",

                    languageSettings: "Language Settings",
                    appLanguage: "App Language",
                    region: "Region",
                    firstName: "First Name",
                    lastName: "Last Name",
                    phoneNumber: "Phone Number",
                    streetAddress: "Street Address",
                    city: "City",
                    state: "State/Province",
                    zipCode: "Zip/Postal Code"
                },
                knowledge: {
                    KnowledgeHub: "Knowledge Hub",
                    Learnaboutrainwaterharvestingtechniquesandbestpractices: "Learn about rainwater harvesting techniques and best practices",
                    RainwaterHarvestingEssentials: "Rainwater Harvesting Essentials",
                    Acomprehensiveguideforbeginnerstoadvancedpractitioners: "A comprehensive guide for beginners to advanced practitioners",
                    StartLearning: "Start Learning",
                    Searchforarticlesvideosguides: "Search for articles, videos, guides...",
                    Filter: "Filter",
                    NewestFirst: "Newest First",
                    MostPopular: "Most Popular",
                    Language: "Language",
                    All: "All",
                    Basics: "Basics",
                    Techniques: "Techniques",
                    Maintenance: "Maintenance",
                    Benefits: "Benefits",
                    CaseStudies: "Case Studies",
                    Featured: "Featured",
                    IntroductiontoRainwaterHarvesting: "Introduction to Rainwater Harvesting",
                    HowtoBuildaRechargePit: "How to Build a Recharge Pit",
                    MaintenanceGuideforStorageTanks: "Maintenance Guide for Storage Tanks",
                    EconomicBenefitsofRainwaterHarvesting: "Economic Benefits of Rainwater Harvesting",
                    SuccessStoryCommunityHarvestingProject: "Success Story: Community Harvesting Project",
                    DIYFiltrationSystems: "DIY Filtration Systems"
                },
                results: {
                    title: "Assessment Results",
                    subtitle: "Here is the summary of your rainwater harvesting assessment",
                    waterSavings: "Estimated Water Savings",
                    roofArea: "Roof Area",
                    openSpace: "Open Space Area",
                    rainfall: "Annual Rainfall",
                    potential: "Harvesting Potential",
                    litersPerYear: "Liters per year",
                    recommendations: "Recommendations",
                    savePdf: "Save Report as PDF",
                    backToReports: "Back to My Reports",
                    tryAgain: "Try Another Assessment",

                    costEstimation: "Cost Estimation",
                    storageTank: "Storage Tank",
                    rechargePit: "Recharge Pit",
                    guttersPipes: "Gutters & Pipes",
                    filtrationSystem: "Filtration System",
                    installation: "Installation",
                    totalEstimatedCost: "Total Estimated Cost",

                    returnOnInvestment: "Return on Investment",
                    estimatedAnnualSavings: "Estimated Annual Savings",
                    paybackPeriod: "Payback period: ~9 years",
                    environmentalImpact: "Environmental Impact",
                    waterSavedAnnually: "112,500 L water saved annually",
                    reducedRunoff: "Reduced runoff by 85%",

                    nextSteps: "Next Steps",
                    step1: "Contact local contractors for detailed quotes and implementation plans.",
                    step2: "Check for available government subsidies or rebates in your area.",
                    step3: "Review our knowledge hub for maintenance best practices.",
                    exploreKnowledgeHub: "Explore Knowledge Hub",

                    rainfallDistribution: "Rainfall Distribution",
                    monthlyPrecipitation: "Monthly Precipitation",
                    mmPerMonth: "mm/month",

                    groundwaterLevel: "Groundwater Level",
                    surface: "Surface",
                    depth: "Depth (m)",
                    groundwaterDesc: "The groundwater level in your area is at 8.5m depth, which is suitable for recharge structures.",
                    feasibility: "Feasibility: Highly Suitable",
                    feasibilityDesc: "Your property is well-suited for rainwater harvesting"
                    },
                    



                welcome: "Welcome back,",
                subtitle: "Let's explore your rainwater harvesting potential",
                currentWeather: "Current Weather",
                searchPlaceholder: "Enter city name...",
                search: "Search",
                useLocation: "Use My Location",
                loadingWeather: "Loading weather...",
                locationDenied: "Location access denied",
                quickActions: {
                    startAssessment: "Start Assessment",
                    startAssessmentDesc: "Evaluate your rainwater harvesting potential",
                    myReports: "My Reports",
                    myReportsDesc: "View your past assessments and reports",
                    localRainfall: "Roof Structure AI Analysis",
                    localRainfallDesc: "Check roof contour and capture efficiency using AI",
                    knowledgeHub: "Knowledge Hub",
                    knowledgeHubDesc: "Learn about rainwater harvesting techniques",
                },
                mapPreview: "Map Preview",
                exploreGIS: "Explore GIS Map",
                rainfallPatterns: "Rainfall Patterns",
                rainfallChartTitle: "Hourly Precipitation, Rain & Showers",
                today: "Today",
                chartLegend: "Blue: Precipitation, Cyan: Rain, Purple: Showers",
                potentialSavings: "Potential Savings",
                estimatedSavings: "Estimated Water Savings",
                litersPerYear: "Liters per year",
                completeAssessment: "Complete an assessment to get personalized savings estimates."
            },
            hi: {

                navbar: {
                    home: "होम",
                    assessment: "मूल्यांकन",
                    map: "मानचित्र",
                    reports: "रिपोर्ट्स",
                    learn: "सीखें",
                    community: "समुदाय",
                    settings: "सेटिंग्स",
                    roofAI: "रूफ AI"
                },
                welcome: "वापसी पर स्वागत है, स्वरूप",
                subtitle: "आइए आपके वर्षा जल संचयन की क्षमता का पता लगाएं",
                currentWeather: "वर्तमान मौसम",
                searchPlaceholder: "शहर का नाम दर्ज करें...",
                search: "खोजें",
                useLocation: "मेरे स्थान का उपयोग करें",
                loadingWeather: "मौसम लोड हो रहा है...",
                locationDenied: "स्थान की अनुमति अस्वीकार कर दी गई",
                quickActions: {
                    startAssessment: "मूल्यांकन प्रारंभ करें",
                    startAssessmentDesc: "अपने वर्षा जल संचयन की क्षमता का मूल्यांकन करें",
                    myReports: "मेरी रिपोर्ट्स",
                    myReportsDesc: "अपने पिछले मूल्यांकन और रिपोर्ट देखें",
                    localRainfall: "स्थानीय वर्षा डेटा",
                    localRainfallDesc: "अपने क्षेत्र में वर्षा पैटर्न देखें",
                    knowledgeHub: "ज्ञान केंद्र",
                    knowledgeHubDesc: "वर्षा जल संचयन तकनीकों के बारे में जानें",
                },
                mapPreview: "मानचित्र पूर्वावलोकन",
                exploreGIS: "जीआईएस मानचित्र देखें",
                rainfallPatterns: "वर्षा पैटर्न",
                rainfallChartTitle: "प्रति घंटा वर्षा, बारिश और बौछारें",
                today: "आज",
                chartLegend: "नीला: वर्षा, सियान: बारिश, बैंगनी: बौछारें",
                potentialSavings: "संभावित बचत",
                estimatedSavings: "अनुमानित जल बचत",
                litersPerYear: "लीटर प्रति वर्ष",
                completeAssessment: "व्यक्तिगत बचत अनुमान प्राप्त करने के लिए एक मूल्यांकन पूरा करें।",



                // General
                Settings: "Settings",
                "Manage your account preferences": "Manage your account preferences",
                "Save Preferences": "Save Preferences",
                "Save Changes": "Save Changes",
                Apply: "Apply Changes",

                // Tabs
                Profile: "Profile",
                Notifications: "Notifications",
                Language: "Language",
                Appearance: "Appearance",
                Privacy: "Privacy",
                "Help & Support": "Help & Support",

                // Profile
                "Profile Information": "Profile Information",
                "Change Photo": "Change Photo",
                "JPG, GIF or PNG. Max size 1MB.": "JPG, GIF or PNG. Max size 1MB.",
                "First Name": "First Name",
                "Last Name": "Last Name",
                Email: "Email",
                "Phone Number": "Phone Number",
                "Default Address": "Default Address",
                "Street Address": "Street Address",
                City: "City",
                "State/Province": "State/Province",
                "Zip/Postal Code": "Zip/Postal Code",

                // Notifications
                "Notification Preferences": "Notification Preferences",
                "Assessment Reports": "Assessment Reports",
                "Receive notifications when your assessments are complete":
                    "Receive notifications when your assessments are complete",
                "Rainfall Alerts": "Rainfall Alerts",
                "Get notified about significant rainfall events in your area":
                    "Get notified about significant rainfall events in your area",
                "News & Updates": "News & Updates",
                "Stay informed about new features and app updates":
                    "Stay informed about new features and app updates",
                "Maintenance Reminders": "Maintenance Reminders",
                "Get reminders for maintaining your rainwater harvesting systems":
                    "Get reminders for maintaining your rainwater harvesting systems",
                "Notification Channels": "Notification Channels",
                SMS: "SMS",
                "Push Notifications": "Push Notifications",

                // Appearance
                "Appearance Settings": "Appearance Settings",
                Theme: "Theme",
                Light: "Light",
                Dark: "Dark",
                System: "System",
                "Text Size": "Text Size",

                // Language
                "Language Settings": "Language Settings",
                "App Language": "App Language",
                Region: "Region",
                "Date Format": "Date Format",
                "Measurement Units": "Measurement Units",
                Metric: "Metric (meters, liters, mm)",
                Imperial: "Imperial (feet, gallons, inches)",

                // Date Formats
                "MM/DD/YYYY (06/15/2023)": "MM/DD/YYYY (06/15/2023)",
                "DD/MM/YYYY (15/06/2023)": "DD/MM/YYYY (15/06/2023)",
                "YYYY/MM/DD (2023/06/15)": "YYYY/MM/DD (2023/06/15)",

                // Regions
                "United States": "United States",
                "European Union": "European Union",
                "United Kingdom": "United Kingdom",
                Canada: "Canada",
                Australia: "Australia",
                India: "India",
            },
        },
        hi: {
            translation: {
                assessment: {
                    title: "वर्षा जल संचयन मूल्यांकन",
                    subtitle: "व्यक्तिगत मूल्यांकन प्राप्त करने के लिए विवरण भरें",
                    roofTypes: {
                        metal: "धातु की छत",
                        tile: "टाइल की छत",
                        concrete: "कंक्रीट की छत",
                        asphalt: "डामर शिंगल्स",
                        thatch: "घास-फूस की छत"
                    },

                    soilTypes: {
                        sandy: "बालू मिट्टी",
                        loamy: "दोमट मिट्टी",
                        clay: "चिकनी मिट्टी",
                        silt: "गाद मिट्टी",
                        peaty: "पीट मिट्टी",
                        chalky: "चाकयुक्त मिट्टी"
                    },

                    steps: {
                        basicInfo: "मूल जानकारी",
                        propertyDetails: "संपत्ति विवरण",
                        location: "स्थान"
                    },

                    basicInfo: {
                        heading: "मूल जानकारी",
                        name: "मूल्यांकन नाम",
                        namePlaceholder: "उदा. मेरा होम मूल्यांकन",
                        dwellers: "निवासियों की संख्या",
                        dwellersPlaceholder: "उदा. 4",
                        phone: "फ़ोन नंबर",
                        phonePlaceholder: "उदा. +91 98765 43210",
                        email: "ईमेल",
                        emailPlaceholder: "your@email.com"
                    },

                    propertyDetails: {
                        heading: "संपत्ति विवरण",
                        roofArea: "छत का क्षेत्रफल (वर्ग मीटर)",
                        roofAreaPlaceholder: "उदा. 100",
                        openSpace: "खुला स्थान क्षेत्र (वर्ग मीटर)",
                        openSpacePlaceholder: "उदा. 50",
                        roofType: "छत का प्रकार",
                        soilType: "मिट्टी का प्रकार",
                        roofPhoto: "छत की फोटो (वैकल्पिक)",
                        dragDrop: "अपनी छत की फोटो यहाँ खींचें और छोड़ें",
                        orBrowse: "या फाइलें ब्राउज़ करें"
                    },

                    locationDetails: {
                        heading: "स्थान विवरण",
                        address: "पता",
                        addressPlaceholder: "अपना पूरा पता दर्ज करें",
                        mapPin: "मानचित्र पर स्थान पिन करें",
                        latitude: "अक्षांश",
                        latitudePlaceholder: "उदा. 40.7128",
                        longitude: "देशांतर",
                        longitudePlaceholder: "उदा. -74.0060",
                        rainfall: "वार्षिक वर्षा (मिमी)",
                        rainfallPlaceholder: "उदा. 1200"
                    },

                    buttons: {
                        previous: "पिछला",
                        next: "अगला",
                        submit: "मूल्यांकन सबमिट करें"
                    }
                },

                mapExplorer: {
                    title: "मानचित्र एक्सप्लोरर",
                    subtitle: "अपने क्षेत्र में वर्षा जल संचयन डेटा का पता लगाएं",
                    yourLocation: "आपका स्थान",
                    searchPlaceholder: "किसी स्थान को खोजें...",
                    searchButton: "खोजें",
                    zoomButton: "मेरे स्थान पर ज़ूम करें"
                },
                navbar: {
                    home: "होम",
                    assessment: "मूल्यांकन",
                    map: "मानचित्र",
                    reports: "रिपोर्ट्स",
                    learn: "सीखें",
                    community: "समुदाय",
                    settings: "सेटिंग्स",
                    roofAI: "रूफ AI"
                },
                reports: {
                AssessmentReports: "अकलन रिपोर्ट",
                "View and manage your past assessments": "अपने पिछले आकलनों को देखें और प्रबंधित करें",
                "New Assessment": "नया आकलन",
                "Search reports...": "रिपोर्ट खोजें...",
                Filter: "फ़िल्टर",
                "Newest First": "नवीनतम पहले",
                "Oldest First": "सबसे पुराना पहले",
                "Highest Potential": "सबसे उच्च संभाव्यता",
                "Highly Suitable": "अत्यंत उपयुक्त",
                "Conditionally Suitable": "शर्तों के अनुसार उपयुक्त",
                "Not Recommended": "अनुशंसित नहीं",
                View: "देखें",
                Download: "डाउनलोड",
                "No reports yet": "अभी तक कोई रिपोर्ट नहीं",
                "Start your first assessment to generate a report.": "रिपोर्ट बनाने के लिए अपना पहला आकलन शुरू करें।",
                "Start Assessment": "आकलन शुरू करें"
},
                settings: {
                    title: "सेटिंग्स",
                    subtitle: "अपने खाता वरीयताओं का प्रबंधन करें",
                    profile: "प्रोफ़ाइल",
                    notifications: "सूचनाएं",
                    language: "भाषा",
                    appearance: "रूप-रंग",
                    privacy: "गोपनीयता",
                    help: "सहायता और समर्थन",

                    profileInformation: "प्रोफ़ाइल जानकारी",
                    changePhoto: "फ़ोटो बदलें",
                    defaultAddress: "डिफ़ॉल्ट पता",
                    saveChanges: "परिवर्तन सहेजें",

                    notificationPreferences: "सूचना वरीयताएँ",
                    assessmentReports: "मूल्यांकन रिपोर्ट",
                    assessmentReportsDesc: "जब आपके मूल्यांकन पूर्ण हों तो सूचनाएं प्राप्त करें",
                    rainfallAlerts: "वर्षा चेतावनी",
                    rainfallAlertsDesc: "अपने क्षेत्र में महत्वपूर्ण वर्षा घटनाओं के बारे में सूचित रहें",
                    newsUpdates: "समाचार और अपडेट",
                    newsUpdatesDesc: "नई विशेषताओं और ऐप अपडेट के बारे में सूचित रहें",
                    maintenanceReminders: "रखरखाव अनुस्मारक",
                    maintenanceRemindersDesc: "अपने वर्षा जल संचयन प्रणालियों के रखरखाव के लिए अनुस्मारक प्राप्त करें",
                    notificationChannels: "सूचना चैनल",
                    email: "ईमेल",
                    sms: "एसएमएस",
                    push: "पुश सूचनाएं",
                    savePreferences: "वरीयताएँ सहेजें",

                    appearanceSettings: "रूप-रंग सेटिंग्स",
                    theme: "थीम",
                    light: "हल्का",
                    dark: "गहरा",
                    system: "सिस्टम",
                    textSize: "पाठ का आकार",
                    applyChanges: "परिवर्तन लागू करें",

                    languageSettings: "भाषा सेटिंग्स",
                    appLanguage: "ऐप भाषा",
                    region: "क्षेत्र",
                    firstName: "पहला नाम",
                    lastName: "अंतिम नाम",
                    phoneNumber: "फोन नंबर",
                    streetAddress: "सड़क का पता",
                    city: "शहर",
                    state: "राज्य/प्रांत",
                    zipCode: "पिन/डाक कोड"
                },
                knowledge: {
                    KnowledgeHub: "ज्ञान केंद्र",
                    Learnaboutrainwaterharvestingtechniquesandbestpractices: "वर्षा जल संचयन तकनीकों और सर्वोत्तम तरीकों के बारे में जानें",
                    RainwaterHarvestingEssentials: "वर्षा जल संचयन आवश्यकताएँ",
                    Acomprehensiveguideforbeginnerstoadvancedpractitioners: "शुरुआती से उन्नत उपयोगकर्ताओं के लिए एक व्यापक मार्गदर्शिका",
                    StartLearning: "सीखना शुरू करें",
                    Searchforarticlesvideosguides: "लेख, वीडियो, मार्गदर्शिकाएँ खोजें...",
                    Filter: "फ़िल्टर",
                    NewestFirst: "नवीनतम पहले",
                    MostPopular: "सबसे लोकप्रिय",
                    Language: "भाषा",
                    All: "सभी",
                    Basics: "मूल बातें",
                    Techniques: "तकनीकें",
                    Maintenance: "रखरखाव",
                    Benefits: "लाभ",
                    CaseStudies: "केस अध्ययन",
                    Featured: "विशेष",
                    IntroductiontoRainwaterHarvesting: "वर्षा जल संचयन का परिचय",
                    HowtoBuildaRechargePit: "रिचार्ज पिट कैसे बनाएं",
                    MaintenanceGuideforStorageTanks: "स्टोरेज टैंकों के रखरखाव की मार्गदर्शिका",
                    EconomicBenefitsofRainwaterHarvesting: "वर्षा जल संचयन के आर्थिक लाभ",
                    SuccessStoryCommunityHarvestingProject: "सफलता की कहानी: सामुदायिक संचयन परियोजना",
                    DIYFiltrationSystems: "खुद बनाएं निस्पंदन प्रणालियाँ"
                },
                results: {
                    title: "मूल्यांकन परिणाम",
                    subtitle: "यह आपके वर्षा जल संचयन मूल्यांकन का सारांश है",
                    waterSavings: "अनुमानित जल बचत",
                    roofArea: "छत का क्षेत्रफल",
                    openSpace: "खुले स्थान का क्षेत्रफल",
                    rainfall: "वार्षिक वर्षा",
                    potential: "संचयन क्षमता",
                    litersPerYear: "लीटर प्रति वर्ष",
                    recommendations: "सिफारिशें",
                    savePdf: "रिपोर्ट को पीडीएफ के रूप में सहेजें",
                    backToReports: "मेरी रिपोर्ट्स पर वापस जाएं",
                    tryAgain: "एक और मूल्यांकन करें",

                    costEstimation: "लागत का अनुमान",
                    storageTank: "भंडारण टैंक",
                    rechargePit: "रीचार्ज पिट",
                    guttersPipes: "नालियां और पाइप",
                    filtrationSystem: "निस्पंदन प्रणाली",
                    installation: "स्थापना",
                    totalEstimatedCost: "कुल अनुमानित लागत",

                    returnOnInvestment: "निवेश पर प्रतिलाभ",
                    estimatedAnnualSavings: "अनुमानित वार्षिक बचत",
                    paybackPeriod: "लागत वसूली अवधि: ~9 वर्ष",
                    environmentalImpact: "पर्यावरणीय प्रभाव",
                    waterSavedAnnually: "वार्षिक 112,500 लीटर जल की बचत",
                    reducedRunoff: "85% तक अपवाह में कमी",

                    nextSteps: "अगले कदम",
                    step1: "विस्तृत अनुमान और कार्ययोजना के लिए स्थानीय ठेकेदारों से संपर्क करें।",
                    step2: "अपने क्षेत्र में उपलब्ध सरकारी सब्सिडी या रियायतें जांचें।",
                    step3: "रखरखाव के सर्वोत्तम तरीकों के लिए हमारे ज्ञान केंद्र की समीक्षा करें।",
                    exploreKnowledgeHub: "ज्ञान केंद्र का अन्वेषण करें",

                    rainfallDistribution: "वर्षा वितरण",
                    monthlyPrecipitation: "मासिक वर्षा",
                    mmPerMonth: "मिमी/माह",

                    groundwaterLevel: "भूजल स्तर",
                    surface: "सतह",
                    depth: "गहराई (मीटर)",
                    groundwaterDesc: "आपके क्षेत्र में भूजल स्तर 8.5 मीटर गहराई पर है, जो पुनर्भरण संरचनाओं के लिए उपयुक्त है।",
                    feasibility: "व्यवहार्यता: अत्यधिक उपयुक्त",
                    feasibilityDesc: "आपकी संपत्ति वर्षा जल संचयन के लिए अत्यधिक उपयुक्त है"
                    },


                welcome: "वापसी पर स्वागत है,",
                subtitle: "आइए आपके वर्षा जल संचयन की क्षमता का पता लगाएं",
                currentWeather: "वर्तमान मौसम",
                searchPlaceholder: "शहर का नाम दर्ज करें...",
                search: "खोजें",
                useLocation: "मेरे स्थान का उपयोग करें",
                loadingWeather: "मौसम लोड हो रहा है...",
                locationDenied: "स्थान की अनुमति अस्वीकार कर दी गई",
                quickActions: {
                    startAssessment: "मूल्यांकन प्रारंभ करें",
                    startAssessmentDesc: "अपने वर्षा जल संचयन की क्षमता का मूल्यांकन करें",
                    myReports: "मेरी रिपोर्ट्स",
                    myReportsDesc: "अपने पिछले मूल्यांकन और रिपोर्ट देखें",
                    localRainfall: "स्थानीय वर्षा डेटा",
                    localRainfallDesc: "अपने क्षेत्र में वर्षा पैटर्न देखें",
                    knowledgeHub: "ज्ञान केंद्र",
                    knowledgeHubDesc: "वर्षा जल संचयन तकनीकों के बारे में जानें",
                },
                mapPreview: "मानचित्र पूर्वावलोकन",
                exploreGIS: "जीआईएस मानचित्र देखें",
                rainfallPatterns: "वर्षा पैटर्न",
                rainfallChartTitle: "प्रति घंटा वर्षा, बारिश और बौछारें",
                today: "आज",
                chartLegend: "नीला: वर्षा, सियान: बारिश, बैंगनी: बौछारें",
                potentialSavings: "संभावित बचत",
                estimatedSavings: "अनुमानित जल बचत",
                litersPerYear: "लीटर प्रति वर्ष",
                completeAssessment: "व्यक्तिगत बचत अनुमान प्राप्त करने के लिए एक मूल्यांकन पूरा करें।",
                // General
                Settings: "सेटिंग्स",
                "Manage your account preferences": "अपने खाता प्राथमिकताएँ प्रबंधित करें",
                "Save Preferences": "प्राथमिकताएँ सहेजें",
                "Save Changes": "परिवर्तन सहेजें",
                Apply: "परिवर्तन लागू करें",

                // Tabs
                Profile: "प्रोफ़ाइल",
                Notifications: "सूचनाएँ",
                Language: "भाषा",
                Appearance: "दिखावट",
                Privacy: "गोपनीयता",
                "Help & Support": "सहायता और समर्थन",

                // Profile
                "Profile Information": "प्रोफ़ाइल जानकारी",
                "Change Photo": "फ़ोटो बदलें",
                "JPG, GIF or PNG. Max size 1MB.": "JPG, GIF या PNG। अधिकतम आकार 1MB।",
                "First Name": "पहला नाम",
                "Last Name": "अंतिम नाम",
                Email: "ईमेल",
                "Phone Number": "फ़ोन नंबर",
                "Default Address": "डिफ़ॉल्ट पता",
                "Street Address": "गली का पता",
                City: "शहर",
                "State/Province": "राज्य/प्रांत",
                "Zip/Postal Code": "पिन/डाक कोड",

                // Notifications
                "Notification Preferences": "सूचना प्राथमिकताएँ",
                "Assessment Reports": "मूल्यांकन रिपोर्ट",
                "Receive notifications when your assessments are complete":
                    "जब आपका मूल्यांकन पूरा हो जाए तब सूचनाएँ प्राप्त करें",
                "Rainfall Alerts": "वर्षा अलर्ट",
                "Get notified about significant rainfall events in your area":
                    "अपने क्षेत्र में महत्वपूर्ण वर्षा घटनाओं की सूचना प्राप्त करें",
                "News & Updates": "समाचार और अपडेट",
                "Stay informed about new features and app updates":
                    "नई विशेषताओं और ऐप अपडेट के बारे में सूचित रहें",
                "Maintenance Reminders": "रखरखाव अनुस्मारक",
                "Get reminders for maintaining your rainwater harvesting systems":
                    "अपने वर्षा जल संचयन प्रणाली के रखरखाव के लिए अनुस्मारक प्राप्त करें",
                "Notification Channels": "सूचना चैनल",
                SMS: "एसएमएस",
                "Push Notifications": "पुश सूचनाएँ",

                // Appearance
                "Appearance Settings": "दिखावट सेटिंग्स",
                Theme: "थीम",
                Light: "हल्का",
                Dark: "गहरा",
                System: "सिस्टम",
                "Text Size": "पाठ का आकार",

                // Language
                "Language Settings": "भाषा सेटिंग्स",
                "App Language": "ऐप भाषा",
                Region: "क्षेत्र",
                "Date Format": "तारीख प्रारूप",
                "Measurement Units": "माप की इकाइयाँ",
                Metric: "मैट्रिक (मीटर, लीटर, मिमी)",
                Imperial: "इम्पीरियल (फुट, गैलन, इंच)",

                // Date Formats
                "MM/DD/YYYY (06/15/2023)": "MM/DD/YYYY (06/15/2023)",
                "DD/MM/YYYY (15/06/2023)": "DD/MM/YYYY (15/06/2023)",
                "YYYY/MM/DD (2023/06/15)": "YYYY/MM/DD (2023/06/15)",

                // Regions
                "United States": "संयुक्त राज्य",
                "European Union": "यूरोपीय संघ",
                "United Kingdom": "यूनाइटेड किंगडम",
                Canada: "कनाडा",
                Australia: "ऑस्ट्रेलिया",
                India: "भारत",
            },
        },
    },
});

export default i18n;
