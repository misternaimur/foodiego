"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import {
  ChefHat, Star, ShoppingBag, TrendingUp, MapPin, Clock, Phone, Edit3, Camera, CheckCircle2, ShieldCheck, Sparkles, Utensils, Plus, Share2, Sliders, Volume2, VolumeX, Save, X, Award, Info, MessageSquare, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight,
} from "lucide-react";
import { uploadImage } from "@/app/(public)/actions/upload";
import { useVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendorProfile";

interface SoundEngine {
  ctx: AudioContext | null;
  enabled: boolean;
  init(): void;
  playPop(): void;
  playClick(): void;
}
class SoundEngineImpl implements SoundEngine {
  ctx: AudioContext | null;
  enabled: boolean;
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(340, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.07);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch (e) {
      console.error(e);
    }
  }
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }
}

const sounds = new SoundEngineImpl();

const Interactive3DScene = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    interface Item {
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      floatSpeed: number;
      initialY: number;
    }
    const items: Item[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.TorusGeometry(1, 0.35, 16, 100),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.DodecahedronGeometry(0.9, 0),
    ];
    const colors = [0xea580c, 0xf59e0b, 0x10b981, 0x3b82f6, 0x8b5cf6, 0xf43f5e];
    for (let i = 0; i < 22; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshPhysicalMaterial({
        color: color,
        metalness: 0.2,
        roughness: 0.15,
        transmission: 0.85,
        opacity: 0.8,
        transparent: true,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: Math.random() > 0.7,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.x = (Math.random() - 0.5) * 38;
      mesh.position.y = (Math.random() - 0.5) * 24;
      mesh.position.z = (Math.random() - 0.5) * 16 - 4;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      const scale = 0.5 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);
      group.add(mesh);
      items.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.012,
        floatSpeed: 0.004 + Math.random() * 0.008,
        initialY: mesh.position.y,
      });
    }
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);
    const pointLight = new THREE.PointLight(0xea580c, 3.5, 35);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      mouseY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      group.rotation.y = targetX * 0.25;
      group.rotation.x = -targetY * 0.25;
      items.forEach((item, idx) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y = item.initialY + Math.sin(elapsedTime * 1.5 + idx) * 0.5;
      });
      renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50" />
  );
};

interface Metric3DProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  subtext: string;
  glowColor: string;
  accentGradient: string;
}

const Metric3DCard = ({ title, value, icon: Icon, subtext, glowColor, accentGradient }: Metric3DProps) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = -((y - centerY) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    sounds.playPop();
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => sounds.playClick()}
      style={{ perspective: "1000px" }}
      className="cursor-pointer group"
    >
      <div
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? "20px" : "0px"})`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out, box-shadow 0.5s ease-out",
        }}
        className="relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl border border-white/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 shadow-xl hover:shadow-2xl transition-all duration-300 transform-gpu"
      >
        <div className={`absolute -right-10 -top-10 w-36 h-36 rounded-full blur-3xl opacity-30 group-hover:opacity-75 transition-opacity duration-500 ${glowColor}`} />
        <div className="flex items-center gap-4 relative z-10">
          <div className={`p-4 rounded-2xl ${accentGradient} text-white shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-white tracking-tight">{value}</h4>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5">{title}</p>
            {subtext && (
              <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{subtext}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface Live3DBillboardProps {
  dishes: Dish[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onToggleAvailability: (id: number) => void;
  onEditDish: (dish: Dish) => void;
  availability: Record<number, boolean>;
  isPaused: boolean;
}

const Live3DBillboard = ({ dishes, currentIndex, onPrev, onNext, onToggleAvailability, onEditDish, availability, isPaused }: Live3DBillboardProps) => {
  if (dishes.length === 0) {
    return (
      <div className="rounded-3xl p-12 bg-slate-900/90 border border-slate-700 shadow-2xl text-center text-white">
        <p className="text-slate-400">No dishes in this category.</p>
      </div>
    );
  }

  const dish = dishes[currentIndex];
  const isAvailable = availability[dish.id] !== false;
  const popularity = Math.min(90, Math.round(parseFloat(dish.rating) * 20));

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-slate-900/90 text-white border border-slate-700 shadow-2xl"
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">LIVE FEATURED SPECIAL</span>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8">
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-full max-w-xs aspect-square">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
            >
              {dish.image ? (
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                  <span className="text-4xl">🍽️</span>
                </div>
              )}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
                {dish.badge}
              </span>
            </motion.div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-black text-amber-400">{dish.price}</span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-bold">
              <Star className="w-4 h-4 fill-current" />{dish.rating}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: 15, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <h3 className="text-3xl font-black tracking-tight">{dish.name}</h3>
              <p className="text-sm text-slate-300 mt-1">
                Artisanal dish crafted with premium ingredients. Freshly prepared and highly rated by our customers.
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Popularity Score</span>
              <span className="text-amber-400 font-black">{popularity}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${popularity}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Orders Today:</span>
            <span className="font-black text-emerald-400">{Math.round(popularity * 12.8)}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Available:</span>
              <button
                onClick={() => onToggleAvailability(dish.id)}
                className="flex items-center"
              >
                {isAvailable ? (
                  <ToggleRight className="w-10 h-6 text-emerald-400" />
                ) : (
                  <ToggleLeft className="w-10 h-6 text-slate-500" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEditDish(dish)}
                className="p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors"
                title="Edit dish"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Dish {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: string;
  image: string;
  badge: string;
}

export default function RestaurantProfile() {
  const [profile, setProfile] = useState({
    name: "Abid Merchant",
    restaurantName: "Truffle House Kitchen",
    tagline: "Artisanal Fine Dining & Gourmet Fast Casual",
    accountType: "Verified Merchant",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80",
    phone: "+1 (555) 382-9102",
    email: "abid@foodiego.com",
    address: "742 Evergreen Terrace, Downtown Culinary District",
    hours: "10:00 AM - 11:00 PM (Mon-Sun)",
    isActive: true,
  });
  const [activeTab, setActiveTab] = useState("menu");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...profile });
  const [coverImage, setCoverImage] = useState(() => {
    if (typeof window === "undefined") return profile.cover;
    return localStorage.getItem("foodiego_cover_image") || profile.cover;
  });
  const [avatarImage, setAvatarImage] = useState(() => {
    if (typeof window === "undefined") return profile.avatar;
    return localStorage.getItem("foodiego_avatar_image") || profile.avatar;
  });
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { data: vendorProfile } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const saveImageToLocalStorage = (key: string, dataUrl: string) => {
    try {
      localStorage.setItem(key, dataUrl);
    } catch (err) {
      console.warn("localStorage save failed, using state only:", err);
    }
  };
  const [dishes, setDishes] = useState(() => {
    if (typeof window === "undefined") {
      return [
        { id: 2, name: "Artisan Wood-Fired Pizza", category: "Signature", price: "৳550", rating: "4.8", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", badge: "Chef Choice" },
        { id: 3, name: "Smoked Salmon Carpaccio", category: "Signature", price: "৳480", rating: "4.7", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", badge: "Fresh" },
      ];
    }
    try {
      const saved = localStorage.getItem("foodiego_dishes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Failed to load saved dishes:", err);
    }
    return [
      { id: 2, name: "Artisan Wood-Fired Pizza", category: "Signature", price: "৳550", rating: "4.8", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", badge: "Chef Choice" },
      { id: 3, name: "Smoked Salmon Carpaccio", category: "Signature", price: "৳480", rating: "4.7", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", badge: "Fresh" },
    ];
  });
  const [dishImageErrors, setDishImageErrors] = useState<Record<number, boolean>>({});
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [dishForm, setDishForm] = useState({
    name: "",
    category: "Signature",
    price: "",
    rating: "4.5",
    image: "",
    badge: "",
  });
  const [billboardIndex, setBillboardIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const [dishAvailability, setDishAvailability] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("foodiego_dishes", JSON.stringify(dishes));
    } catch (err) {
      console.warn("Failed to save dishes:", err);
    }
  }, [dishes]);

  const filteredDishes = selectedCategory === "All" ? dishes : dishes.filter((d) => d.category === selectedCategory);
  const validBillboardIndex = filteredDishes.length === 0 ? 0 : Math.min(billboardIndex, filteredDishes.length - 1);

  useEffect(() => {
    if (isAutoPlayPaused || filteredDishes.length <= 1) return;
    const timer = setInterval(() => {
      setBillboardIndex((prev) => (prev + 1) % filteredDishes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlayPaused, filteredDishes.length]);

  const handlePrevDish = () => {
    setBillboardIndex((prev) => (prev - 1 + filteredDishes.length) % filteredDishes.length);
    setIsAutoPlayPaused(true);
    setTimeout(() => setIsAutoPlayPaused(false), 10000);
  };

  const handleNextDish = () => {
    setBillboardIndex((prev) => (prev + 1) % filteredDishes.length);
    setIsAutoPlayPaused(true);
    setTimeout(() => setIsAutoPlayPaused(false), 10000);
  };

  const handleToggleAvailability = (dishId: number) => {
    setDishAvailability((prev) => ({
      ...prev,
      [dishId]: prev[dishId] === false ? true : false,
    }));
    showToast("Availability updated");
  };
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    sounds.playPop();
  };
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playPop();
    setProfile({ ...formData, avatar: avatarImage, cover: coverImage });
    setIsEditModalOpen(false);
    showToast("Profile details updated successfully!");
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    setCoverError(false);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setCoverImage(dataUrl);
        saveImageToLocalStorage("foodiego_cover_image", dataUrl);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "restaurants");
          const result = await uploadImage(formData);
          if (result.success) {
            await updateProfile.mutateAsync({ coverImage: result.data.secureUrl });
            setCoverImage(result.data.secureUrl);
            saveImageToLocalStorage("foodiego_cover_image", result.data.secureUrl);
          }
        } catch {
          // base64 already saved locally
        }
        setIsUploadingCover(false);
        showToast("Cover image saved!");
      };
      reader.onerror = () => {
        setCoverError(true);
        setIsUploadingCover(false);
        showToast("Failed to read image");
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingCover(false);
      setCoverError(true);
      showToast("Upload failed");
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    setAvatarError(false);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setAvatarImage(dataUrl);
        saveImageToLocalStorage("foodiego_avatar_image", dataUrl);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "avatars");
          const result = await uploadImage(formData);
          if (result.success) {
            await updateProfile.mutateAsync({ logoUrl: result.data.secureUrl });
            setAvatarImage(result.data.secureUrl);
            saveImageToLocalStorage("foodiego_avatar_image", result.data.secureUrl);
          }
        } catch {
          // base64 already saved locally
        }
        setIsUploadingAvatar(false);
        showToast("Avatar saved!");
      };
      reader.onerror = () => {
        setAvatarError(true);
        setIsUploadingAvatar(false);
        showToast("Failed to read image");
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingAvatar(false);
      setAvatarError(true);
      showToast("Upload failed");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Truffle House Kitchen",
      text: "Check out our restaurant on FoodieGo!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        showToast("Share canceled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Restaurant link copied to clipboard!");
      } catch {
        showToast("Unable to copy link");
      }
    }
  };

  const openAddDishModal = () => {
    setEditingDish(null);
    setDishForm({ name: "", category: "Signature", price: "", rating: "4.5", image: "", badge: "" });
    setIsAddDishOpen(true);
  };

  const openEditDishModal = (dish: Dish) => {
    setEditingDish(dish);
    setDishForm({
      name: dish.name,
      category: dish.category,
      price: dish.price,
      rating: dish.rating,
      image: dish.image,
      badge: dish.badge,
    });
    setIsAddDishOpen(true);
  };

  const closeDishModal = () => {
    setIsAddDishOpen(false);
    setEditingDish(null);
    setDishForm({ name: "", category: "Signature", price: "", rating: "4.5", image: "", badge: "" });
  };

  const handleDishFormChange = (field: string, value: string) => {
    setDishForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDishImageError = (dishId: number) => {
    setDishImageErrors((prev) => ({ ...prev, [dishId]: true }));
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name.trim() || !dishForm.price.trim()) {
      showToast("Name and price are required");
      return;
    }
    if (editingDish) {
      setDishes((prev) =>
        prev.map((d) =>
          d.id === editingDish.id
            ? { ...d, ...dishForm, price: dishForm.price.startsWith("৳") ? dishForm.price : `৳${dishForm.price}` }
            : d
        )
      );
      showToast("Dish updated successfully!");
    } else {
      const newDish: Dish = {
        id: Date.now(),
        name: dishForm.name.trim(),
        category: dishForm.category,
        price: dishForm.price.startsWith("৳") ? dishForm.price : `৳${dishForm.price}`,
        rating: dishForm.rating,
        image: dishForm.image,
        badge: dishForm.badge,
      };
      setDishes((prev) => [...prev, newDish]);
      showToast("New dish added!");
    }
    closeDishModal();
  };

  const handleDeleteDish = (dishId: number) => {
    setDishes((prev) => prev.filter((d) => d.id !== dishId));
    setDishImageErrors((prev) => {
      const next = { ...prev };
      delete next[dishId];
      return next;
    });
    showToast("Dish removed");
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative font-sans transition-colors duration-300 overflow-x-hidden">
      <Interactive3DScene />
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-amber-500/40 flex items-center gap-3 animate-bounce text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-white backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col">
          <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-slate-200">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              hidden
            />
            {coverError || !coverImage ? (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <ChefHat className="w-16 h-16 text-slate-400" />
              </div>
            ) : (
              <img
                src={coverImage}
                alt="Cover"
                className="h-52 w-full object-cover"
                onError={() => setCoverError(true)}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <button
              onClick={() => { coverInputRef.current?.click(); sounds.playPop(); }}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md text-white text-xs font-bold hover:bg-slate-950/80 transition-all flex items-center gap-1.5 border border-white/20"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isUploadingCover ? "Uploading..." : "Change Cover"}</span>
            </button>
          </div>
              <div className="bg-white rounded-b-2xl p-6 relative flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  <div className="relative group z-20 -mt-12 ml-6">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      hidden
                    />
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white relative ring-4 ring-white shadow-lg">
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-20">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                      {avatarError || !avatarImage ? (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                          <ChefHat className="w-10 h-10 text-slate-400" />
                        </div>
                      ) : (
                        <img src={avatarImage} alt={profile.name} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                      )}
                      <button
                        onClick={() => { avatarInputRef.current?.click(); sounds.playPop(); }}
                        className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                        title="Change avatar"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-3 ring-white" title="Store Status: OPEN" />
                  </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{profile.restaurantName}</h2>
                  <span className="inline-flex items-center gap-1 ml-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {profile.accountType}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {profile.tagline} • Manager: <strong className="text-slate-800">{profile.name}</strong>
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {profile.address}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> {profile.hours}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={handleShare} className="p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="Share Profile">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Manage Store</span>
              </button>
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Metric3DCard title="Total Orders" value="1,284" icon={ShoppingBag} subtext="+14% this month" glowColor="bg-blue-500" accentGradient="bg-gradient-to-tr from-blue-500 to-indigo-600" />
          <Metric3DCard title="Avg. Rating" value="4.8" icon={Star} subtext="Based on 490 reviews" glowColor="bg-amber-500" accentGradient="bg-gradient-to-tr from-amber-500 to-orange-600" />
          <Metric3DCard title="Active Menu Items" value="24" icon={Utensils} subtext="4 Specials Featured" glowColor="bg-emerald-500" accentGradient="bg-gradient-to-tr from-emerald-500 to-teal-600" />
          <Metric3DCard title="Monthly Growth" value="+18%" icon={TrendingUp} subtext="Top 5% in District" glowColor="bg-rose-500" accentGradient="bg-gradient-to-tr from-rose-500 to-red-600" />
        </section>
        <section className="rounded-3xl p-6 lg:p-8 bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
            {[
              { id: "menu", label: "Menu Showcase", icon: Utensils },
              { id: "info", label: "Store Information", icon: Info },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); sounds.playPop(); }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/30" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {activeTab === "menu" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="menu-content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-nowrap overflow-x-auto gap-2 p-2 pb-3 scrollbar-hide border-b border-slate-200">
                    {["All", "Signature"].map((cat) => (
                      <motion.button
                        key={cat}
                        layoutId="activeCategoryPill"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => { setSelectedCategory(cat); sounds.playPop(); }}
                        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          selectedCategory === cat ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={openAddDishModal}
                    className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5 self-end sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Dish</span>
                  </motion.button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {filteredDishes.map((dish) => (
                      <motion.div
                        key={dish.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60 hover:shadow-xl"
                      >
                        <div className="h-44 overflow-hidden relative">
                          {dishImageErrors[dish.id] || !dish.image ? (
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                              <Utensils className="w-12 h-12 text-amber-400" />
                            </div>
                          ) : (
                            <img
                              src={dish.image}
                              alt={dish.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={() => handleDishImageError(dish.id)}
                            />
                          )}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">{dish.badge}</span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">{dish.category}</span>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /><span>{dish.rating}</span></div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 truncate">{dish.name}</h4>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-base font-black text-slate-900">{dish.price}</span>
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => openEditDishModal(dish)}
                                className="p-2 rounded-xl bg-slate-200 hover:bg-amber-500 hover:text-white transition-colors"
                                title="Edit dish"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteDish(dish.id)}
                                className="p-2 rounded-xl bg-slate-200 hover:bg-rose-500 hover:text-white transition-colors"
                                title="Delete dish"
                              >
                                <X className="w-3.5 h-3.5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <Live3DBillboard
                  dishes={filteredDishes}
                  currentIndex={validBillboardIndex}
                  onPrev={handlePrevDish}
                  onNext={handleNextDish}
                  onToggleAvailability={handleToggleAvailability}
                  onEditDish={openEditDishModal}
                  availability={dishAvailability}
                  isPaused={isAutoPlayPaused}
                />
              </motion.div>
            </AnimatePresence>
          )}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /> Contact Details</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <p><strong>Phone:</strong> {profile.phone}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Support Hotline:</strong> +1 (800) 902-FOOD</p>
                </div>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Award className="w-4 h-4 text-emerald-500" /> Kitchen Compliance & Hygiene</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grade A Food Safety Certified</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Organic Sourced Ingredients</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((r) => (
                  <div key={r} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{r}★</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-amber-400" initial={{ width: 0 }} animate={{ width: `${[82, 10, 4, 2, 2][r - 1]}%` }} transition={{ duration: 0.8, delay: 0.2 * r }} />
                    </div>
                    <span className="w-6 text-right text-slate-400">{[82, 10, 4, 2, 2][r - 1]}%</span>
                  </div>
                ))}
              </div>
              {[
                { name: "Sarah M.", text: "The Truffle Wagyu Burger was out of this world! Fast delivery.", rating: 5, time: "2 hours ago" },
                { name: "David C.", text: "Exceptional wood-fired flavor. Great presentation.", rating: 5, time: "1 day ago" },
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/50 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{rev.name}</span>
                      <div className="flex text-amber-400">{[...Array(rev.rating)].map((_, r) => <Star key={r} className="w-3 h-3 fill-current" />)}</div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1">{rev.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{rev.time}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Edit3 className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Edit Restaurant Profile</h3>
                  <p className="text-xs text-slate-500">Update public merchant information</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Manager Name</label>
                <input type="text" value={formData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Restaurant Title</label>
                <input type="text" value={formData.restaurantName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, restaurantName: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Tagline</label>
                <input type="text" value={formData.tagline} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tagline: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"><Save className="w-4 h-4" /> Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isAddDishOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Utensils className="w-6 h-6" /></div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{editingDish ? "Edit Dish" : "Add New Dish"}</h3>
                    <p className="text-xs text-slate-500">{editingDish ? "Update dish details" : "Create a new menu item"}</p>
                  </div>
                </div>
                <button onClick={closeDishModal} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSaveDish} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Dish Name</label>
                  <input type="text" value={dishForm.name} onChange={(e) => handleDishFormChange("name", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" placeholder="e.g. Truffle Wagyu Burger" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Category</label>
                  <select value={dishForm.category} onChange={(e) => handleDishFormChange("category", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500">
                    <option>Signature</option>
                    <option>Pasta</option>
                    <option>Drinks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Price (৳)</label>
                  <input type="text" value={dishForm.price} onChange={(e) => handleDishFormChange("price", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" placeholder="e.g. 450" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Rating</label>
                  <input type="text" value={dishForm.rating} onChange={(e) => handleDishFormChange("rating", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" placeholder="e.g. 4.9" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Badge Label</label>
                  <input type="text" value={dishForm.badge} onChange={(e) => handleDishFormChange("badge", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" placeholder="e.g. Bestseller" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Image URL</label>
                  <input type="text" value={dishForm.image} onChange={(e) => handleDishFormChange("image", e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border-none text-xs font-semibold focus:ring-2 focus:ring-amber-500" placeholder="https://..." />
                </div>
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button type="button" onClick={closeDishModal} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"><Save className="w-4 h-4" /> {editingDish ? "Update Dish" : "Add Dish"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
