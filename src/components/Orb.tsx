import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { OrbPhase } from '../types';

interface OrbProps {
  phase?: OrbPhase;
  typingEnergy?: number; // 0 to 1
  size?: number; // Target diameter in px (e.g., 250 or 52)
  isThinking?: boolean;
  className?: string;
  intensity?: 'calm' | 'balanced' | 'energetic';
  onClick?: () => void;
}

export const Orb: React.FC<OrbProps> = ({
  phase = 'home',
  typingEnergy = 0,
  size = 250,
  isThinking = false,
  className = '',
  intensity = 'balanced',
  onClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Intensity multipliers for animation speed and turbulence
  const speedFactor = intensity === 'calm' ? 0.7 : intensity === 'energetic' ? 1.35 : 1.0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let currentEnergy = typingEnergy;

    // Handle high-DPI retina displays
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    // Setup particles for wispy fluid dust
    const particleCount = size > 100 ? 18 : 8;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      angle: (i / particleCount) * Math.PI * 2,
      speed: 0.2 + Math.random() * 0.4,
      radiusRatio: 0.2 + Math.random() * 0.65,
      size: 0.8 + Math.random() * 1.2,
      opacity: 0.15 + Math.random() * 0.35,
      offsetY: (Math.random() - 0.5) * 0.4,
    }));

    const render = () => {
      time += (isThinking ? 0.04 : 0.015) * speedFactor;

      // Smooth typing energy interpolation
      currentEnergy = currentEnergy * 0.92 + typingEnergy * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const cx = size / 2;
      const cy = size / 2;
      // Sphere radius: leaves room for orbital ring extending outside
      const R = size * 0.35;

      // Orbital Ring Parameters (Tilted ellipse descending from top-right to bottom-left)
      const ringRx = size * 0.48;
      const ringRy = size * 0.15;
      const ringTilt = -23 * (Math.PI / 180); // ~ -23 degrees tilt matching reference
      const ringRotation = time * (isThinking ? 2.5 : 0.65);

      // ==========================================
      // 1. BACK HALF OF THE ORBITAL RING (behind sphere)
      // ==========================================
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ringTilt);

      // We draw the upper/back arc from PI to 2*PI (or -PI to 0)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.28)';
      ctx.lineWidth = size > 100 ? 1.0 : 0.7;
      ctx.stroke();

      // Back ring soft glow
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.lineWidth = size > 100 ? 3.0 : 1.5;
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 2. GRAVITATIONAL ETHEREAL AMBIENT GLOW
      // ==========================================
      // Very soft, non-opaque atmospheric presence below/behind the sphere
      const ambientGlow = ctx.createRadialGradient(cx, cy + R * 0.15, R * 0.1, cx, cy + R * 0.15, R * 1.35);
      ambientGlow.addColorStop(0, 'rgba(14, 165, 233, 0.09)');
      ambientGlow.addColorStop(0.55, 'rgba(2, 132, 199, 0.03)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(cx, cy + R * 0.15, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // ==========================================
      // 3. THE TRANSPARENT SPHERE INTERIOR (CLIPPED)
      // ==========================================
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // 3a. Ultra-subtle fluid space tint (95%+ of background remains visible!)
      const baseTint = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, R * 0.1, cx, cy, R);
      baseTint.addColorStop(0, 'rgba(15, 23, 42, 0.08)');
      baseTint.addColorStop(0.7, 'rgba(8, 14, 26, 0.14)');
      baseTint.addColorStop(1, 'rgba(14, 165, 233, 0.06)');
      ctx.fillStyle = baseTint;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      // 3b. Flowing Fluid-Energy Wisps (Delicate ribbons of light, NO solid blobs)
      const wispCount = 3;
      for (let i = 0; i < wispCount; i++) {
        const wispPhase = time * (1.2 + i * 0.4) + (i * Math.PI) / 2.2;
        const wispEnergyMod = currentEnergy * 14 * speedFactor;

        // Curve start, control, and end points traversing the spherical volume
        const startX = cx - R * 0.85;
        const startY = cy + Math.sin(wispPhase * 0.7) * (R * 0.25) + (i - 1) * (R * 0.2);

        const cp1X = cx - R * 0.3 + Math.cos(wispPhase) * (R * 0.2 + wispEnergyMod);
        const cp1Y = cy - R * 0.45 + Math.sin(wispPhase * 1.2) * (R * 0.25 + wispEnergyMod);

        const cp2X = cx + R * 0.25 + Math.sin(wispPhase * 0.9) * (R * 0.25);
        const cp2Y = cy + R * 0.35 + Math.cos(wispPhase * 1.1) * (R * 0.2);

        const endX = cx + R * 0.85;
        const endY = cy + Math.sin(wispPhase * 0.8 + 1) * (R * 0.3);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

        // Gradient for delicate wispy ribbon
        const wispGrad = ctx.createLinearGradient(startX, startY, endX, endY);
        const alpha = (0.16 + Math.sin(wispPhase) * 0.06 + currentEnergy * 0.22);
        wispGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        wispGrad.addColorStop(0.35, `rgba(186, 230, 253, ${Math.min(0.5, alpha * 1.3)})`);
        wispGrad.addColorStop(0.65, `rgba(56, 189, 248, ${alpha})`);
        wispGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

        ctx.strokeStyle = wispGrad;
        ctx.lineWidth = size > 100 ? (2.2 - i * 0.4 + currentEnergy * 1.5) : 1.2;
        ctx.stroke();

        // Delicate luminous blur on main central wisp
        if (i === 0) {
          ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 0.35})`;
          ctx.lineWidth = size > 100 ? 5.5 : 2.5;
          ctx.stroke();
        }
      }

      // 3c. Ethereal fluid dust / photon particles drifting inside
      particles.forEach((p) => {
        p.angle += p.speed * 0.015 * speedFactor;
        const pDist = R * p.radiusRatio;
        const px = cx + Math.cos(p.angle + time * 0.2) * pDist;
        const py = cy + Math.sin(p.angle * 1.3 + time * 0.3) * (pDist * 0.7) + p.offsetY * R;

        const pAlpha = p.opacity * (0.6 + Math.sin(p.angle * 3 + time) * 0.4 + currentEnergy * 0.4);
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.min(0.6, pAlpha)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3d. Subtle typing harmonic ripple (only active when typing)
      if (currentEnergy > 0.02) {
        const ripplePhase = (time * 6 * speedFactor) % 1;
        const rippleR = ripplePhase * R * 0.85;
        const rippleAlpha = (1 - ripplePhase) * currentEnergy * 0.35;

        ctx.beginPath();
        ctx.arc(cx, cy, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${rippleAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore(); // Restore clipping

      // ==========================================
      // 4. DELICATE RIM LIGHT (NO THICK GLASS RIM!)
      // ==========================================
      // 4a. Top / Upper-Left Razor-Thin Crescent Rim (atmospheric boundary)
      ctx.save();
      ctx.translate(cx, cy);

      // Arc from ~130° to ~215° in upper-left
      const arcStart = -Math.PI * 0.95;
      const arcEnd = -Math.PI * 0.25;

      const rimGrad = ctx.createLinearGradient(
        -R * 0.8, -R * 0.8,
        R * 0.2, -R * 0.2
      );
      rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      rimGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
      rimGrad.addColorStop(0.65, 'rgba(186, 230, 253, 0.7)');
      rimGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, R, arcStart, arcEnd);
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = size > 100 ? 1.4 : 0.9;
      ctx.stroke();

      // Delicate soft glow just along that top-left arc
      ctx.beginPath();
      ctx.arc(0, 0, R, arcStart, arcEnd);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.2)';
      ctx.lineWidth = size > 100 ? 3.2 : 1.6;
      ctx.stroke();

      // 4b. Lower-edge soft ambient cyan crescent (diffuse gravitational glow)
      const bottomArcStart = Math.PI * 0.2;
      const bottomArcEnd = Math.PI * 0.85;

      const bottomRimGrad = ctx.createLinearGradient(
        -R * 0.5, R * 0.8,
        R * 0.5, R * 0.8
      );
      bottomRimGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      bottomRimGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
      bottomRimGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.beginPath();
      ctx.arc(0, 0, R, bottomArcStart, bottomArcEnd);
      ctx.strokeStyle = bottomRimGrad;
      ctx.lineWidth = size > 100 ? 1.2 : 0.8;
      ctx.stroke();
      ctx.restore();

      // ==========================================
      // 5. FRONT HALF OF THE ORBITAL RING (in front of sphere)
      // ==========================================
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ringTilt);

      // Front arc from 0 to PI (descending across front of sphere)
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI);

      const frontRingGrad = ctx.createLinearGradient(-ringRx, 0, ringRx, 0);
      frontRingGrad.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      frontRingGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.7)');
      frontRingGrad.addColorStop(0.55, 'rgba(255, 255, 255, 0.95)');
      frontRingGrad.addColorStop(0.8, 'rgba(186, 230, 253, 0.65)');
      frontRingGrad.addColorStop(1, 'rgba(56, 189, 248, 0.15)');

      ctx.strokeStyle = frontRingGrad;
      ctx.lineWidth = size > 100 ? 1.2 : 0.8;
      ctx.stroke();

      // Front ring subtle outer glow
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = size > 100 ? 3.0 : 1.6;
      ctx.stroke();

      // Satellite Photon Node traveling along the ring
      const photonAngle = ringRotation % (Math.PI * 2);
      const photonX = Math.cos(photonAngle) * ringRx;
      const photonY = Math.sin(photonAngle) * ringRy;

      // Only draw photon brightly when on front arc (sin > 0), dimmer on back
      const isFront = Math.sin(photonAngle) >= 0;
      const photonAlpha = isFront ? 0.9 : 0.35;

      ctx.fillStyle = `rgba(255, 255, 255, ${photonAlpha})`;
      ctx.beginPath();
      ctx.arc(photonX, photonY, size > 100 ? 1.8 : 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Photon soft glow halo
      ctx.fillStyle = `rgba(56, 189, 248, ${photonAlpha * 0.4})`;
      ctx.beginPath();
      ctx.arc(photonX, photonY, size > 100 ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore(); // Restore DPR scale

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [size, isThinking, intensity, speedFactor, typingEnergy]);

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none transition-transform duration-300 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Floating Canvas Orb (Completely Transparent, Weightless Fluid-Energy) */}
      <motion.div
        animate={{
          scale: 1 + typingEnergy * 0.04,
          y: phase === 'home' ? [0, -6, 0] : 0,
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 4.8,
            ease: 'easeInOut',
          },
          scale: {
            type: 'spring',
            stiffness: 320,
            damping: 22,
          },
        }}
        className="relative z-10 flex items-center justify-center"
      >
        <canvas
          ref={canvasRef}
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
          className="pointer-events-none"
        />
      </motion.div>
    </div>
  );
};
