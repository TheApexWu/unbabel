"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { TenureBadge } from "./TenureBadge";

interface Post {
  id: number;
  alias: string;
  body_original: string;
  source_lang: string;
  hood: string;
  tenure: string;
  created_at: string;
}

const LANG_COLORS: Record<string, string> = {
  en: "#a78bfa",
  es: "#fb7185",
  zh: "#fbbf24",
  ko: "#34d399",
  hi: "#f97316",
  ne: "#06b6d4",
  bn: "#ec4899",
  ar: "#10b981",
  tl: "#8b5cf6",
  ru: "#ef4444",
  el: "#3b82f6",
  pt: "#14b8a6",
  fr: "#6366f1",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", zh: "Chinese", ko: "Korean",
  hi: "Hindi", ne: "Nepali", bn: "Bengali", ar: "Arabic",
  tl: "Tagalog", ru: "Russian", el: "Greek", pt: "Portuguese", fr: "French",
};

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function PostCube({
  post,
  position,
  text,
  onSelect,
  selected,
}: {
  post: Post;
  position: [number, number, number];
  text: string;
  onSelect: () => void;
  selected: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const color = LANG_COLORS[post.source_lang] ?? "#94a3b8";

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.15;
    const targetRot = hovered || selected ? 0.3 : 0;
    meshRef.current.rotation.y += (targetRot - meshRef.current.rotation.y) * 0.08;
  });

  return (
    <group ref={meshRef} position={position}>
      <RoundedBox
        args={[2.6, 1.6, 0.2]}
        radius={0.08}
        smoothness={4}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || selected ? 0.5 : 0.15}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Front face label band */}
      <mesh position={[0, 0.55, 0.11]}>
        <planeGeometry args={[2.4, 0.3]} />
        <meshBasicMaterial color="#0f172a" transparent opacity={0.7} />
      </mesh>

      <Text
        position={[-1.15, 0.55, 0.12]}
        fontSize={0.16}
        color="#fef3c7"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.3}
      >
        {post.alias} · {LANG_NAMES[post.source_lang] ?? post.source_lang}
      </Text>

      <Text
        position={[0, -0.05, 0.12]}
        fontSize={0.14}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.3}
        textAlign="center"
        lineHeight={1.2}
      >
        {truncate(text, 140)}
      </Text>
    </group>
  );
}

function Scene({
  posts,
  texts,
  selectedId,
  setSelectedId,
}: {
  posts: Post[];
  texts: Record<number, string>;
  selectedId: number | null;
  setSelectedId: (id: number) => void;
}) {
  // Arrange posts on a spiral
  const positions: [number, number, number][] = posts.map((_, i) => {
    const angle = i * 0.9;
    const radius = 3 + i * 0.18;
    return [
      Math.cos(angle) * radius,
      (i % 5) * 0.8 - 1.5,
      Math.sin(angle) * radius - i * 0.2,
    ];
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#a78bfa" />

      {posts.map((post, i) => (
        <PostCube
          key={post.id}
          post={post}
          position={positions[i]}
          text={texts[post.id] ?? post.body_original}
          onSelect={() => setSelectedId(post.id)}
          selected={selectedId === post.id}
        />
      ))}

      <gridHelper args={[40, 40, "#312e81", "#1e1b4b"]} position={[0, -3, 0]} />
    </>
  );
}

export function Posts3D({
  posts,
  viewerLang,
}: {
  posts: Post[];
  viewerLang: string;
}) {
  const [texts, setTexts] = useState<Record<number, string>>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadTranslations() {
      const entries = await Promise.all(
        posts.map(async (p) => {
          if (p.source_lang === viewerLang) {
            return [p.id, p.body_original] as const;
          }
          try {
            const r = await fetch(`/api/translate?postId=${p.id}&lang=${viewerLang}`);
            const d = await r.json();
            return [p.id, d.translated_text || p.body_original] as const;
          } catch {
            return [p.id, p.body_original] as const;
          }
        })
      );
      if (cancelled) return;
      const map: Record<number, string> = {};
      for (const [id, text] of entries) map[id] = text;
      setTexts(map);
    }
    loadTranslations();
    return () => {
      cancelled = true;
    };
  }, [posts, viewerLang]);

  const selected = posts.find((p) => p.id === selectedId);

  return (
    <div className="relative w-full h-[600px] border border-purple-300 bg-gradient-to-b from-slate-900 to-purple-950 overflow-hidden">
      <Canvas camera={{ position: [0, 2, 10], fov: 55 }}>
        <Suspense fallback={null}>
          <Scene
            posts={posts}
            texts={texts}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>

      <div className="absolute top-2 left-2 text-xs font-mono text-purple-200 bg-slate-900/70 px-2 py-1 border border-purple-500/40">
        drag to rotate · scroll to zoom · click a card
      </div>

      {selected && (
        <div className="absolute bottom-2 left-2 right-2 max-h-48 overflow-y-auto bg-white/95 border border-purple-400 p-3 font-mono text-xs">
          <div className="flex items-center gap-2 mb-1 text-gray-500">
            <span className="font-bold text-gray-800">{selected.alias}</span>
            <TenureBadge tenure={selected.tenure} />
            <span>{LANG_NAMES[selected.source_lang] ?? selected.source_lang}</span>
            <button
              onClick={() => setSelectedId(null)}
              className="ml-auto text-gray-400 hover:text-purple-700"
            >
              close ✕
            </button>
          </div>
          <p className="text-gray-900">{texts[selected.id] ?? selected.body_original}</p>
        </div>
      )}
    </div>
  );
}
