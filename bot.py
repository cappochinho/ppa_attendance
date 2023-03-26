#!/usr/bin/python3

import json
import os
from telebot import TeleBot

from list_to_pdf import list_to_pdf


BOT_TOKEN = os.environ.get('BOT_TOKEN')
bot = TeleBot(BOT_TOKEN)


@bot.message_handler(commands=['start'])
def start(message):
    context = "Welcome! To get a list of people in \
    the premises, enter /checkattendance"
    bot.reply_to(message, context)


@bot.message_handler(commands=['checkattendance'])
def check_attendance(message):
    """Check for the number of people in building at current time"""

    in_list = []
    with open('file.json', 'r', encoding='utf-8') as f:
        people = json.load(f)
        for person in people:
            if person["hub_attendance_logs"] == []:
                continue
            if person['hub_attendance_logs'][-1]['type'] == "IN":
                add_to_list = []
                add_to_list.append(person['name'])
                add_to_list.append(
                    person['hub_attendance_logs'][-1]['location'])
                add_to_list.append(
                    person['hub_attendance_logs'][-1]['timestamp'])
                in_list.append(add_to_list)
    
    with open('in_list.json', 'w', encoding='utf-8') as f:
        json.dump(in_list, f)

    chat_id = message.chat.id
    with open('in_list.json', 'r', encoding='utf-8') as f:
        bot.send_document(chat_id, f)

bot.infinity_polling()
