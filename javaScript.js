// مطمئن شوید که DOM کاملاً بارگذاری شده است
document.addEventListener('DOMContentLoaded', function() {
    const wheelCanvas = document.getElementById('wheelCanvas');
    if (!wheelCanvas) return; // اگر کانواس پیدا نشد، ادامه نده

    const ctx = wheelCanvas.getContext('2d');
    const spinWheelBtn = document.getElementById('spinWheel');
    const resultMessageDiv = document.getElementById('resultMessage');
    const wheelResultField = document.getElementById('wheelResultField'); // فیلد پنهان Gravity Forms

    // گزینه‌های گردونه
    const segments = [
        { text: '10% تخفیف', color: '#9e9c9cff' },
        { text: 'سفرکیش', color: '#e1141e' },
        { text: '10 دلار ', color: '#505050' },
        { text: 'هیچ شانس', color: '#e1141e' },
        { text: 'گوشی موبایل', color: '#505050' },
        { text: 'آیفون 17 ', color: '#e1141e' },
        { text: ' پوچ', color: '#505050' },
        { text: '100دلار ', color: '#e1141e' }
    ];

    const numSegments = segments.length;
    const arc = Math.PI / (numSegments / 2); // زاویه هر بخش

    let rotation = 0;
    let spinning = false;

    // تابع برای ترسیم گردونه
    function drawWheel() {
        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        for (let i = 0; i < numSegments; i++) {
            const angle = rotation + i * arc;
            ctx.beginPath();
            ctx.arc(wheelCanvas.width / 2, wheelCanvas.height / 2, wheelCanvas.width / 2, angle, angle + arc);
            ctx.lineTo(wheelCanvas.width / 2, wheelCanvas.height / 2);
            ctx.fillStyle = segments[i].color;
            ctx.fill();
            ctx.save();
            ctx.translate(wheelCanvas.width / 2 + Math.cos(angle + arc / 2) * (wheelCanvas.width / 2 - 50),
                          wheelCanvas.height / 2 + Math.sin(angle + arc / 2) * (wheelCanvas.width / 2 - 50));
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(segments[i].text, 0, 0);
            ctx.restore();
        }
    }

    // تابع برای چرخاندن گردونه
    function spinWheel() {
        if (spinning) return;
        spinning = true;
        spinWheelBtn.disabled = true; // دکمه را غیرفعال کنید

        // چرخش تصادفی بین 5 تا 10 دور کامل + یک مقدار تصادفی برای توقف روی یک بخش
        const totalRotation = Math.random() * (3600 - 1800) + 1800; // 5 تا 10 دور
        const duration = 4600; // مدت زمان چرخش (میلی‌ثانیه)
        const startTime = Date.now();

        function animateSpin() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3); // تابع easing برای حرکت نرم

            rotation = (totalRotation * easeOut) % 360; // چرخش بر حسب درجه

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                spinning = false;
                determineWinner();
            }
        }
        requestAnimationFrame(animateSpin);
    }

    // تابع برای تعیین برنده
    function determineWinner() {
        // محاسبه زاویه نهایی بر حسب رادیان
        const finalAngleRad = (rotation * Math.PI) / 180;
        // محاسبه ایندکس برنده بر اساس زاویه نهایی
        const winningIndex = Math.floor(numSegments - (finalAngleRad % (2 * Math.PI)) / arc);
        const winner = segments[winningIndex];

        resultMessageDiv.textContent = `تبریک! شما برنده شدید: ${winner.text}`;
        
        // ذخیره نتیجه در فیلد پنهان Gravity Forms
        if (wheelResultField) {
            wheelResultField.value = winner.text;
        }

        // می‌توانید اینجا اقدامات دیگری انجام دهید، مثلاً ارسال کد تخفیف
    }

    // ترسیم اولیه گردونه
    drawWheel();

    // رویداد کلیک برای دکمه چرخش
    spinWheelBtn.addEventListener('click', spinWheel);
});


// تابع برای چرخاندن گردونه
function spinWheel() {
    if (spinning) return;
    spinning = true;
    spinWheelBtn.disabled = true;

    let totalRotation;

    // --- احتمال اختصاصی ---
    const chancePhone = Math.floor(Math.random() * 1000);   // 1/1000 برای گوشی
    const chanceIphone = Math.floor(Math.random() * 1000);  // 1/1000 برای آیفون 17

    const phoneIndex = segments.findIndex(s => s.text === 'گوشی موبایل');
    const iphoneIndex = segments.findIndex(s => s.text === 'آیفون 17 ');

    // اگر قرعه گوشی موبایل افتاد
    if (chancePhone === 0 && phoneIndex !== -1) {
        const targetAngle = phoneIndex * arc + arc / 2;
        const targetDeg = (targetAngle * 180) / Math.PI;

        totalRotation = (Math.random() * (3600 - 1800) + 1800) + (360 - targetDeg);

    // اگر قرعه آیفون 17 افتاد
    } else if (chanceIphone === 0 && iphoneIndex !== -1) {
        const targetAngle = iphoneIndex * arc + arc / 2;
        const targetDeg = (targetAngle * 180) / Math.PI;

        totalRotation = (Math.random() * (3600 - 1800) + 1800) + (360 - targetDeg);

    // حالت معمولی
    } else {
        totalRotation = Math.random() * (3600 - 1800) + 1800;
    }

    const duration = 4600;
    const startTime = Date.now();

    function animateSpin() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        rotation = (totalRotation * easeOut) % 360;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            spinning = false;
            determineWinner();
        }
    }
    requestAnimationFrame(animateSpin);
}

