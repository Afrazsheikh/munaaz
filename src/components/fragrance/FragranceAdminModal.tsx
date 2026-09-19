'use client';

import React, { useState } from 'react';
import { X, Save, RotateCcw, Settings, Sparkles, Edit3, Image as ImageIcon } from 'lucide-react';
import { FragranceDataStore, FragranceProduct, FragranceScene } from '@/types/fragrance';
import { fragranceService } from '@/services/fragranceService';

interface FragranceAdminModalProps {
  currentStore: FragranceDataStore;
  onClose: () => void;
  onUpdate: (newStore: FragranceDataStore) => void;
}

export const FragranceAdminModal: React.FC<FragranceAdminModalProps> = ({
  currentStore,
  onClose,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'scenes' | 'products'>('scenes');
  const [scenesForm, setScenesForm] = useState<FragranceScene[]>([...currentStore.scenes]);
  const [selectedSceneId, setSelectedSceneId] = useState<string>(currentStore.scenes[0]?.id || '');

  const [productsForm, setProductsForm] = useState<FragranceProduct[]>([...currentStore.products]);
  const [selectedProdId, setSelectedProdId] = useState<string>(currentStore.products[0]?.id || '');
  
  const [message, setMessage] = useState<string | null>(null);

  const selectedScene = scenesForm.find((s) => s.id === selectedSceneId) || scenesForm[0];
  const selectedProduct = productsForm.find((p) => p.id === selectedProdId) || productsForm[0];

  const handleSceneChange = (field: keyof FragranceScene, value: any) => {
    setScenesForm((prev) =>
      prev.map((s) => (s.id === selectedSceneId ? { ...s, [field]: value } : s))
    );
  };

  const handleSceneNotesChange = (value: string) => {
    const arr = value.split(',').map((s) => s.trim()).filter(Boolean);
    setScenesForm((prev) =>
      prev.map((s) => (s.id === selectedSceneId ? { ...s, notes: arr } : s))
    );
  };

  const handleProductChange = (field: keyof FragranceProduct, value: any) => {
    setProductsForm((prev) =>
      prev.map((p) => (p.id === selectedProdId ? { ...p, [field]: value } : p))
    );
  };

  const handleProductNotesChange = (type: 'top' | 'heart' | 'base', value: string) => {
    const arr = value.split(',').map((s) => s.trim()).filter(Boolean);
    setProductsForm((prev) =>
      prev.map((p) =>
        p.id === selectedProdId ? { ...p, notes: { ...p.notes, [type]: arr } } : p
      )
    );
  };

  const handleSave = () => {
    const updatedStore: FragranceDataStore = {
      hero: currentStore.hero,
      scenes: scenesForm,
      products: productsForm
    };
    fragranceService.updateFragranceData(updatedStore);
    onUpdate(updatedStore);
    setMessage('All Cinematic Scenes & Products saved successfully!');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all cinematic fragrance scenes & data to defaults?')) {
      const defaultStore = fragranceService.resetToDefault();
      setScenesForm(defaultStore.scenes);
      setProductsForm(defaultStore.products);
      onUpdate(defaultStore);
      setMessage('Reset to default cinematic scenes & products.');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative z-10 w-full max-w-4xl bg-[#171411] text-[#F4EFE7] border border-[#D6A35D]/50 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#211815] border-b border-[#3A2418] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#9A5C24] text-white">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#F4EFE7]">
                MUNAAZ ESSENCE CINEMATIC ADMIN
              </h3>
              <p className="text-xs text-[#D6A35D]">
                Manage 5 cinematic scenes, macro camera travel imagery, titles, & products
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#9A5C24] text-[#F4EFE7] transition-colors"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="bg-emerald-900/90 text-emerald-100 text-xs px-6 py-2.5 flex items-center gap-2 border-b border-emerald-700">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3A2418] bg-[#1C1714]">
          <button
            onClick={() => setActiveTab('scenes')}
            className={`flex-1 py-3.5 px-6 text-xs font-bold tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'scenes'
                ? 'border-[#9A5C24] bg-[#211815] text-[#D6A35D]'
                : 'border-transparent text-[#806B5D] hover:text-[#F4EFE7]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>CINEMATIC SCENES ({scenesForm.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3.5 px-6 text-xs font-bold tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'products'
                ? 'border-[#9A5C24] bg-[#211815] text-[#D6A35D]'
                : 'border-transparent text-[#806B5D] hover:text-[#F4EFE7]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>FRAGRANCE PRODUCTS ({productsForm.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'scenes' ? (
            <div className="space-y-6">
              {/* Scene Selector Tabs */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-[#3A2418]">
                {scenesForm.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSceneId(s.id)}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all border ${
                      selectedSceneId === s.id
                        ? 'bg-[#9A5C24] border-[#9A5C24] text-white'
                        : 'bg-[#211815] border-[#3A2418] text-[#D6A35D] hover:border-[#D6A35D]'
                    }`}
                  >
                    SCENE {s.sceneNumber} · {s.name}
                  </button>
                ))}
              </div>

              {selectedScene && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Scene Name
                      </label>
                      <input
                        type="text"
                        value={selectedScene.name}
                        onChange={(e) => handleSceneChange('name', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={selectedScene.badge}
                        onChange={(e) => handleSceneChange('badge', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={selectedScene.title}
                        onChange={(e) => handleSceneChange('title', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Tagline (Quote)
                      </label>
                      <input
                        type="text"
                        value={selectedScene.tagline}
                        onChange={(e) => handleSceneChange('tagline', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                      Scene Description
                    </label>
                    <textarea
                      rows={2}
                      value={selectedScene.description}
                      onChange={(e) => handleSceneChange('description', e.target.value)}
                      className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Desktop Macro Image URL
                      </label>
                      <input
                        type="text"
                        value={selectedScene.desktopImage}
                        onChange={(e) => handleSceneChange('desktopImage', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Mobile Portrait Image URL
                      </label>
                      <input
                        type="text"
                        value={selectedScene.mobileImage}
                        onChange={(e) => handleSceneChange('mobileImage', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Animation Travel Type
                      </label>
                      <select
                        value={selectedScene.animationType || 'zoomIn'}
                        onChange={(e) => handleSceneChange('animationType', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      >
                        <option value="zoomIn">Continuous Camera Zoom-In</option>
                        <option value="liquidRefraction">Submerged Liquid Refraction</option>
                        <option value="fadeZoom">Deep Fade & Macro Zoom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Background Focal Position
                      </label>
                      <input
                        type="text"
                        placeholder="center / top / 50% 40%"
                        value={selectedScene.bgPosition || 'center'}
                        onChange={(e) => handleSceneChange('bgPosition', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                      Scene Key Notes (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={selectedScene.notes.join(', ')}
                      onChange={(e) => handleSceneNotesChange(e.target.value)}
                      className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Selector */}
              <div className="flex flex-wrap gap-2 pb-4 border-b border-[#3A2418]">
                {productsForm.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProdId(p.id)}
                    className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all border ${
                      selectedProdId === p.id
                        ? 'bg-[#9A5C24] border-[#9A5C24] text-white'
                        : 'bg-[#211815] border-[#3A2418] text-[#D6A35D] hover:border-[#D6A35D]'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {selectedProduct && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Fragrance Name
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => handleProductChange('name', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.subtitle}
                        onChange={(e) => handleProductChange('subtitle', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Price (INR ₹)
                      </label>
                      <input
                        type="number"
                        value={selectedProduct.priceINR}
                        onChange={(e) => handleProductChange('priceINR', Number(e.target.value))}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Price (USD $)
                      </label>
                      <input
                        type="number"
                        value={selectedProduct.priceUSD}
                        onChange={(e) => handleProductChange('priceUSD', Number(e.target.value))}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.size}
                        onChange={(e) => handleProductChange('size', e.target.value)}
                        className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#D6A35D] uppercase block mb-1">
                      Perfume Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedProduct.images[0] || ''}
                      onChange={(e) =>
                        handleProductChange('images', [e.target.value, ...selectedProduct.images.slice(1)])
                      }
                      className="w-full bg-[#211815] border border-[#3A2418] px-3 py-2 text-xs text-[#F4EFE7] focus:border-[#9A5C24] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#211815] border-t border-[#3A2418] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleReset}
            className="w-full sm:w-auto px-6 py-2.5 bg-transparent hover:bg-red-950/40 text-red-300 text-xs font-semibold tracking-wider uppercase border border-red-900/50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET TO DEFAULTS</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-transparent hover:bg-[#1C1714] text-[#F4EFE7] text-xs font-semibold tracking-wider uppercase border border-[#3A2418] transition-colors"
            >
              CANCEL
            </button>

            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-8 py-2.5 bg-[#9A5C24] hover:bg-[#D6A35D] text-white text-xs font-semibold tracking-[0.15em] uppercase shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE ALL SCENES</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
