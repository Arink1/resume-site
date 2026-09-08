"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const hidden = pathname?.startsWith("/demos/") ?? false;

  useEffect(() => {
    if (hidden) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;

    let animationId: number;
    let stars: {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }[] = [];
    let nebulae: {
      x: number;
      y: number;
      radius: number;
      color: string;
      opacity: number;
      drift: number;
    }[] = [];
    const shootingStars: {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;
    }[] = [];

    const glowSprite = document.createElement("canvas");
    const glowSize = 32;
    glowSprite.width = glowSize;
    glowSprite.height = glowSize;
    const glowCtx = glowSprite.getContext("2d");
    if (glowCtx) {
      const g = glowCtx.createRadialGradient(
        glowSize / 2,
        glowSize / 2,
        0,
        glowSize / 2,
        glowSize / 2,
        glowSize / 2
      );
      g.addColorStop(0, "rgba(200, 210, 255, 0.9)");
      g.addColorStop(0.4, "rgba(200, 210, 255, 0.2)");
      g.addColorStop(1, "rgba(200, 210, 255, 0)");
      glowCtx.fillStyle = g;
      glowCtx.fillRect(0, 0, glowSize, glowSize);
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initField();
    }

    function initField() {
      const area = width * height;
      const starCount = Math.min(220, Math.floor(area / 9000));

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinkleOffset: Math.random() * Math.PI * 2,
      }));

      const nebulaCount = 3;
      const colors = [
        "99, 102, 241",
        "168, 85, 247",
        "236, 72, 153",
        "59, 130, 246",
        "139, 92, 246",
      ];
      nebulae = Array.from({ length: nebulaCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 280 + 220,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.04 + 0.02,
        drift: (Math.random() - 0.5) * 0.08,
      }));
    }

    function spawnShootingStar() {
      if (shootingStars.length > 1) return;
      if (Math.random() > 0.0015) return;

      shootingStars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
    }

    let time = 0;

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      time++;

      for (const nebula of nebulae) {
        nebula.x += nebula.drift;
        if (nebula.x < -nebula.radius) nebula.x = width + nebula.radius;
        if (nebula.x > width + nebula.radius) nebula.x = -nebula.radius;

        const gradient = ctx!.createRadialGradient(
          nebula.x,
          nebula.y,
          0,
          nebula.x,
          nebula.y,
          nebula.radius
        );
        gradient.addColorStop(0, `rgba(${nebula.color}, ${nebula.opacity})`);
        gradient.addColorStop(1, `rgba(${nebula.color}, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.fillRect(
          nebula.x - nebula.radius,
          nebula.y - nebula.radius,
          nebula.radius * 2,
          nebula.radius * 2
        );
      }

      for (const star of stars) {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        const alpha = star.opacity * twinkle;

        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx!.fill();

        if (star.size > 1.0) {
          const glowR = star.size * 3;
          ctx!.globalAlpha = alpha * 0.6;
          ctx!.drawImage(
            glowSprite,
            star.x - glowR,
            star.y - glowR,
            glowR * 2,
            glowR * 2
          );
          ctx!.globalAlpha = 1;
        }
      }

      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity = 1 - ss.life / ss.maxLife;

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const gradient = ctx!.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(ss.x, ss.y);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        ctx!.globalAlpha = ss.opacity;
        ctx!.drawImage(glowSprite, ss.x - 6, ss.y - 6, 12, 12);
        ctx!.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
