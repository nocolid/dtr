import { jsPDF } from 'jspdf'

export function usePDF() {
  let currentDoc = null

  function generatePDF(times, totalDecimal) {
    const doc = new jsPDF()
    const date = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text('DAILY TIME RECORD', 20, 30)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${date}`, 20, 40)
    doc.line(20, 45, 190, 45)

    doc.setFont('helvetica', 'bold')
    doc.text('SESSION', 20, 60)
    doc.text('TIME IN', 70, 60)
    doc.text('TIME OUT', 120, 60)

    doc.setFont('helvetica', 'normal')
    doc.text('Morning:', 20, 75)
    doc.text(times.morningIn || '--:--', 70, 75)
    doc.text(times.morningOut || '--:--', 120, 75)

    doc.text('Afternoon:', 20, 85)
    doc.text(times.afternoonIn || '--:--', 70, 85)
    doc.text(times.afternoonOut || '--:--', 120, 85)

    doc.line(20, 95, 190, 95)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`TOTAL HOURS: ${totalDecimal}`, 20, 110)

    return doc
  }

  function getPreviewURL(times, totalDecimal) {
    currentDoc = generatePDF(times, totalDecimal)
    return currentDoc.output('bloburl')
  }

  function downloadPDF() {
    if (currentDoc) {
      currentDoc.save(`DTR_${new Date().toLocaleDateString()}.pdf`)
    }
  }

  return { getPreviewURL, downloadPDF }
}
