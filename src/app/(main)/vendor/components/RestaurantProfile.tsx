"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import {
  ChefHat, Star, ShoppingBag, TrendingUp, MapPin, Clock, Phone, Edit3, Camera, ShieldCheck, Sparkles, Utensils, Plus, Share2, Sliders, Volume2, VolumeX, Save, X, Info, MessageSquare, ToggleLeft, ToggleRight, ImagePlus,
} from "lucide-react";
import { uploadImage } from "@/app/(public)/actions/upload";
import {
  useVendorProfile,
  useUpdateVendorProfile,
  type RestaurantProfile as RestaurantProfileData,
} from "@/hooks/useVendorProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useMenuItems, useToggleMenuItem, type MenuItem } from "@/hooks/useVendorMenu";
import AddMenuItemModal from "@/app/(main)/vendor/components/AddMenuItemModal";

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

// ============================================================
// UPDATE (real-profile fix): everything below used to be hardcoded demo
// content - "Truffle House Kitchen", manager "Abid Merchant", a fixed
// address/phone, stat cards reading "1,284 orders"/"4.8", and a dish list
// kept only in this browser's localStorage. Cover and logo uploads were
// saved to localStorage too, so they never reached customers and reverted
// to stock photos elsewhere. The page now reads and writes the real
// Restaurant document (/api/v1/vendor/profile, including server-computed
// stats) and the real menu (/api/v1/vendor/menu). Cover/logo go through the
// same uploadImage action menu-item photos use, then get saved on the
// restaurant, and dishes are added/edited with the same modal as Menu
// Management.
// ============================================================

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function to12Hour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

function describeHours(profile: RestaurantProfileData): string {
  if (profile.openingTime && profile.closingTime) {
    return `${to12Hour(profile.openingTime)} - ${to12Hour(profile.closingTime)}`;
  }
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todays = profile.operatingHours?.find((h) => h.day === today);
  if (!todays) return "Hours not set";
  return todays.isOpen ? `Today ${to12Hour(todays.openTime)} - ${to12Hour(todays.closeTime)}` : "Closed today";
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface ProfileForm {
  name: string;
  ownerName: string;
  tagline: string;
  cuisineType: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  openingTime: string;
  closingTime: string;
  description: string;
}

function formFromProfile(profile: RestaurantProfileData): ProfileForm {
  return {
    name: profile.name,
    ownerName: profile.ownerName,
    tagline: profile.tagline,
    cuisineType: profile.cuisineType,
    phone: profile.phone,
    email: profile.email,
    website: profile.website,
    address: profile.address,
    openingTime: profile.openingTime,
    closingTime: profile.closingTime,
    description: profile.description,
  };
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-transparent text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500";

export default function RestaurantProfile() {
  const { data: profile, isLoading, isError } = useVendorProfile();
  const updateProfile = useUpdateVendorProfile();
  const { data: menuData, isLoading: isMenuLoading } = useMenuItems({ limit: 200 });
  const toggleMenuItem = useToggleMenuItem();
  const queryClient = useQueryClient();
  // Menu changes affect the "Active Menu Items" stat, which comes from the profile query.
  const refreshStats = () => queryClient.invalidateQueries({ queryKey: ["vendor-profile"] });

  const [activeTab, setActiveTab] = useState<"menu" | "info">("menu");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileForm | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dishModal, setDishModal] = useState<{ open: boolean; item: MenuItem | null }>({ open: false, item: null });
  const [uploading, setUploading] = useState<"cover" | "logo" | null>(null);
  // Local object-URL previews shown while an upload is in flight.
  const [previews, setPreviews] = useState<{ cover?: string; logo?: string }>({});
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const menuItems = menuData?.items ?? [];
  const categories = ["All", ...Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)))];
  const visibleItems = selectedCategory === "All" ? menuItems : menuItems.filter((i) => i.category === selectedCategory);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    sounds.playPop();
  };

  const handleImageSelected = async (kind: "cover" | "logo", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be picked again later
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      showToast("Image must be smaller than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [kind]: previewUrl }));
    setUploading(kind);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "restaurants");
      const result = await uploadImage(body);
      if (!result.success) {
        showToast(result.error);
        return;
      }
      await updateProfile.mutateAsync(
        kind === "cover" ? { coverImage: result.data.secureUrl } : { logoUrl: result.data.secureUrl }
      );
      setBrokenImages((prev) => ({ ...prev, [kind]: false }));
      showToast(kind === "cover" ? "Cover photo updated!" : "Profile photo updated!");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(null);
      setPreviews((prev) => ({ ...prev, [kind]: undefined }));
      URL.revokeObjectURL(previewUrl);
    }
  };

  const openEditModal = () => {
    if (!profile) return;
    setFormData(formFromProfile(profile));
    setFormError(null);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    if (!formData.name.trim()) {
      setFormError("Restaurant name is required");
      return;
    }
    setFormError(null);
    try {
      await updateProfile.mutateAsync({
        ...formData,
        name: formData.name.trim(),
        ownerName: formData.ownerName.trim(),
      });
      sounds.playPop();
      setIsEditModalOpen(false);
      showToast("Restaurant profile saved!");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Couldn't save your changes");
    }
  };

  const handleToggleItem = (item: MenuItem) => {
    toggleMenuItem.mutate(item._id, {
      onSuccess: () => {
        refreshStats();
        showToast(item.isActive ? `${item.name} hidden from customers` : `${item.name} is available again`);
      },
      onError: () => showToast("Couldn't update availability"),
    });
  };

  const handleShare = async () => {
    if (!profile) return;
    const url = `${window.location.origin}/restaurants/${slugify(profile.name)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: profile.name, text: `Order from ${profile.name} on FoodieGo!`, url });
      } catch {
        // user dismissed the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("Restaurant link copied to clipboard!");
    } catch {
      showToast("Unable to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-80 animate-pulse rounded-3xl bg-white/70" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-3xl bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <ChefHat className="mx-auto h-12 w-12 text-slate-400" />
        <h2 className="mt-4 text-lg font-bold text-slate-800">We couldn&apos;t load your restaurant profile</h2>
        <p className="mt-1 text-sm text-slate-500">Please refresh the page. If this keeps happening, contact support.</p>
      </div>
    );
  }

  const stats = profile.stats;
  const coverSrc = previews.cover || profile.coverImage;
  const logoSrc = previews.logo || profile.logoUrl;
  const isOpen = profile.storeStatus === "open";
  const growth = stats?.monthlyGrowth;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 relative font-sans transition-colors duration-300 overflow-x-hidden">
      <Interactive3DScene />
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-amber-500/40 flex items-center gap-3 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ============ Header: cover, logo, identity ============ */}
        <section className="relative overflow-hidden rounded-3xl bg-white backdrop-blur-xl border border-white/50 shadow-2xl flex flex-col">
          <div className="relative h-52 w-full overflow-hidden rounded-t-2xl bg-slate-200 sm:h-60">
            <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => handleImageSelected("cover", e)} hidden />
            {coverSrc && !brokenImages.cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URL from any image host
              <img
                src={coverSrc}
                alt={`${profile.name} cover`}
                className="h-full w-full object-cover"
                onError={() => setBrokenImages((prev) => ({ ...prev, cover: true }))}
              />
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-200 to-slate-100 text-slate-500 transition hover:text-slate-700"
              >
                <ImagePlus className="h-10 w-10" />
                <span className="text-xs font-bold">Upload a cover photo for your restaurant</span>
              </button>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
            {uploading === "cover" && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
            <button
              type="button"
              onClick={() => { coverInputRef.current?.click(); sounds.playPop(); }}
              disabled={uploading !== null}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md text-white text-xs font-bold hover:bg-slate-950/80 transition-all flex items-center gap-1.5 border border-white/20 disabled:opacity-60"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{uploading === "cover" ? "Uploading..." : profile.coverImage ? "Change Cover" : "Add Cover"}</span>
            </button>
          </div>

          <div className="bg-white rounded-b-2xl p-6 relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative group z-20 -mt-14 ml-2 w-fit">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => handleImageSelected("logo", e)} hidden />
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white relative ring-4 ring-white shadow-lg">
                  {uploading === "logo" && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-20">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {logoSrc && !brokenImages.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URL from any image host
                    <img
                      src={logoSrc}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={() => setBrokenImages((prev) => ({ ...prev, logo: true }))}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center text-3xl font-black text-amber-600">
                      {profile.name.charAt(0).toUpperCase() || <ChefHat className="w-10 h-10 text-slate-400" />}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { logoInputRef.current?.click(); sounds.playPop(); }}
                    disabled={uploading !== null}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-900/55 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                    title="Change profile photo"
                  >
                    <Camera className="w-6 h-6 text-white" />
                    <span className="text-[10px] font-bold text-white">{profile.logoUrl ? "Change" : "Upload"}</span>
                  </button>
                </div>
                <div
                  className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ring-3 ring-white ${isOpen ? "bg-emerald-500" : "bg-slate-400"}`}
                  title={isOpen ? "Store is open" : "Store is closed"}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center flex-wrap gap-2">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{profile.name || "Your restaurant"}</h2>
                  {profile.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                      <Clock className="w-3.5 h-3.5" /> {profile.status}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  {[profile.tagline, profile.cuisineType].filter(Boolean).join(" • ") || "Add a tagline so customers know what you serve"}
                  {profile.ownerName && (
                    <>
                      {" "}• Manager: <strong className="text-slate-800">{profile.ownerName}</strong>
                    </>
                  )}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {profile.address || "No address set"}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> {describeHours(profile)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button onClick={toggleSound} className="p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title={soundEnabled ? "Mute sounds" : "Unmute sounds"}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={handleShare} className="p-3 rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="Share restaurant page">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={openEditModal}
                className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Sliders className="w-4 h-4" />
                <span>Manage Store</span>
              </button>
            </div>
          </div>
        </section>

        {/* ============ Real stats ============ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Metric3DCard
            title="Total Orders"
            value={(stats?.totalOrders ?? 0).toLocaleString()}
            icon={ShoppingBag}
            subtext={`${stats?.ordersThisMonth ?? 0} this month`}
            glowColor="bg-blue-500"
            accentGradient="bg-gradient-to-tr from-blue-500 to-indigo-600"
          />
          <Metric3DCard
            title="Avg. Rating"
            value={stats && stats.reviewCount > 0 ? stats.avgRating.toFixed(1) : "—"}
            icon={Star}
            subtext={stats && stats.reviewCount > 0 ? `Based on ${stats.reviewCount} review${stats.reviewCount === 1 ? "" : "s"}` : "No reviews yet"}
            glowColor="bg-amber-500"
            accentGradient="bg-gradient-to-tr from-amber-500 to-orange-600"
          />
          <Metric3DCard
            title="Active Menu Items"
            value={String(stats?.activeMenuItems ?? 0)}
            icon={Utensils}
            subtext={`of ${stats?.totalMenuItems ?? 0} on your menu`}
            glowColor="bg-emerald-500"
            accentGradient="bg-gradient-to-tr from-emerald-500 to-teal-600"
          />
          <Metric3DCard
            title="Monthly Growth"
            value={growth === null || growth === undefined ? "—" : `${growth > 0 ? "+" : ""}${growth}%`}
            icon={TrendingUp}
            subtext={growth === null || growth === undefined ? "No orders last month to compare" : "Orders vs last month"}
            glowColor="bg-rose-500"
            accentGradient="bg-gradient-to-tr from-rose-500 to-red-600"
          />
        </section>

        {/* ============ Menu + store information ============ */}
        <section className="rounded-3xl p-6 lg:p-8 bg-white/80 backdrop-blur-xl border border-white/50 shadow-xl">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
            {[
              { id: "menu" as const, label: "Menu Showcase", icon: Utensils },
              { id: "info" as const, label: "Store Information", icon: Info },
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
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-nowrap overflow-x-auto gap-2 pb-1 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); sounds.playPop(); }}
                      className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                      {cat !== "All" && (
                        <span className="ml-1.5 opacity-60">{menuItems.filter((i) => i.category === cat).length}</span>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setDishModal({ open: true, item: null })}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1.5 self-end sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Dish</span>
                </button>
              </div>

              {isMenuLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                  <Utensils className="mx-auto h-10 w-10 text-slate-400" />
                  <p className="mt-3 text-sm font-bold text-slate-700">
                    {menuItems.length === 0 ? "Your menu is empty" : "No dishes in this category"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Add a dish with a photo so customers can start ordering.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {visibleItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className={`group relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/60 hover:shadow-xl ${item.isActive ? "" : "opacity-60"}`}
                      >
                        <div className="h-44 overflow-hidden relative">
                          {item.image && !brokenImages[item._id] ? (
                            // eslint-disable-next-line @next/next/no-img-element -- user-uploaded URL from any image host
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={() => setBrokenImages((prev) => ({ ...prev, [item._id]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                              <Utensils className="w-12 h-12 text-amber-400" />
                            </div>
                          )}
                          {!item.isActive && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 text-white">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider truncate">{item.category}</span>
                            {item.rating > 0 && (
                              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{item.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 truncate">{item.name}</h4>
                          {item.description && <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">{item.description}</p>}
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-base font-black text-slate-900">${(item.price ?? 0).toLocaleString()}</span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleToggleItem(item)}
                                className="p-1.5 rounded-xl transition-colors hover:bg-slate-200"
                                title={item.isActive ? "Mark unavailable" : "Mark available"}
                                aria-pressed={item.isActive}
                              >
                                {item.isActive ? (
                                  <ToggleRight className="w-6 h-6 text-emerald-500" />
                                ) : (
                                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                                )}
                              </button>
                              <button
                                onClick={() => setDishModal({ open: true, item })}
                                className="p-2 rounded-xl bg-slate-200 hover:bg-amber-500 hover:text-white transition-colors"
                                title="Edit dish"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Phone className="w-4 h-4 text-amber-500" /> Contact Details</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <p><strong>Phone:</strong> {profile.phone || "Not set"}</p>
                  <p><strong>Email:</strong> {profile.email || "Not set"}</p>
                  {profile.website && <p><strong>Website:</strong> {profile.website}</p>}
                  <p><strong>Address:</strong> {profile.address || "Not set"}</p>
                </div>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-500" /> About</h4>
                <p className="text-xs font-medium leading-relaxed text-slate-600">
                  {profile.description || "No description yet. Use Manage Store to tell customers what makes your kitchen special."}
                </p>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-blue-500" /> Delivery Settings</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-600">
                  <p><strong>Delivery fee:</strong> ${profile.deliveryFee}</p>
                  <p><strong>Minimum order:</strong> ${profile.minOrderValue}</p>
                  <p><strong>Store status:</strong> {isOpen ? "Open" : "Closed"}</p>
                </div>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/50">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> Opening Hours</h4>
                {profile.openingTime && profile.closingTime ? (
                  <p className="text-xs font-semibold text-slate-600">Every day: {describeHours(profile)}</p>
                ) : (
                  <ul className="space-y-1 text-xs font-semibold text-slate-600">
                    {profile.operatingHours.map((h) => (
                      <li key={h.day} className="flex justify-between">
                        <span>{h.day}</span>
                        <span>{h.isOpen ? `${to12Hour(h.openTime)} - ${to12Hour(h.closeTime)}` : "Closed"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ============ Edit profile ============ */}
      {isEditModalOpen && formData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500"><Edit3 className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Edit Restaurant Profile</h3>
                  <p className="text-xs text-slate-500">Customers see these details on your restaurant page</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2" aria-label="Close"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(
                [
                  ["name", "Restaurant name", "text"],
                  ["ownerName", "Manager / owner name", "text"],
                  ["tagline", "Tagline", "text"],
                  ["cuisineType", "Cuisine type", "text"],
                  ["phone", "Phone", "tel"],
                  ["email", "Email", "email"],
                  ["website", "Website", "text"],
                  ["address", "Address", "text"],
                  ["openingTime", "Opening time", "time"],
                  ["closingTime", "Closing time", "time"],
                ] as const
              ).map(([field, label, type]) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor={`rp-${field}`}>{label}</label>
                  <input
                    id={`rp-${field}`}
                    type={type}
                    value={formData[field]}
                    required={field === "name"}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1" htmlFor="rp-description">Description</label>
                <textarea
                  id="rp-description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {formError && <p className="sm:col-span-2 text-xs font-semibold text-rose-600">{formError}</p>}
              <div className="sm:col-span-2 pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200">Cancel</button>
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Same add/edit dish modal (with photo upload) as Menu Management */}
      <AddMenuItemModal
        open={dishModal.open}
        editItem={dishModal.item}
        onClose={() => {
          setDishModal({ open: false, item: null });
          refreshStats();
        }}
      />
    </div>
  );
}
