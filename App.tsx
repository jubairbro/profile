import React, { useEffect, useState, useRef } from 'react';
import { 
  Menu, X, Sun, Moon, Music, Pause, ArrowUp, 
  Github, Youtube, Facebook, Send, ExternalLink, Settings, Check, Play, Quote, Terminal,
  Code, Star, GitFork, Smartphone, Layout, Monitor, Cpu, Globe, Server, Shield, Video,
  User, MapPin, Heart, BookOpen, ScrollText, Palette, Cake, Hand, Bot, Languages
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Autoplay, EffectCoverflow } from 'swiper/modules';

import Preloader from './components/Preloader.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import { UserData } from './types.ts';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

type ThemeColor = 'green' | 'blue' | 'purple' | 'orange' | 'cyan';
type View = 'home' | 'projects' | 'hadith';
type LangMode = 'en' | 'bn';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<ThemeColor>('green');
  const [showSettings, setShowSettings] = useState(false);
  const [age, setAge] = useState(20);
  const [hadithTab, setHadithTab] = useState<'hadith' | 'dua'>('hadith');
  const [langMode, setLangMode] = useState<LangMode>('bn'); // Default to Bangla as requested context implies local users
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Data ---
  const galleryImages = [
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20250822_001904_975.jpg",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/1735204262659.jpg",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/satoru-gojo-jujutsu-5120x2880-10828.png",
    "https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20251001_161822_246.jpg"
  ];

  const hadiths = [
    { arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", text_en: "Actions are judged by intentions.", text_bn: "নিশ্চয়ই সব কাজ নিয়তের উপর নির্ভরশীল।", ref: "Bukhari & Muslim" },
    { arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", text_en: "The best of you are those who learn the Quran and teach it.", text_bn: "তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি যে কুরআন শেখে এবং অন্যকে শেখায়।", ref: "Bukhari" },
    { arabic: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", text_en: "None of you truly believes until he loves for his brother what he loves for himself.", text_bn: "তোমাদের কেউ ততক্ষণ পর্যন্ত মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তাই পছন্দ করবে যা সে নিজের জন্য পছন্দ করে।", ref: "Bukhari & Muslim" },
    { arabic: "الدِّينُ النَّصِيحَةُ", text_en: "Religion is sincerity.", text_bn: "দ্বীন হলো কল্যাণকামিতা।", ref: "Muslim" },
    { arabic: "لَا تَقُومُ السَّاعَةُ حَتَّى تَخْرُجَ النَّارُ مِنْ أَرْضِ الْحِجَازِ", text_en: "The Hour will not be established until a fire emerges from the land of Hijaz.", text_bn: "ততক্ষণ পর্যন্ত কিয়ামত হবে না, যতক্ষণ না হিজাজের জমিন থেকে এমন এক আগুন বের হবে।", ref: "Bukhari" },
    { arabic: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", text_en: "Your smile for your brother is a charity.", text_bn: "তোমার ভাইয়ের সামনে মুচকি হাসাও একটি সাদাকা।", ref: "Tirmidhi" },
    { arabic: "الطُّهُورُ شَطْرُ الإِيمَانِ", text_en: "Cleanliness is half of faith.", text_bn: "পবিত্রতা ঈমানের অর্ধেক।", ref: "Muslim" },
    { arabic: "الْجَنَّةُ تَحْتَ أَقْدَامِ الْأُمَّهَاتِ", text_en: "Paradise lies at the feet of your mother.", text_bn: "মায়ের পায়ের নিচে জান্নাত।", ref: "Nasa'i" },
    { arabic: "الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ", text_en: "A strong believer is better and is more lovable to Allah than a weak believer.", text_bn: "দুর্বল মুমিনের চেয়ে শক্তিশালী মুমিন আল্লাহর কাছে উত্তম এবং অধিক প্রিয়।", ref: "Muslim" },
    { arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", text_en: "Whoever believes in Allah and the Last Day should talk what is good or keep quiet.", text_bn: "যে আল্লাহ ও পরকালে বিশ্বাস করে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।", ref: "Bukhari" },
    { arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ", text_en: "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.", text_bn: "কুস্তিতে খুব শক্তিশালী হলেই বীর হওয়া যায় না; বরং সেই প্রকৃত বীর, যে রাগের সময় নিজেকে সামলে রাখতে পারে।", ref: "Bukhari" },
    { arabic: "عُودُوا الْمَرِيضَ، وَأَطْعِمُوا الْجَائِعَ، وَفُكُّوا الْعَانِيَ", text_en: "Visit the sick, feed the hungry, and set free the captives.", text_bn: "অসুস্থ ব্যক্তিকে দেখতে যাও, ক্ষুধার্তকে খাবার দাও এবং বন্দীকে মুক্ত করো।", ref: "Bukhari" },
    { arabic: "تَهَادَوْا تَحَابُّوا", text_en: "Give gifts to one another, you will love each other.", text_bn: "তোমরা একে অপরকে উপহার দাও, তাহলে তোমাদের মধ্যে ভালোবাসা সৃষ্টি হবে।", ref: "Bukhari" },
    { arabic: "أَكْمَلُ الْمُؤْمِنِينَ إِيمَانًا أَحْسَنُهُمْ خُلُقًا", text_en: "The most perfect man in his faith among the believers is the one whose behavior is most excellent.", text_bn: "মুমিনদের মধ্যে ঈমানে সেই পরিপূর্ণ, যার চরিত্র সবচেয়ে সুন্দর।", ref: "Tirmidhi" },
    { arabic: "إِمَاطَةُ الْأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ", text_en: "Removing harmful things from the road is an act of charity.", text_bn: "রাস্তা থেকে কষ্টদায়ক বস্তু সরিয়ে দেওয়াও একটি সাদাকা।", ref: "Bukhari" }
  ];

  const duas = [
    { arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ", text_en: "O Allah, You are my Lord... (Sayyidul Istighfar)", text_bn: "হে আল্লাহ! তুমিই আমার প্রতিপালক। তুমি ছাড়া কোনো ইলাহ নেই। তুমিই আমাকে সৃষ্টি করেছ এবং আমি তোমার বান্দা... (সাইয়্যিদুল ইস্তেগফার)", ref: "Bukhari" },
    { arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", text_en: "Our Lord! Give us in this world that which is good and in the Hereafter that which is good, and save us from the torment of the Fire.", text_bn: "হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দাও এবং আখেরাতেও কল্যাণ দাও এবং আমাদের আগুনের আজাব থেকে রক্ষা করো।", ref: "Al-Baqarah 2:201" },
    { arabic: "رَبِّ زِدْنِي عِلْمًا", text_en: "My Lord, increase me in knowledge.", text_bn: "হে আমার প্রতিপালক! আমার জ্ঞান বৃদ্ধি করে দাও।", ref: "Taha 20:114" },
    { arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", text_en: "My Lord, have mercy upon them [my parents] as they brought me up [when I was] small.", text_bn: "হে আমার রব! তাদের (পিতা-মাতা) প্রতি রহম করো, যেমন তারা শৈশবে আমাকে লালন-পালন করেছেন।", ref: "Al-Isra 17:24" },
    { arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", text_en: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.", text_bn: "হে আল্লাহ! আমি তোমার কাছে হেদায়েত, তাকওয়া, পবিত্রতা এবং সচ্ছলতা প্রার্থনা করছি।", ref: "Muslim" },
    { arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا", text_en: "Our Lord! Grant unto us wives and offspring who will be the comfort of our eyes, and give us (the grace) to lead the righteous.", text_bn: "হে আমাদের রব! আমাদের স্ত্রী ও সন্তানদের আমাদের চোখের শীতলতা বানিয়ে দাও এবং আমাদের মুত্তাকীদের নেতা বানিয়ে দাও।", ref: "Al-Furqan 25:74" },
    { arabic: "رَبَّنَا لاَ تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", text_en: "Our Lord! Let not our hearts deviate (from the truth) after You have guided us, and grant us mercy from You. Truly, You are the Bestower.", text_bn: "হে আমাদের রব! আমাদের হেদায়েত দেওয়ার পর আমাদের অন্তরকে বক্র করে দিও না এবং তোমার পক্ষ থেকে আমাদের রহমত দান করো।", ref: "Al-Imran 3:8" },
    { arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", text_en: "Allah (Alone) is Sufficient for us, and He is the Best Disposer of affairs.", text_bn: "আমাদের জন্য আল্লাহই যথেষ্ট এবং তিনি কতই না উত্তম কর্মবিধায়ক।", ref: "Al-Imran 3:173" },
    { arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", text_en: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.", text_bn: "তুমি ছাড়া কোনো মাবুদ নেই, তুমি পবিত্র মহান। নিশ্চয়ই আমি জালিমদের অন্তর্ভুক্ত ছিলাম।", ref: "Al-Anbiya 21:87" },
    { arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي", text_en: "O Allah, You are Forgiving and love forgiveness, so forgive me.", text_bn: "হে আল্লাহ! তুমি ক্ষমাশীল এবং ক্ষমাকে ভালোবাসো, তাই আমাকে ক্ষমা করো।", ref: "Tirmidhi" },
    { arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", text_en: "In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing.", text_bn: "আল্লাহর নামে, যার নামের বরকতে আকাশ ও জমিনের কোনো কিছুই ক্ষতি করতে পারে না, তিনি সর্বশ্রোতা ও সর্বজ্ঞ।", ref: "Abu Dawud" },
    { arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ", text_en: "In the name of Allah, I trust in Allah; there is no might and no power but in Allah.", text_bn: "আল্লাহর নামে, আল্লাহর ওপর ভরসা করলাম। আল্লাহর সাহায্য ছাড়া পাপ থেকে ফেরা এবং পুণ্য করার কোনো শক্তি নেই।", ref: "Abu Dawud" },
    { arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", text_en: "In Your Name, O Allah, I die and I live.", text_bn: "হে আল্লাহ! তোমার নামেই আমি মৃত্যুবরণ করি (ঘুমাই) এবং তোমার নামেই আমি জীবিত হই (জেগে উঠি)।", ref: "Bukhari" },
    { arabic: "بِسْمِ اللَّهِ", text_en: "In the name of Allah.", text_bn: "আল্লাহর নামে শুরু করছি।", ref: "Common" },
    { arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", text_en: "O Allah, I seek refuge in You from anxiety and sorrow.", text_bn: "হে আল্লাহ! আমি তোমার কাছে দুশ্চিন্তা ও শোক থেকে আশ্রয় চাই।", ref: "Bukhari" }
  ];

  const navLinks = [
    { id: 'home', label: "Home", action: () => setCurrentView('home') },
    { id: 'projects', label: "Projects", action: () => setCurrentView('projects') },
    { id: 'hadith', label: "Hadith & Dua", action: () => setCurrentView('hadith') },
    { id: 'about', label: "About", href: "#about" },
    { id: 'skills', label: "Skills", href: "#skills" },
    { id: 'contact', label: "Contact", href: "#contact" },
  ];

  const projects = [
    {
      title: "VIP VPS Auto Script",
      desc: "Powerful all-in-one script for managing SSH, VPNs, Xray, and Proxies with a clean UI.",
      lang: "Shell",
      stars: 0,
      url: "https://github.com/jubairbro/Premium"
    },
    {
      title: "Telegram Toolkit",
      desc: "Advanced toolkit for multi-account management, bulk messaging, and scraping on Telegram.",
      lang: "Python/Shell",
      stars: 0,
      url: "https://github.com/jubairbro/telegram"
    },
    {
      title: "VideoSensi",
      desc: "The ultimate Termux video tool: Compress, Watermark, and Convert videos instantly.",
      lang: "Shell",
      stars: 2,
      url: "https://github.com/jubairbro/VideoSensi"
    },
    {
      title: "Data Waster",
      desc: "High-speed network traffic generator for testing data consumption limits.",
      lang: "Web",
      stars: 0,
      url: "https://burn.jubairbro.store"
    }
  ];

  const skills = [
    { name: "Ubuntu", iconClass: "devicon-ubuntu-plain colored" },
    { name: "Windows", iconClass: "devicon-windows8-original colored" },
    { name: "Android", iconClass: "devicon-android-plain colored" },
    { name: "Python", iconClass: "devicon-python-plain colored" },
    { name: "JavaScript", iconClass: "devicon-javascript-plain colored" },
    { name: "HTML5", iconClass: "devicon-html5-plain colored" },
    { name: "CSS3", iconClass: "devicon-css3-plain colored" },
    { name: "Telegram Bot", iconClass: "custom-bot-icon" }, // Custom flag
  ];

  const languages = [
    { name: "Bengali", percent: 75, color: "bg-green-500" },
    { name: "Hindi", percent: 35, color: "bg-orange-500" },
    { name: "English", percent: 30, color: "bg-blue-500" },
    { name: "Urdu", percent: 20, color: "bg-teal-500" },
    { name: "Arabic", percent: 10, color: "bg-yellow-500" },
  ];

  const themes: { id: ThemeColor; color: string }[] = [
    { id: 'green', color: '#27ae60' },
    { id: 'blue', color: '#3b82f6' },
    { id: 'purple', color: '#8b5cf6' },
    { id: 'orange', color: '#f97316' },
    { id: 'cyan', color: '#06b6d4' },
  ];

  // --- Initialization Logic ---
  useEffect(() => {
    // Age Calculation
    const dob = new Date('2005-09-10');
    const today = new Date();
    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
    }
    setAge(calculatedAge);

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('themeMode');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
    
    const savedColor = localStorage.getItem('colorTheme') as ThemeColor;
    if (savedColor) {
      setActiveColor(savedColor);
    }
  }, []);

  // --- Theme Application ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('themeMode', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('themeMode', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    let colorValue = '39 174 96'; // Green default

    if (activeColor === 'blue') colorValue = '59 130 246';
    if (activeColor === 'purple') colorValue = '139 92 246';
    if (activeColor === 'orange') colorValue = '249 115 22';
    if (activeColor === 'cyan') colorValue = '6 182 212';

    root.style.setProperty('--color-primary', colorValue);
    localStorage.setItem('colorTheme', activeColor);
  }, [activeColor]);

  // --- Menu Scroll Lock ---
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = ''; 
    }
  }, [isMenuOpen]);

  // --- Audio Logic ---
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  // --- Animations & Swiper ---
  useEffect(() => {
    if (loading) return;

    // Initialize Swiper
    const swiperEl = document.querySelector('.mySwiper');
    if (swiperEl) {
      new Swiper('.mySwiper', {
        modules: [EffectCoverflow, Autoplay],
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        coverflowEffect: {
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
      });
    }

    // GSAP Animations
    const ctx = gsap.context(() => {
      // Reveal General Sections
      gsap.utils.toArray('.reveal').forEach((elem: any) => {
        gsap.from(elem, {
          y: 50,
          opacity: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
          },
        });
      });

      // Progress Bar Animation
      gsap.utils.toArray('.progress-bar').forEach((bar: any) => {
        const width = bar.dataset.width;
        gsap.to(bar, {
          width: width,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
          }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [loading, currentView]);

  const getCurrentYear = () => new Date().getFullYear();

  const handleNavClick = (link: any) => {
    setIsMenuOpen(false);
    if (link.action) {
      link.action();
    } else if (link.href) {
      if (currentView !== 'home') setCurrentView('home');
      setTimeout(() => {
        const el = document.querySelector(link.href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="https://github.com/jubairbro/Faw/raw/refs/heads/main/audio.mp3" />
      
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div ref={mainRef} className={`min-h-screen transition-colors duration-500 bg-gray-50 dark:bg-dark text-slate-800 dark:text-slate-200 cursor-none md:cursor-auto font-body`}>
          <CustomCursor />

          {/* Settings / Theme Panel (Floating) */}
          <div className={`fixed right-4 top-24 z-40 transition-transform duration-300 ${showSettings ? 'translate-x-0' : 'translate-x-[120%]'}`}>
             <div className="bg-white/90 dark:bg-card-dark/90 backdrop-blur-xl p-4 rounded-2xl border border-primary/20 shadow-2xl w-48">
                <div className="flex justify-between items-center mb-4">
                   <span className="font-bold font-display uppercase text-xs tracking-widest">Settings</span>
                   <button onClick={() => setShowSettings(false)} className="hover:text-primary"><X size={16}/></button>
                </div>
                
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-primary/10 transition-colors mb-4"
                >
                   <span className="text-xs font-bold">Theme</span>
                   {isDarkMode ? <Moon size={16} className="text-blue-400"/> : <Sun size={16} className="text-orange-500"/>}
                </button>

                <div className="flex flex-wrap gap-2 justify-center">
                   {themes.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setActiveColor(t.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${activeColor === t.id ? 'scale-110 ring-2 ring-primary' : 'hover:scale-110'}`}
                        style={{ backgroundColor: t.color }}
                      >
                         {activeColor === t.id && <Check size={12} className="text-white"/>}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="fixed right-4 top-24 z-30 p-2 bg-white/10 backdrop-blur rounded-full border border-white/10 shadow-lg hover:bg-primary hover:text-white transition-all interactive"
          >
             <Settings size={20} className={showSettings ? 'animate-spin' : ''} />
          </button>

          {/* Navbar */}
          <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 md:py-4 md:px-12 backdrop-blur-xl bg-white/70 dark:bg-dark/70 border-b border-gray-200/50 dark:border-white/5 transition-all duration-300">
            <a href="#" onClick={() => setCurrentView('home')} className="text-xl md:text-2xl font-bold font-display tracking-widest z-50 interactive group relative">
              JUBAIR<span className="text-primary group-hover:text-primary transition-colors duration-300">.</span>
            </a>
            
            <div className="flex items-center gap-4">
               <button 
                 onClick={toggleMusic}
                 className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all interactive active:scale-90"
               >
                  {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
               </button>

               <button 
                 onClick={() => setIsMenuOpen(!isMenuOpen)} 
                 className="z-50 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors interactive active:scale-95 duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                 aria-label="Toggle Menu"
               >
                 {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
               </button>
            </div>
          </nav>

          {/* Menu Overlay */}
          <div ref={menuRef} className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl transition-all duration-500 flex flex-col items-center justify-center ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
            <div className="flex flex-col items-center gap-6 mb-10 overflow-y-auto max-h-[80vh] w-full px-4">
              {navLinks.map((link) => (
                <button 
                  key={link.id}
                  onClick={() => handleNavClick(link)}
                  className="menu-item text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-all duration-300 interactive hover:tracking-wide p-2 uppercase"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <main className="container mx-auto px-4 md:px-6 pt-24 min-h-screen">
            
            {/* View Switcher Logic */}
            {currentView === 'home' && (
              <>
                {/* Hero / Profile Section */}
                <section id="home" className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-between gap-10 relative pb-10">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] lg:w-[600px] h-[300px] lg:h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>

                  {/* Left: Bio Info */}
                  <div className="w-full lg:w-1/2 order-2 lg:order-1 z-10">
                    
                    {/* Language Graph (Top) */}
                    <div className="mb-8 bg-white/50 dark:bg-card-dark/50 backdrop-blur p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-lg reveal">
                        <div className="flex items-center gap-3 mb-6">
                           <Globe className="text-primary" size={24} />
                           <h3 className="text-lg font-bold font-display uppercase tracking-widest">Language Data</h3>
                        </div>
                        <div className="space-y-5">
                           {languages.map((lang, idx) => (
                             <div key={idx}>
                                <div className="flex justify-between text-xs font-bold mb-2 font-mono">
                                   <span>{lang.name}</span>
                                   <span className="text-primary">{lang.percent}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                                   <div 
                                    className={`h-full ${lang.color} progress-bar shadow-[0_0_10px_currentColor]`} 
                                    style={{ width: '0%' }}
                                    data-width={`${lang.percent}%`}
                                   ></div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                    {/* JSON Terminal (Responsive Light/Dark) */}
                    <div className="bg-gray-50 dark:bg-[#1e1e1e] p-6 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-2xl relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500 reveal text-left">
                       
                       <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-700 pb-3">
                          <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                             <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                             <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs font-mono">jubair_data.json</div>
                       </div>

                       <div className="font-mono text-sm md:text-base leading-relaxed overflow-x-auto whitespace-pre text-gray-800 dark:text-gray-300">
                          <span className="text-purple-600 dark:text-purple-400">const</span> <span className="text-yellow-600 dark:text-yellow-400">jubair</span> <span className="text-gray-800 dark:text-white">=</span> <span className="text-gray-600 dark:text-gray-300">{`{`}</span><br/>
                          &nbsp;&nbsp;<span className="text-sky-600 dark:text-sky-400">name</span>: <span className="text-green-600 dark:text-green-400">"Jubair Ahmad"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-600 dark:text-sky-400">rank</span>: <span className="text-orange-500 dark:text-orange-400">"Leader of Noobs"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-600 dark:text-sky-400">status</span>: <span className="text-red-500 dark:text-red-400">"404: Potential Not Found"</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-600 dark:text-sky-400">note</span>: <span className="text-green-600 dark:text-green-400">"I am nothing. Just a background process."</span>,<br/>
                          &nbsp;&nbsp;<span className="text-sky-600 dark:text-sky-400">interests</span>: <span className="text-gray-600 dark:text-gray-300">[</span><br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">"Coding"</span>, <span className="text-green-600 dark:text-green-400">"Gaming"</span>, <span className="text-green-600 dark:text-green-400">"Photography"</span><br/>
                          &nbsp;&nbsp;<span className="text-gray-600 dark:text-gray-300">]</span><br/>
                          <span className="text-gray-600 dark:text-gray-300">{`}`}</span>;
                       </div>
                    </div>
                  </div>

                  {/* Right: Image & Personal Details */}
                  <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col items-center lg:items-end relative">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 mb-8">
                       <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur-2xl opacity-50 animate-blob"></div>
                       <img 
                        src="https://raw.githubusercontent.com/jubairbro/Faw/refs/heads/main/photos/IMG_20250822_001904_975.jpg" 
                        alt="Jubair Ahmad"
                        className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl z-10 hover:rotate-3 transition-transform duration-500"
                       />
                       
                       <div className="absolute -top-4 -right-4 bg-white dark:bg-card-dark p-3 rounded-2xl shadow-xl z-20 animate-float border border-white/10">
                          <p className="font-serif text-primary font-bold text-lg leading-none">السلام عليكم</p>
                       </div>
                       <div className="absolute bottom-10 -left-8 bg-white dark:bg-card-dark p-3 rounded-2xl shadow-xl z-20 animate-float border border-white/10" style={{ animationDelay: '1s' }}>
                          <Code size={24} className="text-blue-500" />
                       </div>
                    </div>

                    {/* Personal Details Card */}
                    <div className="w-full max-w-md bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                       <div className="space-y-4 font-mono text-sm md:text-base relative z-10">
                          <div className="flex items-center gap-3">
                             <User className="text-primary" size={20} />
                             <span className="text-gray-400">Name:</span>
                             <span className="font-bold">Jᴜʙᴀɪʀ Aʜᴍᴀᴅ</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <Cake className="text-pink-500" size={20} />
                             <span className="text-gray-400">Age:</span>
                             <span className="font-bold">{age}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <BookOpen className="text-orange-500" size={20} />
                             <span className="text-gray-400">Profession:</span>
                             <span className="font-bold">Student</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <Heart className="text-green-500" size={20} />
                             <span className="text-gray-400">Religion:</span>
                             <span className="font-bold">Iꜱʟᴀᴍ</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <MapPin className="text-red-500" size={20} />
                             <span className="text-gray-400">City:</span>
                             <span className="font-bold">Netrokona, BD</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </section>

                {/* About / Core System Section */}
                <section id="about" className="py-24 reveal">
                  <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 flex items-center justify-center gap-4 uppercase tracking-wider">
                      <span className="w-8 md:w-12 h-[2px] bg-primary/50"></span>
                      System Specs
                      <span className="w-8 md:w-12 h-[2px] bg-primary/50"></span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Cpu size={20} className="text-orange-500"/> Core Beliefs</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                I am deeply passionate about continuous learning and believe that knowledge only becomes truly valuable when it is shared. This space is a reflection of my journey.
                            </p>
                        </div>
                        <div className="bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg hover:-translate-y-1 transition-all">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe size={20} className="text-blue-500"/> Future Goals</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                My primary goal is to build a life that is fulfilling... staying true to the values of faith. I aspire to make my mother proud by achieving my dreams.
                            </p>
                        </div>
                    </div>
                  </div>
                </section>

                {/* Skills Section */}
                <section id="skills" className="py-20 bg-gray-50/50 dark:bg-white/5 reveal">
                   <div className="container mx-auto px-6 max-w-5xl">
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 uppercase tracking-wider">Tech Arsenal</h2>
                      <div className="bg-white/40 dark:bg-card-dark/40 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/20 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                          <div className="stagger-container grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                            {skills.map((skill, idx) => (
                              <div key={idx} className="stagger-item bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all interactive group text-center cursor-pointer relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {skill.name === "Telegram Bot" ? (
                                    <div className="text-5xl group-hover:scale-110 transition-transform relative z-10 text-blue-400">
                                        <Bot size={48} />
                                    </div>
                                ) : (
                                    <i className={`${skill.iconClass} text-5xl group-hover:scale-110 transition-transform relative z-10`}></i>
                                )}
                                <h3 className="font-bold font-sans text-lg relative z-10 text-gray-800 dark:text-gray-200">{skill.name}</h3>
                              </div>
                            ))}
                          </div>
                      </div>
                   </div>
                </section>

                {/* Links Section */}
                <section id="links" className="py-20 reveal">
                   <div className="container mx-auto px-6 max-w-2xl">
                      <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 uppercase tracking-wider">Connect</h2>
                      <div className="flex flex-col gap-6">
                        <a href="https://t.me/+1p9RnexGMP0yOGVl" target="_blank" rel="noreferrer" className="flex items-center gap-6 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all interactive group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center text-3xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-md relative z-10">
                              <Send size={28} />
                           </div>
                           <div className="relative z-10">
                              <h3 className="text-2xl font-bold font-sans group-hover:text-primary transition-colors">Main Channel</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">Tech updates and resources.</p>
                           </div>
                           <ExternalLink className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                        </a>

                        <a href="https://t.me/JubairSensei" target="_blank" rel="noreferrer" className="flex items-center gap-6 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all interactive group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-500 flex items-center justify-center text-3xl group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-md relative z-10">
                              <Send size={28} />
                           </div>
                           <div className="relative z-10">
                              <h3 className="text-2xl font-bold font-sans group-hover:text-primary transition-colors">Second Channel</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">Updates and personal thoughts.</p>
                           </div>
                           <ExternalLink className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                        </a>

                        <a href="https://github.com/jubairbro" target="_blank" rel="noreferrer" className="flex items-center gap-6 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all interactive group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white flex items-center justify-center text-3xl group-hover:bg-black group-hover:text-white transition-all shadow-md relative z-10">
                              <Github size={28} />
                           </div>
                           <div className="relative z-10">
                              <h3 className="text-2xl font-bold font-sans group-hover:text-primary transition-colors">GitHub</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">All my open-source projects.</p>
                           </div>
                           <ExternalLink className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                        </a>

                        <a href="https://youtube.com/@jubairsensei" target="_blank" rel="noreferrer" className="flex items-center gap-6 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all interactive group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500 flex items-center justify-center text-3xl group-hover:bg-red-600 group-hover:text-white transition-all shadow-md relative z-10">
                              <Youtube size={28} />
                           </div>
                           <div className="relative z-10">
                              <h3 className="text-2xl font-bold font-sans group-hover:text-primary transition-colors">YouTube</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">Tutorials and Tricks.</p>
                           </div>
                           <ExternalLink className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                        </a>

                        <a href="https://fb.com/jubair.py" target="_blank" rel="noreferrer" className="flex items-center gap-6 bg-white/90 dark:bg-card-dark/90 backdrop-blur-md p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-xl hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all interactive group relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-600/20 text-blue-600 flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md relative z-10">
                              <Facebook size={28} />
                           </div>
                           <div className="relative z-10">
                              <h3 className="text-2xl font-bold font-sans group-hover:text-primary transition-colors">Facebook</h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm font-mono mt-1">Personal profile.</p>
                           </div>
                           <ExternalLink className="absolute top-6 right-6 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                        </a>
                      </div>
                   </div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="pt-12 pb-4 reveal border-t border-gray-100 dark:border-white/5">
                   <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center uppercase tracking-wider">Visuals</h2>
                   <div className="swiper mySwiper w-full py-8">
                    <div className="swiper-wrapper">
                      {galleryImages.map((img, idx) => (
                        <div key={idx} className="swiper-slide rounded-2xl overflow-hidden shadow-2xl border-[4px] border-white dark:border-gray-800 interactive transform hover:scale-105 transition-transform duration-500 group" style={{ width: '300px', height: '300px' }}>
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                
                {/* Contact Footer */}
                <section id="contact" className="py-20 text-center reveal">
                   <div className="bg-gradient-to-br from-primary/5 to-transparent dark:from-white/5 dark:to-transparent rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-primary/10 backdrop-blur-sm mx-4">
                     <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 uppercase tracking-wider">Say Hello</h2>
                     <div className="flex flex-wrap justify-center gap-6">
                        <a href="https://t.me/JubairZ" className="flex items-center gap-3 bg-white dark:bg-card-dark px-8 py-4 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all interactive transform hover:scale-105">
                          <Send size={24} /> <span className="font-bold text-lg">@JubairZ</span>
                        </a>
                     </div>
                   </div>
                </section>
              </>
            )}

            {/* Projects View */}
            {currentView === 'projects' && (
               <section id="projects-page" className="py-20 animate-pop-in">
                  <div className="text-center mb-16">
                     <button onClick={() => setCurrentView('home')} className="mb-8 text-gray-500 hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors interactive font-bold uppercase tracking-wider hover:underline">
                        <ArrowUp className="rotate-[-90deg]" size={20} /> Back to Home
                     </button>
                     <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 uppercase tracking-tighter">Featured Projects</h2>
                     <p className="text-gray-500 font-sans max-w-2xl mx-auto">
                        A collection of tools and scripts I've tinkered with.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {projects.map((project, idx) => (
                      <div key={idx} className="bg-white dark:bg-card-dark rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-all hover:-translate-y-2 group interactive relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <Code size={28} />
                           </div>
                           <a href={project.url} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm">
                              <ExternalLink size={20} />
                           </a>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors relative z-10 font-display">{project.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 relative z-10 leading-relaxed font-sans">
                          {project.desc}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100 dark:border-white/5 relative z-10">
                           <span className="text-sm font-mono text-primary bg-primary/10 px-3 py-1 rounded-lg">
                             {project.lang}
                           </span>
                           <div className="flex items-center gap-4 text-gray-400 text-sm">
                              <span className="flex items-center gap-1">
                                <Star size={16} className="text-yellow-500" /> {project.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork size={16} className="text-blue-500" /> 0
                              </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-16 text-center">
                     <div className="inline-block p-6 bg-white/50 dark:bg-card-dark/50 backdrop-blur rounded-2xl border border-dashed border-gray-300 dark:border-white/20">
                        <p className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-4">More Projects Coming Soon...</p>
                        <a href="https://github.com/jubairbro" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-primary/50 transition-all hover:-translate-y-1">
                           <Github size={20} /> View all on GitHub
                        </a>
                     </div>
                  </div>
               </section>
            )}

            {/* Hadith & Dua View */}
            {currentView === 'hadith' && (
               <section id="hadith-page" className="py-20 animate-pop-in">
                  <div className="text-center mb-16">
                     <button onClick={() => setCurrentView('home')} className="mb-8 text-gray-500 hover:text-primary flex items-center justify-center gap-2 mx-auto transition-colors interactive font-bold uppercase tracking-wider hover:underline">
                        <ArrowUp className="rotate-[-90deg]" size={20} /> Back to Home
                     </button>
                     <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 uppercase tracking-tighter text-primary">Hadith & Dua</h2>
                     <p className="text-gray-500 font-sans max-w-2xl mx-auto mb-8">
                        Pearls of wisdom and reminders for the soul.
                     </p>

                     {/* Controls */}
                     <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        {/* Type Toggle */}
                        <div className="flex bg-gray-200 dark:bg-white/10 p-1 rounded-full">
                            <button 
                              onClick={() => setHadithTab('hadith')}
                              className={`px-6 py-2 rounded-full font-bold transition-all ${hadithTab === 'hadith' ? 'bg-white dark:bg-card-dark shadow-md text-primary' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                            >
                              Hadith
                            </button>
                            <button 
                              onClick={() => setHadithTab('dua')}
                              className={`px-6 py-2 rounded-full font-bold transition-all ${hadithTab === 'dua' ? 'bg-white dark:bg-card-dark shadow-md text-primary' : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'}`}
                            >
                              Dua
                            </button>
                        </div>

                        {/* Lang Toggle */}
                        <div className="flex items-center gap-3 bg-gray-200 dark:bg-white/10 px-4 py-2 rounded-full">
                           <Languages size={18} className="text-gray-500" />
                           <button 
                             onClick={() => setLangMode('bn')} 
                             className={`text-sm font-bold transition-colors ${langMode === 'bn' ? 'text-primary' : 'text-gray-500'}`}
                           >
                             BN
                           </button>
                           <span className="text-gray-400">|</span>
                           <button 
                             onClick={() => setLangMode('en')} 
                             className={`text-sm font-bold transition-colors ${langMode === 'en' ? 'text-primary' : 'text-gray-500'}`}
                           >
                             EN
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="max-w-4xl mx-auto space-y-8">
                    {hadithTab === 'hadith' && hadiths.map((h, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-card-dark/80 backdrop-blur p-8 rounded-3xl border border-primary/20 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group animate-pop-in" style={{ animationDelay: `${idx * 100}ms` }}>
                         <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                         <div className="absolute right-4 top-4 opacity-10">
                            <ScrollText size={100} />
                         </div>
                         
                         <p className="text-2xl md:text-4xl text-right font-serif mb-6 leading-relaxed text-gray-800 dark:text-gray-200" dir="rtl">
                           {h.arabic}
                         </p>
                         <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 ${langMode === 'bn' ? 'font-body' : 'font-sans italic'} mb-4`}>
                           "{langMode === 'bn' ? h.text_bn : h.text_en}"
                         </p>
                         <p className="text-sm font-bold text-primary uppercase tracking-widest font-display">
                           — {h.ref}
                         </p>
                      </div>
                    ))}

                    {hadithTab === 'dua' && duas.map((d, idx) => (
                      <div key={idx} className="bg-white/80 dark:bg-card-dark/80 backdrop-blur p-8 rounded-3xl border border-green-500/20 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group animate-pop-in" style={{ animationDelay: `${idx * 100}ms` }}>
                         <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                         <div className="absolute right-4 top-4 opacity-10 text-green-500">
                            <Hand size={100} />
                         </div>
                         
                         <p className="text-2xl md:text-4xl text-right font-serif mb-6 leading-relaxed text-gray-800 dark:text-gray-200" dir="rtl">
                           {d.arabic}
                         </p>
                         <p className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 ${langMode === 'bn' ? 'font-body' : 'font-sans italic'} mb-4`}>
                           "{langMode === 'bn' ? d.text_bn : d.text_en}"
                         </p>
                         <p className="text-sm font-bold text-green-500 uppercase tracking-widest font-display">
                           — {d.ref}
                         </p>
                      </div>
                    ))}
                  </div>
               </section>
            )}

          </main>

          {/* Footer */}
          <footer className="text-center py-8 text-gray-500 text-sm border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-dark mt-0 font-mono">
            <p className="flex items-center justify-center gap-2">
              <span>&copy; {getCurrentYear()} Jubair Ahmad.</span>
            </p>
          </footer>
        </div>
      )}
    </>
  );
};

export default App;