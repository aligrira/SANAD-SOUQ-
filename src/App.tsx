/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  Suspense,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Search,
  User,
  Filter,
  Globe,
  PlusCircle,
  Crown,
  Star,
  ShoppingBag,
  ShieldCheck,
  MessageCircle,
  Bot,
  Sparkles,
  Grid,
  List,
  Shirt,
  Baby,
  Car,
  Smartphone,
  Home,
  Coffee,
  PawPrint,
  Package,
  Laptop,
  Gift,
  BrainCircuit,
  X,
  Trash2,
  ChevronDown,
  Droplets,
  Mic,
  Tag,
  Facebook,
  Loader2,
  LogIn,
  Bell,
  Sliders,
  Percent,
  Headphones,
  Plus,
  Heart,
  MapPin,
} from "lucide-react";
import { Product, Story } from "./types";
import { safeStorage } from "./lib/safeStorage";
import { cleanUndefined, generateUUID } from "./lib/utils";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  getDoc,
  where,
  writeBatch,
  limit,
} from "firebase/firestore";
import { db, messaging } from "./firebase";
import { CATEGORIES_DATA, getSubcategoriesForMain } from "./categoriesData";
// Removed initialProducts import
// Removed CursorGlow import
import VipStoriesRow from "./components/VipStoriesRow";
import BroadcastMarquee, {
  BroadcastMessage,
} from "./components/BroadcastMarquee";
import ListingCard from "./components/ListingCard";
import VipAdSlider from "./components/VipAdSlider";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, currentUserPhone?: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUserPhone || "anonymous",
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const ICON_COMPONENTS: Record<string, React.ComponentType<any>> = {
  Grid,
  Shirt,
  User,
  Baby,
  Star,
  Droplets,
  Car,
  Home,
  Smartphone,
  Package,
  Laptop,
  Gift,
  Coffee,
  PawPrint,
  Sparkles,
  ChevronDown,
};

import StateModal from "./components/StateModal";
import AdminPanel from "./components/AdminPanel";
import ProfileModal from "./components/ProfileModal";
import AddProductModal from "./components/AddProductModal";
import ProductDetailsModal from "./components/ProductDetailsModal";
import PricingPackages from "./components/PricingPackages";
import PaymentModal from "./components/PaymentModal";
import StoryViewerModal from "./components/StoryViewerModal";

import AuthModal from "./components/AuthModal";

import PublishingTransition from "./components/PublishingTransition";
import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";
import ListingSkeleton from "./components/ListingSkeleton";
import EmptyState from "./components/EmptyState";
import Toast from "./components/Toast";
import confetti from "canvas-confetti";

import Footer from "./components/Footer";
import MenuModal from "./components/MenuModal";
import {
  playLoginSound,
  playListingSound,
  playSubscriptionClapSound,
} from "./lib/audioEffects";
import DebugView from "./components/DebugView";

// Fallback loader for Suspense
const ModalFallback = () => (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border border-gray-800 shadow-2xl">
      <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
      <p className="text-gray-400 text-sm font-display">جاري التحميل...</p>
    </div>
  </div>
);

// No more dummy stories or products
// Using real data from Firestore

const CATEGORIES = [
  "الكل",
  "ملابس رجال",
  "ملابس نساء",
  "ملابس اطفال",
  "ماكياج و اكسسوارات",
  "عطورات",
  "عقارات",
  "سيارات و دراجات",
  "إلكترونيات",
  "أثاث",
  "أدوات منزلية",
  "حيوانات",
  "تحف و هدايا",
  "اخرى",
];
const REGIONS = [
  "الكل",
  "أريانة",
  "باجة",
  "بن عروس",
  "بنزرت",
  "تطاوين",
  "توزر",
  "تونس",
  "جندوبة",
  "زغوان",
  "سليانة",
  "سوسة",
  "سيدي بوزيد",
  "صفاقس",
  "قابس",
  "قبلي",
  "القصرين",
  "قفصة",
  "القيروان",
  "الكاف",
  "مدنين",
  "المنستير",
  "منوبة",
  "المهدية",
  "نابل",
];

export default function App() {
  const [showDebugPage, setShowDebugPage] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.location) {
        return (
          window.location.pathname === "/debug" ||
          window.location.pathname === "debug" ||
          new URLSearchParams(window.location.search).get("page") === "debug"
        );
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const triggerHaptic = (pattern: number | number[]) => {
    try {
      if (
        typeof window !== "undefined" &&
        navigator &&
        typeof navigator.vibrate === "function"
      ) {
        navigator.vibrate(pattern);
      }
    } catch (err) {
      console.warn("Haptic feedback is not supported or blocked:", err);
    }
  };

  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(
    () => {
      return safeStorage.getItem("sanad_current_user_phone");
    },
  );
  const [currentUserPlan, setCurrentUserPlan] = useState<
    "free" | "bronze" | "vip"
  >(() => {
    const saved = safeStorage.getItem("sanad_current_user_plan");
    return (saved as "free" | "bronze" | "vip") || "free";
  });
  const [loggedUserObj, setLoggedUserObj] = useState<any>(() => {
    try {
      const saved = safeStorage.getItem("sanad_current_user_obj");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [systemRequests, setSystemRequests] = useState<any[]>(() => {
    try {
      const saved = safeStorage.getItem("sanad_system_requests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Automatically reset subcategory when main category changes
  useEffect(() => {
    setSelectedSubCategory("");
  }, [selectedCategory]);

  useEffect(() => {
    setProductsLoaded(false);

    const q = query(collection(db, "products"));

    const unsubProducts = onSnapshot(
      q as any,
      (snapshot: any) => {
        console.log(
          "SanadSouq: Real-time listener received snapshot of products: size",
          snapshot.size,
        );
        if (
          typeof window !== "undefined" &&
          (window as any).__sanadDiagnostics
        ) {
          (window as any).__sanadDiagnostics.productsSnapshotCount =
            snapshot.size;
          (window as any).__sanadDiagnostics.realtimeSyncSuccess = true;
          (window as any).__sanadDiagnostics.connectionStatus =
            `Syncing real-time products. Snapshot count: ${snapshot.size}`;
          (window as any).__sanadDiagnostics.lastUpdate =
            new Date().toISOString();
        }
        let prods: Product[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            const data = doc.data();
            const mainCat = data.mainCategory || data.category || "اخرى";
            const subCat = data.subCategory || "";
            prods.push({
              id: doc.id,
              ...data,
              mainCategory: mainCat,
              subCategory: subCat,
              category: data.category || mainCat,
            } as Product);
          });
        }

        const sorted = prods.sort((a, b) => {
          const tA = new Date(a.createdAt).getTime();
          const tB = new Date(b.createdAt).getTime();
          return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        });

        // Check for newly added products to trigger favorite category notifications
        if (productsRef.current.length > 0) {
          const previousIds = new Set(productsRef.current.map((p) => p.id));
          const newProducts = sorted.filter((p) => !previousIds.has(p.id));

          // Get already notified IDs from local storage to prevent repeats
          const notifiedIds = new Set<string>(JSON.parse(safeStorage.getItem("sanad_notified_ads") || "[]"));

          newProducts.forEach((item) => {
            const createdTime = new Date(item.createdAt).getTime();
            // Added within recent time after app opened and not uploaded by this user themselves
            if (
              createdTime > appOpenTimeRef.current - 120000 &&
              item.sellerId !== safeStorage.getItem("sanad_current_user_phone") &&
              !notifiedIds.has(item.id)
            ) {
              const isFavorite =
                favoriteCategoriesRef.current.includes(item.category) ||
                favoriteCategoriesRef.current.includes(item.mainCategory);
              if (isFavorite) {
                // Add to notified set immediately
                notifiedIds.add(item.id);
                safeStorage.setItem("sanad_notified_ads", JSON.stringify(Array.from(notifiedIds)));

                // 1. Core Native Browser Notification
                if (
                  typeof window !== "undefined" &&
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  new Notification("🔔 إعلان جديد في أقسامك المفضلة!", {
                    body: `تم إضافة "${item.title}" في قسم: ${item.subCategory || item.category} بسعر ${item.price} د.ت`,
                    icon: "/apple-touch-icon.png",
                  });
                }

                // 2. Add to local userNotifications array
                const customNotifId = "fcm-" + item.id + "-" + Date.now();
                const pushNotif = {
                  id: customNotifId,
                  userPhone:
                    safeStorage.getItem("sanad_current_user_phone") ||
                    "visitor",
                  message: `🎯 إشعار الأقسام المفضلة: تم إضافة إعلان جديد في قسم "${item.subCategory || item.category}"! المنتج: "${item.title}" بسعر ${item.price} د.ت. اضغط هنا للمعاينة الفورية!`,
                  read: false,
                  createdAt: new Date().toISOString(),
                  productId: item.id,
                };

                setUserNotifications((prev) => {
                  if (
                    prev.some(
                      (n) =>
                        n.productId === item.id && n.message.includes("🎯"),
                    )
                  )
                    return prev;
                  const updated = [pushNotif, ...prev];
                  safeStorage.setItem(
                    "sanad_user_notifications",
                    JSON.stringify(updated),
                  );
                  return updated;
                });

                // 3. Play elegant notification chime sound
                try {
                  const audio = new Audio(
                    "https://assets.mixkit.co/active_storage/sfx/1423/1423-84.wav",
                  );
                  audio.volume = 0.4;
                  audio.play().catch(() => {});
                } catch (soundErr) {
                  console.warn("Could not play chime:", soundErr);
                }

                // 4. Trigger premium in-app Live Product Alert modal
                setLiveProductAlert({
                  title: item.title,
                  category: item.subCategory || item.category,
                  price: item.price,
                  product: item,
                });
              }
            }
          });
        }

        setProducts(sorted);
        productsRef.current = sorted;
        setProductsLoaded(true);

        const searchParams = new URLSearchParams(window.location.search);
        const initialAdId = searchParams.get("ad");
        if (initialAdId) {
          const ad = sorted.find((p) => p.id === initialAdId);
          if (ad) {
            setSelectedProduct((prev) => (prev ? prev : ad));
          }
        }
      },
      (error: any) => {
        console.error(
          "SanadSouq: Failed to sync products via onSnapshot. Error message:",
          error?.message || error,
        );
        if (
          typeof window !== "undefined" &&
          (window as any).__sanadDiagnostics
        ) {
          (window as any).__sanadDiagnostics.firestoreError =
            error?.message || String(error);
          (window as any).__sanadDiagnostics.connectionStatus =
            `Syncing failed: ${error?.message || error}`;
          (window as any).__sanadDiagnostics.lastUpdate =
            new Date().toISOString();
        }
        setProductsLoaded(true);
      },
    );

    return () => unsubProducts();
  }, []);

  useEffect(() => {
    let unsubUsers = () => {};
    let unsubRequests = () => {};
    let unsubBroadcasts = () => {};

    // 1. Always listen to public broadcasts in real-time
    unsubBroadcasts = onSnapshot(
      collection(db, "broadcasts"),
      (snapshot) => {
        const msgs: BroadcastMessage[] = [];
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as BroadcastMessage);
        });
        msgs.sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || ""),
        );
        setBroadcastQueue(msgs);
      },
      (error) => {
        console.error("Failed to sync broadcasts:", error);
      },
    );

    // 2. Identity-Optimized Subscriptions
    if (!currentUserPhone) {
      // Visitor Mode: Instantly ready, fetch nothing
      setSystemUsers([]);
      setSystemRequests([]);
      setUsersLoaded(true);
    } else if (currentUserPhone === "92942482") {
      // Admin Mode: Listen to all users and upgrade requests for dashboard management
      unsubUsers = onSnapshot(
        collection(db, "systemUsers"),
        (snapshot) => {
          const users: any[] = [];
          snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
          });
          setSystemUsers(users);
          setUsersLoaded(true);
        },
        (error) => {
          console.error("Admin: Listen users failed:", error);
          setUsersLoaded(true);
        },
      );

      unsubRequests = onSnapshot(
        collection(db, "systemRequests"),
        (snapshot) => {
          const reqs: any[] = [];
          snapshot.forEach((doc) => {
            reqs.push({ id: doc.id, ...doc.data() });
          });
          setSystemRequests(reqs);
        },
        (error) => {
          console.error("Admin: Failed to sync systemRequests:", error);
        },
      );
    } else {
      // Regular User Mode: Highly isolated single-document listener for optimal performance
      unsubUsers = onSnapshot(
        doc(db, "systemUsers", currentUserPhone),
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setSystemUsers([{ id: docSnapshot.id, ...docSnapshot.data() }]);
          } else {
            setSystemUsers([]);
          }
          setUsersLoaded(true);
        },
        (error) => {
          console.error("Regular: Listen user doc failed:", error);
          setUsersLoaded(true);
        },
      );

      unsubRequests = onSnapshot(
        query(collection(db, "systemRequests"), where("phone", "==", currentUserPhone)),
        (snapshot) => {
          const reqs: any[] = [];
          snapshot.forEach((doc) => {
            reqs.push({ id: doc.id, ...doc.data() });
          });
          setSystemRequests(reqs);
        },
        (error) => {
          console.error("Regular: Failed to sync personal requests:", error);
        },
      );
    }

    const fallbackTimer = setTimeout(() => {
      setUsersLoaded(true);
      setProductsLoaded(true);
    }, 2000);

    return () => {
      unsubUsers();
      unsubRequests();
      unsubBroadcasts();
      clearTimeout(fallbackTimer);
    };
  }, [currentUserPhone]);
  const [notificationsCount, setNotificationsCount] = useState(() => {
    const saved = safeStorage.getItem("sanad_last_seen_requests_count");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userNotifications, setUserNotifications] = useState<any[]>(() => {
    try {
      const saved = safeStorage.getItem("sanad_user_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [isPublishingTransition, setIsPublishingTransition] = useState(false);

  useEffect(() => {
    if (loggedUserObj) {
      safeStorage.setItem(
        "sanad_current_user_obj",
        JSON.stringify(loggedUserObj),
      );
    } else {
      safeStorage.removeItem("sanad_current_user_obj");
    }
  }, [loggedUserObj]);
  const [transitionPlan, setTransitionPlan] = useState<
    "free" | "bronze" | "vip"
  >("free");

  useEffect(() => {
    if (!currentUserPhone) {
      setFavorites([]);
      safeStorage.removeItem("sanad_favorites");
      setLikedProductIds([]);
      safeStorage.removeItem("sanad_liked_products");
    }
  }, [currentUserPhone]);

  useEffect(() => {
    if (!currentUserPhone) {
      setUserNotifications([]);
      return;
    }

    const isAdmin = ["92942482", "21692942482"].includes(currentUserPhone || "");
    const allowedPhones = isAdmin ? ["92942482", "21692942482"] : [currentUserPhone];
    
    isInitialNotificationsLoadRef.current = true;
    const subscriptionTime = Date.now(); 
    // Use a session-persistent set to avoid duplicates even on remounts
    if (!(window as any)._seenToastIds) (window as any)._seenToastIds = new Set<string>();
    const seenToastIds = (window as any)._seenToastIds;

    const q = query(
      collection(db, "systemNotifications"),
      where("userPhone", "in", allowedPhones)
    );

    const unsubNotifications = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added" && !isInitialNotificationsLoadRef.current) {
            const data = change.doc.data();
            const eventId = change.doc.id;
            const createdTime = data.createdAt ? new Date(data.createdAt).getTime() : Date.now();
            
            // Strictly guard: only toast if newly created AND not seen in this session
            if (createdTime > subscriptionTime && !seenToastIds.has(eventId)) {
              seenToastIds.add(eventId);
              showToast(`إشعار جديد: ${data.message}`, "info");
            }
          }
        });
        isInitialNotificationsLoadRef.current = false;

        const notifs: any[] = [];
        snapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() });
        });
        notifs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
        setUserNotifications(notifs);
        
        // Save in local storage as fallback
        safeStorage.setItem("sanad_user_notifications", JSON.stringify(notifs));
      },
      (error) => {
        console.error("Failed to sync systemNotifications from Firestore:", error);
      }
    );

    return () => unsubNotifications();
  }, [currentUserPhone]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = safeStorage.getItem("sanad_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [likedProductIds, setLikedProductIds] = useState<string[]>(() => {
    const saved = safeStorage.getItem("sanad_liked_products");
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = safeStorage.getItem("sanad_recently_viewed");
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(() => {
    try {
      const saved = safeStorage.getItem("sanad_favorite_categories");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tickerEvent, setTickerEvent] = useState<{ id: string; name: string; plan?: "free" | "bronze" | "vip"; phone?: string } | null>(null);
  const seenLoginEvents = useRef<Set<string>>(new Set());

  useEffect(() => {
    const q = query(
      collection(db, "login_activity"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const tickerStartTime = Date.now();

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const eventId = change.doc.id;
          const eventTime = new Date(data.timestamp).getTime();
          const now = Date.now();
          
          const eventPlan = data.plan || "free";
          const phoneKey = data.phone ? `phone-${data.phone}-${eventPlan}` : `name-${data.userName}-${eventPlan}`;
          const isRecentlySeen = seenLoginEvents.current.has(eventId) || seenLoginEvents.current.has(phoneKey);
          
          // Only show for events that happened AFTER listener started or very recently (last 10s) to avoid spam on refresh
          if (eventTime > tickerStartTime - 10000 && !isRecentlySeen) {
            seenLoginEvents.current.add(eventId);
            if (data.phone) {
              seenLoginEvents.current.add(`phone-${data.phone}-${eventPlan}`);
              // Clear previous cached plan indicators so upgrades/updates trigger new animations immediately
              seenLoginEvents.current.delete(`phone-${data.phone}-free`);
              seenLoginEvents.current.delete(`phone-${data.phone}-bronze`);
              seenLoginEvents.current.delete(`phone-${data.phone}-vip`);
            }
            if (data.userName) {
              seenLoginEvents.current.add(`name-${data.userName}-${eventPlan}`);
              seenLoginEvents.current.delete(`name-${data.userName}-free`);
              seenLoginEvents.current.delete(`name-${data.userName}-bronze`);
              seenLoginEvents.current.delete(`name-${data.userName}-vip`);
            }
            
            setTickerEvent({ 
              id: eventId, 
              name: data.userName || data.phone || "مستخدم جديد",
              plan: eventPlan,
              phone: data.phone || ""
            });
            setTimeout(() => setTickerEvent(null), 10000);
          }
        }
      });
    }, (error) => {
      console.error("Ticker listener error:", error);
    });

    return () => unsub();
  }, []);

  const recordLoginEvent = async (phone: string, name?: string, localTrigger = false, plan?: "free" | "bronze" | "vip") => {
    const userName = name || "مستخدم";
    const userPlan = plan || (phone === "92942482" ? "vip" : "free");
    
    if (localTrigger) {
      const tempId = "local-" + Date.now();
      seenLoginEvents.current.add(tempId);
      seenLoginEvents.current.add(`phone-${phone}`);
      seenLoginEvents.current.add(`name-${userName}`);
      
      setTickerEvent({ id: tempId, name: userName, plan: userPlan, phone });
      setTimeout(() => setTickerEvent(null), 10000);
    }

    try {
      await addDoc(collection(db, "login_activity"), {
        phone,
        userName,
        plan: userPlan,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to record login event:", err);
    }
  };

  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<string>(() => {
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission;
      }
      return "unsupported";
    });

  const [liveProductAlert, setLiveProductAlert] = useState<any>(null);

  const appOpenTimeRef = useRef<number>(Date.now());
  const favoriteCategoriesRef = useRef<string[]>(favoriteCategories);
  const productsRef = useRef<Product[]>([]);
  const isInitialNotificationsLoadRef = useRef(true);

  useEffect(() => {
    favoriteCategoriesRef.current = favoriteCategories;
  }, [favoriteCategories]);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");

  const [initialRenderComplete, setInitialRenderComplete] = useState(true);
  useEffect(() => {
    // Immediate render complete to speed up startup
    setInitialRenderComplete(true);
  }, []);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [showSocialMenu, setShowSocialMenu] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Automatically update the region filter if the search query is a known region (full or partial match)
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const match = REGIONS.find(
        (r) =>
          r !== "الكل" &&
          (r.toLowerCase().includes(q) || q.includes(r.toLowerCase())),
      );
      if (match) {
        setSelectedRegion(match);
        // Scroll to the selected region in the regionsContainer to center it perfectly
        setTimeout(() => {
          const selectedButton = regionRefs.current[match];
          if (selectedButton) {
            selectedButton.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center",
            });
          }
        }, 50);
      }
    } else {
      setSelectedRegion("الكل");
    }
  }, [searchQuery]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [broadcastQueue, setBroadcastQueue] = useState<BroadcastMessage[]>([]);
  const [activeVipBroadcasts, setActiveVipBroadcasts] = useState<
    BroadcastMessage[]
  >([]);
  const processedBroadcastIds = useRef<Set<string>>(new Set());
  const sessionStartTime = useRef(Date.now());
  const [dismissedBroadcastIds, setDismissedBroadcastIds] = useState<
    Set<string>
  >(new Set());

  const playPremiumGoldChime = () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Beautiful celestial sequence of notes: D5 -> A5 -> D6 -> A6
      const playTone = (
        freq: number,
        start: number,
        duration: number,
        vol: number,
      ) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // High frequency shimmer for the golden touch
        osc.type = freq > 1000 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
        gainNode.gain.linearRampToValueAtTime(
          vol,
          ctx.currentTime + start + 0.04,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + start + duration,
        );

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      // Celestial gold chord chime
      playTone(587.33, 0, 0.6, 0.12); // D5
      playTone(880.0, 0.08, 0.7, 0.1); // A5
      playTone(1174.66, 0.16, 0.9, 0.08); // D6 (high sparkle)
      playTone(1760.0, 0.24, 1.2, 0.05); // A6 (royal shimmer)
    } catch (error) {
      console.warn(
        "Audio synthesis failed, skipping notification sound",
        error,
      );
    }
  };

  // Royal Ads broadcast listener system: shows royal ads (VIP) and lets the marquee dismiss them after 3 full cycles
  useEffect(() => {
    const vipMsgs = broadcastQueue.filter((msg) => msg.plan === "vip");

    vipMsgs.forEach((msg) => {
      if (!processedBroadcastIds.current.has(msg.id)) {
        processedBroadcastIds.current.add(msg.id);

        const msgTime = msg.createdAt ? new Date(msg.createdAt).getTime() : 0;

        // Show if published within current session (with 5 seconds tolerance buffer)
        if (msgTime > sessionStartTime.current - 5000) {
          setActiveVipBroadcasts((prev) => {
            if (prev.some((p) => p.id === msg.id)) return prev;
            return [...prev, msg];
          });

          // Play the signature golden notification chime sound for royal announcements!
          playPremiumGoldChime();
        }
      }
    });
  }, [broadcastQueue]);

  const triggerBroadcast = async (
    sellerName: string,
    location: string,
    title: string,
    plan: "vip" | "bronze" | "free",
    avatar?: string,
    forceBroadcast: boolean = false,
    itemImage?: string,
    price?: number | string
  ) => {
    const isAdmin = currentUserPhone === "92942482";
    const resolvedPlan = isAdmin ? "vip" : plan;
    if (!forceBroadcast && resolvedPlan !== "vip") return;

    const newMessage = {
      sellerName,
      location,
      title,
      plan: resolvedPlan,
      avatar,
      itemImage,
      price,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "broadcasts"), newMessage);
    } catch (e) {
      console.error("Error broadcasting message:", e);
    }
  };

  const createSystemNotification = async (
    targetPhone: string,
    message: string,
    productId?: string,
  ) => {
    const notifId =
      String(Date.now()) +
      "-" +
      targetPhone +
      "-" +
      Math.random().toString(36).substr(2, 9);
    const newNotif = {
      id: notifId,
      userPhone: targetPhone,
      message,
      read: false,
      createdAt: new Date().toISOString(),
      ...(productId ? { productId } : {}),
    };
    try {
      console.log(`Saving notification to Firestore for ${targetPhone}:`, newNotif);
      await setDoc(doc(db, "systemNotifications", notifId), newNotif);
      console.log("Notification saved successfully to Firestore.");
      
      // Play sound if current user is receiving it
      if (currentUserPhone && targetPhone === currentUserPhone) {
        try {
          const audio = new Audio(
            "https://assets.mixkit.co/active_storage/sfx/1423/1423-84.wav"
          );
          audio.volume = 0.4;
          audio.play().catch(() => {});
        } catch (soundErr) {
          console.warn("Could not play chime:", soundErr);
        }
      }
    } catch (err) {
      console.error("Failed to save notification to Firestore:", err);
      // Fallback - this is bad for admin notifications, but necessary for session stability
      setUserNotifications((prev) => [newNotif, ...prev]);
      throw err; // Re-throw to allow caller to know it failed
    }
  };

  // Broadcast system is ready for user triggers on submission only

  // History tracker
  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed((prev) =>
        [
          selectedProduct.id,
          ...prev.filter((id) => id !== selectedProduct.id),
        ].slice(0, 5),
      );
    }
  }, [selectedProduct]);

  useEffect(() => {
    safeStorage.setItem(
      "sanad_system_requests",
      JSON.stringify(systemRequests),
    );
  }, [systemRequests]);

  useEffect(() => {
    safeStorage.setItem(
      "sanad_last_seen_requests_count",
      notificationsCount.toString(),
    );
  }, [notificationsCount]);

  useEffect(() => {
    safeStorage.setItem(
      "sanad_user_notifications",
      JSON.stringify(userNotifications),
    );
  }, [userNotifications]);

  useEffect(() => {
    safeStorage.setItem("sanad_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    safeStorage.setItem(
      "sanad_recently_viewed",
      JSON.stringify(recentlyViewed),
    );
  }, [recentlyViewed]);

  useEffect(() => {
    safeStorage.setItem("sanad_current_user_plan", currentUserPlan);
  }, [currentUserPlan]);

  // Track last visited web origin dynamically to support self-healing configurations in the built APK wrapper
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      const isApk =
        window.location.protocol === "file:" ||
        window.location.protocol.startsWith("capacitor") ||
        window.location.protocol.startsWith("ionic") ||
        !window.location.hostname;
      if (!isApk) {
        safeStorage.setItem("sanad_last_web_origin", window.location.origin);
      }
    }
  }, []);

  // Synchronize currentUserPlan with system database changes dynamically so plan transitions are immediate
  useEffect(() => {
    const userObj = systemUsers.find(
      (u) => u.phone === currentUserPhone || u.id === currentUserPhone,
    );
    const isAdmin = currentUserPhone === "92942482";
    const resolvedPlan = isAdmin
      ? "vip"
      : userObj?.subscription || userObj?.plan || "free";
    if (userObj && resolvedPlan !== currentUserPlan) {
      setCurrentUserPlan(resolvedPlan);
      
      // Instantly trigger celebratory dynamic login bar banner for the active user upon upgrade
      if (resolvedPlan === "vip" || resolvedPlan === "bronze") {
        setTickerEvent({
          id: "upgrade-celebration-" + Date.now(),
          name: userObj.name || userObj.phone || "مستخدم متميز",
          plan: resolvedPlan,
          phone: currentUserPhone
        });
        setTimeout(() => setTickerEvent(null), 10000);
      }
    }
  }, [systemUsers, currentUserPhone, currentUserPlan]);

  const handleDismissBroadcast = (id: string) => {
    setBroadcastQueue((prev) => prev.filter((b) => b.id !== id));
  };

  // PWA & Browser App Installation Triggers
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    const isDismissed =
      safeStorage.getItem("sanad_app_install_dismissed") === "true";
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone;

    let timer: NodeJS.Timeout | null = null;
    if (!isStandalone && !isDismissed) {
      timer = setTimeout(() => {
        setShowInstallBanner(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<
    "home" | "listings" | "favorites" | "memberships" | "profile"
  >("home");
  const isManualClickRef = useRef<boolean>(false);
  const handleManualTabClick = (
    tab: "home" | "listings" | "favorites" | "memberships" | "profile",
  ) => {
    setActiveBottomTab(tab);
    isManualClickRef.current = true;
    setTimeout(() => {
      isManualClickRef.current = false;
    }, 1000);
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isManualClickRef.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isManualClickRef.current) {
            ticking = false;
            return;
          }

          if (showProfile || showAuth || showAdmin || showAddProduct) {
            setActiveBottomTab((prev) => (prev !== "profile" ? "profile" : prev));
            ticking = false;
            return;
          }

          const listingsEl = document.getElementById("listings-head");
          const pricingEl = document.getElementById("pricing-packages");

          let nextTab: "home" | "listings" | "favorites" | "memberships" | "profile" = "home";

          if (pricingEl) {
            const pricingRect = pricingEl.getBoundingClientRect();
            if (
              pricingRect.top < window.innerHeight * 0.45 ||
              window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 120
            ) {
              nextTab = "memberships";
            }
          }

          if (nextTab !== "memberships" && listingsEl) {
            const listingsRect = listingsEl.getBoundingClientRect();
            if (listingsRect.top < window.innerHeight * 0.45) {
              nextTab = "listings";
            }
          }

          setActiveBottomTab((prev) => (prev !== nextTab ? nextTab : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showProfile, showAuth, showAdmin, showAddProduct]);
  const [storyViewerId, setStoryViewerId] = useState<string | null>(null);
  const [directPaymentPkg, setDirectPaymentPkg] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "warning" | "error";
  } | null>(null);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "info" | "warning" | "error" = "info",
    ) => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
    },
    [],
  );

  const handleBroadcastProductSelect = useCallback(
    (title: string, sellerName: string) => {
      const found = products.find((p) => {
        const cleanPTitle = p.title.trim().toLowerCase();
        const cleanBTitle = title.trim().toLowerCase();
        return (
          cleanPTitle === cleanBTitle ||
          cleanPTitle.includes(cleanBTitle) ||
          cleanBTitle.includes(cleanPTitle)
        );
      });

      if (found) {
        setSelectedProduct(found);
        showToast(`🎯 تم فتح الإعلان: ${found.title}`, "success");
      } else {
        if (title.includes("انضم إلينا")) {
          showToast("مرحباً بك في سوق سند الملكي! 🌟", "success");
        } else {
          showToast("الإعلان مسجل في الأرشيف لمشرفي سوق سند.", "warning");
        }
      }
    },
    [products, showToast],
  );

  useEffect(() => {
    if (currentUserPhone) {
      safeStorage.setItem("sanad_current_user_phone", currentUserPhone);
    } else {
      safeStorage.removeItem("sanad_current_user_phone");
    }
  }, [currentUserPhone]);
  const [selectedRegion, setSelectedRegion] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAutoSuggest, setShowAutoSuggest] = useState(false);
  const autoSuggestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autoSuggestRef.current &&
        !autoSuggestRef.current.contains(event.target as Node)
      ) {
        setShowAutoSuggest(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Back button handling integration for APKs and mobile browsers
  const lastStateRef = useRef<boolean>(false);
  useEffect(() => {
    const isAnyModalOpen =
      showAdmin ||
      showSidebar ||
      showAuth ||
      showProfile ||
      showAddProduct ||
      showAIChat ||
      !!storyViewerId;

    if (isAnyModalOpen && !lastStateRef.current) {
      window.history.pushState({ modalOpen: true }, "", "#overlay");
    } else if (!isAnyModalOpen && lastStateRef.current) {
      if (window.location.hash === "#overlay") {
        window.history.back();
      }
    }
    lastStateRef.current = isAnyModalOpen;

    const handlePopState = (e: PopStateEvent) => {
      if (window.location.hash !== "#overlay") {
        setShowAdmin(false);
        setShowSidebar(false);
        setShowAuth(false);
        setShowProfile(false);
        setShowAddProduct(false);
        setShowAIChat(false);
        setStoryViewerId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    showAdmin,
    showSidebar,
    showAuth,
    showProfile,
    showAddProduct,
    showAIChat,
    storyViewerId,
  ]);

  const getSuggestions = () => {
    if (!searchQuery.trim()) return { productMatches: [], categoryMatches: [] };
    const q = searchQuery.toLowerCase();
    const productMatches = products
      .filter((p) => p.title.toLowerCase().includes(q))
      .slice(0, 5);
    const categoryMatches = CATEGORIES.filter(
      (c) => c !== "الكل" && c.toLowerCase().includes(q),
    ).slice(0, 3);
    return { productMatches, categoryMatches };
  };

  const mainRef = useRef<HTMLElement>(null);
  const regionsContainerRef = useRef<HTMLDivElement>(null);
  const regionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const pendingRequest = systemRequests.find(
    (r) => r.phone === currentUserPhone && r.status === "pending",
  );
  const currentUserObj = systemUsers.find(
    (u) => u.phone === currentUserPhone || u.id === currentUserPhone,
  );

  // Auto clean-up stale or invalid user sessions is disabled to avoid race conditions during signup
  useEffect(() => {
    /* 
    if (usersLoaded && currentUserPhone && !systemUsers.some(u => u.phone === currentUserPhone)) {
      setCurrentUserPhone(null);
      setCurrentUserPlan('free');
      setLoggedUserObj(null);
    }
    */
  }, [currentUserPhone, systemUsers, usersLoaded]);

  // For Admin auto-sync of product plans (self-healing)
  useEffect(() => {
    if (
      currentUserPhone === "92942482" &&
      products.length > 0 &&
      systemUsers.length > 0
    ) {
      products.forEach((p) => {
        const u = systemUsers.find(
          (su) => su.phone === p.sellerId || su.id === p.sellerId,
        );
        if (u && u.plan && p.plan !== u.plan) {
          updateDoc(doc(db, "products", p.id), { plan: u.plan }).catch(
            console.error,
          );
        }
      });
    }
  }, [currentUserPhone, products, systemUsers]);

  // Sync loggedUserObj whenever currentUserPhone or systemUsers changes
  useEffect(() => {
    if (currentUserPhone) {
      const user = systemUsers.find(
        (u) => u.phone === currentUserPhone || u.id === currentUserPhone,
      );
      if (user) {
        const truePlan = user.subscription || user.plan || "free";
        setLoggedUserObj({ ...user, plan: truePlan });
        if (user.favoriteCategories && Array.isArray(user.favoriteCategories)) {
          setFavoriteCategories(user.favoriteCategories);
          safeStorage.setItem(
            "sanad_favorite_categories",
            JSON.stringify(user.favoriteCategories),
          );
        }
      }
    } else {
      setLoggedUserObj(null);
    }
  }, [currentUserPhone, systemUsers]);

  // Prevent body scrolling when a modal or full-screen flow is active
  useEffect(() => {
    const isAnyModalActive =
      !!selectedProduct ||
      showProfile ||
      showAdmin ||
      showAddProduct ||
      showNotificationsModal ||
      showMenuModal ||
      !!storyViewerId;

    if (isAnyModalActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    selectedProduct,
    showProfile,
    showAdmin,
    showAddProduct,
    showNotificationsModal,
    showMenuModal,
    storyViewerId,
  ]);

  const handleAuth = async (
    isLogin: boolean,
    rawPhone: string,
    rawName: string,
    rawCode: string,
  ): Promise<boolean | string> => {
    const englishPhone = rawPhone.replace(
      /[٠-٩]/g,
      (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)],
    );
    const phone = englishPhone.trim().replace(/\s+/g, "");
    const englishCode = rawCode.replace(
      /[٠-٩]/g,
      (d) => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)],
    );
    const code = englishCode.trim();
    const name = rawName.trim();

    const isAdmin = phone === "92942482";

    if (isLogin) {
      let user: any = null;
      try {
        const docSnap = await getDoc(doc(db, "systemUsers", phone));
        if (docSnap.exists()) {
          user = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {
        console.error("Direct fetch user failed for login:", e);
      }

      if (!user) {
        if (isAdmin) {
          user = {
            name: "المدير",
            phone: phone,
            subscription: "vip",
            avatar: null,
            password: code,
          };
          setDoc(doc(db, "systemUsers", phone), user).catch((e) =>
            console.error(e),
          );
        } else {
          return "رقم الهاتف غير مسجل، يرجى إنشاء حساب أولاً";
        }
      }

      if (user && !user.password && !isAdmin) {
        updateDoc(doc(db, "systemUsers", phone), { password: code }).catch(
          (e) => console.error(e),
        );
        user.password = code;
      }

      if (isAdmin || String(user.password) === code) {
        if (isAdmin && user.password !== code) {
          updateDoc(doc(db, "systemUsers", phone), { password: code }).catch(
            (e) => console.error(e),
          );
        }

        const finalPlan = isAdmin ? "vip" : user.plan || "free";

        setCurrentUserPhone(phone);
        setCurrentUserPlan(finalPlan);
        recordLoginEvent(phone, user.name, true, finalPlan);
        setShowAuth(false);
        const loggedUser = { ...user, plan: finalPlan, password: code };
        setLoggedUserObj(loggedUser);
        try {
          playLoginSound();
        } catch (e) {
          console.error(e);
        }
        return true;
      } else {
        return "بيانات الدخول غير صحيحة";
      }
    } else {
      console.log("--- SIGNUP INITIATED ---");
      console.log("Input Phone:", phone);

      let existingUser: any = null;
      try {
        const docSnap = await getDoc(doc(db, "systemUsers", phone));
        if (docSnap.exists()) {
          existingUser = { id: docSnap.id, ...docSnap.data() };
        }
      } catch (e) {
        console.error("Direct fetch user failed for signup:", e);
      }

      if (existingUser) {
        console.log(
          "Duplicate user found, preventing signup or performing self-healing:",
          existingUser,
        );
        if (isAdmin) {
          return handleAuth(true, rawPhone, rawName, rawCode);
        }
        if (existingUser.password && String(existingUser.password) === code) {
          console.log(
            "Password matches existing user, performing automatic self-healing login.",
          );
          const savedPlan = (existingUser.plan || "free") as "free" | "bronze" | "vip";
          setCurrentUserPhone(phone);
          setCurrentUserPlan(savedPlan);
          recordLoginEvent(phone, existingUser.name, true, savedPlan);
          setShowAuth(false);
          const loggedUser = { ...existingUser, id: existingUser.id || phone };
          setLoggedUserObj(loggedUser);

          try {
            playLoginSound();
          } catch (e) {
            console.error(e);
          }
          return true;
        }
        return `رقم الهاتف مسجل مسبقاً (الاسم: ${existingUser.name || "لا يوجد اسم"} | الهاتف: ${existingUser.phone || "لا يوجد هاتف"})`;
      }

      const newUser = {
        name: isAdmin && !name ? "المدير" : name,
        phone,
        subscription: isAdmin ? "vip" : "free",
        plan: (isAdmin ? "vip" : "free") as "free" | "bronze" | "vip",
        avatar: null,
        password: code,
      };
      setDoc(doc(db, "systemUsers", phone), newUser).catch((e) => {
        console.error("Error saving user to Firestore in background:", e);
      });

      // Create notification for Admins
      for (const adminPhone of ["92942482", "21692942482"]) {
        try {
          await createSystemNotification(
            adminPhone,
            `👤 مستخدم جديد انضم للتطبيق! الاسم: "${newUser.name}" ورقم الهاتف: ${newUser.phone}.`
          );
        } catch (adminErr) {
          console.error("Failed to notify admin:", adminPhone, adminErr);
        }
      }

      // Create notification for the newly registered User
      await createSystemNotification(
        newUser.phone,
        `🎉 أهلاً بك في سوق سند يا "${newUser.name}"! تم إنشاء حسابك بنجاح. تصفح الإعلانات والمنتجات المميزة الآن واستمتع بتجربة تسوق فريدة.`
      );

      // Broadcast new user
      triggerBroadcast(
        newUser.name,
        "سوق سند",
        "انضم إلينا مستخدم جديد!",
        "free",
        undefined,
        true,
      );

      setCurrentUserPhone(phone);
      setCurrentUserPlan(newUser.plan as "free" | "bronze" | "vip");
      recordLoginEvent(phone, newUser.name, true, newUser.plan as "free" | "bronze" | "vip");
      setShowAuth(false);
      const loggedUser = { ...newUser, id: phone };
      setLoggedUserObj(loggedUser);
      try {
        playLoginSound();
      } catch (e) {
        console.error(e);
      }
      return true;
    }
  };

  const handleToggleFavoriteCategory = async (category: string) => {
    const updated = favoriteCategories.includes(category)
      ? favoriteCategories.filter((c) => c !== category)
      : [...favoriteCategories, category];

    setFavoriteCategories(updated);
    safeStorage.setItem("sanad_favorite_categories", JSON.stringify(updated));

    if (currentUserPhone) {
      try {
        await setDoc(
          doc(db, "systemUsers", currentUserPhone),
          { favoriteCategories: updated },
          { merge: true },
        );
        showToast(`تم التحديث: ${category}`, "success");
      } catch (dbErr) {
        console.error("Failed to save remote favorite categories:", dbErr);
      }
    } else {
      showToast(`تم حفظ القسم في المفضلة المحلية بالمتصفح 🌟`, "success");
    }
  };

  const handleRequestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      showToast("المتصفح لا يدعم التنبيهات الفورية", "error");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermissionStatus(permission);
      if (permission === "granted") {
        showToast(
          "تم تفعيل التنبيهات بنجاح! ستصلك إشعارات فورية عن أقسامك المفضلة 🎉",
          "success",
        );

        if (messaging) {
          try {
            const { getToken } = await import("firebase/messaging");
            const token = await getToken(messaging, {
              vapidKey: "BM-S9S3P9s-fscXl157e_5y1x3Yn9r-r9s-zXl8z1z...",
            }).catch((err) => {
              console.warn("Could not retrieve FCM registration token:", err);
              return null;
            });

            if (token && currentUserPhone) {
              await setDoc(
                doc(db, "systemUsers", currentUserPhone),
                { fcmToken: token },
                { merge: true },
              );
            }
          } catch (swErr) {
            console.warn("FCM registration error wrapper:", swErr);
          }
        }
      } else if (permission === "denied") {
        showToast(
          "تم رفض الإشعارات. يرجى تفعيلها من إعدادات المتصفح لتلقي التنبيهات.",
          "warning",
        );
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      showToast("حدث خطأ أثناء طلب الإذن بالتنبيهات.", "error");
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    const isAdmin = currentUserPhone === "92942482";
    if (isAdmin) {
      newProduct.plan = "vip";
    }
    // Ensure comments, views and likes are initialized for new products
    const adWithStats = { ...newProduct, comments: [], views: 0, likes: 0 };
    if (!adWithStats.id || adWithStats.id.startsWith("temp-")) {
      adWithStats.id = generateUUID(); // ensure clean ID
    }

    // 1. Activate the majestic full-screen luxury transition scene matching the user's plan
    setTransitionPlan(isAdmin ? "vip" : currentUserPlan);
    setIsPublishingTransition(true);

    // 2. Perform DB write in the background completely asynchronously to avoid blocking UI or freezing
    setDoc(
      doc(db, "products", adWithStats.id),
      cleanUndefined(adWithStats),
    ).catch((err) => {
      console.error("Failed to publish product to Database:", err);
      showToast(
        "حدث خطأ أثناء الاتصال بالنظام، ولكن سنحاول جاهدين المزامنة بالخلفية.",
        "error",
      );
    });

    // 3. Run UI cleanup and transition timelines in a predictable, high-performance, responsive manner
    setTimeout(async () => {
      // 4. Update products and clear all filters silently behind the scenes
      setShowAddProduct(false);
      setSelectedCategory("الكل");
      setSelectedRegion("الكل");
      setSearchQuery("");

      // 5. Reset the scroll instantly to (0,0) - NO browser stutter or white screen as the overlay covers it!
      window.scrollTo({ top: 0 });

      // INSTANT UI UPDATE: Prepend locally so the user sees it immediately even before Firestore syncs back!
      setProducts((prev) => {
        if (prev.some((p) => p.id === adWithStats.id)) return prev;
        return [adWithStats, ...prev];
      });

      // 6. Add REAL dynamic action-oriented notifications for both the publisher and the admin
      const notifyUsers = new Set<string>();
      if (currentUserPhone) notifyUsers.add(currentUserPhone);
      notifyUsers.add("92942482"); // target admin as well
      notifyUsers.add("21692942482"); // target secondary admin

      const message = `📢 تم نشر إعلان جديد بنجاح: "${newProduct.title}" تفاصيل العرض ووصف المنتج متوفرة الآن! كتب بواسطة: ${newProduct.sellerName || "مستعمل متميز"} (${newProduct.sellerId || "بدون هاتف"}). اضغط هنا للمعاينة والموافقة الفورية.`;
      
      await Promise.all(
        Array.from(notifyUsers).map((phone) =>
          createSystemNotification(phone, message, newProduct.id)
        )
      );

      // 7. Launch celebratory confetti burst
      confetti({
        particleCount: 155,
        spread: 85,
        origin: { y: 0.55 },
        colors: ["#D4AF37", "#10B981", "#ffffff"],
      });

      // Play tailored confirmation sound (royal/vip, bronze, or free)
      try {
        playListingSound(newProduct.plan || "free");
      } catch (e) {
        console.error(e);
      }

      // 7. Show modern floating success toast
      showToast("تم نشر إعلانك وبث الإشعار وحفظ تفاصيله للمعاينة!", "success");

      // 8. Gracefully fade out the luxury transition overlay after all rendering is finalized
      setTimeout(() => {
        setIsPublishingTransition(false);
        // Broadcast newly published product in immediate TikTok-Universe luxury ticker style AFTER the overlay fades!
        triggerBroadcast(
          newProduct.sellerName || "مستعمل متميز",
          newProduct.location || "تونس",
          newProduct.title,
          newProduct.plan || "free",
          newProduct.sellerAvatar,
          false,
          newProduct.imageUrls?.[0],
          newProduct.price
        );
      }, 1500);
    }, 1800);
  };

  const toggleFavorite = useCallback(
    async (productId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setFavorites((prev) => {
        const isAdding = !prev.includes(productId);
        const newFavs = isAdding
          ? [...prev, productId]
          : prev.filter((id) => id !== productId);

        safeStorage.setItem("sanad_favorites", JSON.stringify(newFavs));

        showToast(
          isAdding ? "تمت إضافة المنتج للمفضلة" : "تمت إزالة المنتج من المفضلة",
          "info"
        );
        return newFavs;
      });
    },
    [showToast],
  );

  const toggleLike = useCallback(
    async (productId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setLikedProductIds((prev) => {
        const isAdding = !prev.includes(productId);
        const newLikes = isAdding
          ? [...prev, productId]
          : prev.filter((id) => id !== productId);
        
        safeStorage.setItem("sanad_liked_products", JSON.stringify(newLikes));

        // Update DB
        const updateDB = async () => {
          try {
            const productDoc = await getDoc(doc(db, "products", productId));
            if (productDoc.exists()) {
              const prodData = productDoc.data();
              const newLikesValue = Math.max(
                0,
                (prodData.likes || 0) + (isAdding ? 1 : -1),
              );
              await updateDoc(doc(db, "products", productId), {
                likes: newLikesValue,
              });
            }
          } catch (err) {
            console.error("Could not update likes", err);
          }
        };
        updateDB();
        return newLikes;
      });
      showToast(
        "تم التحديث",
        "info"
      );
    },
    [showToast]
  );

  const handleSubscriptionRequest = async (plan: string) => {
    if (!currentUserPhone) {
      setShowAuth(true);
      return;
    }
    const newId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newReq = {
      id: newId,
      user: `User ${currentUserPhone}`,
      phone: currentUserPhone,
      plan,
      status: "pending",
    };
    try {
      await setDoc(doc(db, "systemRequests", newId), newReq);
      
      // Create notification for Admin ("92942482") to review subscription upgrade request
      const displayPlan = plan === 'vip' ? 'الباقة الملكية VIP' : plan === 'bronze' ? 'الباقة البرونزية المتميزة' : plan;
      createSystemNotification(
        "92942482",
        `👑 طلب ترقية جديد! المستخدم صاحب الرقم (${currentUserPhone}) يطلب الترقية إلى: "${displayPlan}". يرجى مراجعة وتأكيد الدفع من لوحة التحكم.`
      );

      try {
        playSubscriptionClapSound();
      } catch (e) {
        console.error(e);
      }
      confetti({
        particleCount: 88,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#D4AF37", "#ffffff"],
      });
      showToast(
        "تم إرسال طلب الاشتراك، سيتم تفعيل باقتك بعد تأكيد الدفع",
        "success",
      );
    } catch (e) {
      console.error("Failed to add subscription request to Firestore:", e);
      // Fallback to local state if offline/network issues
      setSystemRequests((prev) => [newReq, ...prev]);
      showToast(
        "تم إرسال طلب الاشتراك، ولكن قد يستغرق المزامنة وقتاً أطول.",
        "info",
      );
    }
  };

  const allEnrichedProducts = useMemo(
    () =>
      products.map((p) => {
        const userObj = systemUsers.find(
          (u) => u.phone === p.sellerId || u.id === p.sellerId,
        );
        const isSellerAdmin = p.sellerId === "92942482";
        let resolvedPlan: "free" | "bronze" | "vip" = "free";
        if (isSellerAdmin) {
          resolvedPlan = "vip";
        } else if (
          userObj?.plan === "vip" ||
          userObj?.subscription === "vip" ||
          p.plan === "vip" ||
          (p as any).subscription === "vip" ||
          p.isVip
        ) {
          resolvedPlan = "vip";
        } else if (
          userObj?.plan === "bronze" ||
          userObj?.subscription === "bronze" ||
          p.plan === "bronze" ||
          (p as any).subscription === "bronze"
        ) {
          resolvedPlan = "bronze";
        }

        return {
          ...p,
          sellerName: isSellerAdmin ? "المدير" : userObj?.name || p.sellerName,
          sellerAvatar: userObj?.avatar || p.sellerAvatar,
          plan: resolvedPlan,
          isVip: resolvedPlan === "vip", // ensure boolean flag syncs
        };
      }),
    [products, systemUsers],
  );

  const filteredProducts = useMemo(
    () =>
      allEnrichedProducts.filter((p) => {
        if (activeBottomTab === "favorites" && !favorites.includes(p.id)) {
          return false;
        }

        const matchCat =
          selectedCategory === "الكل" ||
          (((p.mainCategory || "").trim() === selectedCategory.trim() ||
            (p.category || "").trim() === selectedCategory.trim()) &&
            (!selectedSubCategory ||
              (p.subCategory || "").trim() === selectedSubCategory.trim()));

        const matchReg =
          selectedRegion === "الكل" ||
          (p.location || "").trim().includes(selectedRegion.trim());

        const q = searchQuery.trim().toLowerCase();
        // Determine if search query matches any region in the REGIONS list
        const isSearchingRegion =
          q &&
          REGIONS.some(
            (r) =>
              r !== "الكل" &&
              (r.toLowerCase() === q || q.includes(r.toLowerCase())),
          );

        const matchSearch = isSearchingRegion
          ? (p.location || "").toLowerCase().trim().includes(q)
          : !q ||
            (p.title || "").toLowerCase().includes(q) ||
            (p.description || "").toLowerCase().includes(q) ||
            (p.location || "").toLowerCase().includes(q) ||
            (p.category || "").toLowerCase().includes(q) ||
            (p.subCategory || "").toLowerCase().includes(q);
        return matchCat && matchReg && matchSearch;
      }),
    [
      allEnrichedProducts,
      selectedCategory,
      selectedSubCategory,
      selectedRegion,
      searchQuery,
      activeBottomTab,
      favorites,
    ],
  );

  const enrichedProducts = filteredProducts;

  const PAGE_SIZE = 12;

  const vipProducts = useMemo(() => {
    return enrichedProducts.filter((p) => p.plan === "vip");
  }, [enrichedProducts]);

  const bronzeProducts = useMemo(() => {
    return enrichedProducts.filter((p) => p.plan === "bronze");
  }, [enrichedProducts]);

  const allGeneralProducts = useMemo(
    () => enrichedProducts.filter((p) => p.plan === "free" || !p.plan),
    [enrichedProducts],
  );

  const generalProducts = allGeneralProducts;

  const stories: Story[] = useMemo(() => {
    console.log(
      "SanadSouq Stories Engine: Calculating stories. Length of allEnrichedProducts is:",
      allEnrichedProducts.length,
    );
    const rawVipAndBronze = allEnrichedProducts.filter(
      (p) => p.plan === "vip" || p.plan === "bronze",
    );
    console.log(
      "SanadSouq Stories Engine: Total products with plan 'vip' or 'bronze' is:",
      rawVipAndBronze.length,
      rawVipAndBronze,
    );

    // Filter active VIP/Bronze products from allEnrichedProducts
    let filtered = allEnrichedProducts.filter((p) => {
      if (p.plan !== "vip" && p.plan !== "bronze") return false;
      if (p.status === "sold") return false;

      const tA = new Date(p.createdAt).getTime();
      if (isNaN(tA)) return true; // keep if invalid/missing date

      const now = Date.now();
      const diffHours = (now - tA) / (1000 * 60 * 60);
      return diffHours <= 24; // Keep in stories for 24 hours
    });

    console.log(
      "SanadSouq Stories Engine: Filtered active/recent stories count:",
      filtered.length,
    );

    // Fallback: if there are no VIP or Bronze products in the last 24 hours, show all active VIP/Bronze products so the list is never empty
    if (filtered.length === 0) {
      console.log(
        "SanadSouq Stories Engine: Active recent list is empty. Triggering non-expiry active VIP/Bronze fallback...",
      );
      filtered = allEnrichedProducts.filter((p) => {
        if (p.plan !== "vip" && p.plan !== "bronze") return false;
        if (p.status === "sold") return false;
        return true;
      });
      console.log(
        "SanadSouq Stories Engine: Fallback found active VIP/Bronze count:",
        filtered.length,
      );
    }

    const result = filtered
      .sort((a, b) => {
        // Gold (vip) strictly comes first, Bronze comes second
        if (a.plan === "vip" && b.plan === "bronze") return -1;
        if (a.plan === "bronze" && b.plan === "vip") return 1;

        // Secondary: newest first
        const devA = new Date(a.createdAt).getTime();
        const devB = new Date(b.createdAt).getTime();
        const timeA = isNaN(devA) ? 0 : devA;
        const timeB = isNaN(devB) ? 0 : devB;
        if (timeB !== timeA) {
          return timeB - timeA;
        }

        // Tertiary: views count
        return (b.views || 0) - (a.views || 0);
      })
      .map((p) => {
        return {
          id: p.id,
          sellerId: p.sellerId,
          sellerName: p.sellerName,
          title: p.title,
          sellerAvatar: p.sellerAvatar || "https://via.placeholder.com/150",
          imageUrl: p.imageUrls?.[0] || "https://via.placeholder.com/400",
          imageUrls: p.imageUrls || [],
          createdAt: p.createdAt,
          expiresAt: p.createdAt, // Just for typing, we do custom logic
          isVip: p.plan === "vip",
          views: p.views || 0,
          price: p.price,
          category: p.category,
        };
      });

    const vipCount = allEnrichedProducts.filter((p) => p.plan === "vip").length;
    const bronzeCount = allEnrichedProducts.filter(
      (p) => p.plan === "bronze",
    ).length;
    if (typeof window !== "undefined" && (window as any).__sanadDiagnostics) {
      (window as any).__sanadDiagnostics.vipProductsCount = vipCount;
      (window as any).__sanadDiagnostics.bronzeProductsCount = bronzeCount;
      (window as any).__sanadDiagnostics.rawVipBronzeCount =
        rawVipAndBronze.length;
      (window as any).__sanadDiagnostics.activeVipBronzeCount = filtered.length;
      (window as any).__sanadDiagnostics.storiesCount = result.length;
      (window as any).__sanadDiagnostics.lastUpdate = new Date().toISOString();
    }

    console.log(
      "SanadSouq Stories Engine: Final mapped stories list length:",
      result.length,
      result,
    );
    return result;
  }, [allEnrichedProducts]);

  const currentUserStats = {
    active: products.filter(
      (p) => p.sellerId === currentUserPhone && p.status === "active",
    ).length,
    views: products
      .filter((p) => p.sellerId === currentUserPhone)
      .reduce((sum, p) => sum + (p.views || 0), 0),
    sold: products.filter(
      (p) => p.sellerId === currentUserPhone && p.status === "sold",
    ).length,
  };

  const handleProductClick = useCallback(
    async (productId: string, product: Product) => {
      // Determine the updated product with incremented views
      const updatedProduct = { ...product, views: (product.views || 0) + 1 };

      // Set the selected product for the modal with the latest stats
      setSelectedProduct(updatedProduct);

      window.history.pushState(null, "", `?ad=${productId}`);

      try {
        await updateDoc(doc(db, "products", productId), {
          views: updatedProduct.views,
        });
      } catch (err) {
        console.error("Error updating views", err);
      }
    },
    [],
  );

  const hasActiveBroadcast = activeVipBroadcasts.length > 0;
  const isHomePageActive = true; // Always show home page content behind modals

  if (showDebugPage) {
    return (
      <DebugView
        onBack={() => {
          setShowDebugPage(false);
          try {
            if (typeof window !== "undefined") {
              window.history.pushState(null, "", "/");
            }
          } catch (e) {
            console.error(e);
          }
        }}
        productsCount={products.length}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-base-black flex justify-center items-start md:py-6 p-0 relative selection:bg-[#D4AF37]/30">
      {/* Dynamic Background with Mesh Gradient Effect */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-base-black overflow-hidden">
          <div className="absolute top-[-30%] right-[-20%] w-[130%] h-[130%] bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08)_0%,rgba(11,11,11,1)_80%)] opacity-95" />
          <div className="absolute bottom-[-20%] left-[-20%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05)_0%,transparent_70%)] opacity-90" />
        </div>

      <div
        id="app-root"
        className="min-h-[100dvh] w-full max-w-[480px] bg-base-black text-white relative shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col z-10"
        dir="rtl"
      >
        {/* Royal Login Ticker - Sleek Centered Membership Entry Banner */}
        <div className="fixed top-[74px] left-1/2 -translate-x-1/2 z-[310] w-[90%] max-w-[420px] pointer-events-none flex flex-col items-center">
          <AnimatePresence mode="wait">
            {tickerEvent && (() => {
              const plan = tickerEvent.plan || "free";
              const userFirstChar = tickerEvent.name ? tickerEvent.name.trim().charAt(0).toUpperCase() : "👤";
              
              if (plan === "vip") {
                return (
                  <motion.div
                    key={tickerEvent.id}
                    initial={{ opacity: 0, y: -25, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.96 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full relative rounded-2xl p-4 bg-gradient-to-r from-black via-[#1a1403] to-black border-2 border-[#D4AF37]/60 shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(212,175,55,0.15)] overflow-hidden"
                  >
                    {/* single-sweep elegant golden shine */}
                    <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent pointer-events-none animate-single-shine" />

                    {/* 6 Tiny CSS-confetti particles playing for 1s only */}
                    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-1" />
                      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-2" />
                      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-3" />
                      <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-4" />
                      <div className="absolute top-1/4 left-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-5" />
                      <div className="absolute bottom-1/2 right-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-white to-[#D4AF37] animate-sparkle-6" />
                    </div>

                    <div className="flex items-center gap-3" dir="rtl">
                      {/* Gold Framed Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white via-[#D4AF37] to-[#8a6f27] p-[1.5px] shrink-0 shadow-lg flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-md font-black text-[#D4AF37]">
                          {userFirstChar}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center text-right">
                        <div className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37] shrink-0" />
                          <span className="text-[#D4AF37] text-[11px] font-black tracking-wider">العضوية الملكية الذهبية (VIP Royal)</span>
                        </div>
                        <p className="text-white font-sans text-[13px] sm:text-[14px] font-black tracking-tight mt-0.5 leading-tight">
                          👑 انضم الآن العضو الملكي <span className="text-[#D4AF37] font-black underline decoration-dashed decoration-[#D4AF37]/50">{tickerEvent.name}</span> إلى سوق سند الملكي
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (plan === "bronze" || (plan as string) === "silver") {
                return (
                  <motion.div
                    key={tickerEvent.id}
                    initial={{ opacity: 0, y: -20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full relative rounded-2xl p-3.5 bg-gradient-to-r from-[#12141c] via-[#1c202b] to-[#12141c] border border-slate-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden"
                  >
                    <div className="flex items-center gap-3" dir="rtl">
                      {/* Silver Framed Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 p-[1px] shrink-0 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-sm font-black text-slate-350">
                          {userFirstChar}
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-center text-right">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-slate-400 text-[11px] font-bold">عضوية متميزة</span>
                        </div>
                        <p className="text-slate-100 font-sans text-[12.5px] sm:text-[13px] font-bold mt-0.5 leading-tight">
                          ⭐ انضم الآن العضو المتميز <span className="text-slate-300 font-black">{tickerEvent.name}</span> إلى منصة سند
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={tickerEvent.id}
                  initial={{ opacity: 0, y: -15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="w-full rounded-xl p-3 bg-[#111] border border-neutral-800 shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
                >
                  <div className="flex items-center gap-2.5" dir="rtl">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-400 shrink-0">
                      {userFirstChar}
                    </div>
                    <div className="flex-1 min-w-0 text-right">
                      <p className="text-neutral-300 text-[12.5px] font-semibold truncate leading-tight">
                        👤 دخل العضو <span className="text-white font-black">{tickerEvent.name}</span> التطبيق الآن
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>
        </div>
        {/* Huge Black and Gold Background */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-black overflow-hidden select-none">
          <div className="absolute top-[-30%] right-[-20%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.25)_0%,rgba(0,0,0,1)_70%)]" />
          <div className="absolute bottom-[-30%] left-[-30%] w-[150%] h-[150%] bg-[radial-gradient(circle_at_bottom_left,rgba(180,130,40,0.2)_0%,transparent_60%)]" />
        </div>
        {/* Golden Glowing Ambient Background Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Top center glow */}
          <div className="absolute top-[-15%] left-[10%] sm:left-[25%] w-[80%] sm:w-[50%] h-[45%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.13)_0%,transparent_75%)] blur-[80px] sm:blur-[120px]" />
          {/* Middle right glow */}
          <div className="absolute top-[35%] -right-[10%] w-[60%] sm:w-[40%] h-[45%] rounded-full bg-[radial-gradient(circle,rgba(170,124,17,0.09)_0%,transparent_75%)] blur-[100px] sm:blur-[140px]" />
          {/* Bottom left glow */}
          <div className="absolute bottom-[10%] -left-[15%] w-[55%] sm:w-[35%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(255,243,176,0.08)_0%,transparent_75%)] blur-[90px] sm:blur-[130px]" />
        </div>

        {/* Watermark Background */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden flex flex-col items-center justify-center opacity-[0.08] select-none">
          <div className="absolute top-0 w-full h-[100vh] flex flex-col items-center justify-center gap-16 -rotate-12 scale-[1.5] sm:scale-[1.8]">
            <div className="flex items-center gap-12">
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
            </div>
            <div className="flex items-center gap-12 opacity-50 ml-40">
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
            </div>
            <div className="flex items-center gap-12 mr-40">
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
            </div>
            <div className="flex items-center gap-12 opacity-50 -ml-20">
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
              <Crown className="w-32 h-32 sm:w-40 sm:h-40 text-[#D4AF37] opacity-80" />
              <span
                className="text-8xl sm:text-9xl font-black font-display text-transparent outline-text drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]"
                style={{ WebkitTextStroke: "2px #D4AF37" }}
              >
                سوق سند
              </span>
            </div>
          </div>
        </div>

        {isSplashActive && (
          <SplashScreen 
            onComplete={() => setIsSplashActive(false)} 
            isReady={productsLoaded && usersLoaded} 
          />
        )}

        {/* Header Container */}
        <div className="pt-2 px-3 sm:px-4 max-w-7xl mx-auto w-full transition-all duration-300 relative z-50 flex flex-col">
          <header className="bg-transparent w-full">
            <div className="flex items-center justify-between h-[54px] relative w-full">
              {/* Left Side: Avatar and Bell */}
              <div className="flex items-center gap-1 sm:gap-2 z-10 scale-[0.85] sm:scale-100 origin-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentUserPhone) setShowProfile(true);
                    else setShowAuth(true);
                  }}
                  className="relative flex items-center gap-1.5 p-1 pr-1.5 sm:p-1.5 sm:pr-2 bg-[#111] border border-[#D4AF37]/30 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:border-[#D4AF37] transition-all active:scale-95 group"
                >
                  <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center p-[2.5px] bg-gradient-to-br from-[#f3db8b] via-[#D4AF37] to-[#7a5f11] shadow-[0_4px_8px_rgba(212,175,55,0.3),inset_0_2px_4px_rgba(255,255,255,0.5)] flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-[2px] border-black shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)]">
                      {currentUserObj?.avatar ? (
                        <img src={currentUserObj.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-[#D4AF37] drop-shadow-md group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                  {!currentUserPhone && (
                     <span className="text-[10px] sm:text-[11px] font-black text-[#D4AF37] pl-2 pr-0.5 sm:pl-3 sm:pr-1 whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">دخول</span>
                  )}
                  {currentUserPhone && currentUserObj?.name && (
                     <span className="text-[10px] sm:text-[11px] font-black text-[#D4AF37] pl-2 pr-0.5 sm:pl-3 sm:pr-1 whitespace-nowrap max-w-[65px] truncate drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">{currentUserObj.name.split(' ')[0]}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => currentUserPhone ? setShowNotificationsModal(true) : setShowAuth(true)}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-zinc-100 hover:text-[#D4AF37] transition-all cursor-pointer flex-shrink-0"
                >
                  <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-sm" />
                  {currentUserPhone && (() => {
                    const unreadCount = userNotifications.filter(n => n && n.userPhone === currentUserPhone && !n.read).length + (currentUserPhone === "92942482" ? notificationsCount : 0);
                    return unreadCount > 0 ? (
                      <span className="absolute top-1 right-1 bg-red-600 text-[9px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-black shadow-sm animate-pulse">
                        {unreadCount}
                      </span>
                    ) : null;
                  })()}
                </button>
              </div>

              {/* Center: Compact Logo - Perfectly Centered Absolute Position */}
              <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center pointer-events-auto z-20 scale-[0.85] sm:scale-100 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="flex items-center gap-1">
                    <Crown className="w-5 h-5 text-[#D4AF37] drop-shadow-sm" fill="currentColor" />
                    <span className="text-[20px] font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8860B] tracking-wider">
                      سُوق سَنَد
                    </span>
                  </div>
                  <span className="text-[8px] text-[#B8860B] font-bold tracking-[0.25em] -mt-1 uppercase">
                    CLASSIFIED ADS
                  </span>
              </div>

              {/* Right Side: Subscriptions Button */}
              <div className="flex justify-end z-10 scale-[0.85] sm:scale-100 origin-left">
                <button
                  type="button"
                  onClick={() => {
                    if (activeBottomTab !== "home") {
                      setActiveBottomTab("home");
                      setTimeout(() => {
                        const pricingSec = document.getElementById("pricing-packages");
                        if (pricingSec) {
                           pricingSec.scrollIntoView({ behavior: "smooth", block: "start" });
                        } else {
                          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                        }
                      }, 10);
                    } else {
                      const pricingSec = document.getElementById("pricing-packages");
                      if (pricingSec) {
                         pricingSec.scrollIntoView({ behavior: "smooth", block: "start" });
                      } else {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }
                    }
                  }}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl border border-[#D4AF37]/60 bg-slate-900/60 text-[#D4AF37] transition-all cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(212,175,55,0.1)]"
                >
                  <Crown className="w-3 h-3 text-[#D4AF37]" fill="currentColor" />
                  <span className="text-[9px] font-black pt-0.5 whitespace-nowrap">الاشتراكات الملكية</span>
                </button>
              </div>
            </div>
          </header>
        </div>


        {/* Offline Banner */}
        <AnimatePresence key="offline-banner-presence">
          {isOffline && (
            <motion.div
              key="offline-banner"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`bg-red-500/95 text-white text-xs font-semibold py-2.5 px-4 w-full text-center shadow-md border-b border-red-600 sticky ${hasActiveBroadcast ? "top-[112px]" : "top-[76px]"} z-30 flex items-center justify-center gap-1.5 transition-all duration-300`}
            >
              <span>
                أنت تتصفح الإعلانات المحفوظة مؤقتاً (وضع أوفلاين) - سنقوم بتحديث
                البيانات تلقائياً فور استعادة الاتصال 🌐
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          ref={mainRef}
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-1 pb-10 relative z-10 w-full overflow-x-hidden"
        >
          {/* 1. Selection & Search Section */}
          <div
            className="mb-1.5 relative z-20 w-full max-w-4xl mx-auto space-y-1 mt-0.5"
          >
             {/* Region & Filter Top Bar */}
             <div className="flex items-center gap-1.5 w-full">
                {/* Region Filter */}
                <div 
                  onClick={() => setShowStateModal(true)}
                  className="flex-1 flex items-center justify-between px-3 h-[42px] cursor-pointer bg-[#181818] border border-white/5 rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-800/80 group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6.5 h-6.5 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20 group-hover:scale-110 transition-transform">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[11.5px] font-black text-gray-100">
                        {selectedRegion === "الكل" ? "كل الولايات" : selectedRegion}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#D4AF37]/50" />
                </div>

                {/* Main Filter Button */}
                <button
                  type="button"
                  onClick={() => setShowSidebar(true)}
                  className="flex-shrink-0 w-[42px] h-[42px] flex items-center justify-center rounded-2xl bg-[#181818] border border-emerald-500/30 text-emerald-400 active:scale-95 hover:bg-emerald-500/10 transition-colors"
                  title="الفلاتر"
                >
                  <Sliders className="w-4 h-4" />
                </button>
             </div>

             {/* Modern Search Bar */}
             <div className="relative w-full h-[42px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="سيارات، عقارات، ملابس..."
                  className="w-full h-full bg-[#181818] border border-white/5 focus:border-[#D4AF37] focus:bg-[#111] outline-none text-[13px] text-right text-gray-100 rounded-2xl pr-12 pl-4 transition-all shadow-xl placeholder:text-gray-500 font-medium"
                  dir="rtl"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Search className="w-5 h-5 text-[#D4AF37]/70" />
                </div>
                {searchQuery && (
                   <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
                   >
                     <X className="w-3 h-3" />
                   </button>
                )}
             </div>

            {/* Premium Broadcast Marquee */}
            {isHomePageActive && activeVipBroadcasts.length > 0 && (
              <div className="w-full sticky top-[60px] sm:top-[70px] z-[120] mb-2 drop-shadow-md">
                <BroadcastMarquee
                  queue={activeVipBroadcasts}
                  relative={true}
                  onProductClick={handleBroadcastProductSelect}
                  onDismiss={(id) => {
                    setActiveVipBroadcasts((prev) => prev.filter((b) => b.id !== id));
                    handleDismissBroadcast(id);
                  }}
                />
              </div>
            )}
          </div>

          {/* 2. Primary VIP Ad Slider */}
          {isHomePageActive && vipProducts.length > 0 && (
            <div className="mb-0.5 relative z-10 px-0">
              <VipAdSlider
                vipProducts={vipProducts.slice(0, 5)}
                heightClass="h-[185px] sm:h-[225px]"
                onAdClick={(product) => setSelectedProduct(product)}
              />
            </div>
          )}

          {/* 3. Redesigned Stories Section (Elite Cards) */}
          {isHomePageActive && (
            <div className="mb-0.5 relative z-20">
              <VipStoriesRow
                stories={stories}
                currentUserObj={currentUserObj}
                onProfileClick={() => currentUserPhone ? setShowProfile(true) : setShowAuth(true)}
                onStoryClick={(id) => setStoryViewerId(id)}
              />
            </div>
          )}

          {/* 4. Secondary Ad Slider (Silver Elite) */}
          {isHomePageActive && bronzeProducts.length > 0 && (
            <div className="mb-1 relative z-10">
              <div className="flex items-center justify-between mb-0.5 px-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-80">النخبة الملكية الفضية</span>
                 <div className="h-px bg-gradient-to-l from-slate-400/20 to-transparent flex-1 mr-4" />
              </div>
              <VipAdSlider
                vipProducts={bronzeProducts.slice(0, 5)}
                isSecondary={true}
                heightClass="h-[185px] sm:h-[225px]"
                onAdClick={(product) => setSelectedProduct(product)}
              />
            </div>
          )}

          <AnimatePresence>
            {/* Main Ad Section View (Listing Sections) */}
            <div className={`transition-all duration-700 ${isHomePageActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              
              {/* Section VIP */}
              <div className="mb-2 scroll-mt-24" id="listings-head">
            <div className="flex flex-col items-center text-center justify-center gap-1 mb-2 px-4">
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent flex items-center justify-center border transition-all duration-700 ${activeBottomTab === "listings" ? "scale-105 border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-gradient-to-br from-[#D4AF37]/35 to-black/30" : "border-[#D4AF37]/30 shadow-[0_0_12px_rgba(212,175,55,0.1)]"}`}
              >
                <Crown
                  className={`w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF37] transition-all duration-700 ${activeBottomTab === "listings" ? "scale-105 rotate-12 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""}`}
                />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold font-display text-white mb-0.5 tracking-tight transition-colors duration-500">
                  النخبة الملكية{" "}
                  <span
                    className={`text-[#D4AF37] transition-all duration-500 ${activeBottomTab === "listings" ? "drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" : ""}`}
                  >
                    VIP
                  </span>
                </h2>
                <p className="text-[9px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  أرقى العروض والسلع الحصرية
                </p>
              </div>
            </div>
            {!productsLoaded ? (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
                }
              >
                {[...Array(4)].map((_, i) => (
                  <ListingSkeleton key={`sk-vip-${i}`} viewMode={viewMode} />
                ))}
              </div>
            ) : vipProducts.length > 0 ? (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
                }
              >
                <AnimatePresence>
                  {vipProducts.map((product, index) => (
                    <ListingCard
                      key={`vip-${product.id}-${index}`}
                      product={product}
                      onClick={handleProductClick}
                      searchQuery={searchQuery}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                      isLiked={likedProductIds.includes(product.id)}
                      onToggleLike={toggleLike}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                icon={Crown}
                title="لا توجد عروض"
                desc="لا توجد عروض VIP حالياً في هذا القسم"
              />
            )}
          </div>
          {/* Section Bronze */}
          <div className="mb-3">
            <div className="flex flex-col items-center text-center justify-center gap-1 mb-2 px-4">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#d97706]/20 to-transparent flex items-center justify-center border border-[#d97706]/30 shadow-[0_0_12px_rgba(217,119,6,0.1)]">
                <Star className="w-5 h-5 sm:w-7 sm:h-7 text-[#d97706]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold font-display text-white mb-0.5 tracking-tight">
                  عروض التميز <span className="text-[#d97706] drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]">البرونزية</span>
                </h2>
                <p className="text-[9px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  اختياراتنا المميزة لبائعين موثوقين
                </p>
              </div>
            </div>
            {!productsLoaded ? (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
                }
              >
                {[...Array(4)].map((_, i) => (
                  <ListingSkeleton key={`sk-bronze-${i}`} viewMode={viewMode} />
                ))}
              </div>
            ) : bronzeProducts.length > 0 ? (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
                }
              >
                <AnimatePresence>
                  {bronzeProducts.map((product, index) => (
                    <ListingCard
                      key={`bronze-${product.id}-${index}`}
                      product={product}
                      onClick={handleProductClick}
                      searchQuery={searchQuery}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                      isLiked={likedProductIds.includes(product.id)}
                      onToggleLike={toggleLike}
                      viewMode={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <EmptyState
                icon={Star}
                title="لا توجد عروض"
                desc="لا توجد عروض برونزية حالياً في هذا القسم"
              />
            )}
          </div>
          {/* Section General */}
          <div className="mb-2">
            <div className="flex flex-col items-center text-center justify-center gap-1 mb-1 px-4">
              <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#10B981]/20 to-transparent flex items-center justify-center border border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                <ShoppingBag className="w-5.5 h-5.5 sm:w-8 sm:h-8 text-[#10B981]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-extrabold font-display text-white mb-1 tracking-tight">
                  القائمة العامة
                </h2>
                <p className="text-[11px] sm:text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  عروض سوقنا المتنوعة لكل الفئات
                </p>
              </div>
            </div>
            {!productsLoaded ? (
              <div
                className={
                  viewMode === "list"
                    ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto"
                    : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
                }
              >
                {[...Array(10)].map((_, i) => (
                  <ListingSkeleton
                    key={`sk-general-${i}`}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : generalProducts.length > 0 ? (
              <div className="flex flex-col items-center">
                <div
                  className={
                    viewMode === "list"
                      ? "grid grid-cols-1 gap-4 max-w-4xl mx-auto w-full"
                      : "grid grid-cols-2 gap-2 w-full"
                  }
                >
                  <AnimatePresence>
                    {generalProducts.map((product, index) => (
                      <ListingCard
                        key={`general-${product.id}-${index}`}
                        product={product}
                        onClick={handleProductClick}
                        searchQuery={searchQuery}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={toggleFavorite}
                        isLiked={likedProductIds.includes(product.id)}
                        onToggleLike={toggleLike}
                        viewMode={viewMode}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="لا توجد عروض"
                desc="لا توجد عروض حالياً في هذا القسم"
              />
            )}
          </div>
          {recentlyViewed.length > 0 && (
            <div className="mb-4 mt-2">
              <h3 className="text-xl font-bold text-white mb-4 mr-4">
                شوهد مؤخراً
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {recentlyViewed.map((id, index) => {
                  const p = products.find((prod) => prod.id === id);
                  if (!p) return null;
                  return (
                    <div
                      key={`recent-${p.id}-${index}`}
                      className="cursor-pointer shrink-0 transition-transform hover:scale-105"
                      onClick={() => handleProductClick(p.id, p)}
                    >
                      <img
                        src={
                          p.imageUrls?.[0] || "https://via.placeholder.com/150"
                        }
                        className="w-20 h-20 rounded-2xl object-cover border border-gray-800"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Pricing Packages */}
          <PricingPackages
            onSubscriptionRequest={(id) => setDirectPaymentPkg(id)}
            hasPendingRequest={!!pendingRequest}
            showToast={showToast}
            currentUserPhone={currentUserPhone}
          />
          <Footer />
        </div>
      </AnimatePresence>
    </main>

      <AnimatePresence>
          {showSidebar && (
            <Suspense key="suspense-sidebar" fallback={<ModalFallback />}>
              <Sidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onClose={() => setShowSidebar(false)}
              />
            </Suspense>
          )}
          <StateModal
            isOpen={showStateModal}
            onClose={() => setShowStateModal(false)}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            regions={REGIONS}
          />
          {showAdmin && (
            <Suspense key="suspense-admin" fallback={<ModalFallback />}>
              <AdminPanel
                onClose={() => setShowAdmin(false)}
                systemUsers={systemUsers}
                setSystemUsers={setSystemUsers}
                systemRequests={systemRequests}
                setSystemRequests={setSystemRequests}
                onAddUserNotification={(phone: string, msg: string) => {
                  const newNotif = {
                    id:
                      String(Date.now()) +
                      Math.random().toString(36).substr(2, 9),
                    userPhone: phone,
                    message: msg,
                    read: false,
                    createdAt: new Date().toISOString(),
                  };
                  setUserNotifications((prev) => [newNotif, ...prev]);
                }}
                products={products}
                setProducts={setProducts}
                notificationsCount={notificationsCount}
                setNotificationsCount={setNotificationsCount}
                showToast={showToast}
              />
            </Suspense>
          )}
          {showAuth && (
            <Suspense key="suspense-auth" fallback={<ModalFallback />}>
              <AuthModal
                key="auth"
                onClose={() => setShowAuth(false)}
                onAuth={handleAuth}
              />
            </Suspense>
          )}

          {/* Premium Live FCM Notification Popup Card */}
          <AnimatePresence key="live-alert-presence">
            {liveProductAlert && (
              <motion.div
                key="live-product-alert"
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="fixed top-24 left-4 right-4 md:left-auto md:right-8 z-50 max-w-sm w-full bg-[#0B0B0B]/95 border border-[#D4AF37] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                dir="rtl"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
                    <Bell className="w-6 h-6 text-[#D4AF37] animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2.5 py-0.5 rounded-full font-black">
                        إشعار فوري للأقسام المفضلة
                      </span>
                      <button
                        onClick={() => setLiveProductAlert(null)}
                        className="text-gray-500 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="text-sm font-black text-white mt-2 leading-snug">
                      {liveProductAlert.title}
                    </h4>
                    <p className="text-[11px] text-[#10B981] mt-1 font-black">
                      بسعر: {liveProductAlert.price} د.ت • قسم:{" "}
                      {liveProductAlert.category}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setSelectedProduct(liveProductAlert.product);
                          setLiveProductAlert(null);
                        }}
                        className="flex-1 py-2 bg-[#D4AF37] text-black text-xs font-black rounded-xl hover:bg-[#b59223] transition-colors cursor-pointer text-center"
                      >
                        معاينة الإعلان الفورية 👁️
                      </button>
                      <button
                        onClick={() => setLiveProductAlert(null)}
                        className="px-3 py-2 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        تجاهل
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {storyViewerId && (
            <StoryViewerModal
              key={`story-viewer-${storyViewerId}`}
              stories={stories}
              initialStoryId={storyViewerId}
              onClose={() => setStoryViewerId(null)}
              onActionClick={(story) => {
                const prod = products.find((p) => p.id === story.id);
                if (prod) {
                  handleProductClick(prod.id, prod);
                  setStoryViewerId(null);
                }
              }}
            />
          )}
          {showProfile && (
            <Suspense key="suspense-profile" fallback={<ModalFallback />}>
              <ProfileModal
                onClose={() => setShowProfile(false)}
                phone={currentUserPhone ?? undefined}
                currentUserPlan={currentUserPlan}
                pendingPlan={pendingRequest?.plan}
                stats={currentUserStats}
                currentUser={loggedUserObj}
                favoriteCategories={favoriteCategories}
                onToggleFavoriteCategory={handleToggleFavoriteCategory}
                onViewPackages={() => {
                  setShowProfile(false);
                  
                  // Lock scroll listener during instant page transition
                  isManualClickRef.current = true;
                  
                  // Clear query and filter to make sure feed is fully loaded
                  setSelectedCategory("الكل");
                  setSearchQuery("");
                  
                  // Highlight memberships active bottom nav tab
                  setActiveBottomTab("memberships");
                  
                  setTimeout(() => {
                    const pricingSec = document.getElementById("pricing-packages");
                    if (pricingSec) {
                      pricingSec.scrollIntoView({
                        behavior: "auto",
                        block: "start",
                      });
                    }
                    
                    // Guarantee absolute accuracy with a secondary layout tick
                    setTimeout(() => {
                      if (pricingSec) {
                        pricingSec.scrollIntoView({
                          behavior: "auto",
                          block: "start",
                        });
                      }
                      isManualClickRef.current = false;
                    }, 60);
                  }, 15);
                }}
                onSaveProfile={async (name, avatar) => {
                  if (!currentUserPhone) return;
                  try {
                    let uploadedAvatar = avatar;
                    if (avatar && avatar.startsWith("data:image")) {
                      try {
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ image: avatar }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          if (data.secure_url) {
                            uploadedAvatar = data.secure_url;
                          }
                        }
                      } catch (err) {
                        console.error(
                          "Avatar upload failed, using fallback:",
                          err,
                        );
                      }
                    }
                    await setDoc(
                      doc(db, "systemUsers", currentUserPhone),
                      { name, avatar: uploadedAvatar },
                      { merge: true },
                    );
                    showToast("تم حفظ الملف الشخصي بنجاح", "success");
                  } catch (e) {
                    console.error("Error saving profile", e);
                    showToast("حدث خطأ أثناء حفظ الملف الشخصي", "error");
                  }
                }}
                onOpenAdmin={
                  currentUserPhone === "92942482"
                    ? () => {
                        setShowAdmin(true);
                        setShowProfile(false);
                      }
                    : undefined
                }
                onLogout={() => {
                  setCurrentUserPhone(null);
                  setCurrentUserPlan("free");
                  setLoggedUserObj(null);
                }}
              />
            </Suspense>
          )}
          {showAddProduct && (
            <Suspense key="suspense-addproduct" fallback={<ModalFallback />}>
              <AddProductModal
                key="addproduct"
                onClose={() => {
                  setShowAddProduct(false);
                  setEditingProduct(null);
                }}
                onAdd={(p) => handleAddProduct({ ...p, plan: currentUserPlan })}
                onEdit={async (p) => {
                  try {
                    await updateDoc(
                      doc(db, "products", p.id),
                      cleanUndefined({
                        ...p,
                      }),
                    );
                    setShowAddProduct(false);
                    setEditingProduct(null);
                    showToast("تم تحديث الإعلان بنجاح", "success");
                  } catch (err) {
                    console.error("Failed to edit ad", err);
                    showToast("حدث خطأ أثناء تعديل الإعلان", "error");
                  }
                }}
                currentUserPhone={currentUserPhone}
                currentUser={loggedUserObj}
                initialProduct={editingProduct}
                showToast={showToast}
              />
            </Suspense>
          )}
          {selectedProduct && (
            <Suspense key="suspense-details" fallback={<ModalFallback />}>
              <ProductDetailsModal
                key={`product-details-${selectedProduct.id}`}
                product={
                  products.find((p) => p.id === selectedProduct.id) ||
                  selectedProduct
                }
                isFavorite={favorites.includes(selectedProduct.id)}
                onToggleFavorite={(e) => toggleFavorite(selectedProduct.id, e)}
                isLiked={likedProductIds.includes(selectedProduct.id)}
                onToggleLike={(e) => toggleLike(selectedProduct.id, e)}
                onClose={() => {
                  setSelectedProduct(null);
                  window.history.pushState(null, "", window.location.pathname);
                }}
                currentUserPhone={currentUserPhone}
                currentUser={loggedUserObj}
                isAdmin={currentUserPhone === "92942482"}
                showToast={showToast}
                onDelete={async () => {
                  try {
                    await deleteDoc(doc(db, "products", selectedProduct!.id));
                    showToast("تم حذف الإعلان بنجاح", "success");
                    setSelectedProduct(null);
                  } catch (err) {
                    console.error("Error deleting product", err);
                  }
                }}
                onEdit={(product) => {
                  setEditingProduct(product);
                  setShowAddProduct(true);
                }}
                onUpdateComments={async (productId, updatedComments) => {
                  try {
                    await updateDoc(doc(db, "products", productId), {
                      comments: updatedComments,
                    });

                    // Check if a comment was added (rather than deleted)
                    const oldCommentsCount = selectedProduct?.comments?.length || 0;
                    if (updatedComments.length > oldCommentsCount && selectedProduct) {
                      const latestComment = updatedComments[updatedComments.length - 1];
                      const commenterName = currentUserObj?.name || currentUserPhone || "مستعمل متميز";
                      const sellerPhone = selectedProduct.sellerId;
                      
                      if (sellerPhone && sellerPhone !== currentUserPhone) {
                        console.log("Attempting to send comment notification to seller:", sellerPhone);
                        try {
                          await createSystemNotification(
                            sellerPhone,
                            `💬 تعليق/استفسار جديد على منتجك "${selectedProduct.title}"! من قِبل: ${commenterName}. يرجى التحقق والرد عليه باسرع وقت.`,
                            selectedProduct.id
                          );
                          console.log("Comment notification sent successfully");
                        } catch (commentErr) {
                          console.error("Failed to send comment notification:", commentErr);
                        }
                      }
                    }

                    setSelectedProduct((prev) =>
                      prev && prev.id === productId
                        ? { ...prev, comments: updatedComments }
                        : prev,
                    );
                  } catch (err) {
                    console.error("Error updating comments", err);
                  }
                }}
                onAddNotification={(phone, message) => {
                  createSystemNotification(phone, message, selectedProduct?.id);
                  showToast(
                    "تنبيه: تم تلقي تعليق جديد على إعلانك! 🔔",
                    "success",
                  );
                }}
              />
            </Suspense>
          )}
          {/* Notifications Modal for Regular Users */}
          {showNotificationsModal && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90"
              onClick={() => {
                setShowNotificationsModal(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-gradient-to-b from-[#0a0a0a] to-[#020202] border border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden text-right"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background gold aura decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-center pb-4 border-b border-gray-900 mb-6 font-display">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                      <span className="text-sm">🔔</span>
                    </div>
                    <h3 className="text-lg font-black font-display text-white">
                      إشعارات الحساب
                    </h3>
                  </div>
                  {(userNotifications || []).filter(n => n && n.userPhone === currentUserPhone && !n.read).length > 0 && (
                    <button
                      onClick={async () => {
                        const batch = writeBatch(db);
                        const unread = (userNotifications || []).filter(n => n && n.userPhone === currentUserPhone && !n.read);
                        unread.forEach(n => {
                          if (n.id) {
                            batch.update(doc(db, "systemNotifications", n.id), { read: true });
                          }
                        });
                        await batch.commit().catch(console.error);
                        setUserNotifications(prev => (prev || []).map(n => ({...n, read: true})));
                      }}
                      className="text-[10px] font-bold text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                    >
                      تعطيل الكل كمقروء
                    </button>
                  )}
                  {currentUserPhone === "92942482" && (
                    <button
                      onClick={() => {
                        setShowNotificationsModal(false);
                        setShowAdmin(true);
                      }}
                      className="text-[10px] sm:text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 px-3 py-1.5 rounded-xl border border-[#D4AF37]/20 transition-all cursor-pointer"
                    >
                      لوحة الإدارة 🛡️ ({notificationsCount})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowNotificationsModal(false);
                    }}
                    className="p-2 bg-gray-900 hover:bg-gray-800 rounded-full border border-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {(userNotifications || []).filter(
                    (n) => n && n.userPhone === currentUserPhone,
                  ).length > 0 ? (
                    (userNotifications || [])
                      .filter((n) => n && n.userPhone === currentUserPhone)
                      .map((n, index) => (
                        <div
                          key={n.id ? `${n.id}-${index}` : `notif-${index}`}
                          onClick={() => {
                            setUserNotifications((prev) =>
                              (prev || []).map((notif) =>
                                notif && notif.id && n.id && notif.id === n.id
                                  ? { ...notif, read: true }
                                  : notif,
                              ),
                            );
                            if (n.id) {
                              updateDoc(doc(db, "systemNotifications", n.id), { read: true }).catch((err) =>
                                console.error("Error marking read in Firestore:", err)
                              );
                            }
                            if (n.productId) {
                              const p = products.find(
                                (prod) => prod && prod.id === n.productId,
                              );
                                if (p) {
                                  handleProductClick(p.id, p);
                                  setShowNotificationsModal(false);
                                }
                              }
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer hover:bg-white/5 ${!n.read ? "border-[#D4AF37]/30 bg-[#D4AF37]/5" : "border-gray-950 bg-black/40"} transition-all`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1">
                                {!n.read ? (
                                  <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0 mt-0.5 text-[#10B981]">
                                    <span className="text-xs font-black">✓</span>
                                  </div>
                                )}
                                <div className="space-y-1 flex-1 text-right">
                                  <p className="text-white text-sm font-bold leading-relaxed">
                                    {n.message || "إشعار جديد في سوق سند"}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                    {(() => {
                                      try {
                                        if (!n.createdAt) return "قبل قليل";
                                        const d = new Date(n.createdAt);
                                        if (isNaN(d.getTime())) return "قبل قليل";
                                        return d.toLocaleDateString("ar-TN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        });
                                      } catch {
                                        return "قبل قليل";
                                      }
                                    })()}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                title="حذف هذا الإشعار"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setUserNotifications((prev) =>
                                    (prev || []).filter(
                                      (notif) =>
                                        notif && n.id && notif.id !== n.id,
                                    ),
                                  );
                                  if (n.id) {
                                    deleteDoc(doc(db, "systemNotifications", n.id)).catch((err) =>
                                      console.error("Error deleting from Firestore:", err)
                                    );
                                  }
                                }}
                              className="p-1.5 self-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 space-y-3">
                      <span className="text-3xl inline-block animate-bounce">
                        🔔
                      </span>
                      <p className="text-xs">
                        المستقبل هادئ، لا توجد إشعارات جديدة حالياً.
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={async () => {
                    try {
                      const batch = writeBatch(db);
                      const unread = (userNotifications || []).filter(
                        (n) => n && n.userPhone === currentUserPhone && !n.read
                      );
                      unread.forEach((n) => {
                        if (n.id) {
                          batch.update(doc(db, "systemNotifications", n.id), { read: true });
                        }
                      });
                      await batch.commit();
                    } catch (err) {
                      console.error("Failed to batch mark read systemNotifications:", err);
                    }

                    setUserNotifications((prev) =>
                      (prev || []).map((n) =>
                        n && n.userPhone === currentUserPhone
                          ? { ...n, read: true }
                          : n,
                      ),
                    );
                    setShowNotificationsModal(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-extrabold text-sm rounded-xl hover:opacity-95 mt-6 transition-opacity cursor-pointer text-center font-display"
                >
                  فهمت وتأكيد القراءة
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence key="publishing-transition-presence">
          {isPublishingTransition && (
            <PublishingTransition
              key="publishing-transition"
              plan={transitionPlan}
            />
          )}
        </AnimatePresence>

        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Dynamic Unified ⊕ Contact Trigger (WhatsApp + Facebook Merger) */}
      </div>

      {/* FIXED UI ELEMENTS - Moved outside central container for absolute rendering reliability */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-[480px] pointer-events-none z-50">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 right-6 pointer-events-auto pb-4">
            <AnimatePresence key="social-menu-presence">
              {showSocialMenu && (
                <motion.div
                  key="social-menu"
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute bottom-16 right-0 bg-[#111]/95 border border-[#D4AF37]/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex flex-col gap-3 min-w-[220px]"
                >
                  <a
                    href="https://www.facebook.com/share/1ENN1nm6tn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowSocialMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 hover:bg-emerald-500/20 text-white font-bold text-[13px] border border-white/5 rounded-xl transition-all"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <span>صفحة فيسبوك سَنَد</span>
                  </a>

                  <a
                    href={`https://wa.me/21692942482?text=${encodeURIComponent("مرحباً إدارة سوق سند، لدي استفسار وأود التواصل معكم.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowSocialMenu(false)}
                    className="flex items-center gap-3 px-3 py-2.5 bg-slate-800/50 hover:bg-emerald-500/20 text-white font-bold text-[13px] border border-white/5 rounded-xl transition-all"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                    </div>
                    <span>تواصل واتساب سَنَد</span>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowSocialMenu(!showSocialMenu)}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative select-none hover:scale-110 active:scale-95 border-2 pointer-events-auto ${
                showSocialMenu
                  ? "bg-gradient-to-b from-[#F5D76E] via-[#D4AF37] to-[#B8860B] border-[#D4AF37] text-slate-900 shadow-[0_10px_25px_rgba(212,175,55,0.4)]"
                  : "bg-slate-900 border-emerald-500/50 text-emerald-400 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.2)]"
              }`}
            >
              {showSocialMenu ? <X className="w-5 h-5" /> : <span className="text-2xl">💬</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Global Modals - Moved to end for absolute z-index stability and to prevent being clipped by layout containers */}
      <AnimatePresence mode="wait">
        {directPaymentPkg && (
          <PaymentModal
            key="payment-modal-unified"
            packageId={directPaymentPkg}
            onClose={() => setDirectPaymentPkg(null)}
            onConfirm={() => {
               handleSubscriptionRequest(directPaymentPkg);
               // Do not close immediately, PaymentModal has internal 'confirmed' state
            }}
          />
        )}
      </AnimatePresence>

      <div
        className="fixed bottom-3 left-1/2 w-[92%] sm:w-[460px] -translate-x-1/2 z-[60] bg-[#0B0B0B]/98 border border-white/10 rounded-[20px] px-2 py-1.5 grid grid-cols-5 items-center justify-items-center gap-1 shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        dir="rtl"
      >
        <button
          type="button"
          onClick={() => {
            isManualClickRef.current = true;
            setShowProfile(false);
            setShowAdmin(false);
            setShowAddProduct(false);
            setShowAuth(false);
            setActiveBottomTab("home");
            // Use auto for more reliable instant reset without layout rubber banding
            window.scrollTo({ top: 0, behavior: "auto" });
            const root = document.getElementById("app-root");
            if (root) root.scrollIntoView({ behavior: "auto" });
            setTimeout(() => { isManualClickRef.current = false; }, 100);
          }}
          className={`w-full flex flex-col items-center gap-0.5 transition-all ${activeBottomTab === "home" ? "text-[#D4AF37]" : "text-gray-400 hover:text-white"}`}
        >
          <Home className={`w-5 h-5 sm:w-6 sm:h-6 ${activeBottomTab === "home" ? "drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" : ""}`} />
          <span className="text-[9px] sm:text-[10px] font-black">الرئيسية</span>
        </button>

                <button
                  type="button"
                  onClick={() => {
                    handleManualTabClick("listings");
                    const targetEl = document.getElementById("listings-head");
                    if (targetEl) {
                      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className={`w-full flex flex-col items-center gap-0.5 transition-all ${activeBottomTab === "listings" ? "text-[#D4AF37]" : "text-gray-400 hover:text-white"}`}
                >
                  <Grid className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-[9px] sm:text-[10px] font-black">الأقسام</span>
                </button>

        <button
          type="button"
          onClick={() => {
            if (currentUserPhone) setShowAddProduct(true);
            else setShowAuth(true);
          }}
          className="w-full h-full relative flex items-center justify-center -mt-6 sm:-mt-8"
        >
          <div className="w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] border-[4px] border-[#0a0a0a] transition-all hover:scale-110 active:scale-90">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 text-slate-950" strokeWidth={3} />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            handleManualTabClick("favorites");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`w-full flex flex-col items-center gap-0.5 transition-all ${activeBottomTab === "favorites" ? "text-rose-500" : "text-gray-400 hover:text-white"}`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${activeBottomTab === "favorites" ? "fill-rose-500" : ""}`} />
            {favorites?.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#0a0a0a]">
                {favorites.length}
              </span>
            )}
          </div>
          <span className="text-[9px] sm:text-[10px] font-black">المفضلة</span>
        </button>

        <button
          onClick={() => {
            if (currentUserPhone) setShowProfile(true);
            else setShowAuth(true);
          }}
          className={`w-full flex flex-col items-center gap-0.5 transition-all ${activeBottomTab === "profile" ? "text-emerald-400" : "text-gray-400 hover:text-white"}`}
        >
          <User className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-[9px] sm:text-[10px] font-black">الحساب</span>
        </button>
      </div>
    </div>
  );
}
