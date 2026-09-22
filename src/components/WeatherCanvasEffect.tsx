import React, { useEffect, useRef } from 'react';
import { WeatherType } from '../types';

interface WeatherCanvasEffectProps {
  weather: WeatherType;
  isEnabled: boolean;
  intensity?: 'SUBTLE' | 'MODERATE' | 'VIVID';
}

export const WeatherCanvasEffect: React.FC<WeatherCanvasEffectProps> = ({
  weather,
  isEnabled,
  intensity = 'MODERATE',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const countMultiplier = intensity === 'SUBTLE' ? 0.5 : intensity === 'VIVID' ? 1.4 : 1.0;

    // Particle states
    interface RainDrop {
      x: number;
      y: number;
      len: number;
      speed: number;
      opacity: number;
      width: number;
    }

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      opacity: number;
    }

    interface Snowflake {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      wobble: number;
      wobbleSpeed: number;
      opacity: number;
    }

    interface SunParticle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      pulseSpeed: number;
      pulseAngle: number;
    }

    interface LeafParticle {
      x: number;
      y: number;
      size: number;
      angle: number;
      speedX: number;
      speedY: number;
      rotSpeed: number;
      color: string;
    }

    interface CloudPuff {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      opacity: number;
    }

    // Initialize arrays
    const raindrops: RainDrop[] = [];
    const ripples: Ripple[] = [];
    const snowflakes: Snowflake[] = [];
    const sunParticles: SunParticle[] = [];
    const leaves: LeafParticle[] = [];
    const clouds: CloudPuff[] = [];

    let lightningTimer = 0;
    let isLightning = false;
    let lightningOpacity = 0;

    // Rain setup
    const rainCount = Math.floor(75 * countMultiplier);
    for (let i = 0; i < rainCount; i++) {
      raindrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        len: Math.random() * 18 + 10,
        speed: Math.random() * 8 + 12,
        opacity: Math.random() * 0.4 + 0.2,
        width: Math.random() * 1.5 + 0.8,
      });
    }

    // Snow setup
    const snowCount = Math.floor(65 * countMultiplier);
    for (let i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3.5 + 1.2,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    // Sun / Warm particle setup
    const sunCount = Math.floor(35 * countMultiplier);
    for (let i = 0; i < sunCount; i++) {
      sunParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 2,
        speedY: -(Math.random() * 0.5 + 0.2),
        speedX: Math.random() * 0.6 - 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    // Windy / Leaves setup
    const leafCount = Math.floor(25 * countMultiplier);
    const leafColors = ['#10b981', '#14b8a6', '#059669', '#f59e0b', '#d97706'];
    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        angle: Math.random() * Math.PI * 2,
        speedX: Math.random() * 3 + 2.5,
        speedY: Math.random() * 1.5 + 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.08,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      });
    }

    // Clouds setup
    const cloudCount = Math.floor(12 * countMultiplier);
    for (let i = 0; i < cloudCount; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.35),
        radius: Math.random() * 90 + 70,
        speedX: Math.random() * 0.2 + 0.08,
        opacity: Math.random() * 0.12 + 0.05,
      });
    }

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. SUNNY EFFECT
      if (weather === 'SUNNY') {
        // Soft golden sun radial flare in top right
        const sunX = width * 0.88;
        const sunY = 70;
        const pulse = Math.sin(frameCount * 0.02) * 15;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 260 + pulse);
        sunGrad.addColorStop(0, 'rgba(251, 191, 36, 0.35)');
        sunGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.15)');
        sunGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.05)');
        sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // Radiant sunlight streaks
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(frameCount * 0.002);
        for (let r = 0; r < 8; r++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const a1 = (r * Math.PI) / 4 - 0.07;
          const a2 = (r * Math.PI) / 4 + 0.07;
          ctx.lineTo(Math.cos(a1) * 380, Math.sin(a1) * 380);
          ctx.lineTo(Math.cos(a2) * 380, Math.sin(a2) * 380);
          ctx.closePath();
          ctx.fillStyle = 'rgba(253, 224, 71, 0.035)';
          ctx.fill();
        }
        ctx.restore();

        // Subtle, elegant daylight ambient glow (no sparkling yellow popping particles)
        const warmAmbient = ctx.createLinearGradient(0, 0, 0, height * 0.5);
        warmAmbient.addColorStop(0, 'rgba(254, 240, 138, 0.025)');
        warmAmbient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = warmAmbient;
        ctx.fillRect(0, 0, width, height * 0.5);
      }

      // 2. PARTLY CLOUDY EFFECT
      else if (weather === 'PARTLY_CLOUDY') {
        // Soft sky gradient overlay
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.4);
        skyGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
        skyGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height * 0.4);

        // Drifting cloud puffs
        clouds.forEach((c) => {
          c.x += c.speedX;
          if (c.x - c.radius > width) {
            c.x = -c.radius;
            c.y = Math.random() * (height * 0.35);
          }

          const puffGrad = ctx.createRadialGradient(c.x, c.y, c.radius * 0.2, c.x, c.y, c.radius);
          puffGrad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity * 1.5})`);
          puffGrad.addColorStop(0.6, `rgba(241, 245, 249, ${c.opacity})`);
          puffGrad.addColorStop(1, 'rgba(241, 245, 249, 0)');

          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fillStyle = puffGrad;
          ctx.fill();
        });

        // Gentle light motes
        sunParticles.slice(0, 15).forEach((p) => {
          p.y += p.speedY * 0.6;
          p.x += p.speedX;
          if (p.y < -10) p.y = height + 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(186, 230, 253, ${p.opacity * 0.5})`;
          ctx.fill();
        });
      }

      // 3. RAINY EFFECT
      else if (weather === 'RAINY') {
        // Subtle cool rain ambiance overlay
        ctx.fillStyle = 'rgba(30, 58, 138, 0.03)';
        ctx.fillRect(0, 0, width, height);

        // Falling raindrops (slanted)
        raindrops.forEach((drop) => {
          drop.y += drop.speed;
          drop.x += drop.speed * 0.22; // slight wind slant

          if (drop.y > height) {
            // Chance to create a ripple at the bottom
            if (Math.random() < 0.25) {
              ripples.push({
                x: drop.x,
                y: height - Math.random() * 15,
                radius: 1,
                maxRadius: Math.random() * 10 + 6,
                opacity: 0.4,
              });
            }
            drop.y = -drop.len;
            drop.x = Math.random() * (width + 100) - 50;
          }

          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.len * 0.22, drop.y + drop.len);
          ctx.strokeStyle = `rgba(147, 197, 253, ${drop.opacity})`;
          ctx.lineWidth = drop.width;
          ctx.stroke();
        });

        // Expanding splash ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i];
          r.radius += 0.5;
          r.opacity -= 0.02;

          ctx.beginPath();
          ctx.ellipse(r.x, r.y, r.radius * 1.8, r.radius * 0.6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(147, 197, 253, ${Math.max(0, r.opacity)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (r.opacity <= 0 || r.radius >= r.maxRadius) {
            ripples.splice(i, 1);
          }
        }
      }

      // 4. THUNDERSTORM EFFECT
      else if (weather === 'THUNDERSTORM') {
        // Moody dark overlay
        ctx.fillStyle = 'rgba(15, 23, 42, 0.07)';
        ctx.fillRect(0, 0, width, height);

        // Lightning logic
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.015) {
          isLightning = true;
          lightningOpacity = 0.45;
          lightningTimer = 0;
        }

        if (isLightning) {
          ctx.fillStyle = `rgba(255, 255, 255, ${lightningOpacity})`;
          ctx.fillRect(0, 0, width, height);
          lightningOpacity -= 0.035;
          if (lightningOpacity <= 0) {
            isLightning = false;
          }
        }

        // Fast violent rain streaks
        raindrops.forEach((drop) => {
          drop.y += drop.speed * 1.35;
          drop.x += drop.speed * 0.4; // heavier slant

          if (drop.y > height) {
            drop.y = -drop.len;
            drop.x = Math.random() * (width + 200) - 100;
          }

          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x + drop.len * 0.4, drop.y + drop.len * 1.3);
          ctx.strokeStyle = `rgba(165, 180, 252, ${drop.opacity * 1.2})`;
          ctx.lineWidth = drop.width * 1.2;
          ctx.stroke();
        });
      }

      // 5. SNOWY EFFECT
      else if (weather === 'SNOWY') {
        // Soft icy ambient tint
        ctx.fillStyle = 'rgba(224, 242, 254, 0.03)';
        ctx.fillRect(0, 0, width, height);

        snowflakes.forEach((s) => {
          s.wobble += s.wobbleSpeed;
          s.y += s.speedY;
          s.x += s.speedX + Math.sin(s.wobble) * 0.7;

          if (s.y > height + 10) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x > width + 10) s.x = -10;
          if (s.x < -10) s.x = width + 10;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // 6. WINDY EFFECT
      else if (weather === 'WINDY') {
        // Air current streaks
        for (let i = 0; i < 4; i++) {
          const streamY = ((frameCount * 1.5 + i * (height / 4)) % height);
          ctx.beginPath();
          ctx.moveTo(0, streamY);
          ctx.bezierCurveTo(
            width * 0.33,
            streamY - 15 + Math.sin(frameCount * 0.02 + i) * 12,
            width * 0.66,
            streamY + 15 + Math.cos(frameCount * 0.02 + i) * 12,
            width,
            streamY
          );
          ctx.strokeStyle = 'rgba(153, 246, 228, 0.08)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Tumbling leaves/petals
        leaves.forEach((l) => {
          l.x += l.speedX;
          l.y += l.speedY + Math.sin(frameCount * 0.03 + l.x) * 0.8;
          l.angle += l.rotSpeed;

          if (l.x > width + 20) {
            l.x = -20;
            l.y = Math.random() * height;
          }
          if (l.y > height + 20) {
            l.y = -20;
            l.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(l.x, l.y);
          ctx.rotate(l.angle);
          ctx.beginPath();
          ctx.ellipse(0, 0, l.size, l.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = l.color;
          ctx.globalAlpha = 0.55;
          ctx.fill();
          ctx.restore();
          ctx.globalAlpha = 1.0;
        });
      }

      // 7. MISTY EFFECT
      else if (weather === 'MISTY') {
        // Slow drifting hazy horizontal bands
        for (let i = 0; i < 4; i++) {
          const mistY = (i * height) / 3.5;
          const mistOffset = Math.sin(frameCount * 0.005 + i * 1.2) * 50;
          const mistGrad = ctx.createLinearGradient(0, mistY, 0, mistY + height * 0.35);
          mistGrad.addColorStop(0, 'rgba(241, 245, 249, 0)');
          mistGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.12)');
          mistGrad.addColorStop(1, 'rgba(241, 245, 249, 0)');

          ctx.fillStyle = mistGrad;
          ctx.fillRect(0, mistY + mistOffset, width, height * 0.35);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weather, isEnabled, intensity]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      id="weather-effects-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 transition-opacity duration-1000"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
