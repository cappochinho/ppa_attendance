#!/usr/bin/env node

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const getAttendance = require('./getAttendancePDF.js');

const apiToken = 'YOUR API TOKEN';
const bot = new TelegramBot(apiToken, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/checkattendance') {
    const attendancePDF = getAttendance('file.json', 'attendance_sheet.pdf');
    bot.sendDocument(chatId, attendancePDF)
      .then(() => {
        console.log('File sent successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (text === '/start') {
    bot.sendMessage(chatId, "Welcome, enter '/checkattendance' for data");
  } else {
      bot.sendMessage(chatId, `You said: ${text}`);
  }
});

