// src/utils/handleExportPDFUsingSVG.js
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

/* === Inline computed SVG styles === */
async function inlineComputedStyles(svg) {
  const props = [
    "fill",
    "stroke",
    "stroke-width",
    "font-size",
    "font-family",
    "font-weight",
    "opacity",
  ];
  svg.querySelectorAll("*").forEach((el) => {
    const cs = window.getComputedStyle(el);
    let style = "";
    props.forEach((p) => {
      const val = cs.getPropertyValue(p);
      if (val) style += `${p}:${val};`;
    });
    el.setAttribute("style", style);
  });
}

/* === Convert SVG → PNG === */
async function svgToPngDataURL(svg, scale = 2, bg = "#0F0A1E") {
  const clone = svg.cloneNode(true);
  const rect = svg.getBoundingClientRect();
  const width = rect.width || 800;
  const height = rect.height || 400;

  clone.setAttribute("width", width);
  clone.setAttribute("height", height);
  await inlineComputedStyles(clone);

  const serialized = new XMLSerializer().serializeToString(clone);
  const svg64 =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(serialized);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#0F0A1E");
      gradient.addColorStop(1, "#1B102D");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = svg64;
  });
}

/* === Export as PDF (Better Padding + Clean Layout) === */
export async function handleExportPDFUsingSVG(stats = {}, options = {}) {
  // ✅ Custom confirmation modal instead of window.confirm
  const confirmed = await new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]";
    modal.innerHTML = `
      <div class="bg-[#141218] border border-[#2d2d38]/80 rounded-2xl shadow-[0_0_30px_rgba(155,92,246,0.3)] p-8 text-center text-white w-[320px]">
        <h2 class="text-lg font-semibold mb-3 text-[#c084fc]">Export Analytics Report?</h2>
        <p class="text-sm text-gray-400 mb-6">Your charts and stats will be exported as a themed PDF file.</p>
        <div class="flex justify-center gap-4">
          <button id="confirmExportYes" class="px-4 py-2 rounded bg-gradient-to-r from-[#9b5cf6] to-[#ec4899] hover:opacity-90 text-sm font-semibold">Yes, Export</button>
          <button id="confirmExportNo" class="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-sm font-semibold">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector("#confirmExportYes").onclick = () => {
      modal.remove();
      resolve(true);
    };
    modal.querySelector("#confirmExportNo").onclick = () => {
      modal.remove();
      resolve(false);
    };
  });

  if (!confirmed) return; // user canceled

  try {
    // ✅ Wait until all labels are rendered (Recharts animation delay)
    await new Promise((r) => setTimeout(r, 1500));

    const svgs = Array.from(document.querySelectorAll(".recharts-surface"));
    if (!svgs.length) {
      toast.error("No charts found to export.");
      return;
    }

    toast.loading("Generating PDF...", { id: "export" });

    const chartImages = [];
    for (const svg of svgs) {
      const img = await svgToPngDataURL(svg, 2, "#0F0A1E");
      chartImages.push(img);
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const chartHeight = (pageH - 80) / 2;

    /* === COVER PAGE (With better spacing) === */
    pdf.setFillColor(15, 10, 30);
    pdf.rect(0, 0, pageW, pageH, "F");

    pdf.setDrawColor(155, 92, 246);
    pdf.setLineWidth(0.8);
    pdf.roundedRect(18, 30, pageW - 36, pageH - 60, 10, 10);

    pdf.setFontSize(28);
    pdf.setTextColor(245, 240, 255);
    pdf.text("MediaVerse Analytics Report", pageW / 2, 65, { align: "center" });

    pdf.setFontSize(12);
    pdf.setTextColor(180, 160, 255);
    pdf.text("Your Entertainment Insights, Simplified", pageW / 2, 78, {
      align: "center",
    });

    pdf.setDrawColor(155, 92, 246);
    pdf.setLineWidth(0.4);
    pdf.line(pageW / 2 - 35, 83, pageW / 2 + 35, 83);

    pdf.setFontSize(11);
    pdf.setTextColor(200, 180, 255);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, 100, {
      align: "center",
    });

    // Stats section with more breathing room
    const startY = 130;
    pdf.setFontSize(15);
    pdf.setTextColor(240, 240, 255);
    pdf.text("Report Summary", pageW / 2, startY - 10, { align: "center" });

    pdf.setDrawColor(155, 92, 246);
    pdf.line(pageW / 2 - 25, startY - 7, pageW / 2 + 25, startY - 7);

    const statsLines = [
      `Total Entries: ${stats.total ?? "—"}`,
      `Average Rating: ${
        typeof stats.avgRating === "number"
          ? stats.avgRating.toFixed(1) + "/10"
          : stats.avgRating ?? "—"
      }`,
      `Genres Tracked: ${stats.genreCount ?? "—"}`,
    ];
    pdf.setFontSize(13);
    pdf.setTextColor(220, 220, 240);
    statsLines.forEach((line, i) =>
      pdf.text(line, pageW / 2, startY + i * 12, { align: "center" })
    );

    pdf.setFontSize(10);
    pdf.setTextColor(160, 140, 230);
    pdf.text("MediaVerse — Explore • Rate • Analyze", pageW / 2, pageH - 25, {
      align: "center",
    });

    /* === CHART PAGES (2 per page, uniform borders + titles + spacing) === */
    for (let i = 0; i < chartImages.length; i += 2) {
      pdf.addPage();
      pdf.setFillColor(18, 12, 29);
      pdf.rect(0, 0, pageW, pageH, "F");

      const cardW = pageW - margin * 2;
      const cardH = chartHeight - 10;
      const borderRadius = 6;
      const chartGap = 18;
      const titles = options.chartTitles || [];

      // === Top Chart ===
      const title1 = titles[i] || `Chart ${i + 1}`;
      pdf.setFontSize(13);
      pdf.setTextColor(155, 92, 246);
      pdf.text(title1, pageW / 2, margin + 3, { align: "center" });

      pdf.setDrawColor(155, 92, 246);
      pdf.setLineWidth(0.6);
      pdf.roundedRect(
        margin,
        margin + 8,
        cardW,
        cardH,
        borderRadius,
        borderRadius
      );

      pdf.addImage(
        chartImages[i],
        "PNG",
        margin + 5,
        margin + 13,
        cardW - 10,
        cardH - 15
      );

      // === Bottom Chart ===
      if (chartImages[i + 1]) {
        const topY = margin + 8 + cardH + chartGap + 10;
        const title2 = titles[i + 1] || `Chart ${i + 2}`;

        pdf.setFontSize(13);
        pdf.setTextColor(155, 92, 246);
        pdf.text(title2, pageW / 2, topY - 5, { align: "center" });

        pdf.setDrawColor(155, 92, 246);
        pdf.setLineWidth(0.6);
        pdf.roundedRect(margin, topY, cardW, cardH, borderRadius, borderRadius);

        pdf.addImage(
          chartImages[i + 1],
          "PNG",
          margin + 5,
          topY + 5,
          cardW - 10,
          cardH - 15
        );
      }

      // === Footer ===
      pdf.setFontSize(10);
      pdf.setTextColor(170, 150, 255);
      pdf.text("MediaVerse Analytics © 2025", pageW - 60, pageH - 10);
    }

    const filename =
      options.fileName ||
      `MediaVerse_Analytics_${new Date().toISOString().slice(0, 10)}.pdf`;

    pdf.save(filename);

    toast.success("✅ Themed Analytics PDF exported successfully!", {
      id: "export",
    });
  } catch (err) {
    console.error("Export failed:", err);
    toast.error("❌ Export failed. Try again.", { id: "export" });
  }
}
