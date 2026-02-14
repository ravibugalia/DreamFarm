
import React, { useState, useEffect } from 'react';
import { TreeRecord, TreeHealth, FruitProduction, GeoLocation } from '../types';
import { Camera, MapPin, Loader2, Save, X, Hash, MessageSquareText } from 'lucide-react';

interface TreeFormProps {
  onSave: (record: Omit<TreeRecord, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

const TreeForm: React.FC<TreeFormProps> = ({ onSave, onCancel }) => {
  const [treeNumber, setTreeNumber] = useState('');
  const [treeName, setTreeName] = useState('');
  const [species, setSpecies] = useState('');
  const [health, setHealth] = useState<TreeHealth>(TreeHealth.GOOD);
  const [healthDescription, setHealthDescription] = useState('');
  const [production, setProduction] = useState<FruitProduction>(FruitProduction.NONE);
  const [productionQuantity, setProductionQuantity] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<GeoLocation | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);

  const handleCapturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert("Failed to get location. Ensure permissions are granted.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treeNumber || !treeName || !species) {
      alert("Please fill in required fields.");
      return;
    }
    onSave({
      treeNumber,
      treeName,
      species,
      health,
      healthDescription,
      production,
      productionQuantity: productionQuantity === '' ? undefined : Number(productionQuantity),
      photo,
      location,
      notes
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Add New Tree</h2>
        <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tree Number *</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. A-102"
              value={treeNumber}
              onChange={(e) => setTreeNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Common Name *</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Grandma's Apple Tree"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Species *</label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Malus domestica"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Plant Health</label>
            <select
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={health}
              onChange={(e) => setHealth(e.target.value as TreeHealth)}
            >
              {Object.values(TreeHealth).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
            <MessageSquareText size={16} className="text-slate-400" />
            Health Description
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. Minor leaf curling, deep green foliage"
            value={healthDescription}
            onChange={(e) => setHealthDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Production Level</label>
            <select
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={production}
              onChange={(e) => setProduction(e.target.value as FruitProduction)}
            >
              {Object.values(FruitProduction).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <Hash size={16} className="text-slate-400" />
              Yield Quantity (Approx.)
            </label>
            <input
              type="number"
              className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. 150 (kg or count)"
              value={productionQuantity}
              onChange={(e) => setProductionQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Location Tag</label>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={isLocating}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-lg border-2 border-dashed transition-all ${
              location 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                : 'border-slate-300 text-slate-500 hover:border-emerald-400'
            }`}
          >
            {isLocating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : location ? (
              <>
                <MapPin size={20} />
                <span>Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</span>
              </>
            ) : (
              <>
                <MapPin size={20} />
                <span>Tag Location</span>
              </>
            )}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Tree Photo</label>
          <div className="flex gap-4 items-center">
            <label className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl hover:border-emerald-400 transition-all overflow-hidden relative group">
              {photo ? (
                <>
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" />
                  </div>
                </>
              ) : (
                <>
                  <Camera size={32} className="text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500">Take Photo</span>
                </>
              )}
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapturePhoto} />
            </label>
            <div className="flex-1">
              <p className="text-xs text-slate-500 mb-2">Upload or capture an image of the tree for visual tracking.</p>
              {photo && (
                <button 
                  type="button" 
                  onClick={() => setPhoto(undefined)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Observation Notes</label>
          <textarea
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
            placeholder="Describe pests, soil conditions, or pruning needs..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-100"
          >
            <Save size={20} />
            Save Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default TreeForm;
