/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_COSTUMES, PRESET_OUTFITS } from './data/initialCostumes';
import { CostumeItem, LookbookItem, OutfitComposition } from './types/vietphuc';
import { AppUser, SUPER_ADMIN_EMAIL } from './types/auth';
import { Header } from './components/Header';
import { ArchiveCatalog } from './components/ArchiveCatalog';
import { MixMatchStudio } from './components/MixMatchStudio';
import { LookbookGallery } from './components/LookbookGallery';
import { CulturalGuideSection } from './components/CulturalGuideSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookbookCardModal } from './components/LookbookCardModal';
import { SideBySideComparison } from './components/SideBySideComparison';
import { WardrobeDrawer } from './components/WardrobeDrawer';
import { NoCodeCMSModal } from './components/NoCodeCMSModal';
import { AuthModal } from './components/AuthModal';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_COSTUMES = 'vietphuc_costumes_v1';
const STORAGE_KEY_WARDROBE = 'vietphuc_wardrobe_v1';
const STORAGE_KEY_LOOKBOOKS = 'cophuc_remix_lookbooks_v1';
const STORAGE_KEY_USERS = 'vietphuc_registered_users_v2';
const STORAGE_KEY_CURRENT_USER = 'vietphuc_current_user_v2';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'archive' | 'studio' | 'lookbook' | 'guides'>('archive');

  // Costumes list (tất cả các bản demo đã được xóa theo yêu cầu)
  const [costumes, setCostumes] = useState<CostumeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COSTUMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Chỉ giữ lại các món do người dùng tự tạo/tải lên, loại bỏ toàn bộ bản demo cũ
          return parsed.filter((item: CostumeItem) => item.isCustom);
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Lookbooks list (tất cả các bản lookbook mẫu đã được xóa theo yêu cầu)
  const [lookbooks, setLookbooks] = useState<LookbookItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOOKBOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Loại bỏ toàn bộ các bản demo preset cũ, chỉ giữ lookbook do người dùng tự tạo
          return parsed.filter((item: LookbookItem) => !item.id.startsWith('preset_'));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Wardrobe saved items (start empty, no pre-populated items)
  const [wardrobeIds, setWardrobeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WARDROBE);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear old default pre-populated items if present
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed[0] === 'ao_ngu_than_tay_chen' &&
          parsed[1] === 'quan_lua_lanh_my_a' &&
          parsed[2] === 'khan_dong_ngu_than'
        ) {
          return [];
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Modals & Drawers state
  const [selectedItemForModal, setSelectedItemForModal] = useState<CostumeItem | null>(null);
  const [isLookbookCardOpen, setIsLookbookCardOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isWardrobeDrawerOpen, setIsWardrobeDrawerOpen] = useState(false);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // User Management & Authentication State
  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: AppUser) =>
            u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
              ? { ...u, role: 'admin' as const }
              : u
          );
        }
      }
    } catch {
      // Ignore
    }
    // Mặc định luôn có tài khoản Super Admin gốc bqutrhieu1602@gmail.com
    return [
      {
        uid: 'super_admin_root',
        email: SUPER_ADMIN_EMAIL,
        displayName: 'Quản Trị Viên (Root)',
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          if (parsed.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) {
            return { ...parsed, role: 'admin' as const };
          }
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return null;
  });

  // Sync registered users to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [registeredUsers]);

  // Sync current user to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
      }
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  }, [currentUser]);

  // Check if current user has admin rights
  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const handleLogin = (user: AppUser) => {
    const isSuper = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const finalUser: AppUser = isSuper ? { ...user, role: 'admin' } : user;
    setCurrentUser(finalUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleRegister = (newUser: AppUser) => {
    setRegisteredUsers((prev) => {
      const exists = prev.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) {
        return prev.map((u) => (u.email.toLowerCase() === newUser.email.toLowerCase() ? newUser : u));
      }
      return [...prev, newUser];
    });
  };

  const handleToggleUserRole = (userId: string, newRole: 'admin' | 'user') => {
    if (currentUser?.email.toLowerCase() !== SUPER_ADMIN_EMAIL.toLowerCase()) {
      alert('Chỉ tài khoản bqutrhieu1602@gmail.com mới có quyền duyệt admin cho người khác!');
      return;
    }
    setRegisteredUsers((prev) =>
      prev.map((u) => {
        if (u.uid === userId || u.email.toLowerCase() === userId.toLowerCase()) {
          if (u.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()) return u;
          const updated = { ...u, role: newRole };
          if (currentUser?.email.toLowerCase() === u.email.toLowerCase()) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  // Active outfit in MixMatchStudio (khởi tạo gọn gàng không còn trang phục demo)
  const [currentOutfit, setCurrentOutfit] = useState<OutfitComposition>(() => {
    return {
      customColorOuter: '#9E2A2B',
      customColorBottom: '#1A1A1A',
      customColorAccessory: '#D4AF37',
      targetOccasion: 'Dạo Phố & Cafe',
      lookbookTitle: 'Bản Phối Mới',
      creatorName: 'Người Yêu Di Sản',
      gender: 'Nam',
      introduction: '',
    };
  });

  // Sync costumes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COSTUMES, JSON.stringify(costumes));
    } catch (e) {
      console.error('Failed to save costumes to LocalStorage', e);
    }
  }, [costumes]);

  // Sync wardrobe to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WARDROBE, JSON.stringify(wardrobeIds));
    } catch (e) {
      console.error('Failed to save wardrobe to LocalStorage', e);
    }
  }, [wardrobeIds]);

  // Sync lookbooks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOOKBOOKS, JSON.stringify(lookbooks));
    } catch (e) {
      console.error('Failed to save lookbooks to LocalStorage', e);
    }
  }, [lookbooks]);

  // Lookbook actions
  const handleAddLookbook = (newLookbook: LookbookItem) => {
    setLookbooks((prev) => [newLookbook, ...prev]);
  };

  const handleDeleteLookbook = (id: string) => {
    setLookbooks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetLookbooks = () => {
    setLookbooks([]);
    try {
      localStorage.removeItem(STORAGE_KEY_LOOKBOOKS);
    } catch {
      // Ignore
    }
  };

  // Wardrobe actions
  const handleToggleWardrobe = (item: CostumeItem) => {
    setWardrobeIds((prev) => {
      if (prev.includes(item.id)) {
        return prev.filter((id) => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const handleRemoveFromWardrobe = (id: string) => {
    setWardrobeIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearWardrobe = () => {
    setWardrobeIds([]);
  };

  // Send an item to studio immediately
  const handleSendToStudio = (item: CostumeItem) => {
    setCurrentOutfit((prev) => {
      if (item.category === 'bo_trang_phuc') {
        return {
          ...prev,
          fullOutfit: item,
          customImage: item.imageUrl,
          fullOutfitImages: item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
          customColorOuter: item.heroColor || prev.customColorOuter,
          lookbookTitle: item.name,
        };
      } else if (item.category === 'ao_ngoai') {
        return { ...prev, outerwear: item, customColorOuter: item.heroColor };
      } else if (item.category === 'ao_trong') {
        return { ...prev, innerwear: item, customColorInner: item.heroColor };
      } else if (item.category === 'quan_vay') {
        return { ...prev, bottom: item, customColorBottom: item.heroColor };
      } else if (item.category === 'phu_kien') {
        return { ...prev, accessory: item, customColorAccessory: item.heroColor };
      } else if (item.category === 'giay_dep') {
        return { ...prev, footwear: item };
      }
      return prev;
    });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Equip an item to studio immediately
  const handleEquipToStudio = (item: CostumeItem) => {
    setCostumes((prev) => {
      if (prev.some((c) => c.id === item.id)) return prev;
      return [item, ...prev];
    });

    setCurrentOutfit((prev) => {
      const next = { ...prev };
      if (item.gender) {
        next.gender = item.gender;
      }
      if (item.category === 'bo_trang_phuc') {
        next.fullOutfit = item;
        next.customImage = item.imageUrl;
        next.fullOutfitImages = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []);
        next.customColorOuter = item.heroColor || '#9E2A2B';
        next.lookbookTitle = item.name;
      } else if (item.category === 'ao_ngoai') {
        next.outerwear = item;
        next.customColorOuter = item.heroColor || '#9E2A2B';
      } else if (item.category === 'ao_trong') {
        next.innerwear = item;
        next.customColorInner = item.heroColor || '#FAF8F5';
      } else if (item.category === 'quan_vay') {
        next.bottom = item;
        next.customColorBottom = item.heroColor || '#1A1A1A';
      } else if (item.category === 'phu_kien') {
        next.accessory = item;
        next.customColorAccessory = item.heroColor || '#D4AF37';
      } else if (item.category === 'giay_dep') {
        next.footwear = item;
        next.customColorFootwear = item.heroColor || '#F8F9FA';
      }
      return next;
    });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load a preset lookbook into the studio
  const handleLoadPreset = (preset: LookbookItem) => {
    const outer = costumes.find((c) => c.id === preset.outerId);
    const inner = costumes.find((c) => c.id === preset.innerId);
    const bottom = costumes.find((c) => c.id === preset.bottomId);
    const accessory = costumes.find((c) => c.id === preset.accessoryId);
    const footwear = costumes.find((c) => c.id === preset.footwearId);

    setCurrentOutfit({
      outerwear: outer,
      innerwear: inner,
      bottom: bottom,
      accessory: accessory,
      footwear: footwear,
      customColorOuter: preset.customColorOuter || (outer ? outer.heroColor : '#1F3A4B'),
      customColorBottom: preset.customColorBottom || (bottom ? bottom.heroColor : '#1A1A1A'),
      customColorAccessory: preset.customColorAccessory || (accessory ? accessory.heroColor : '#D4AF37'),
      targetOccasion: preset.occasion,
      lookbookTitle: preset.title,
      creatorName: preset.creatorName || 'Bản Phối Lookbook',
      gender: preset.gender || 'Nam',
    });
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CMS Handlers
  const handleAddCostume = (newItem: CostumeItem) => {
    setCostumes((prev) => [newItem, ...prev]);
  };

  const handleUpdateCostume = (updatedItem: CostumeItem) => {
    setCostumes((prev) => prev.map((c) => (c.id === updatedItem.id ? updatedItem : c)));
  };

  const handleDeleteCostume = (id: string) => {
    setCostumes((prev) => prev.filter((c) => c.id !== id));
    setWardrobeIds((prev) => prev.filter((i) => i !== id));
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục về danh sách trang phục mặc định?')) {
      setCostumes(INITIAL_COSTUMES);
      localStorage.removeItem(STORAGE_KEY_COSTUMES);
    }
  };

  const handleImportJson = (importedItems: CostumeItem[]) => {
    setCostumes(importedItems);
  };

  // Get full objects of saved costumes
  const savedCostumesList = costumes.filter((c) => wardrobeIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1918]">
      {/* Top Bar Navigation (Adheres to 3-zone Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={wardrobeIds.length}
        openWardrobeDrawer={() => setIsWardrobeDrawerOpen(true)}
        openCmsModal={() => setIsCmsModalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Archive Catalog (Trực tiếp danh sách trang phục, không có spotlight hay bộ lọc rườm rà) */}
        {activeTab === 'archive' && (
          <div id="archive-grid">
            <ArchiveCatalog
              costumes={costumes}
              onSelectItem={(item) => setSelectedItemForModal(item)}
              onSendToStudio={handleSendToStudio}
              onAddToWardrobe={handleToggleWardrobe}
              onDeleteCostume={handleDeleteCostume}
              wardrobeIds={wardrobeIds}
              openCmsModal={() => setIsCmsModalOpen(true)}
              isAdmin={isAdmin}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: Mix & Match Studio (Xưởng May Đo & Thử Đồ) */}
        {activeTab === 'studio' && (
          <MixMatchStudio
            costumes={costumes}
            currentOutfit={currentOutfit}
            setCurrentOutfit={setCurrentOutfit}
            onDeleteCostume={handleDeleteCostume}
            onUpdateCostume={handleUpdateCostume}
            onOpenCmsModal={() => setIsCmsModalOpen(true)}
            onOpenLookbookCard={() => setIsLookbookCardOpen(true)}
            onOpenComparison={() => setIsComparisonOpen(true)}
            isAdmin={isAdmin}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSaveToLookbook={(outfit) => {
              const newLookbook: LookbookItem = {
                id: `lookbook_${Date.now()}`,
                title: outfit.lookbookTitle || 'Bản Phối Cổ Phục Remix',
                occasion: outfit.targetOccasion,
                description: outfit.introduction || `Bản phối sáng tạo bởi ${outfit.creatorName || 'Người Yêu Di Sản'}.`,
                fullOutfitId: outfit.fullOutfit?.id,
                fullOutfitImage: outfit.fullOutfit?.imageUrl || (outfit.fullOutfitImages && outfit.fullOutfitImages[0]) || outfit.customImage,
                introduction: outfit.introduction,
                outerId: outfit.outerwear?.id,
                innerId: outfit.innerwear?.id,
                bottomId: outfit.bottom?.id,
                accessoryId: outfit.accessory?.id,
                footwearId: outfit.footwear?.id,
                gender: outfit.gender || 'Nam',
                customColorOuter: outfit.customColorOuter,
                customColorBottom: outfit.customColorBottom,
                customColorAccessory: outfit.customColorAccessory,
                creatorName: outfit.creatorName,
              };
              handleAddLookbook(newLookbook);
            }}
          />
        )}

        {/* Tab 3: Lookbook Gen Z Showcase */}
        {activeTab === 'lookbook' && (
          <LookbookGallery
            lookbooks={lookbooks}
            costumes={costumes}
            currentStudioOutfit={currentOutfit}
            onAddLookbook={handleAddLookbook}
            onDeleteLookbook={handleDeleteLookbook}
            onResetLookbooks={handleResetLookbooks}
            onLoadPreset={handleLoadPreset}
            onOpenStudio={() => setActiveTab('studio')}
          />
        )}

        {/* Tab 4: Cultural Guides & Historical Etiquette */}
        {activeTab === 'guides' && <CulturalGuideSection />}
      </main>

      {/* Product Detail Modal */}
      {selectedItemForModal && (
        <ProductDetailModal
          item={selectedItemForModal}
          onClose={() => setSelectedItemForModal(null)}
          onSendToStudio={handleSendToStudio}
          onAddToWardrobe={handleToggleWardrobe}
          onDeleteCostume={handleDeleteCostume}
          isSaved={wardrobeIds.includes(selectedItemForModal.id)}
        />
      )}

      {/* Shareable Lookbook Card Modal */}
      {isLookbookCardOpen && (
        <LookbookCardModal
          outfit={currentOutfit}
          onClose={() => setIsLookbookCardOpen(false)}
        />
      )}

      {/* Side-by-Side Comparison Modal */}
      {isComparisonOpen && (
        <SideBySideComparison
          currentOutfit={currentOutfit}
          allCostumes={costumes}
          onClose={() => setIsComparisonOpen(false)}
          onApplyOutfitA={() => setIsComparisonOpen(false)}
          onApplyOutfitB={(newOutfit) => {
            setCurrentOutfit(newOutfit);
            setIsComparisonOpen(false);
          }}
        />
      )}

      {/* Wardrobe Drawer (Tủ Đồ Của Bạn) */}
      <WardrobeDrawer
        isOpen={isWardrobeDrawerOpen}
        onClose={() => setIsWardrobeDrawerOpen(false)}
        savedCostumes={savedCostumesList}
        onRemoveFromWardrobe={handleRemoveFromWardrobe}
        onClearWardrobe={handleClearWardrobe}
        onSendToStudio={handleSendToStudio}
        onOpenStudio={() => setActiveTab('studio')}
      />

      {/* Thêm Trang Phục Modal (when triggered via button) */}
      {isCmsModalOpen && (
        <NoCodeCMSModal
          costumes={costumes}
          onAddCostume={handleAddCostume}
          onDeleteCostume={handleDeleteCostume}
          onResetToDefaults={handleResetToDefaults}
          onImportJson={handleImportJson}
          onClose={() => setIsCmsModalOpen(false)}
          onEquipToStudio={handleEquipToStudio}
          isAdmin={isAdmin}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Auth Modal (Đăng Ký & Đăng Nhập Gmail) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        registeredUsers={registeredUsers}
        onRegister={handleRegister}
      />

      {/* Admin Approval Modal (Duyệt Quyền Admin) */}
      <AdminApprovalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        currentUser={currentUser}
        registeredUsers={registeredUsers}
        onToggleUserRole={handleToggleUserRole}
      />

      {/* Editorial Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
