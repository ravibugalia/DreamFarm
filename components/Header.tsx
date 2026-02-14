
import React from 'react';
import { TreePine, Download, FileSpreadsheet, FileText } from 'lucide-react';

interface HeaderProps {
  totalTrees: number;
  onExportPdf: () => void;
  onExportExcel: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalTrees, onExportPdf, onExportExcel }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <TreePine size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">ArborLog</h1>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Digital Orchard Ledger</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 self-end sm:self-auto">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-700">{totalTrees} Trees</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Systematic Records</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onExportExcel}
                title="Export Excel (CSV)"
                className="p-2.5 px-4 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-200 group"
              >
                <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">Excel</span>
              </button>
              
              <button 
                onClick={onExportPdf}
                title="Export PDF Report"
                className="p-2.5 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200 group"
              >
                <FileText size={18} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wide">PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
