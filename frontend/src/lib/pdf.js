import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function downloadAsPdf(htmlString, filename) {
  // Create a hidden container for the HTML
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '794px'; // A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';

  // Clean up any extraneous margins from the html string
  container.innerHTML = htmlString;
  document.body.appendChild(container);

  try {
    // Render the canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    });

    // Create the PDF (A4 dimensions)
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = canvas.height * pdfWidth / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  } finally {
    // Cleanup
    document.body.removeChild(container);
  }
}