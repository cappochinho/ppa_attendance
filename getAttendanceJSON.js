const fs = require('fs');

function getAttendanceJSON() {
  // const filePath = 'in_list.json';

  fs.readFile('file.json', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    if (!data) {
      console.error('File is empty');
      return;
    }

    const people = JSON.parse(data);
    let attendanceSheet = [];

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

    if (attendanceSheet.length > 0) {
      const filePath = 'attendance_sheet.json';
      const jsonData = JSON.stringify(attendanceSheet, null, 2);
      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('Attendance data written to attendance_sheet.json');
      });
      return filePath;
    } else {
      console.error('No attendance data found');
      return;
    }
  });
}

getAttendanceJSON();
