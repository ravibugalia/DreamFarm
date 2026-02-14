
import React, { useState } from 'react';
import { TreeRecord, TreeHealth } from '../types';
import { MapPin, Calendar, Activity, Sprout, Sparkles, Loader2, Trash2, Hash } from 'lucide-react';
import { getTreeInsights } from '../services/geminiService';

interface TreeCardProps {
  tree: TreeRecord;
  onDelete: (id: string) => void;
}

const TreeCard: React.FC<TreeCardProps> = ({ tree, onDelete }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const fetchInsight = async () => {
    setIsLoadingInsight(true);
    const result = await getTreeInsights(tree);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  const getHealthColor = (health: TreeHealth) => {
    switch (health) {
      case TreeHealth.EXCELLENT: return 'bg-emerald-100 text-emerald-700';
      case TreeHealth.GOOD: return 'bg-green-100 text-green-700';
      case TreeHealth.FAIR: return 'bg-amber-100 text-amber-700';
      case TreeHealth.POOR: return 'bg-orange-100 text-orange-700';
      case TreeHealth.CRITICAL: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 w-full bg-slate-100">
        {tree.photo ? (
          <img src={tree.photo} alt={tree.treeName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Sprout size={48} className="mb-2" />
            <span className="text-xs">No Photo Available</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm">
          #{tree.treeNumber}
        </div>
        <button 
          onClick={() => onDelete(tree.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-rose-50"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{tree.treeName}</h3>
          <p className="text-sm text-slate-500 italic">{tree.species}</p>
        </div>

        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-slate-400" />
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getHealthColor(tree.health)}`}>
                {tree.health}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout size={16} className="text-slate-400" />
              <span className="text-xs text-slate-600 font-medium">{tree.production} Yield</span>
            </div>
          </div>

          {(tree.healthDescription || tree.productionQuantity !== undefined) && (
            <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
              {tree.healthDescription && (
                <div className="flex items-start gap-2">
                  <Activity size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <span className="font-bold text-slate-700">Health:</span> {tree.healthDescription}
                  </p>
                </div>
              )}
              {tree.productionQuantity !== undefined && (
                <div className="flex items-start gap-2">
                  <Hash size={14} className="text-slate-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <span className="font-bold text-slate-700">Quantity:</span> {tree.productionQuantity} units
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-[10px] text-slate-600 font-medium">{new Date(tree.timestamp).toLocaleDateString()}</span>
            </div>
            {tree.location && (
              <div className="flex items-center gap-2 overflow-hidden">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-[10px] text-emerald-600 truncate underline cursor-help font-medium" title={`Lat: ${tree.location.lat}, Lng: ${tree.location.lng}`}>
                  Geotagged
                </span>
              </div>
            )}
          </div>
        </div>

        {tree.notes && (
          <p className="text-xs text-slate-500 mb-4 line-clamp-2">
            <span className="font-semibold">Notes:</span> {tree.notes}
          </p>
        )}

        <div className="border-t border-slate-100 pt-4">
          {!insight ? (
            <button
              onClick={fetchInsight}
              disabled={isLoadingInsight}
              className="w-full py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              {isLoadingInsight ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing Tree...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Get AI Care Advice
                </>
              )}
            </button>
          ) : (
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Expert Recommendations</span>
                <Sparkles size={12} className="text-emerald-500" />
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed whitespace-pre-wrap">
                {insight}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeCard;
