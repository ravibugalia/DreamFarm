
import React, { useState, useEffect, useMemo } from 'react';
import { TreeRecord, SearchFilters } from './types';
import Header from './components/Header';
import TreeCard from './components/TreeCard';
import TreeForm from './components/TreeForm';
import { generateTreeReport } from './services/pdfService';
import { generateExcelReport } from './services/excelService';
import { Search, Plus, Filter, TreePine, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [records, setRecords] = useState<TreeRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('arborlog_records');
    if (saved) {
      setRecords(JSON.parse(saved));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('arborlog_records', JSON.stringify(records));
    }
  }, [records, isLoaded]);

  const handleAddTree = (newRecord: Omit<TreeRecord, 'id' | 'timestamp'>) => {
    const recordWithId: TreeRecord = {
      ...newRecord,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };
    setRecords([recordWithId, ...records]);
    setShowForm(false);
  };

  const handleDeleteTree = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return records.filter(r => 
      r.treeName.toLowerCase().includes(q) || 
      r.treeNumber.toLowerCase().includes(q) || 
      r.species.toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  const handleExportPdf = () => {
    if (records.length === 0) {
      alert("No records to export.");
      return;
    }
    generateTreeReport(records);
  };

  const handleExportExcel = () => {
    if (records.length === 0) {
      alert("No records to export.");
      return;
    }
    generateExcelReport(records);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header 
        totalTrees={records.length} 
        onExportPdf={handleExportPdf} 
        onExportExcel={handleExportExcel}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by tree number, name or species..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-slate-700 font-semibold">
            <Filter size={18} />
            Filters
          </button>
        </div>

        {/* Content Section */}
        {showForm ? (
          <div className="max-w-2xl mx-auto">
            <TreeForm 
              onSave={handleAddTree} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        ) : (
          <>
            {filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Visual indicator for systematic order - sorting visually for the user too */}
                {[...filteredRecords].sort((a,b) => a.treeNumber.localeCompare(b.treeNumber, undefined, {numeric: true})).map(tree => (
                  <TreeCard key={tree.id} tree={tree} onDelete={handleDeleteTree} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  {searchQuery ? <AlertCircle size={40} /> : <TreePine size={40} />}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {searchQuery ? "No matching trees found" : "Your inventory is empty"}
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-8">
                  {searchQuery 
                    ? `We couldn't find any results for "${searchQuery}". Try a different search term.` 
                    : "Start building your digital orchard by adding your first tree record today."}
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 font-bold"
                  >
                    <Plus size={20} />
                    Add Your First Tree
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      {!showForm && (
        <button 
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-700 transition-all hover:scale-110 active:scale-95 z-20 md:w-auto md:px-6 md:rounded-2xl md:bottom-12 md:right-12"
        >
          <Plus size={32} className="md:size-6" />
          <span className="hidden md:inline ml-2 font-bold">New Record</span>
        </button>
      )}
    </div>
  );
};

export default App;
