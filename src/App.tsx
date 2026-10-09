/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_COSTUMES, PRESET_OUTFITS } from './data/initialCostumes';
import { CostumeItem, LookbookItem, OutfitComposition } from './types/vietphuc';
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
import { Footer } from './components/Footer';

const STORAGE_KEY_COSTUMES = 'vietphuc_costumes_v1';
const STORAGE_KEY_WARDROBE = 'vietphuc_wardrobe_v1';
const STORAGE_KEY_LOOKBOOKS = 'cophuc_remix_lookbooks_v1';

export default function App() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'archive' | 'studio' | 'lookbook' | 'guides'>('archive');

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
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);

  // Active outfit in MixMatchStudio
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

    const fetchSharedData = async () => {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        // If server has data, sync into state
        if (Array.isArray(data.costumes) && data.costumes.length > 0) {
          setCostumes(data.costumes);
        } else {
          // If server is empty but client has local costumes, push them to server to initialize shared data
          const localSaved = localStorage.getItem(STORAGE_KEY_COSTUMES);
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                for (const item of parsed) {
                  await fetch('/api/costumes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item),
                  });
                }
              }
            } catch (e) {
              // Ignore
            }
          }
        }

        if (Array.isArray(data.lookbooks) && data.lookbooks.length > 0) {
          setLookbooks(data.lookbooks);
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
      if (e.key === STORAGE_KEY_COSTUMES || e.key === STORAGE_KEY_LOOKBOOKS) {
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

  // CMS Handlers: Tự do thêm & xóa trang phục kèm đồng bộ bộ dữ liệu chung
  const handleAddCostume = async (newItem: CostumeItem) => {
    setCostumes((prev) => [newItem, ...prev.filter((c) => c.id !== newItem.id)]);
    try {
      await fetch('/api/costumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
    } catch (err) {
      console.error('Failed to sync added costume with shared dataset:', err);
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
      console.error('Failed to sync updated costume with shared dataset:', err);
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
      console.error('Failed to sync deleted costume with shared dataset:', err);
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
        console.error('Failed to import costume to shared dataset:', err);
      }
    }
  };

  // Get full objects of saved costumes
  const savedCostumesList = costumes.filter((c) => wardrobeIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1918]">
      {/* Top Bar Navigation (Không còn đăng nhập/đăng ký) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wardrobeCount={wardrobeIds.length}
        openWardrobeDrawer={() => setIsWardrobeDrawerOpen(true)}
        openCmsModal={() => setIsCmsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Archive Catalog */}
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

      {/* Thêm Trang Phục Modal */}
      {isCmsModalOpen && (
        <NoCodeCMSModal
          costumes={costumes}
          onAddCostume={handleAddCostume}
          onDeleteCostume={handleDeleteCostume}
          onResetToDefaults={handleResetToDefaults}
          onImportJson={handleImportJson}
          onClose={() => setIsCmsModalOpen(false)}
          onEquipToStudio={handleEquipToStudio}
        />
      )}

      {/* Editorial Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
