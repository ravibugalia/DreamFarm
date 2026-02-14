
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { TreeRecord } from "../types";

export const generateTreeReport = (records: TreeRecord[]) => {
  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(22, 101, 52); // Dark green
  doc.text("ArborLog Inventory Report", 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  const tableData = records.map(r => [
    r.treeNumber,
    r.treeName,
    r.species,
    `${r.health}${r.healthDescription ? ` (${r.healthDescription})` : ''}`,
    `${r.production}${r.productionQuantity !== undefined ? ` [Qty: ${r.productionQuantity}]` : ''}`,
    r.location ? `${r.location.lat.toFixed(4)}, ${r.location.lng.toFixed(4)}` : "N/A"
  ]);

  (doc as any).autoTable({
    startY: 40,
    head: [['#', 'Name', 'Species', 'Health Status', 'Production Yield', 'Location']],
    body: tableData,
    headStyles: { fillColor: [22, 101, 52] },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    styles: { fontSize: 9 }
  });

  doc.save(`ArborLog_Report_${Date.now()}.pdf`);
};
