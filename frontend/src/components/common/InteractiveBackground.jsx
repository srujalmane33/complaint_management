import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function InteractiveBackground() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  // Smooth spring physics for cursor trailing
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#0a0f1d] select-none z-0">
      
      {/* 1. Interactive Cursor Follower Spotlight */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/15 to-transparent blur-[90px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* 2. Autonomous Floating Ambient Blobs */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -70, 50, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[8%] w-96 h-96 bg-blue-600/25 rounded-full blur-[110px]"
      />

      <motion.div
        animate={{
          x: [0, -70, 80, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.25, 0.85, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[8%] right-[8%] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-[120px]"
      />

      {/* 3. Floating Light Particles */}
      {[
        { top: "18%", left: "12%", size: 4, delay: 0 },
        { top: "75%", left: "22%", size: 6, delay: 1.5 },
        { top: "30%", left: "80%", size: 5, delay: 0.8 },
        { top: "82%", left: "75%", size: 3, delay: 2.2 },
        { top: "15%", left: "65%", size: 4, delay: 3 },
      ].map((dot, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full bg-blue-400/50 blur-[0.5px]"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.9, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 4 + idx,
            repeat: Infinity,
            ease: "easeInOut",
            delay: dot.delay,
          }}
        />
      ))}

      {/* 4. Blueprint Grid Layer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />
    </div>
  );
}