const fs = require('fs');
const PDFDocument = require('pdfkit');

function getAttendancePDF(jsonFilePath, pdfFilePath) {
  fs.readFile(jsonFilePath, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const people = JSON.parse(data);
    const attendanceSheet = [];

    for (const person of people) {
      const attendanceLogs = person['hub_attendance_logs'];

      if (!attendanceLogs || attendanceLogs.length === 0) {
        continue;
      }

      const lastAttendanceLog = attendanceLogs[attendanceLogs.length - 1];

      if (lastAttendanceLog['type'] === 'IN') {
        const addToList = [
          person['name'],
          lastAttendanceLog['location'],
          lastAttendanceLog['timestamp']
        ];
        attendanceSheet.push(addToList);
      }
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfFilePath);

    // Write the attendance data to the PDF
    doc.pipe(stream);

    doc.fontSize(12).text('Attendance Sheet', { align: 'center' });

    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text('Name', { width: 200 });
    doc.text('Location', { width: 200 });
    doc.text('Timestamp', { width: 200 });

    doc.font('Helvetica');
    for (const row of attendanceSheet) {
      doc.moveDown();
      doc.text(row[0], { width: 200 });
      doc.text(row[1], { width: 200 });
      doc.text(row[2], { width: 200 });
    }

    doc.end();
  });

  return pdfFilePath;
}

module.exports = getAttendancePDF;
