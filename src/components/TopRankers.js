import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import * as THREE from 'three';

// Crown SVG components for each rank
const GoldCrown = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 20L8 12L12 16L16 8L20 16L24 12L28 20H4Z" fill="#FFD700" stroke="#E6C200" strokeWidth="1"/>
    <circle cx="16" cy="6" r="2" fill="#FFD700"/>
    <circle cx="8" cy="8" r="1.5" fill="#FFD700"/>
    <circle cx="24" cy="8" r="1.5" fill="#FFD700"/>
  </svg>
);

const SilverCrown = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 20L8 12L12 16L16 8L20 16L24 12L28 20H4Z" fill="#C0C0C0" stroke="#B0B3C6" strokeWidth="1"/>
    <circle cx="16" cy="6" r="2" fill="#C0C0C0"/>
    <circle cx="8" cy="8" r="1.5" fill="#C0C0C0"/>
    <circle cx="24" cy="8" r="1.5" fill="#C0C0C0"/>
  </svg>
);

const BronzeCrown = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 20L8 12L12 16L16 8L20 16L24 12L28 20H4Z" fill="#CD7F32" stroke="#B87333" strokeWidth="1"/>
    <circle cx="16" cy="6" r="2" fill="#CD7F32"/>
    <circle cx="8" cy="8" r="1.5" fill="#CD7F32"/>
  </svg>
);

/**
 * TopRankers component - displays top 3 rankers with profile pictures and crowns
 * @param users - array of user objects
 */
function TopRankers({ users = [] }) {
  // Sort users by totalPoints descending and get top 3
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3);
  
  // Reorder to show: 2nd, 1st, 3rd (so 1st appears in center)
  const top3 = [
    sortedUsers[1], // 2nd place (left)
    sortedUsers[0], // 1st place (center)
    sortedUsers[2]  // 3rd place (right)
  ].filter(Boolean); // Remove any undefined entries if less than 3 users

  // State for celebration animation
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevTop3, setPrevTop3] = useState([]);
  
  // Refs for Three.js
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  // Check if positions changed and trigger celebration
  useEffect(() => {
    const currentTop3Ids = top3.map(user => user._id).join(',');
    const prevTop3Ids = prevTop3.map(user => user._id).join(',');
    
    if (prevTop3.length > 0 && currentTop3Ids !== prevTop3Ids) {
      setShowCelebration(true);
      startConfettiAnimation();
      setTimeout(() => {
        setShowCelebration(false);
        stopConfettiAnimation();
      }, 5000); // Stop celebration after 5 seconds
    }
    
    setPrevTop3(top3);
  }, [top3, prevTop3]);

  // Initialize Three.js confetti
  useEffect(() => {
    if (containerRef.current && showCelebration) {
      initConfetti();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [showCelebration]);

  // Three.js confetti initialization
  const initConfetti = () => {
    const worldRadius = 5;
    const confettiSize = 0.07;
    const confettiNum = 1000; // Reduced for better performance
    const rotateRange_x = Math.PI / 30;
    const rotateRange_y = Math.PI / 50;
    const speed_y = 0.01;
    const speed_x = 0.003;
    const speed_z = 0.005;

    let camera, scene, renderer;
    let confettiMesh;
    const dummy = new THREE.Object3D();
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    // Choose random color
    function getRandomColor() {
      let saturation = 100;
      let lightness = 50;
      const colors = [
        "hsl(0, " + saturation + "%, " + lightness + "%)",
        "hsl(30, " + saturation + "%, " + lightness + "%)",
        "hsl(60, " + saturation + "%, " + lightness + "%)",
        "hsl(90, " + saturation + "%, " + lightness + "%)",
        "hsl(120, " + saturation + "%, " + lightness + "%)",
        "hsl(150, " + saturation + "%, " + lightness + "%)",
        "hsl(180, " + saturation + "%, " + lightness + "%)",
        "hsl(210, " + saturation + "%, " + lightness + "%)",
        "hsl(240, " + saturation + "%, " + lightness + "%)",
        "hsl(270, " + saturation + "%, " + lightness + "%)",
        "hsl(300, " + saturation + "%, " + lightness + "%)",
        "hsl(330, " + saturation + "%, " + lightness + "%)"
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // Camera setup
    camera = new THREE.PerspectiveCamera(
      35,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      worldRadius * 3
    );
    camera.position.z = worldRadius * Math.sqrt(2);

    // Scene setup
    scene = new THREE.Scene();
    sceneRef.current = scene;

    // Confetti setup
    const confettiGeometry = new THREE.PlaneGeometry(
      confettiSize / 2,
      confettiSize
    );
    const confettiMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    confettiMesh = new THREE.InstancedMesh(
      confettiGeometry,
      confettiMaterial,
      confettiNum
    );

    // Set random position and rotation
    for (let i = 0; i < confettiNum; i++) {
      matrix.makeRotationFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
      );
      matrix.setPosition(
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius),
        THREE.MathUtils.randFloat(-worldRadius, worldRadius)
      );
      confettiMesh.setMatrixAt(i, matrix);
      confettiMesh.setColorAt(i, color.set(getRandomColor()));
    }
    scene.add(confettiMesh);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = false;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Animation function
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (confettiMesh) {
        for (let i = 0; i < confettiNum; i++) {
          confettiMesh.getMatrixAt(i, matrix);
          matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
          
          // Position
          dummy.position.y -= speed_y * ((i % 4) + 1);

          // Reset when reaching bottom
          if (dummy.position.y < -worldRadius) {
            dummy.position.y = worldRadius;
            dummy.position.x = THREE.MathUtils.randFloat(-worldRadius, worldRadius);
            dummy.position.z = THREE.MathUtils.randFloat(-worldRadius, worldRadius);
          } else {
            // Random movement
            if (i % 4 == 1) {
              dummy.position.x += speed_x;
              dummy.position.z += speed_z;
            } else if (i % 4 == 2) {
              dummy.position.x += speed_x;
              dummy.position.z -= speed_z;
            } else if (i % 4 == 3) {
              dummy.position.x -= speed_x;
              dummy.position.z += speed_z;
            } else {
              dummy.position.x -= speed_x;
              dummy.position.z -= speed_z;
            }
          }
          
          // Rotation
          dummy.rotation.x += THREE.MathUtils.randFloat(0, rotateRange_x);
          dummy.rotation.z += THREE.MathUtils.randFloat(0, rotateRange_y);

          dummy.updateMatrix();
          confettiMesh.setMatrixAt(i, dummy.matrix);
        }
        confettiMesh.instanceMatrix.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };

    animate();
  };

  const startConfettiAnimation = () => {
    if (containerRef.current && !rendererRef.current) {
      initConfetti();
    }
  };

  const stopConfettiAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }
  };

  // Get crown component based on rank
  const getCrown = (rank) => {
    switch(rank) {
      case 1: return <GoldCrown />;
      case 2: return <SilverCrown />;
      case 3: return <BronzeCrown />;
      default: return null;
    }
  };

  // Get actual rank for display (1st, 2nd, 3rd)
  const getActualRank = (index) => {
    switch(index) {
      case 0: return 2; // Left position = 2nd place
      case 1: return 1; // Center position = 1st place
      case 2: return 3; // Right position = 3rd place
      default: return index + 1;
    }
  };

  // Get ranker styling based on position
  const getRankerStyle = (index) => {
    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 3,
      borderRadius: '10px',
      position: 'relative',
      height: 280,
      background: 'linear-gradient(135deg, #2D3146 0%, #23263A 100%)',
      border: '2px solid',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    };

    switch(index) {
      case 0: // 2nd place - left
        return {
          ...baseStyle,
          borderColor: '#C0C0C0',
          zIndex: 2,
          boxShadow: '0 8px 24px rgba(192, 192, 192, 0.2)',
        };
      case 1: // 1st place - center, larger
        return {
          ...baseStyle,
          borderColor: '#FFD700',
          height: 350, // Increased height only
          zIndex: 3,
          boxShadow: '0 12px 40px rgba(255, 215, 0, 0.3)',
          background: 'linear-gradient(135deg, #2D3146 0%, #1a1d2a 100%)',
        };
      case 2: // 3rd place - right
        return {
          ...baseStyle,
          borderColor: '#CD7F32',
          zIndex: 1,
          boxShadow: '0 8px 24px rgba(205, 127, 50, 0.2)',
        };
      default:
        return baseStyle;
    }
  };

  // Generate random avatar colors for profile pictures
  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box sx={{ mb: 4, position: 'relative' }}>
      {/* Header */}
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          color: '#F3F6F9',
          justifyContent: 'center',
          fontWeight: 700
        }}
      >
        <EmojiEventsIcon color="primary" /> Top 3 Champions
      </Typography>

      {/* Three.js confetti container */}
      {showCelebration && (
        <Box
          ref={containerRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 20,
            pointerEvents: 'none',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        />
      )}

      {/* Top 3 rankers container */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end',
        gap: 4,
        minHeight: 320,
        position: 'relative',
        alignContent: 'flex-end'
      }}>
        <AnimatePresence mode="wait">
          {top3.map((user, index) => (
            <motion.div
              key={user._id}
              layout
              initial={{ scale: 0.8, opacity: 0, y: 0 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.6
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'flex-end'
              }}
            >
              <Paper
                elevation={12}
                sx={getRankerStyle(index)}
              >
                {/* Crown */}
                <Box sx={{ 
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 4
                }}>
                  {getCrown(getActualRank(index))}
                </Box>

                {/* Profile Picture */}
                <Box sx={{ mb: 3, mt: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: getActualRank(index) === 1 ? 80 : 70, 
                      height: getActualRank(index) === 1 ? 80 : 70, 
                      bgcolor: getAvatarColor(user.name),
                      fontSize: getActualRank(index) === 1 ? '2rem' : '1.5rem',
                      fontWeight: 700,
                      boxShadow: 4,
                      border: '3px solid',
                      borderColor: getActualRank(index) === 1 ? '#FFD700' : getActualRank(index) === 2 ? '#C0C0C0' : '#CD7F32'
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                {/* User name */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    mb: 2,
                    fontSize: getActualRank(index) === 1 ? '1.3rem' : '1.1rem',
                    color: '#F3F6F9'
                  }}
                >
                  {user.name}
                </Typography>

                {/* Points */}
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    textAlign: 'center',
                    fontSize: getActualRank(index) === 1 ? '2rem' : '1.7rem',
                    color: getActualRank(index) === 1 ? '#FFD700' : getActualRank(index) === 2 ? '#C0C0C0' : '#CD7F32',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {user.totalPoints}
                </Typography>

                {/* Points label */}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    textAlign: 'center',
                    opacity: 0.7,
                    color: '#B0B3C6',
                    mt: 1
                  }}
                >
                  points
                </Typography>

                {/* Rank badge */}
                <Box sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: '#23263A',
                  color: '#F3F6F9',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: 3,
                  border: '2px solid',
                  borderColor: getActualRank(index) === 1 ? '#FFD700' : getActualRank(index) === 2 ? '#C0C0C0' : '#CD7F32'
                }}>
                  #{getActualRank(index)}
                </Box>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default TopRankers; 