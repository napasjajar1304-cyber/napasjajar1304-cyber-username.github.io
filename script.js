// Sound System Synthesizer using Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    if (type === 'success') {
        // Double sweet beep (C5 to E5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'error') {
        // Buzzer sound sliding down
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
    } else if (type === 'fanfare') {
        // Happy C Major triad progression
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
        frequencies.forEach((freq, idx) => {
            const individualOsc = audioCtx.createOscillator();
            const individualGain = audioCtx.createGain();
            individualOsc.connect(individualGain);
            individualGain.connect(audioCtx.destination);
            
            individualOsc.type = 'sine';
            individualOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
            
            individualGain.gain.setValueAtTime(0.1, now + idx * 0.1);
            individualGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.5);
            
            individualOsc.start(now + idx * 0.1);
            individualOsc.stop(now + idx * 0.1 + 0.5);
        });
    }
}

// Text-To-Speech (Web Speech API)
function speakWord(word) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        
        let explanation = "";
        // Define phonetic explanation for each word to help Grade 3 learners
        switch(word) {
            case 'กวาง':
                explanation = "กวาง. สะกดว่า กอ-วอ-อา-งอ กวาง. เป็นคำควบกล้ำแท้ ออกเสียง กอ และ วอ พร้อมกันครับ";
                break;
            case 'พริก':
                explanation = "พริก. สะกดว่า พอ-รอ-อิ-กอ พริก. เป็นคำควบกล้ำแท้ ออกเสียง พอ และ รอ พร้อมกันครับ";
                break;
            case 'กล้วย':
                explanation = "กล้วย. สะกดว่า กอ-ลอ-อวย-ยอ กล้วย-ไม้โท กล้วย. เป็นคำควบกล้ำแท้ ออกเสียง กอ และ ลอ พร้อมกันครับ";
                break;
            case 'ขลุ่ย':
                explanation = "ขลุ่ย. สะกดว่า ขอ-ลอ-อุ-ยอ ขลุย-ไม้เอก ขลุ่ย. เป็นคำควบกล้ำแท้ ออกเสียง ขอ และ ลอ พร้อมกันครับ";
                break;
            case 'ตรวจ':
                explanation = "ตรวจ. สะกดว่า ตอ-รอ-อัว-จอ ตรวจ. เป็นคำควบกล้ำแท้ ออกเสียง ตอ และ รอ พร้อมกันครับ";
                break;
            case 'กวาด':
                explanation = "กวาด. สะกดว่า กอ-วอ-อา-ดอ กวาด. เป็นคำควบกล้ำแท้ ออกเสียง กอ และ วอ พร้อมกันครับ";
                break;
            case 'จริง':
                explanation = "จริง. สะกดว่า จอ-รอ-อิ-งอ จริง. แต่ออกเสียงเฉพาะตัวหน้าเป็น จิง ไม่ออกเสียงตัว รอ เรือ. จึงเป็นคำควบกล้ำไม่แท้ครับ";
                break;
            case 'สร้าง':
                explanation = "สร้าง. สะกดว่า สอ-รอ-อา-งอ สราง-ไม้โท สร้าง. แต่ออกเสียงเฉพาะตัวหน้าเป็น สร้าง ไม่ออกเสียงตัว รอ เรือ. จึงเป็นคำควบกล้ำไม่แท้ครับ";
                break;
            case 'สร้อย':
                explanation = "สร้อย. สะกดว่า สอ-รอ-ออย-ยอ สรอย-ไม้โท สร้อย. แต่ออกเสียงเฉพาะตัวหน้าเป็น ส้อย ไม่ออกเสียงตัว รอ เรือ. จึงเป็นคำควบกล้ำไม่แท้ครับ";
                break;
            case 'ทราย':
                explanation = "ทราย. สะกดว่า ทอ-รอ-อา-ยอ ทราย. แต่เสียง ทอ-รอ เมื่ออยู่คู่กัน จะออกเสียงเปลี่ยนไปเป็นเสียง ซอ โซ่. อ่านว่า ซาย เป็นคำควบกล้ำไม่แท้ครับ";
                break;
            case 'ทราบ':
                explanation = "ทราบ. สะกดว่า ทอ-รอ-อา-บอ ทราบ. แต่เสียง ทอ-รอ ออกเสียงเปลี่ยนไปเป็น ซอ โซ่. อ่านว่า ซาบ เป็นคำควบกล้ำไม่แท้ครับ";
                break;
            case 'ทรุดโทรม':
                explanation = "ทรุดโทรม. สะกดด้วย ทอ-รอ ทั้งสองคำ แต่เสียง ทอ-รอ ออกเสียงเปลี่ยนไปเป็น ซอ โซ่. อ่านว่า ซุด-โซม เป็นคำควบกล้ำไม่แท้ครับ";
                break;
            default:
                explanation = word;
        }

        const utterance = new SpeechSynthesisUtterance(explanation);
        utterance.lang = 'th-TH';
        utterance.rate = 0.95; // Slightly slower for kids to hear clearly
        
        // Find Thai voice if available
        const voices = window.speechSynthesis.getVoices();
        const thaiVoice = voices.find(voice => voice.lang.includes('TH'));
        if (thaiVoice) {
            utterance.voice = thaiVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert("ขออภัยครับ เบราว์เซอร์ของคุณไม่รองรับการออกเสียงสะกดคำ");
    }
}

// Global Variables
let currentScreen = 'home-screen';
let totalScore = 0;

// Game 1 State
let game1Score = 0;
let game1Progress = 0;
let game1SelectedWord = null; // For mobile click-to-move
const game1Total = 8;
const game1Pool = [
    { name: 'พริก', emoji: '🌶️', type: 'true' },
    { name: 'กวาง', emoji: '🦌', type: 'true' },
    { name: 'กล้วย', emoji: '🍌', type: 'true' },
    { name: 'ขลุ่ย', emoji: '🪈', type: 'true' },
    { name: 'ตรวจ', emoji: '🔍', type: 'true' },
    { name: 'กวาด', emoji: '🧹', type: 'true' },
    { name: 'จริง', emoji: '💭', type: 'false' },
    { name: 'ทราย', emoji: '⏳', type: 'false' },
    { name: 'สร้อย', emoji: '📿', type: 'false' },
    { name: 'สร้าง', emoji: '🏗️', type: 'false' },
    { name: 'ทราบ', emoji: '📝', type: 'false' },
    { name: 'ทรุดโทรม', emoji: '🏚️', type: 'false' }
];
let game1ActiveProducts = [];

// Game 2 State
let game2Score = 0;
let game2Progress = 0;
const game2Total = 10; // Number of consonant clusters to find
const storyData = [
    { text: "ณ", isCluster: false, type: "none" },
    { text: "สระน้ำ", isCluster: true, type: "false", explanation: "สระน้ำ (สะ-น้ำ) ไม่ออกเสียง ร" },
    { text: "กว้างใหญ่", isCluster: true, type: "true", explanation: "กว้าง (กว-อ้าง) ควบกล้ำแท้" },
    { text: "มี", isCluster: false, type: "none" },
    { text: "กวางป่า", isCluster: true, type: "true", explanation: "กวาง (กว-าง) ควบกล้ำแท้" },
    { text: "ตัวหนึ่ง", isCluster: false, type: "none" },
    { text: "นอน", isCluster: false, type: "none" },
    { text: "เศร้าใจ", isCluster: true, type: "false", explanation: "เศร้า (เส้า) ไม่ออกเสียง ร" },
    { text: "อยู่ใต้", isCluster: false, type: "none" },
    { text: "ต้นไทร", isCluster: true, type: "false", explanation: "ไทร (ซาย) ทร ออกเสียง ซ" },
    { text: "ที่", isCluster: false, type: "none" },
    { text: "ทรุดโทรม", isCluster: true, type: "false", explanation: "ทรุดโทรม (ซุด-โซม) ทร ออกเสียง ซ" },
    { text: "มัน", isCluster: false, type: "none" },
    { text: "กำลัง", isCluster: false, type: "none" },
    { text: "ตรวจดู", isCluster: true, type: "true", explanation: "ตรวจ (ตร-วจ) ควบกล้ำแท้" },
    { text: "บาดแผล", isCluster: true, type: "true", explanation: "แผล (ผอ-ลอ-แผล) ควบกล้ำแท้" },
    { text: "ที่เท้า", isCluster: false, type: "none" },
    { text: "ซึ่งโดน", isCluster: false, type: "none" },
    { text: "พริก", isCluster: true, type: "true", explanation: "พริก (พอ-รอ-ิก) ควบกล้ำแท้" },
    { text: "ตำ", isCluster: false, type: "none" },
    { text: "มัน", isCluster: false, type: "none" },
    { text: "หวังว่า", isCluster: false, type: "none" },
    { text: "จะมี", isCluster: false, type: "none" },
    { text: "ใคร", isCluster: true, type: "true", explanation: "ใคร (คร-ไอ) ควบกล้ำแท้" },
    { text: "มาช่วย", isCluster: false, type: "none" },
    { text: "ปรับปรุง", isCluster: true, type: "true", explanation: "ปรับปรุง (ปร-ับ-ปร-ุง) ควบกล้ำแท้" },
    { text: "ให้มัน", isCluster: false, type: "none" },
    { text: "จริงๆ", isCluster: true, type: "false", explanation: "จริง (จิง) ไม่ออกเสียง ร" }
];

// Switch Screen Navigation
function switchScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update navbar buttons state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Match button with screenId
    const buttonMapping = {
        'home-screen': 0,
        'learn-screen': 1,
        'game1-screen': 2,
        'game2-screen': 3,
        'exit-screen': 4
    };
    
    const btns = document.querySelectorAll('.nav-btn');
    const index = buttonMapping[screenId];
    if (index !== undefined && btns[index]) {
        btns[index].classList.add('active');
    }
    
    currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialize games on demand
    if (screenId === 'game1-screen' && game1ActiveProducts.length === 0) {
        initGame1();
    }
    if (screenId === 'game2-screen' && game2Progress === 0) {
        initGame2();
    }
}

/* ==========================================================================
   GAME 1: SHOPPING MARKET GAME (DRAG & DROP)
   ========================================================================== */

function initGame1() {
    game1Score = 0;
    game1Progress = 0;
    game1SelectedWord = null;
    document.getElementById('game1-score').innerText = game1Score;
    document.getElementById('game1-progress').innerText = `0/${game1Total}`;
    document.getElementById('btn-next-game2').disabled = true;

    // Select 8 random words: 4 true, 4 false
    const trueItems = game1Pool.filter(item => item.type === 'true').sort(() => 0.5 - Math.random()).slice(0, 4);
    const falseItems = game1Pool.filter(item => item.type === 'false').sort(() => 0.5 - Math.random()).slice(0, 4);
    game1ActiveProducts = [...trueItems, ...falseItems].sort(() => 0.5 - Math.random());

    renderShelf();
}

function renderShelf() {
    const shelf = document.getElementById('products-shelf');
    shelf.innerHTML = '';
    
    game1ActiveProducts.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = 'product-item';
        item.draggable = true;
        item.id = `prod-${index}`;
        item.dataset.type = product.type;
        item.dataset.name = product.name;
        item.innerHTML = `<span class="product-emoji">${product.emoji}</span> ${product.name}`;
        
        // Drag events
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        // Mobile click selection
        item.addEventListener('click', () => {
            selectProductForMobile(item);
        });
        
        shelf.appendChild(item);
    });
}

function selectProductForMobile(itemElement) {
    document.querySelectorAll('.product-item').forEach(el => {
        el.classList.remove('selected-item');
    });
    
    if (game1SelectedWord === itemElement) {
        game1SelectedWord = null;
    } else {
        game1SelectedWord = itemElement;
        itemElement.classList.add('selected-item');
        speakWord(itemElement.dataset.name);
    }
}

// Drag & Drop Handlers
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.target.classList.add('dragging');
    // Speak word on drag start
    speakWord(e.target.dataset.name);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function allowDrop(e) {
    e.preventDefault();
    const basket = e.currentTarget;
    basket.classList.add('dragover');
}

// Basket drag leave
document.querySelectorAll('.basket').forEach(basket => {
    basket.addEventListener('dragleave', () => {
        basket.classList.remove('dragover');
    });
});

function handleDrop(e, targetType) {
    e.preventDefault();
    const basket = e.currentTarget;
    basket.classList.remove('dragover');
    
    const id = e.dataTransfer.getData('text/plain');
    const draggedItem = document.getElementById(id);
    if (!draggedItem) return;
    
    processSort(draggedItem, targetType);
}

// Sort verification logic
function processSort(itemElement, targetType) {
    const itemType = itemElement.dataset.type;
    const name = itemElement.dataset.name;
    
    if (itemType === targetType) {
        // Correct
        playSound('success');
        game1Score += 10;
        game1Progress++;
        
        // Remove item from active products list
        game1ActiveProducts = game1ActiveProducts.filter(p => p.name !== name);
        itemElement.remove();
        
        // Visual updates
        document.getElementById('game1-score').innerText = game1Score;
        document.getElementById('game1-progress').innerText = `${game1Progress}/${game1Total}`;
        
        // Check game over
        if (game1Progress === game1Total) {
            playSound('fanfare');
            totalScore += game1Score;
            document.getElementById('btn-next-game2').disabled = false;
            // Pop notification speech
            setTimeout(() => {
                speakWord("เก่งมากเลยครับน้อง ๆ ผ่านด่านแรกแล้ว ไปลุยต่อที่ด่านสองกันเลย!");
            }, 500);
        }
    } else {
        // Incorrect
        playSound('error');
        game1Score = Math.max(0, game1Score - 5);
        document.getElementById('game1-score').innerText = game1Score;
        
        // Shake item visually
        itemElement.style.animation = 'shakeIncorrect 0.4s ease';
        setTimeout(() => {
            itemElement.style.animation = '';
        }, 400);
    }
    game1SelectedWord = null;
}

// Mobile Click Basket action
function itemClickBasket(targetType) {
    if (!game1SelectedWord) {
        alert("กรุณาคลิกเลือกสินค้าบนชั้นวางก่อนนะครับ!");
        return;
    }
    processSort(game1SelectedWord, targetType);
}

function resetGame1() {
    initGame1();
}


/* ==========================================================================
   GAME 2: STORY HUNTING GAME (CLICK TO HIGHLIGHT)
   ========================================================================== */

function initGame2() {
    game2Score = 0;
    game2Progress = 0;
    document.getElementById('game2-score').innerText = game2Score;
    document.getElementById('game2-progress').innerText = `0/${game2Total}`;
    document.getElementById('btn-next-exit').disabled = true;
    
    renderStory();
}

function renderStory() {
    const container = document.getElementById('story-content');
    container.innerHTML = '';
    
    storyData.forEach((wordObj, index) => {
        const span = document.createElement('span');
        span.className = 'story-word';
        span.innerText = wordObj.text + " ";
        span.id = `story-word-${index}`;
        
        span.addEventListener('click', () => {
            handleWordClick(span, wordObj);
        });
        
        container.appendChild(span);
    });
}

function handleWordClick(spanElement, wordObj) {
    if (spanElement.classList.contains('correct-true') || 
        spanElement.classList.contains('correct-false') || 
        spanElement.classList.contains('incorrect')) {
        return; // Already clicked
    }

    if (wordObj.isCluster) {
        playSound('success');
        game2Score += 10;
        game2Progress++;
        
        if (wordObj.type === 'true') {
            spanElement.classList.add('correct-true');
        } else {
            spanElement.classList.add('correct-false');
        }
        
        document.getElementById('game2-score').innerText = game2Score;
        document.getElementById('game2-progress').innerText = `${game2Progress}/${game2Total}`;
        
        // Alert descriptive feedback about spelling
        speakWord(wordObj.text.replace(/ป่า|น้ำ|ใจ|ดู|จริงๆ/g, '')); // only speak cluster word portion
        
        if (game2Progress === game2Total) {
            playSound('fanfare');
            totalScore += game2Score;
            document.getElementById('btn-next-exit').disabled = false;
            setTimeout(() => {
                speakWord("ยอดเยี่ยมมากครับ! คุณคือนักสืบตัวจริง ค้นหาคำควบกล้ำพบครบทั้งหมดแล้ว!");
            }, 600);
        }
    } else {
        playSound('error');
        game2Score = Math.max(0, game2Score - 5);
        spanElement.classList.add('incorrect');
        document.getElementById('game2-score').innerText = game2Score;
    }
}

function resetGame2() {
    initGame2();
}


/* ==========================================================================
   EXIT TICKET & CANVAS CERTIFICATE SYSTEM
   ========================================================================== */

let mascotImg = new Image();
mascotImg.src = 'assets/mascot.jpg';

// Draw default empty canvas placeholder on load
window.addEventListener('load', () => {
    const canvas = document.getElementById('cert-canvas');
    const ctx = canvas.getContext('2d');
    
    // Draw pretty draft box
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    ctx.font = '24px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'center';
    ctx.fillText('กรุณากรอกใบเสร็จ Exit Ticket เพื่อสร้างใบประกาศเกียรติคุณ', canvas.width / 2, canvas.height / 2);
});

function generateCertificate(event) {
    event.preventDefault();
    
    const name = document.getElementById('student-name').value.trim();
    const q1 = document.querySelector('input[name="q1"]:checked').value;
    const q2 = document.querySelector('input[name="q2"]:checked').value;
    const q3 = document.getElementById('q3-text').value.trim();
    
    // Validate answers (Q1: สร้าง = false, Q2: ขว้าง = true)
    if (q1 !== 'false' || q2 !== 'true') {
        playSound('error');
        alert("มีบางคำตอบไม่ถูกต้องนะครับ ลองทบทวนใหม่อีกครั้งนะเด็ก ๆ! (ใบ้ให้: 'สร้าง' ไม่ออกเสียง ร, 'ขว้าง' ออกเสียง ขว ควบกัน)");
        return;
    }
    
    playSound('fanfare');
    
    // Calculate final scores
    const finalScore = game1Score + game2Score + 20; // 20 bonus points for correct exit ticket
    
    const canvas = document.getElementById('cert-canvas');
    const ctx = canvas.getContext('2d');
    
    // 1. Draw outer gold-border background
    const goldGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    goldGrad.addColorStop(0, '#f59e0b'); // gold
    goldGrad.addColorStop(0.5, '#fbbf24');
    goldGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 2. Draw inner white box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // 3. Draw inner blue decorative border
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    // 4. Draw Mascot image onto Canvas
    if (mascotImg.complete) {
        // Draw mascot on left side nicely
        ctx.save();
        // Create rounded clip path for mascot image
        ctx.beginPath();
        ctx.arc(150, 280, 95, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(mascotImg, 50, 180, 200, 200);
        ctx.restore();
        // Outer ring for mascot picture
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(150, 280, 95, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // 5. Draw Texts
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'center';
    
    // Title
    ctx.font = 'bold 36px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#0284c7';
    ctx.fillText('ใบประกาศเกียรติคุณผู้ช่วยตลาดสด', 510, 100);
    
    // Subtitle
    ctx.font = '20px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ยอดผู้ช่วยคนเก่งแห่งตลาดสดคำควบกล้ำ ป.3', 510, 140);
    
    // Certification line
    ctx.font = '22px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('ใบประกาศเกียรติคุณฉบับนี้ให้ไว้เพื่อแสดงว่า', 510, 200);
    
    // Student Name
    ctx.font = 'bold 32px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ea580c'; // Vibrant orange
    ctx.fillText(name, 510, 260);
    
    // Divider line
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 290);
    ctx.lineTo(670, 290);
    ctx.stroke();
    
    // Accomplishment detail
    ctx.font = '18px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('ผู้สอบผ่านความรู้และช่วยคัดแยกสินค้าในตลาดอย่างคล่องแคล่ว', 510, 330);
    ctx.fillText(`ได้คะแนนสะสมรวมทั้งสิ้น ${finalScore} คะแนน (ระดับดีเยี่ยม)`, 510, 360);
    ctx.fillText(`คำควบกล้ำแท้ที่ท่านชื่นชอบคือ "${q3}"`, 510, 390);

    // Date
    const today = new Date();
    const dateStr = `ให้ไว้ ณ วันที่ ${today.getDate()} กรกฎาคม พ.ศ. 2569`;
    ctx.font = '16px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(dateStr, 510, 440);

    // Signatures
    ctx.font = 'italic 16px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('น้องพร้อม', 510, 490);
    ctx.font = '14px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ผู้ดูแลตลาดและผู้พิทักษ์รักภาษาไทย 🦖', 510, 510);
    
    // Signature lines
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(420, 475);
    ctx.lineTo(600, 475);
    ctx.stroke();

    // Enable download button
    document.getElementById('btn-download-cert').disabled = false;
    
    alert("ขอแสดงความยินดีด้วย! คุณส่งตั๋วและได้รับใบประกาศเกียรติคุณผู้ช่วยคนเก่งแล้ว!");
}

function downloadCertificate() {
    const canvas = document.getElementById('cert-canvas');
    const name = document.getElementById('student-name').value.trim() || 'student';
    
    // Convert canvas to image data URL
    const imageURI = canvas.toDataURL("image/png");
    
    // Create download link element
    const link = document.createElement('a');
    link.download = `ใบประกาศเกียรติคุณ_ผู้ช่วยตลาดสด_${name}.png`;
    link.href = imageURI;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
