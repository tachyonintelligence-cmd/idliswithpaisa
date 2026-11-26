// Scripted sample calls for the simulation. All businesses and bookings are
// illustrative. Have a native speaker of each language review edits.
// Agent lines avoid gendered first-person verbs so any selected voice can read them.

export const LANGUAGES = [
  { id: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada' },
  { id: 'hi', label: 'हिन्दी', name: 'Hindi' },
  { id: 'ta', label: 'தமிழ்', name: 'Tamil' },
  { id: 'en', label: 'English', name: 'English' },
]

export const VOICES = [
  { id: 'asha', name: 'Voice A', style: 'Warm and unhurried' },
  { id: 'nova', name: 'Voice B', style: 'Bright and brisk' },
  { id: 'mira', name: 'Voice C', style: 'Calm and formal' },
]

const ai = (text, gloss) => ({ role: 'agent', text, gloss })
const caller = (text, gloss, intent, details) => ({ role: 'caller', text, gloss, intent, details })

export const SCENARIOS = {
  kn: {
    title: 'Two-wheeler service booking',
    direction: 'Inbound call',
    note: 'Illustrative scenario with a fictional two-wheeler service centre.',
    outcome: [
      ['Booking', 'Saturday, 11:30 AM'],
      ['Vehicle', 'Scooter — general service'],
      ['Extra check', 'Brakes'],
      ['Follow-up', 'WhatsApp confirmation'],
    ],
    turns: [
      ai('ನಮಸ್ಕಾರ! Service center ಇಂದ ಮಾತಾಡ್ತಿದೀನಿ. ಹೇಳಿ, ಏನ್ help ಬೇಕಿತ್ತು?', 'Hello! Speaking from the service centre. Tell me, how can I help?'),
      caller('ಹಾಯ್, ನನ್ನ scooter ಗೆ service ಮಾಡಿಸ್ಬೇಕಿತ್ತು.', 'Hi, I wanted to get my scooter serviced.', 'Book a service', { Vehicle: 'Scooter' }),
      ai('ಖಂಡಿತ, ಮಾಡ್ಸೋಣ. Last service ಯಾವಾಗ ಆಗಿದ್ದು ಅಂತ ನೆನಪಿದ್ಯಾ?', "Sure, let's do it. Do you remember when the last service was?"),
      caller('ಸುಮಾರು ಆರು ತಿಂಗಳಾಯ್ತು. ಹಂಗೇ brake ಸ್ವಲ್ಪ loose ಅನ್ನಿಸ್ತಿದೆ.', 'About six months ago. Also, the brake feels a bit loose.', 'Report an issue', { 'Last service': '~6 months ago', Issue: 'Loose brake' }),
      ai('ಸರಿ, brake check ಕೂಡ note ಮಾಡ್ಕೊತೀನಿ. ಈ Saturday ಬೆಳಿಗ್ಗೆ 10:30 slot ಇದೆ — ನಿಮ್ಗೆ ಆಗುತ್ತಾ?', "Okay, I'll note a brake check too. There's a 10:30 slot this Saturday morning. Does that work?"),
      caller('Saturday ok, ಆದ್ರೆ 11 ಆದ್ಮೇಲೆ ಇದ್ರೆ ಒಳ್ಳೇದು.', 'Saturday is fine, but after 11 would be better.', 'Change the time', { Day: 'Saturday', Time: 'After 11 AM' }),
      ai('11:30 free ಇದೆ, ಅದನ್ನೇ ನಿಮ್ಗೆ block ಮಾಡ್ತೀನಿ. Pickup ಬೇಕಾ, ಅಥವಾ ನೀವೇ ಗಾಡಿ ತಗೊಂಡ್ ಬರ್ತೀರಾ?', "11:30 is free, I'll block it for you. Do you need pickup, or will you bring the vehicle yourself?"),
      caller('ಬೇಡ, ನಾನೇ ಬರ್ತೀನಿ.', "No need, I'll come myself.", 'Confirm drop-off', { Pickup: 'Not needed' }),
      ai('Done! Saturday 11:30 ಕ್ಕೆ scooter general service, ಜೊತೆಗೆ brake check. Confirmation WhatsApp ಗೆ ಕಳಿಸ್ತೀನಿ. Thank you!', "Done! Scooter general service with a brake check, Saturday 11:30. I'll send the confirmation on WhatsApp. Thank you!"),
    ],
  },
  hi: {
    title: 'Product enquiry — water purifier',
    direction: 'Inbound call',
    note: 'Illustrative scenario with a fictional retailer.',
    outcome: [
      ['Lead', 'Qualified'],
      ['Need', 'RO purifier, 5 people'],
      ['Budget', 'About ₹15,000'],
      ['Next step', 'Demo call tomorrow after 6 PM'],
    ],
    turns: [
      ai('नमस्ते! Sharma Electronics में आपका स्वागत है। बताइए, किस product के बारे में जानना था?', 'Hello! Welcome to Sharma Electronics. Which product did you want to know about?'),
      caller('मुझे water purifier लेना है, लेकिन समझ नहीं आ रहा कौन सा ठीक रहेगा।', "I want to buy a water purifier, but I can't tell which one would suit us.", 'Product advice', { Product: 'Water purifier' }),
      ai('कोई बात नहीं, मिलकर देख लेते हैं। आपके घर में पानी कहाँ से आता है — corporation का या borewell का?', "No problem, let's work it out together. Is your water from the corporation or a borewell?"),
      caller('Borewell का है, थोड़ा खारा भी है।', "It's borewell water, and a bit salty.", 'Describe conditions', { 'Water source': 'Borewell, hard' }),
      ai('तब RO वाला model बेहतर रहेगा। घर में कितने लोग हैं?', 'Then an RO model will be better. How many people are at home?'),
      caller('हम पाँच लोग हैं। और budget करीब पंद्रह हज़ार है।', 'There are five of us. The budget is around fifteen thousand.', 'Share requirements', { Household: '5 people', Budget: '≈ ₹15,000' }),
      ai('ठीक है। पाँच लोगों के लिए 8 से 10 litre storage वाला RO अच्छा रहेगा। आपके budget के options WhatsApp पर भेज दूँ?', 'Right. For five people, an RO with 8 to 10 litres of storage will work well. Shall I send options in your budget on WhatsApp?'),
      caller('हाँ, भेज दीजिए। कोई demo भी मिल सकता है?', 'Yes, please send them. Can we get a demo too?', 'Request a demo', { Interest: 'Home demo' }),
      ai('बिल्कुल। Demo के लिए हमारी team आपको call करेगी। कल शाम का time ठीक रहेगा?', 'Of course. Our team will call you about the demo. Would tomorrow evening work?'),
      caller('हाँ, छह बजे के बाद।', 'Yes, after six.', 'Confirm time', { Callback: 'Tomorrow, after 6 PM' }),
      ai('Done — कल शाम 6 बजे के बाद। Details अभी WhatsApp पर आ जाएँगी। धन्यवाद!', "Done: tomorrow after 6 PM. You'll get the details on WhatsApp. Thank you!"),
    ],
  },
  ta: {
    title: 'Service reminder — air conditioner',
    direction: 'Outbound call',
    note: 'Illustrative scenario with a fictional service company.',
    outcome: [
      ['Visit', 'Sunday, 10:00 AM'],
      ['Job', 'AC service + cooling check'],
      ['Reminder', 'Resolved'],
      ['Follow-up', 'SMS with details'],
    ],
    turns: [
      ai('வணக்கம்! CoolCare service-ல இருந்து பேசுறேன். உங்க AC-க்கு service due ஆகியிருக்கு. இப்போ ரெண்டு நிமிஷம் பேசலாமா?', 'Hello! Calling from CoolCare service. Your AC is due for a service. Can we talk for two minutes?'),
      caller('ஆமா, சொல்லுங்க.', 'Yes, go ahead.', 'Accept the call', { Consent: 'Can talk now' }),
      ai('இந்த வாரத்துல service வெச்சுக்கலாமா? எந்த நாள் உங்களுக்கு வசதியா இருக்கும்?', 'Shall we do the service this week? Which day suits you?'),
      caller('Weekdays கஷ்டம். Sunday முடியுமா?', 'Weekdays are hard. Is Sunday possible?', 'Request a day', { Day: 'Sunday' }),
      ai('முடியும். Sunday காலை 10 மணி இல்ல மதியம் 2 மணி — எது ஓகே?', 'It is. Sunday 10 in the morning or 2 in the afternoon, which is okay?'),
      caller('காலை 10 மணி ஓகே. Cooling-உம் கொஞ்சம் கம்மியா இருக்கு.', '10 in the morning is fine. The cooling is also a bit weak.', 'Book and report issue', { Time: '10:00 AM', Issue: 'Weak cooling' }),
      ai('சரி, cooling check-உம் சேர்த்துக்குறேன். Sunday காலை 10 மணிக்கு technician வருவாங்க. Details SMS-ல அனுப்புறேன். நன்றி!', "Okay, I'll add a cooling check. A technician will come Sunday at 10 AM. I'll text you the details. Thank you!"),
    ],
  },
  en: {
    title: 'Clinic appointment',
    direction: 'Inbound call',
    note: 'Illustrative scenario with a fictional clinic.',
    outcome: [
      ['Appointment', 'Thursday, 5:45 PM'],
      ['Reason', 'Tooth sensitivity'],
      ['Patient', 'First visit'],
      ['Follow-up', 'Reminder the same morning'],
    ],
    turns: [
      ai('Hi, thanks for calling Greenleaf Dental. How can I help you today?'),
      caller("Hi, I'd like to see a dentist. One of my teeth has been really sensitive.", undefined, 'Book an appointment', { Reason: 'Tooth sensitivity' }),
      ai("Sorry to hear that. Let's get you seen. Is there any swelling or severe pain right now?"),
      caller('No swelling. It mostly hurts with cold drinks.', undefined, 'Describe symptoms', { Urgency: 'Not urgent' }),
      ai("Understood. Have you visited us before, or would this be your first time?"),
      caller("First time. Could I come after work, maybe Thursday?", undefined, 'Request a slot', { Patient: 'First visit', Preference: 'Thursday evening' }),
      ai('Thursday has 5:45 or 6:30 in the evening. Which is better for you?'),
      caller('5:45 works.', undefined, 'Confirm slot', { Time: '5:45 PM' }),
      ai("You're booked for Thursday at 5:45. I'll send a reminder that morning. If the pain gets worse before then, please call us right away."),
    ],
  },
}
