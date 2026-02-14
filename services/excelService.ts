
import { TreeRecord } from "../types";

/**
 * Generates a CSV file from tree records and triggers a download.
 * CSV is the most universal format for Excel.
 */
export const generateExcelReport = (records: TreeRecord[]) => {
  // Sort records systematically by tree number
  const sortedRecords = [...records].sort((a, b) => 
    a.treeNumber.localeCompare(b.treeNumber, undefined, { numeric: true, sensitivity: 'base' })
  );

  const headers = [
    "Tree Number",
    "Common Name",
    "Species",
    "Health Status",
    "Health Description",
    "Production Level",
    "Yield Quantity",
    "Latitude",
    "Longitude",
    "Notes",
    "Date Added"
  ];

  const rows = sortedRecords.map(r => [
    `"${r.treeNumber.replace(/"/g, '""')}"`,
    `"${r.treeName.replace(/"/g, '""')}"`,
    `"${r.species.replace(/"/g, '""')}"`,
    `"${r.health}"`,
    `"${(r.healthDescription || "").replace(/"/g, '""')}"`,
    `"${r.production}"`,
    r.productionQuantity !== undefined ? r.productionQuantity : "",
    r.location ? r.location.lat : "",
    r.location ? r.location.lng : "",
    `"${(r.notes || "").replace(/"/g, '""')}"`,
    new Date(r.timestamp).toLocaleDateString()
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ArborLog_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
