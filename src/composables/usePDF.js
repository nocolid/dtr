import { jsPDF } from 'jspdf'

export function usePDF() {
  let currentDoc = null

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split('-')
    return new Date(+y, +m - 1, +d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  function generatePDF(times, totalDecimal, records, totalAccumulatedHours, progressPercent) {
    const doc = new jsPDF()
    const pageH = doc.internal.pageSize.getHeight()
    const maxY = pageH - 20
    const margin = 20

    // --- Header ---
    const generatedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text('DAILY TIME RECORD', margin, 28)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${generatedDate}`, margin, 37)
    doc.line(margin, 41, 190, 41)

    // --- Today's entry ---
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('SESSION', margin, 50)
    doc.text('TIME IN', 80, 50)
    doc.text('TIME OUT', 130, 50)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Morning', margin, 59)
    doc.text(times.morningIn   || '--:--', 80, 59)
    doc.text(times.morningOut  || '--:--', 130, 59)

    doc.text('Afternoon', margin, 68)
    doc.text(times.afternoonIn  || '--:--', 80, 68)
    doc.text(times.afternoonOut || '--:--', 130, 68)

    doc.line(margin, 73, 190, 73)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`TODAY'S TOTAL: ${totalDecimal} HRS`, margin, 82)

    // --- Saved Records section ---
    let y = 97

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.text('SAVED RECORDS', margin, y)
    y += 5

    doc.line(margin, y, 190, y)
    y += 7

    // Column header row
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.text('DATE',   20,  y)
    doc.text('AM IN',  68,  y)
    doc.text('AM OUT', 88,  y)
    doc.text('PM IN',  112, y)
    doc.text('PM OUT', 132, y)
    doc.text('TOTAL',  160, y)
    y += 2
    doc.line(margin, y, 190, y)
    y += 6

    // Record rows
    if (records.length === 0) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(9)
      doc.text('No records saved yet.', margin, y)
      y += 8
    } else {
      doc.setFontSize(9)
      for (const record of records) {
        if (y > maxY) {
          doc.addPage()
          y = 20
        }

        doc.setFont('helvetica', 'normal')
        doc.text(formatDate(record.date),           20,  y)
        doc.text(record.morningIn   || '--:--',     68,  y)
        doc.text(record.morningOut  || '--:--',     88,  y)
        doc.text(record.afternoonIn  || '--:--',    112, y)
        doc.text(record.afternoonOut || '--:--',    132, y)

        doc.setFont('helvetica', 'bold')
        doc.text((record.totalMinutes / 60).toFixed(2), 160, y)

        y += 7
      }
    }

    // --- Summary footer ---
    if (y > maxY - 18) {
      doc.addPage()
      y = 20
    }

    y += 4
    doc.line(margin, y, 190, y)
    y += 8

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(
      `TOTAL ACCUMULATED: ${totalAccumulatedHours} / 486 HRS  (${progressPercent}%)`,
      margin, y
    )

    return doc
  }

  function getPreviewURL(times, totalDecimal, records, totalAccumulatedHours, progressPercent) {
    currentDoc = generatePDF(times, totalDecimal, records, totalAccumulatedHours, progressPercent)
    return currentDoc.output('bloburl')
  }

  function downloadPDF() {
    if (currentDoc) {
      currentDoc.save(`DTR_${new Date().toLocaleDateString()}.pdf`)
    }
  }

  return { getPreviewURL, downloadPDF }
}
