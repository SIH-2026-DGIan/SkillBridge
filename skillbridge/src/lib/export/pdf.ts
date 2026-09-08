import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFReportOptions {
  title: string;
  subtitle?: string;
  dateRangeLabel?: string;
  columns: { header: string; dataKey: string }[];
  rows: Record<string, any>[];
  summaryLines?: string[];
  filename: string;
}

export function generatePlacementPDF(options: PDFReportOptions) {
  const { title, subtitle, dateRangeLabel, columns, rows, summaryLines, filename } = options;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, 40, 50);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  if (subtitle) doc.text(subtitle, 40, 70);
  if (dateRangeLabel) doc.text(dateRangeLabel, 40, 88);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 250, 50);

  let startY = 105;

  if (summaryLines && summaryLines.length > 0) {
    doc.setFontSize(10);
    summaryLines.forEach((line, i) => doc.text(line, 40, startY + i * 16));
    startY += summaryLines.length * 16 + 15;
  }

  autoTable(doc, {
    startY,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => row[c.dataKey] ?? "")),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [79, 70, 229] },
    alternateRowStyles: { fillColor: [245, 245, 250] },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount} — SkillBridge NAAC Report`, 40, doc.internal.pageSize.getHeight() - 20);
  }

  doc.save(`${filename}.pdf`);
}