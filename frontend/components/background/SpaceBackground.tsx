"use client";

import { motion } from "framer-motion";

// 개별 별 컴포넌트
const Star = ({
  x,
  y,
  size,
  delay = 0,
}: {
  x: number;
  y: number;
  size: number;
  delay?: number;
}) => {
  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      initial={{ opacity: 0.2, scale: 0.5 }}
      animate={{
        opacity: [0.2, 0.8, 0.2],
        scale: [0.5, 1, 0.5],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
};

// 성운 효과 컴포넌트
const Nebula = ({
  x,
  y,
  size,
  color1,
  color2,
  delay = 0,
}: {
  x: number;
  y: number;
  size: number;
  color1: string;
  color2: string;
  delay?: number;
}) => {
  return (
    <motion.div
      className="absolute rounded-full blur-xl"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(ellipse at center, ${color1}15, ${color2}08, transparent)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// 먼 행성 컴포넌트
const Planet = ({
  x,
  y,
  size,
  color,
  glowColor,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  glowColor: string;
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`,
        boxShadow: `0 0 ${size / 2}px ${glowColor}40`,
      }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.6, 0.8, 0.6],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// 궤도 링 컴포넌트
const OrbitRing = ({
  size,
  duration,
  color,
  reverse = false,
}: {
  size: number;
  duration: number;
  color: string;
  reverse?: boolean;
}) => {
  return (
    <motion.div
      className={`absolute border rounded-full`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderColor: color,
        borderWidth: "1px",
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default function SpaceBackground() {
  // 별들 생성
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
  }));

  // 성운들 생성
  const nebulas = [
    { x: 20, y: 30, size: 200, color1: "#ec4899", color2: "#8b5cf6", delay: 0 },
    { x: 75, y: 20, size: 150, color1: "#06b6d4", color2: "#0891b2", delay: 5 },
    {
      x: 15,
      y: 70,
      size: 180,
      color1: "#8b5cf6",
      color2: "#ec4899",
      delay: 10,
    },
  ];

  // 먼 행성들 생성
  const planets = [
    { x: 15, y: 20, size: 8, color: "#ec4899", glowColor: "#ec4899" },
    { x: 85, y: 15, size: 6, color: "#06b6d4", glowColor: "#06b6d4" },
    { x: 10, y: 75, size: 10, color: "#8b5cf6", glowColor: "#8b5cf6" },
    { x: 90, y: 80, size: 7, color: "#f59e0b", glowColor: "#f59e0b" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* 사이버펑크 우주 배경 그라데이션 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-cyan-950"
        animate={{
          background: [
            "linear-gradient(135deg, #020617 0%, #581c87 50%, #164e63 100%)",
            "linear-gradient(135deg, #0f0f23 0%, #7c2d92 50%, #0891b2 100%)",
            "linear-gradient(135deg, #020617 0%, #581c87 50%, #164e63 100%)",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 별들 */}
      {stars.map((star) => (
        <Star
          key={star.id}
          x={star.x}
          y={star.y}
          size={star.size}
          delay={star.delay}
        />
      ))}

      {/* 성운들 */}
      {nebulas.map((nebula, index) => (
        <Nebula
          key={index}
          x={nebula.x}
          y={nebula.y}
          size={nebula.size}
          color1={nebula.color1}
          color2={nebula.color2}
          delay={nebula.delay}
        />
      ))}

      {/* 먼 행성들 */}
      {planets.map((planet, index) => (
        <Planet
          key={index}
          x={planet.x}
          y={planet.y}
          size={planet.size}
          color={planet.color}
          glowColor={planet.glowColor}
        />
      ))}

      {/* 사이버펑크 네온 궤도 링들 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.3 }}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      >
        <OrbitRing size={1000} duration={40} color="#06b6d4" />
        <OrbitRing size={750} duration={30} color="#ec4899" reverse />
        <OrbitRing size={500} duration={35} color="#0891b2" />
        <OrbitRing size={1250} duration={50} color="#f472b6" />
      </motion.div>

      {/* 사이버펑크 중앙 글로우 효과 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-96 h-96 bg-gradient-radial from-cyan-500/25 via-pink-500/15 to-transparent rounded-full" />
      </motion.div>

      {/* 추가 네온 글로우 레이어 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="w-64 h-64 bg-gradient-radial from-pink-400/20 via-purple-500/10 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
}
