"use client";

import { useRef, useEffect, useCallback, type RefObject } from "react";

interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  extraX: number;
  extraY: number;
  ease: number;
}

interface ItemState {
  realElement: HTMLElement;
  clones: HTMLElement[];
  positions: Position[];
  lastActiveIndex: number;
  originalStyles: Record<string, string>;
}

interface InfiniteCanvasOptions {
  containerRef: RefObject<HTMLElement | null>;
  scrollSpeed?: number;
  dragSpeed?: number;
  ease?: number;
  parallax?: { enabled: boolean; general: number; child: number };
  enableDrag?: boolean;
}

// Linear interpolation: maps value from [inMin,inMax] to [outMin,outMax]
function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function useInfiniteCanvas({
  containerRef,
  scrollSpeed = 0.4,
  dragSpeed = 0.5,
  ease = 0.3,
  parallax = { enabled: true, general: 1, child: 1 },
  enableDrag = true,
}: InfiniteCanvasOptions) {
  // Map params exactly like emmiwu:
  // scrollSpeed 0.1-1 → 0.1-2, dragSpeed 0.1-1 → 0.1-2, ease 0-1 → 0.01-0.2
  const mappedScroll = lerp(Math.max(0.1, Math.min(1, scrollSpeed)), 0.1, 1, 0.1, 2);
  const mappedDrag = lerp(Math.max(0.1, Math.min(1, dragSpeed)), 0.1, 1, 0.1, 2);
  const mappedEase = lerp(Math.max(0, Math.min(1, ease)), 0, 1, 0.01, 0.2);

  const pEnabled: boolean = parallax.enabled;
  const pGeneral: number = parallax.general;
  const pChild: number = parallax.child;

  const items = useRef<ItemState[]>([]);
  const raf = useRef<number | null>(null);
  const ready = useRef(false);

  const state = useRef({
    ease: mappedEase,
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
  });

  const isDragging = useRef(false);
  const dragStart = useRef({ startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
  const mouse = useRef({ x: { t: 0.5, c: 0.5 }, y: { t: 0.5, c: 0.5 }, press: { t: 0, c: 0 } });
  const view = useRef({ w: 1920, h: 1080 });
  const tile = useRef({ w: 0, h: 0, tw: 0, th: 0 });

  const setup = useCallback((el: HTMLElement) => {
    cleanup();
    const rect = el.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    (Array.from(el.children) as HTMLElement[]).forEach((node) => {
      const r = node.getBoundingClientRect();
      const ix = r.left - rect.left;
      const iy = r.top - rect.top;
      const iw = r.width;
      const ih = r.height;
      if (iw === 0 || ih === 0) return;

      const itemEase = Math.random() * 0.5 + 0.5;
      const orig: Record<string, string> = {};
      ["position", "left", "top", "width", "height", "margin", "transform"].forEach((p) => {
        orig[p] = node.style.getPropertyValue(p);
      });

      const clones: HTMLElement[] = [];
      for (let i = 0; i < 3; i++) {
        const c = node.cloneNode(true) as HTMLElement;
        el.appendChild(c);
        Object.assign(c.style, {
          position: "absolute", left: "0", top: "0",
          width: `${iw}px`, height: `${ih}px`,
          margin: "0", willChange: "transform",
        });
        clones.push(c);
      }

      Object.assign(node.style, {
        position: "absolute", left: "0", top: "0",
        width: `${iw}px`, height: `${ih}px`,
        margin: "0", willChange: "transform",
      });

      const positions: Position[] = [];
      [0, cw].forEach((ox) =>
        [0, ch].forEach((oy) =>
          positions.push({
            x: ix + ox, y: iy + oy,
            width: iw, height: ih,
            extraX: 0, extraY: 0, ease: itemEase,
          })
        )
      );

      items.current.push({
        realElement: node, clones, positions,
        lastActiveIndex: -1, originalStyles: orig,
      });
    });

    state.current.current = { x: 0, y: 0 };
    state.current.target = { x: 0, y: 0 };
    state.current.last = { x: 0, y: 0 };
    state.current.delta = { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } };
    tile.current = { w: cw, h: ch, tw: cw * 2, th: ch * 2 };
    ready.current = true;
  }, []);

  const cleanup = useCallback(() => {
    items.current.forEach((it) => {
      it.clones.forEach((c) => c.parentNode?.removeChild(c));
      const el = it.realElement;
      Object.entries(it.originalStyles).forEach(([k, v]) => el.style.setProperty(k, v));
      el.style.willChange = "";
      el.style.opacity = "";
      el.style.pointerEvents = "";
    });
    items.current = [];
    ready.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    view.current = { w: window.innerWidth, h: window.innerHeight };
    state.current.ease = mappedEase;

    // Wait for images
    const imgs = container.querySelectorAll("img");
    let loaded = 0;
    const total = imgs.length;
    const tryInit = () => { if (++loaded >= total) setup(container); };
    if (total === 0) setup(container);
    else imgs.forEach((img) => {
      if (img.complete) tryInit();
      else {
        img.addEventListener("load", tryInit, { once: true });
        img.addEventListener("error", tryInit, { once: true });
      }
    });

    // --- Wheel: move target directly (exactly like emmiwu) ---
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      state.current.target.x -= e.deltaX * mappedScroll;
      state.current.target.y -= e.deltaY * mappedScroll;
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    // --- Drag ---
    const onDown = (e: MouseEvent) => {
      if (!enableDrag) return;
      e.preventDefault();
      isDragging.current = true;
      document.documentElement.classList.add("dragging");
      mouse.current.press.t = 1;
      dragStart.current = {
        startX: e.clientX, startY: e.clientY,
        scrollX: state.current.target.x, scrollY: state.current.target.y,
      };
    };
    const onUp = () => {
      isDragging.current = false;
      document.documentElement.classList.remove("dragging");
      mouse.current.press.t = 0;
    };
    const onMove = (e: MouseEvent) => {
      mouse.current.x.t = e.clientX / view.current.w;
      mouse.current.y.t = e.clientY / view.current.h;
      if (isDragging.current) {
        state.current.target.x = dragStart.current.scrollX + (e.clientX - dragStart.current.startX) * mappedDrag;
        state.current.target.y = dragStart.current.scrollY + (e.clientY - dragStart.current.startY) * mappedDrag;
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      if (!enableDrag || e.touches.length !== 1) return;
      const t = e.touches[0]!;
      isDragging.current = true;
      mouse.current.press.t = 1;
      dragStart.current = {
        startX: t.clientX, startY: t.clientY,
        scrollX: state.current.target.x, scrollY: state.current.target.y,
      };
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      mouse.current.press.t = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      e.preventDefault();
      const t = e.touches[0]!;
      mouse.current.x.t = t.clientX / view.current.w;
      mouse.current.y.t = t.clientY / view.current.h;
      state.current.target.x = dragStart.current.scrollX + (t.clientX - dragStart.current.startX) * mappedDrag;
      state.current.target.y = dragStart.current.scrollY + (t.clientY - dragStart.current.startY) * mappedDrag;
    };

    container.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    // --- Resize ---
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      view.current = { w: window.innerWidth, h: window.innerHeight };
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (containerRef.current) { cleanup(); setup(containerRef.current); }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    // --- Animation loop (identical to emmiwu) ---
    const tick = () => {
      if (!ready.current) { raf.current = requestAnimationFrame(tick); return; }
      const s = state.current;
      const m = mouse.current;

      // Lerp current → target (this IS the "weight")
      s.current.x += (s.target.x - s.current.x) * s.ease;
      s.current.y += (s.target.y - s.current.y) * s.ease;

      // Smoothed delta
      s.delta.x.t = s.current.x - s.last.x;
      s.delta.y.t = s.current.y - s.last.y;
      s.delta.x.c += (s.delta.x.t - s.delta.x.c) * 0.04;
      s.delta.y.c += (s.delta.y.t - s.delta.y.c) * 0.04;

      // Smooth mouse
      m.x.c += (m.x.t - m.x.c) * 0.04;
      m.y.c += (m.y.t - m.y.c) * 0.04;
      m.press.c += (m.press.t - m.press.c) * 0.04;

      const dirX = s.current.x > s.last.x ? "right" : "left";
      const dirY = s.current.y > s.last.y ? "down" : "up";

      const cx = s.current.x;
      const cy = s.current.y;
      const { w: tw, h: th, tw: tsW, th: tsH } = tile.current;

      const cEl = containerRef.current;
      if (!cEl) { raf.current = requestAnimationFrame(tick); return; }
      const cRect = cEl.getBoundingClientRect();

      items.current.forEach((item) => {
        const cands: { pos: Position; fx: number; fy: number; distC: number; vis: boolean }[] = [];

        item.positions.forEach((pos) => {
          const pg = pEnabled ? pGeneral : 0;
          const offX = 5 * s.delta.x.c * pos.ease + (m.x.c - 0.5) * pos.width * 0.6 * pg;
          const offY = 5 * s.delta.y.c * pos.ease + (m.y.c - 0.5) * pos.height * 0.6 * pg;

          const px = pos.x + cx + pos.extraX + offX;
          const py = pos.y + cy + pos.extraY + offY;

          if (dirX === "right" && px > tw) pos.extraX -= tsW;
          if (dirX === "left" && px + pos.width < 0) pos.extraX += tsW;
          if (dirY === "down" && py > th) pos.extraY -= tsH;
          if (dirY === "up" && py + pos.height < 0) pos.extraY += tsH;

          const fx = pos.x + cx + pos.extraX + offX;
          const fy = pos.y + cy + pos.extraY + offY;
          const sx = fx + cRect.left;
          const sy = fy + cRect.top;
          const halfW = view.current.w / 2;
          const halfH = view.current.h / 2;

          const margin = 1000;
          cands.push({
            pos, fx, fy,
            distC: (sx + pos.width / 2 - halfW) ** 2 + (sy + pos.height / 2 - halfH) ** 2,
            vis: sx >= -pos.width - margin && sx <= view.current.w + margin &&
                 sy >= -pos.height - margin && sy <= view.current.h + margin,
          });
        });

        // Pick active (closest to center)
        let ai = -1, best = Infinity;
        for (let i = 0; i < cands.length; i++) {
          if (cands[i]!.distC < best) { best = cands[i]!.distC; ai = i; }
        }
        item.lastActiveIndex = ai;

        const pool = [...item.clones];
        cands.forEach((c, idx) => {
          const isReal = idx === ai;
          const el = isReal ? item.realElement : pool.pop()!;
          if (!el) return;
          el.style.transform = `translate(${c.fx}px, ${c.fy}px)`;
          el.style.opacity = c.vis ? "1" : "0";
          el.style.pointerEvents = c.vis ? "auto" : "none";

          const childFactor = pEnabled && isReal ? pChild : 0;
          if (childFactor > 0) {
            const inner = el.firstElementChild as HTMLElement | null;
            if (inner) {
              const cox = (0.5 - m.x.c) * c.pos.ease * 20 * pGeneral * childFactor;
              const coy = (0.5 - m.y.c) * c.pos.ease * 20 * pGeneral * childFactor;
              inner.style.transform = `translate(${cox}%, ${coy}%)`;
            }
          }
        });
      });

      s.last.x = s.current.x;
      s.last.y = s.current.y;
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("wheel", onWheel);
      container.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      cleanup();
    };
  }, [containerRef, mappedScroll, mappedDrag, mappedEase, pEnabled, pGeneral, pChild, enableDrag, setup, cleanup]);
}
