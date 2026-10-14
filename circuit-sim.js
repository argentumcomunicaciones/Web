/**
 * ElectroLab Educativa - Simulador Interactivo de Laboratorio
 * Osciloscopio Digital en Tiempo Real y Banco de Pruebas Virtual
 */

(function () {
  'use strict';

  // State
  const simState = {
    waveType: 'pwm', // 'pwm', 'sine', 'rc'
    frequency: 60,   // Hz
    potentiometer: 65, // 0 to 100%
    isLedOn: true,
    running: true,
    phase: 0,
    historyData: [],
    maxPoints: 300,
    serialLog: [
      'Iniciando ElectroLab Workbench v2.6...',
      'Microcontrolador ATmega328P listo (16 MHz).',
      'Configurando Timer1 en modo Fast PWM...',
      'Canal ADC0 activo: Leyendo potenciómetro...',
      'Sistema listo. Ajusta los controles para experimentar.'
    ]
  };

  function initSim() {
    const canvas = document.getElementById('oscilloscope-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const freqSlider = document.getElementById('sim-freq');
    const potSlider = document.getElementById('sim-pot');
    const freqDisplay = document.getElementById('sim-freq-val');
    const potDisplay = document.getElementById('sim-pot-val');
    const vppDisplay = document.getElementById('sim-vpp');
    const vrmsDisplay = document.getElementById('sim-vrms');
    const dutyDisplay = document.getElementById('sim-duty');
    const serialConsole = document.getElementById('sim-serial-output');
    const waveBtns = document.querySelectorAll('[data-wave]');
    const virtualLed = document.getElementById('virtual-led');
    const ledGlow = document.getElementById('virtual-led-glow');
    const btnBlink = document.getElementById('sim-btn-blink');

    // Canvas sizing for retina display
    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Event listeners
    if (freqSlider) {
      freqSlider.addEventListener('input', (e) => {
        simState.frequency = parseInt(e.target.value, 10);
        if (freqDisplay) freqDisplay.textContent = `${simState.frequency} Hz`;
        addSerialLog(`Frecuencia ajustada a: ${simState.frequency} Hz (Periodo T = ${(1000 / simState.frequency).toFixed(2)} ms)`);
      });
    }

    if (potSlider) {
      potSlider.addEventListener('input', (e) => {
        simState.potentiometer = parseInt(e.target.value, 10);
        if (potDisplay) potDisplay.textContent = `${simState.potentiometer}%`;
        const rawAdc = Math.round((simState.potentiometer / 100) * 1023);
        const voltage = ((rawAdc / 1023) * 5.0).toFixed(2);
        addSerialLog(`ADC0: ${rawAdc}/1023 | Voltaje: ${voltage}V | PWM Duty: ${simState.potentiometer}%`);
        updateLedBrightness();
      });
    }

    waveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        waveBtns.forEach(b => {
          b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
          b.classList.add('text-slate-400', 'border-slate-800');
        });
        btn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
        btn.classList.remove('text-slate-400', 'border-slate-800');
        simState.waveType = btn.getAttribute('data-wave');

        const names = {
          pwm: 'Onda Cuadrada / PWM (555 & Arduino)',
          sine: 'Señal Senoidal AC (Filtros & Fuentes)',
          rc: 'Carga/Descarga Exponencial RC (Capacitor)'
        };
        addSerialLog(`Canal CH1: ${names[simState.waveType] || simState.waveType}`);
      });
    });

    if (btnBlink) {
      btnBlink.addEventListener('click', () => {
        simState.isLedOn = !simState.isLedOn;
        btnBlink.textContent = simState.isLedOn ? 'Pulsar: Nivel ALTO (5V)' : 'Pulsar: Nivel BAJO (0V)';
        addSerialLog(`Pin Digital D13 cambiado a: ${simState.isLedOn ? 'HIGH (1)' : 'LOW (0)'}`);
        updateLedBrightness();
      });
    }

    function updateLedBrightness() {
      if (!virtualLed) return;
      const opacity = simState.isLedOn ? (simState.potentiometer / 100) : 0.08;
      virtualLed.style.opacity = Math.max(0.15, opacity);
      if (ledGlow) {
        ledGlow.style.opacity = Math.max(0.05, opacity);
      }
    }

    function addSerialLog(msg) {
      if (!serialConsole) return;
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      const line = `[${timeStr}] ${msg}`;
      simState.serialLog.push(line);
      if (simState.serialLog.length > 25) simState.serialLog.shift();
      serialConsole.innerHTML = simState.serialLog.map(l => `<div class="font-mono text-xs text-slate-300 leading-relaxed font-normal">${escapeHtml(l)}</div>`).join('');
      serialConsole.scrollTop = serialConsole.scrollHeight;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Render loop
    let lastTime = performance.now();

    function render(currentTime) {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      // Increment phase
      const angularFreq = 2 * Math.PI * (simState.frequency / 35);
      simState.phase += angularFreq * dt;

      // Draw background (Oscilloscope CRT Dark Grid)
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#060B14';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#0F2636';
      ctx.lineWidth = 1;
      const gridSpacing = 24;

      ctx.beginPath();
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Center crosshairs
      ctx.strokeStyle = '#18384E';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Signal Trace
      const centerY = h / 2;
      const amplitude = (h / 2.8) * (simState.potentiometer / 100);

      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#22D3EE';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const points = 200;
      const duty = simState.potentiometer / 100;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        const normalizedX = (i / points) * 6 * Math.PI + simState.phase;
        let y = centerY;

        if (simState.waveType === 'sine') {
          y = centerY - Math.sin(normalizedX) * amplitude;
        } else if (simState.waveType === 'pwm') {
          const mod = (normalizedX / (2 * Math.PI)) % 1;
          const high = mod < duty;
          y = high ? (centerY - amplitude) : (centerY + amplitude);
        } else if (simState.waveType === 'rc') {
          const mod = (normalizedX / (2 * Math.PI)) % 1;
          if (mod < 0.5) {
            // Charging curve
            const tNorm = mod * 2;
            const factor = 1 - Math.exp(-tNorm * 4);
            y = (centerY + amplitude) - (2 * amplitude * factor);
          } else {
            // Discharging curve
            const tNorm = (mod - 0.5) * 2;
            const factor = Math.exp(-tNorm * 4);
            y = (centerY + amplitude) - (2 * amplitude * factor);
          }
        }

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Update telemetry numbers
      if (vppDisplay) {
        const vpp = ((simState.potentiometer / 100) * 5.0).toFixed(2);
        vppDisplay.textContent = `${vpp} V`;
      }
      if (vrmsDisplay) {
        let vrms = 0;
        const vpeak = (simState.potentiometer / 100) * 5.0;
        if (simState.waveType === 'sine') vrms = (vpeak / Math.SQRT2).toFixed(2);
        else if (simState.waveType === 'pwm') vrms = (vpeak * Math.sqrt(duty)).toFixed(2);
        else vrms = (vpeak * 0.63).toFixed(2);
        vrmsDisplay.textContent = `${vrms} V`;
      }
      if (dutyDisplay) {
        dutyDisplay.textContent = `${simState.potentiometer}%`;
      }

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    updateLedBrightness();
  }

  // Auto initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSim);
  } else {
    initSim();
  }
})();
