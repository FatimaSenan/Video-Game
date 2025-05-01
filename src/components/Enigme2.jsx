import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactAnimatedWeather from 'react-animated-weather'
import "../styles/Enigme2.css";



function Enigme2() {
    const [sunPos, setSunPos] = useState({ x: -600, y: 20 });
    const [bubblePosition, setBubblePosition] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [snowing, setSnowing] = useState(false);
    const [temperature, setTemperature] = useState(25);
    const [showWind, setShowWind] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef(null);
    const [windDirection, setWindDirection] = useState("right"); 
    const soundPlayedRef = useRef(false);
    const smellParticlesRef = useRef([]);
    const [bearMovingToFish, setBearMovingToFish] = useState(false);
    const [bearHasFallen, setBearHasFallen] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [ableToDrag, setAbleToDrag] = useState(false);


    const canvasRef = useRef(null);
    const width = 1200;
    const height = 600;
    const animationState = useRef({
        bearX: 75,
        bearY: 200,
        ballX: 95,
        ballY: 250,
        isFalling: false,
        fell: false,
        velocityY: 0,
        angle: 0,
        rotationSpeed: 0,
        bearSize: 100,
        ballSize: 80
    });

    const particlesRef = useRef([]);
    const particleCount = 150;

    let animationFrameId = null; 

    useEffect(() => {
        if (!gameStarted) return;

        if (showNotification) {
            const timer = setTimeout(() => {
                setShowNotification(false);
                setAbleToDrag(true);
            }, 10000);
            return () => {
                clearTimeout(timer);
            }
        }

        let timeoutId;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const bear = new Image();
        const ball = new Image();
        const fish1 = new Image();
        const fish2 = new Image();
        const fish3 = new Image();
        
        bear.src = "images/enigme2_bear.png";
        ball.src = "images/snow-ball.png";
        fish1.src = "images/fish1.png";
        fish2.src = "images/fish2.png";
        fish3.src = "images/fish3.png";

        function drawFish(ctx) {
            const fishWidth = 55;
            const fishHeight = 30;
            ctx.drawImage(fish1, 950, 290, fishWidth, fishHeight);
            ctx.drawImage(fish2, 920, 300, fishWidth, fishHeight);
            ctx.drawImage(fish3, 950, 300, fishWidth, fishHeight);
        }
        
        let hasScheduledBubble = false;

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(0, 0, canvas.width, canvas.height);


            const state = animationState.current;
            
            ctx.fillStyle = "rgba(212, 212, 212, 0.8)"; 
            particlesRef.current.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            
                p.x += p.speedX;
                p.y += p.speedY;
            
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                if (p.y < 0) p.y = canvas.height;
            });
            

            ctx.fillStyle = "rgba(248, 248, 5, 0.97)"; //rgba(255, 255, 200, 0.7)"
            smellParticlesRef.current.forEach(p => {
                const margin = 100; 
                const distances = [
                    p.x,                          
                    width - p.x,                  
                    p.y,                          
                    height - p.y                 
                ];
                const minDist = Math.min(...distances);
                const fadeFactor = Math.min(1, minDist / margin); 
            
                const finalOpacity = p.opacity * fadeFactor;
            
                ctx.fillStyle = `rgba(248, 248, 5, ${finalOpacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            
                // Move particle
                p.x += p.speedX;
                p.y += p.speedY;
            
                if (
                    p.x < -50 || p.x > canvas.width + 50 ||
                    p.y < -50 || p.y > canvas.height + 50
                ) {
                    p.dead = true; 
                }
            });

            smellParticlesRef.current = smellParticlesRef.current.filter(p => !p.dead);

            

            if (!state.isFalling && !state.fell) {
                state.bearY += Math.sin(Date.now() / 300) * 1.2;
                state.ballY += Math.sin(Date.now() / 300) * 1.2;
            } else if (!state.fell) {
                if (state.bearY < 432) {
                    state.bearY += state.velocityY;
                    state.ballY += state.velocityY;
                    state.velocityY += 0.2;
                    state.angle += state.rotationSpeed;
                    state.rotationSpeed += 0.01;
                    state.bearX += state.rotationSpeed ;
                    state.ballX += state.rotationSpeed ;
                } else {
                    state.fell = true;
                    setBearHasFallen(true); 
                    if (!hasScheduledBubble) {
                        hasScheduledBubble = true;
                        const bubbleX = state.bearX + state.bearSize + 50;
                        const bubbleY = state.bearY + 100;
                        
                        timeoutId = setTimeout(() => {
                            setBubblePosition({ x: bubbleX, y: bubbleY });
                            setSnowing(true);
                            setTimeout(() => {
                                setBubblePosition(null);
                                setShowNotification(true);
                                if (!showWind) {
                                    setTimeout(() => {
                                        setShowWind(true);
                                    }, 5000);
                                }
                            }, 5000);
                        }, 2000);
                    }
                }
            }


            if (bearMovingToFish) {
                console.log("Animating bear movement", {
                    bearX: state.bearX,
                    bearY: state.bearY
                });
                const targetX = 900;
                const targetY = 300;
                const speed = 2;

                const dx = targetX - state.bearX;
                const dy = targetY - state.bearY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 1) {
                    state.bearX += (dx / dist) * speed;
                    state.bearY += (dy / dist) * speed;
                }else if (!gameEnded) {
                    console.log("Bear reached fish! Ending game");
                    setGameEnded(true);
                }
            }


            // Draw elements
            if (!state.fell) {
                ctx.save();
                ctx.translate(state.ballX + state.ballSize / 2, state.ballY + state.ballSize / 2);
                ctx.rotate(state.angle);
                ctx.drawImage(ball, -state.ballSize / 2, -state.ballSize / 2, state.ballSize, state.ballSize);
                ctx.restore();
            }

            ctx.drawImage(bear, state.bearX, state.bearY, state.bearSize, state.bearSize);
            drawFish(ctx);

            animationFrameId = requestAnimationFrame(animate);
        }

        bear.onload = ball.onload = () => {
            animate();
            setTimeout(() => {
                animationState.current.isFalling = true;
                animationState.current.velocityY = 0.1;
                animationState.current.rotationSpeed = 0.05;
                if (!soundPlayedRef.current) {
                    new Audio("/sounds/belly-sound.mp3").play().catch(console.error);
                    soundPlayedRef.current = true;
                }
            }, 4000);
        };

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            clearTimeout(timeoutId);
        };
    }, [gameStarted, showNotification, bearMovingToFish]);

    useEffect(() => {
        if (snowing) {
            const generated = [];
            for (let i = 0; i < particleCount; i++) {
                const tempFactor = Math.max(0, 30 - temperature); // 30°C is the max — cooler air = stronger horizontal flow
                const horizontalSpeed = (Math.random() * 0.3 + 0.5) * (tempFactor / 20); // Scales from 0 to 1 based on temp

                const directionMultiplier = windDirection === "right" ? 1 : -1;
                generated.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 2 + 1,
                    speedX: horizontalSpeed * directionMultiplier,   // horizontal drift to right
                    speedY: Math.random() * 0.5 + 0.3 + (temperature - 10) * 0.02,   // falling down
                });
            }
            particlesRef.current = generated;


            const newSmellParticles = [];
            const tempFactor = Math.max(0, 30 - temperature);
            const horizontalSpeed = (Math.random() * 0.3 + 0.5) * (tempFactor / 20);
            const directionMultiplier = windDirection === "right" ? 1 : -1;
        
            // Add new particles each frame (adjust the count as needed)
            for (let i = 0; i < 100; i++) {
                newSmellParticles.push({
                    x: 940 + Math.random() * 60, // Start near the fish
                    y: 270 + Math.random() * 20, // From the fish area
                    radius: Math.random() * 1 + 1, // Smaller size for smell
                    speedX: horizontalSpeed * directionMultiplier,
                    speedY: Math.random() * 0.3 + 0.1, // Slower falling speed
                    opacity: Math.random() * 0.5 + 0.3 // Random opacity
                });
            }
        
            // Just keep adding new particles (no removal)
            smellParticlesRef.current = [
                ...smellParticlesRef.current,
                ...newSmellParticles
            ];
        
            // Optional: Limit total particles to prevent performance issues
            if (smellParticlesRef.current.length > 500) {
                smellParticlesRef.current = smellParticlesRef.current.slice(-500);
            }
        }
       
    }, [snowing, windDirection, temperature, sunPos.x]);

    useEffect(() => {
        if (temperature === 10 && windDirection === "left" && bearHasFallen && !bearMovingToFish) {
            const timer = setTimeout(() => {
                setBearMovingToFish(true);
            }, 4500); 
            return () => clearTimeout(timer);
        }
    }, [temperature, windDirection, bearHasFallen]);
    

    const handleSunDrag = (e, info) => {
        
        const newX = info.point.x - (temperature * 2);
        const newY = info.point.y - (temperature * 2);
        setSunPos({
            x: newX, 
            y: newY,
        });
        if (newX > width / 2) {
            setWindDirection("left");
        } else {
            setWindDirection("right");
        }
        
    };

    return (
        <div className="enigme2-body-container">
            <div className="enigme2-container">
                <canvas className="enigme2-canvas" ref={canvasRef} width={width} height={height} />
                {gameStarted && 
                    <motion.div
                            style={{
                                position: 'absolute',
                                x: sunPos.x,
                                y: sunPos.y,
                                width: `${temperature * 4}px`,
                                height: `${temperature * 4}px`,
                                backgroundColor: 'yellow',
                                borderRadius: '50%',
                                cursor: "grabbing",
                                pointerEvents: ableToDrag ? 'auto' : 'none',
                            }}
                            drag
                            onDrag={handleSunDrag}
                            dragConstraints={canvasRef}
                            animate={{
                                scale: [1, 1.05, 1],
                                opacity: [1, 0.8, 1],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: 'reverse',
                            }}
                    />
                }

                <AnimatePresence>
                    {showNotification && (
                        <motion.div
                            className="enigme2-notification"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            ref={notificationRef}
                        >
                            <div className="notification-content">
                                <button 
                                    className="enigme2-close-btn"
                                    onClick={() => {setShowNotification(false); setAbleToDrag(true);}}
                                >
                                    ×
                                </button>
                                <div className="enigme2-arrow slider-arrow"></div>
                                <p>استخدم المؤشر لضبط درجة الحرارة وتغيير حجم الشمس!</p>
                                <p>حرّك الشمس إلى أي مكان تريده في السماء!</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {bubblePosition && (
                        <motion.div
                            className="enigme2-thought-bubble"
                            style={{
                                left: `${bubblePosition.x}px`,
                                top: `${bubblePosition.y}px`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                        >
                            <img src="/images/fish1.png" alt="Fish" className="bubble-fish" />
                            <img src="/images/fish2.png" alt="Fish" className="bubble-fish" />
                            <img src="/images/fish3.png" alt="Fish" className="bubble-fish" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="enigme2-interactions">
                    <h2>الجوع والرياح</h2>
                    {!gameStarted && (
                        <button 
                            className="enigme2-start-button"
                            onClick={() => setGameStarted(true)}
                        >
                            ابدأ اللعبة
                        </button>
                    )}
                    {gameStarted && (
                    
                        <div className="enigme2-temperature-slider">
                            <input
                                type="range"
                                min="10"
                                max="30"
                                value={temperature}
                                onChange={(e) => setTemperature(parseInt(e.target.value))}
                                orient="vertical"
                                className="vertical-slider"
                            />
                            <div className="temperature-display">{temperature}°C</div>
                            <div className='wind-notification-container' style={{ display: showWind ? 'block' : 'none' }}>
                                <span dir='rtl'><ReactAnimatedWeather icon="WIND" size={30} animate={true}/>حركة الرياح</span>   
                                <p dir="rtl" className="wind-notification" >
                                الرياح تهب {temperature >= 20 ? 'بشكل عمودي' : windDirection === "right" ? "من اليسار إلى اليمين" : "من اليمين إلى اليسار  " }
                                </p>
                            </div>

                        </div>

                        
                    )}
                    {gameEnded && (
                        
                        <div className="enigme2-game-end">
                            <h2 dir='rtl'>🎉 أحسنت! لقد وجد الدب طعامه.</h2>
                            <button className="enigme2-replay"onClick={() => window.location.reload()}>العب مرة أخرى</button>
                        </div>
                        
                    )}

                </div>
            </div>
        </div>
    );
}

export default Enigme2;