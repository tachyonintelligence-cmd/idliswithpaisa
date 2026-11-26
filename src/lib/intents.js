// Keyword intent matching for the lab's "try a line" simulation. Deliberately
// simple and labelled as such in the UI; a live deployment uses a language model.

const KEYWORDS = {
  human: ['human', 'person', 'agent', 'manager', 'ಮನುಷ್ಯ', 'staff', 'किसी से बात', 'insaan', 'ஆள்கிட்ட', 'ஒருத்தர்'],
  complaint: ['problem', 'issue', 'not working', 'broken', 'complaint', 'ಸಮಸ್ಯೆ', 'ಕೆಲಸ ಮಾಡ್ತಿಲ್ಲ', 'kharab', 'खराब', 'दिक्कत', 'பிரச்சனை', 'வேலை செய்யல'],
  price: ['price', 'cost', 'charge', 'how much', 'rate', 'ಎಷ್ಟಾಗುತ್ತೆ', 'ಬೆಲೆ', 'eshtu', 'कितना', 'कीमत', 'दाम', 'kitna', 'எவ்வளவு', 'விலை', 'evlo'],
  hours: ['open', 'close', 'timing', 'hours', 'ತೆಗ್ದಿರುತ್ತೆ', 'ಟೈಮ್', 'खुला', 'बंद', 'कब तक', 'திறந்து', 'எப்போ'],
  booking: ['book', 'appointment', 'slot', 'service', 'schedule', 'ಬುಕ್', 'ಮಾಡಿಸ್ಬೇಕು', 'बुक', 'अपॉइंटमेंट', 'अपॉइंटमेंट', 'புக்', 'அப்பாயின்ட்மென்ட்'],
  thanks: ['thank', 'bye', 'ಧನ್ಯವಾದ', 'धन्यवाद', 'शुक्रिया', 'நன்றி'],
}

export const INTENT_LABELS = {
  booking: 'Book an appointment', price: 'Price enquiry', hours: 'Opening hours',
  complaint: 'Report a problem', human: 'Talk to a person', thanks: 'Close the call', unknown: 'Not recognised',
}

export const AGENT = {
  kn: {
    greeting: 'ನಮಸ್ಕಾರ! ಹೇಳಿ, ಏನ್ help ಬೇಕಿತ್ತು?',
    samples: ['ನಾಳೆಗೆ ಒಂದು slot book ಮಾಡ್ಬೇಕಿತ್ತು', 'General service ಗೆ ಎಷ್ಟಾಗುತ್ತೆ?', 'Sunday ತೆಗ್ದಿರುತ್ತಾ? Timing ಹೇಳಿ', 'ಗಾಡಿ start ಆಗ್ತಿಲ್ಲ, ಏನೋ problem ಇದೆ'],
    booking: 'ಖಂಡಿತ! ಯಾವ ದಿನ ಮತ್ತೆ ಯಾವ time ನಿಮ್ಗೆ ಸರಿ ಹೋಗುತ್ತೆ?',
    price: 'Service ಮೇಲೆ price depend ಆಗುತ್ತೆ. ನಿಮ್ಗೆ ಯಾವ service ಬೇಕು ಅಂತ ಹೇಳ್ತೀರಾ?',
    hours: 'ಯಾವ ದಿನ ಬರ್ಬೇಕು ಅಂತಿದೀರಾ? ಆ ದಿನದ timing check ಮಾಡಿ ಹೇಳ್ತೀನಿ.',
    complaint: 'ಅಯ್ಯೋ, sorry. ಏನಾಗ್ತಿದೆ ಅಂತ ಸ್ವಲ್ಪ detail ಆಗಿ ಹೇಳ್ತೀರಾ? Note ಮಾಡ್ಕೊತೀನಿ.',
    human: 'ಸರಿ, ನಮ್ team ಅವ್ರಿಗೆ connect ಮಾಡ್ತೀನಿ. ನೀವ್ ಹೇಳಿದ್ದನ್ನೂ ಅವ್ರಿಗೆ ಕಳಿಸ್ತೀನಿ.',
    thanks: 'Thank you! ಒಳ್ಳೇ ದಿನ ಆಗ್ಲಿ.',
    unknown: 'Sorry, ಸರಿಯಾಗಿ ಅರ್ಥ ಆಗ್ಲಿಲ್ಲ. ಇನ್ನೊಂದ್ ಸಲ ಹೇಳ್ತೀರಾ?',
  },
  hi: {
    greeting: 'नमस्ते! बताइए, क्या help चाहिए?',
    samples: ['कल के लिए appointment book करनी है', 'General service का कितना लगेगा?', 'आप लोग कब तक खुले रहते हैं?', 'Machine खराब हो गई है'],
    booking: 'ज़रूर! किस दिन और किस time पर आना ठीक रहेगा?',
    price: 'Price service पर depend करता है। आपको कौन सी service चाहिए?',
    hours: 'आप किस दिन आना चाहेंगे? उस दिन की timing check करके बताते हैं।',
    complaint: 'Sorry, आपको दिक्कत हुई। थोड़ा detail में बताइए, क्या हो रहा है?',
    human: 'ठीक है, आपको हमारी team से connect करते हैं। आपकी बात भी उन्हें भेज दी जाएगी।',
    thanks: 'धन्यवाद! आपका दिन अच्छा रहे।',
    unknown: 'Sorry, ठीक से समझ नहीं आया। एक बार फिर बताएँगे?',
  },
  ta: {
    greeting: 'வணக்கம்! சொல்லுங்க, என்ன help வேணும்?',
    samples: ['நாளைக்கு ஒரு slot book பண்ணணும்', 'General service எவ்வளவு ஆகும்?', 'எப்போ வரை திறந்து இருக்கும்?', 'AC வேலை செய்யல'],
    booking: 'கண்டிப்பா! எந்த நாள், எந்த time உங்களுக்கு ஓகே?',
    price: 'Service-ஐ பொறுத்து price மாறும். உங்களுக்கு என்ன service வேணும்?',
    hours: 'எந்த நாள் வரலாம்னு இருக்கீங்க? அந்த நாள் timing check பண்ணி சொல்றேன்.',
    complaint: 'Sorry-ங்க. என்ன ஆகுதுன்னு கொஞ்சம் detail-ஆ சொல்லுங்க.',
    human: 'சரி, எங்க team-கிட்ட connect பண்றேன். நீங்க சொன்னதையும் அவங்களுக்கு அனுப்புறேன்.',
    thanks: 'நன்றி! நல்ல நாளா அமையட்டும்.',
    unknown: 'Sorry, சரியா புரியல. இன்னொரு தடவை சொல்ல முடியுமா?',
  },
  en: {
    greeting: 'Hi! How can I help you today?',
    samples: ['I want to book an appointment for tomorrow', 'How much is a general service?', 'What time do you close?', 'My machine is not working'],
    booking: 'Of course. Which day and time would suit you?',
    price: 'The price depends on the service. Which one are you looking for?',
    hours: 'Which day are you planning to come? I can check the timings for that day.',
    complaint: "I'm sorry about that. Could you tell me a little more about what is happening?",
    human: "Sure. I'll connect you with our team and pass along what you've told me.",
    thanks: 'Thank you. Have a good day!',
    unknown: "Sorry, I didn't quite catch that. Could you say it another way?",
  },
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function detectIntent(input) {
  const text = input.toLowerCase().normalize('NFC')
  const hit = Object.entries(KEYWORDS).find(([, words]) =>
    words.some((w) => {
      const word = w.toLowerCase().normalize('NFC')
      // Latin keywords must start a word, so "rate" does not match "operate".
      return /^[a-z]/.test(word) ? new RegExp(`\\b${escape(word)}`).test(text) : text.includes(word)
    }),
  )
  const intent = hit?.[0] ?? 'unknown'
  return { intent, matched: intent !== 'unknown' }
}
