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
        { text: '10% تخفیف', color: '#FFD700' },
        { text: 'سفرکیش', color: '#FF6347' },
        { text: 'گوشی موبایل', color: '#ADFF2F' },
        { text: '10 دلار ', color: '#1E90FF' },
        { text: 'هیچ شانس', color: '#808080' },
        { text: 'آیفون 17 ', color: '#bbafafff' },
        { text: '100دلار ', color: '#FFC0CB' }
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
            ctx.fillStyle = '#000';
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
        const duration = 5000; // مدت زمان چرخش (میلی‌ثانیه)
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