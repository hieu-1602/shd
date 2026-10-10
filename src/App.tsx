/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_COSTUMES, PRESET_OUTFITS } from './data/initialCostumes';
import { CostumeItem, LookbookItem, OutfitComposition, CostumeCategory, CustomOutfit, getVietnameseColorName } from './types/vietphuc';
import { Header, NavigationTab } from './components/Header';
import { ArchiveCatalog } from './components/ArchiveCatalog';
import { TailorWorkshop } from './components/TailorWorkshop';
import { ShowcaseGallery } from './components/ShowcaseGallery';
import { LookbookGallery } from './components/LookbookGallery';
import { CulturalGuideSection } from './components/CulturalGuideSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LookbookCardModal } from './components/LookbookCardModal';
import { WardrobeDrawer } from './components/WardrobeDrawer';
import { SideBySideComparison } from './components/SideBySideComparison';
import { Footer } from './components/Footer';
import { safeSetLocalStorage, cleanupLegacyStorageKeys } from './utils/imageCompressor';
import {
  loadPersistentOutfits,
  savePersistentOutfits,
  loadPersistentCostumes,
  savePersistentCostumes,
  loadPersistentLookbooks,
  savePersistentLookbooks,
} from './utils/storage';

const STORAGE_KEY_COSTUMES = 'vietphuc_costumes_v1';
const STORAGE_KEY_WARDROBE = 'vietphuc_wardrobe_v1';
const STORAGE_KEY_LOOKBOOKS = 'cophuc_remix_lookbooks_v1';
const STORAGE_KEY_OUTFITS = 'vietphuc_custom_outfits_v4';

export default function App() {
  // Navigation Tab State: Trang Chủ, Xưởng May, Trưng Bày, Lookbook, Quy Chuẩn
  const [activeTab, setActiveTab] = useState<NavigationTab>('archive');

  // Danh sách các bộ trang phục riêng biệt đã may đo từ Xưởng May
  const [outfits, setOutfits] = useState<CustomOutfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OUTFITS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // ID của bộ trang phục đang được chọn xem tại Trưng Bày
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null);

  // Costumes list (tự do thêm, sửa, xóa bởi tất cả người dùng)
  const [costumes, setCostumes] = useState<CostumeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COSTUMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Lookbooks list
  const [lookbooks, setLookbooks] = useState<LookbookItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOOKBOOKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item: LookbookItem) => !item.id.startsWith('preset_'));
        }
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Wardrobe saved items
  const [wardrobeIds, setWardrobeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WARDROBE);
      if (saved) {
        const parsed = JSON.parse(saved);
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

  // Active outfit in ShowcaseGallery / Studio
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

  // Sync costumes and lookbooks with server-side shared dataset
  useEffect(() => {
    let isMounted = true;
    cleanupLegacyStorageKeys();
    localStorage.removeItem('vietphuc_custom_outfits_v3');

    const fetchSharedData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        // If server has data, sync into state
        if (Array.isArray(data.costumes)) {
          setCostumes(data.costumes);
          safeSetLocalStorage(STORAGE_KEY_COSTUMES, data.costumes);
        }

        if (Array.isArray(data.lookbooks)) {
          setLookbooks(data.lookbooks);
        }

        // Sync outfits from server database
        if (Array.isArray(data.outfits)) {
          setOutfits(data.outfits);
          safeSetLocalStorage(STORAGE_KEY_OUTFITS, data.outfits);
        }
      } catch (err) {
        console.warn('Could not sync with shared server dataset:', err);
      }
    };

    fetchSharedData();

    // Periodic background sync every 2.5s so all tabs, devices and places see any newly added images instantly
    const intervalId = setInterval(fetchSharedData, 2500);

    // Sync immediately when tab gains focus
    const handleFocus = () => {
      fetchSharedData();
    };
    window.addEventListener('focus', handleFocus);

    // Sync on storage event from another tab
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEY_COSTUMES ||
        e.key === STORAGE_KEY_LOOKBOOKS ||
        e.key === STORAGE_KEY_OUTFITS
      ) {
        fetchSharedData();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Sync outfits to LocalStorage safely (prevents QuotaExceededError)
  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEY_OUTFITS, outfits, (items) =>
      items.map((o) => ({
        ...o,
        imageUrls: o.imageUrls ? o.imageUrls.slice(0, 1) : undefined,
        components: o.components.map((c) => ({
          ...c,
          imageUrls: c.imageUrls ? c.imageUrls.slice(0, 1) : undefined,
        })),
      }))
    );
  }, [outfits]);

  // Sync costumes to LocalStorage safely
  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEY_COSTUMES, costumes, (items) =>
      items.map((c) => ({
        ...c,
        imageUrls: c.imageUrls ? c.imageUrls.slice(0, 1) : undefined,
      }))
    );
  }, [costumes]);

  // Sync wardrobe to LocalStorage safely
  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEY_WARDROBE, wardrobeIds);
  }, [wardrobeIds]);

  // Sync lookbooks to LocalStorage safely
  useEffect(() => {
    safeSetLocalStorage(STORAGE_KEY_LOOKBOOKS, lookbooks);
  }, [lookbooks]);

  // Lookbook actions with shared server sync
  const handleAddLookbook = async (newLookbook: LookbookItem) => {
    setLookbooks((prev) => [newLookbook, ...prev]);
    try {
      await fetch('/api/lookbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLookbook),
      });
    } catch (err) {
      console.error('Failed to save lookbook to shared dataset:', err);
    }
  };

  const handleDeleteLookbook = async (id: string) => {
    setLookbooks((prev) => prev.filter((item) => item.id !== id));
    try {
      await fetch(`/api/lookbooks/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete lookbook from shared dataset:', err);
    }
  };

  const handleResetLookbooks = async () => {
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

  // Send an item to showcase immediately
  const handleSendToStudio = (item: CostumeItem) => {
    const colorLabel = item.colorLabel || getVietnameseColorName(item.heroColor);
    setCurrentOutfit((prev) => {
      const updatedCreator = item.creatorName || prev.creatorName;
      if (item.category === 'bo_trang_phuc') {
        return {
          ...prev,
          fullOutfit: item,
          customImage: item.imageUrl,
          fullOutfitImages: item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
          customColorOuter: item.heroColor || prev.customColorOuter,
          customColorOuterLabel: colorLabel,
          lookbookTitle: item.name,
          creatorName: updatedCreator,
          gender: item.gender || prev.gender || 'Nam',
        };
      } else if (item.category === 'ao_ngoai') {
        return {
          ...prev,
          outerwear: item,
          customColorOuter: item.heroColor,
          customColorOuterLabel: colorLabel,
          creatorName: updatedCreator,
          gender: item.gender || prev.gender || 'Nam',
        };
      } else if (item.category === 'ao_trong') {
        return {
          ...prev,
          innerwear: item,
          customColorInner: item.heroColor,
          customColorInnerLabel: colorLabel,
          creatorName: updatedCreator,
          gender: item.gender || prev.gender || 'Nam',
        };
      } else if (item.category === 'quan_vay') {
        return {
          ...prev,
          bottom: item,
          customColorBottom: item.heroColor,
          customColorBottomLabel: colorLabel,
          creatorName: updatedCreator,
          gender: item.gender || prev.gender || 'Nam',
        };
      } else if (item.category === 'phu_kien') {
        return {
          ...prev,
          accessory: item,
          customColorAccessory: item.heroColor,
          customColorAccessoryLabel: colorLabel,
          creatorName: updatedCreator,
        };
      } else if (item.category === 'giay_dep') {
        return {
          ...prev,
          footwear: item,
          customColorFootwear: item.heroColor,
          customColorFootwearLabel: colorLabel,
          creatorName: updatedCreator,
        };
      }
      return prev;
    });
    setActiveTab('showcase');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Equip an item to studio immediately
  const handleEquipToStudio = (item: CostumeItem) => {
    setCostumes((prev) => {
      if (prev.some((c) => c.id === item.id)) return prev;
      // Post to shared server
      fetch('/api/costumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      }).catch(console.error);
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
        next.fullOutfitImages = item.imageUrls || (item.imageUrl ? [item.imageUrl] : []),
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

  // CMS Handlers: Tự do thêm & xóa trang phục kèm đồng bộ cơ sở dữ liệu PostgreSQL
  const handleAddCostume = async (newItem: CostumeItem) => {
    setCostumes((prev) => [newItem, ...prev.filter((c) => c.id !== newItem.id)]);
    try {
      await fetch('/api/costumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      const syncRes = await fetch('/api/data');
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (Array.isArray(syncData.costumes)) {
          setCostumes(syncData.costumes);
          localStorage.setItem(STORAGE_KEY_COSTUMES, JSON.stringify(syncData.costumes));
        }
      }
    } catch (err) {
      console.error('Failed to sync added costume with database:', err);
    }
  };

  const handleUpdateCostume = async (updatedItem: CostumeItem) => {
    setCostumes((prev) => prev.map((c) => (c.id === updatedItem.id ? updatedItem : c)));
    try {
      await fetch(`/api/costumes/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });
    } catch (err) {
      console.error('Failed to sync updated costume with database:', err);
    }
  };

  const handleDeleteCostume = async (id: string) => {
    setCostumes((prev) => prev.filter((c) => c.id !== id));
    setWardrobeIds((prev) => prev.filter((i) => i !== id));
    try {
      await fetch(`/api/costumes/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to sync deleted costume with database:', err);
    }
  };

  const handleResetToDefaults = async () => {
    if (window.confirm('Bạn có chắc muốn khôi phục về danh sách trang phục mặc định?')) {
      setCostumes(INITIAL_COSTUMES);
      localStorage.removeItem(STORAGE_KEY_COSTUMES);
      try {
        await fetch('/api/reset-data', { method: 'POST' });
      } catch (err) {
        console.error('Failed to reset shared dataset:', err);
      }
    }
  };

  const handleImportJson = async (importedItems: CostumeItem[]) => {
    setCostumes(importedItems);
    for (const item of importedItems) {
      try {
        await fetch('/api/costumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (err) {
        console.error('Failed to import costume to database:', err);
      }
    }
  };

  // Outfit actions: Lưu đồng bộ vào bảng Invoices và bảng Costumes trong PostgreSQL Database
  const handleSaveOutfit = async (newOutfit: CustomOutfit) => {
    setOutfits((prev) => [newOutfit, ...prev.filter((o) => o.id !== newOutfit.id)]);
    setSelectedOutfitId(newOutfit.id);
    try {
      // 1. Lưu bộ trang phục vào Database bảng Invoices
      await fetch('/api/outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOutfit),
      });

      // 2. Lưu từng thành phần riêng lẻ của bộ vào bảng Costumes để đồng bộ ở mọi nơi
      if (Array.isArray(newOutfit.components) && newOutfit.components.length > 0) {
        await Promise.all(
          newOutfit.components.map((comp) =>
            fetch('/api/costumes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(comp),
            }).catch(console.error)
          )
        );
      }

      // 3. Đồng bộ lại dữ liệu mới nhất từ server
      const syncRes = await fetch('/api/data');
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (Array.isArray(syncData.outfits)) {
          setOutfits(syncData.outfits);
          safeSetLocalStorage(STORAGE_KEY_OUTFITS, syncData.outfits);
        }
        if (Array.isArray(syncData.costumes)) {
          setCostumes(syncData.costumes);
          safeSetLocalStorage(STORAGE_KEY_COSTUMES, syncData.costumes);
        }
      }
    } catch (err) {
      console.error('Failed to sync added outfit with database:', err);
    }
  };

  const handleDeleteOutfit = async (id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
    if (selectedOutfitId === id) {
      setSelectedOutfitId(null);
    }
    try {
      await fetch(`/api/outfits/${id}`, {
        method: 'DELETE',
      });
      // Đồng bộ lại dữ liệu sau khi xóa
      const syncRes = await fetch('/api/data');
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (Array.isArray(syncData.outfits)) {
          setOutfits(syncData.outfits);
          localStorage.setItem(STORAGE_KEY_OUTFITS, JSON.stringify(syncData.outfits));
        }
      }
    } catch (err) {
      console.error('Failed to delete outfit from database:', err);
    }
  };

  const handleUpdateOutfit = async (updatedOutfit: CustomOutfit) => {
    setOutfits((prev) => prev.map((o) => (o.id === updatedOutfit.id ? updatedOutfit : o)));
    try {
      await fetch(`/api/outfits/${updatedOutfit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOutfit),
      });
      // Đồng bộ lại dữ liệu sau khi sửa
      const syncRes = await fetch('/api/data');
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (Array.isArray(syncData.outfits)) {
          setOutfits(syncData.outfits);
          localStorage.setItem(STORAGE_KEY_OUTFITS, JSON.stringify(syncData.outfits));
        }
      }
    } catch (err) {
      console.error('Failed to update outfit in database:', err);
    }
  };

  // Get full objects of saved costumes
  const savedCostumesList = costumes.filter((c) => wardrobeIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1918]">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={wardrobeIds.length}
        openWardrobeDrawer={() => setIsWardrobeDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Trang Chủ (Bộ sưu tập cổ phục - Bấm vào xem ngay tại Trưng Bày) */}
        {activeTab === 'archive' && (
          <div id="archive-grid">
            <ArchiveCatalog
              outfits={outfits}
              onSelectOutfitAndShowcase={(outfitId) => {
                setSelectedOutfitId(outfitId);
                setActiveTab('showcase');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToWorkshop={() => {
                setActiveTab('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onDeleteOutfit={handleDeleteOutfit}
            />
          </div>
        )}

        {/* Tab 2: Xưởng May (Chuyên may đo & tạo bộ trang phục riêng biệt kèm nút Xong để chuyển sang Trưng Bày) */}
        {activeTab === 'studio' && (
          <TailorWorkshop
            onSaveOutfit={handleSaveOutfit}
            onFinishAndShowcase={(newOutfit) => {
              if (newOutfit) {
                setSelectedOutfitId(newOutfit.id);
              }
              setActiveTab('showcase');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Tab 3: Trưng Bày (Chỉ hiển thị các bộ trang phục đã thêm từ xưởng may, mỗi bộ riêng lẻ hoàn toàn) */}
        {activeTab === 'showcase' && (
          <ShowcaseGallery
            outfits={outfits}
            selectedOutfitId={selectedOutfitId || (outfits[0] ? outfits[0].id : undefined)}
            onSelectOutfit={(id) => setSelectedOutfitId(id)}
            onDeleteOutfit={handleDeleteOutfit}
            onUpdateOutfit={handleUpdateOutfit}
            onNavigateToWorkshop={() => {
              setActiveTab('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenItemDetailModal={(item) => setSelectedItemForModal(item)}
          />
        )}

        {/* Tab 4: Lookbook Gen Z Showcase */}
        {activeTab === 'lookbook' && (
          <LookbookGallery
            lookbooks={lookbooks}
            costumes={costumes}
            currentStudioOutfit={currentOutfit}
            onAddLookbook={handleAddLookbook}
            onDeleteLookbook={handleDeleteLookbook}
            onResetLookbooks={handleResetLookbooks}
            onLoadPreset={handleLoadPreset}
            onOpenStudio={() => setActiveTab('showcase')}
          />
        )}

        {/* Tab 5: Cultural Guides & Historical Etiquette */}
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
          onApplyOutfitB={(newOutfit: OutfitComposition) => {
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
        onOpenStudio={() => setActiveTab('showcase')}
      />

      {/* Editorial Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
