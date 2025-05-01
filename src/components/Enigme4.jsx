import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../styles/Enigme4.css";

function Enigme4() {
    // States for environmental conditions - modified initial values
    const [iceLevel, setIceLevel] = useState(60);
    const [pollution, setPollution] = useState(30);
    const [extremeWeather, setExtremeWeather] = useState(20);
    const [bearHealth, setBearHealth] = useState(70);
    const [foodAvailability, setFoodAvailability] = useState(70);
    const [environmentalStatus, setEnvironmentalStatus] = useState("warning");
    const [message, setMessage] = useState("البيئة القطبية مهددة. لاحظ تأثير أفعالك على موطن الدب.");
    const [messageType, setMessageType] = useState("info");
    const [showSolutions, setShowSolutions] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [firstAction, setFirstAction] = useState(true);
    const [tutorialStep, setTutorialStep] = useState(1);
    const [showTutorial, setShowTutorial] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState({
        bear: false,
        ice: false,
        fish: false,
        pollution: false,
        weather: false
    });
    const [allImagesLoaded, setAllImagesLoaded] = useState(false);

    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const width = 600;
    const height = 400;
    
    // Images references
    const bearImgRef = useRef(null);
    const iceImgRef = useRef(null);
    const fishImgRef = useRef(null);
    const pollutionImgRef = useRef(null);
    const weatherImgRef = useRef(null);

    // Tutorial messages in Arabic
    const tutorialMessages = [
        "مرحبًا بك في النظام البيئي القطبي! ستكتشف كيف تؤثر الأفعال البشرية على حياة الدببة القطبية.",
        "لاحظ الحالة الحالية: الجليد يذوب بالفعل، الماء ملوث، والمناخ يزداد دفئًا. الدب ليس في أفضل حال.",
        "حاول أولاً تفاقم الوضع لفهم عواقب كل فعل سلبي.",
        "بمجرد فهمك للمخاطر، ستظهر حلول تسمح لك باستعادة التوازن.",
        "هدفك: إعادة النظام البيئي إلى حالة مستقرة حتى يتمكن الدب القطبي من البقاء!"
    ];

    // Negative environmental effects
    const causeIceMelt = () => {
        if (iceLevel > 20 && !gameWon && !gameLost) {
            setIceLevel(prev => Math.max(prev - 20, 0));
            setMessage("ذوبان الجليد يقلص موطن الدب، مما يضطره إلى قطع مسافات أطول للعثور على الطعام.");
            setMessageType("warning");
            checkFirstAction();
            updateBearHealth();
        }
    };

    const causePollution = () => {
        if (pollution < 80 && !gameWon && !gameLost) {
            setPollution(prev => Math.min(prev + 20, 100));
            setMessage("النفايات تلوث الماء وتقتل الأسماك، المصدر الرئيسي لغذاء الدب.");
            setMessageType("warning");
            checkFirstAction();
            updateFoodAvailability();
        }
    };

    const causeExtremeWeather = () => {
        if (extremeWeather < 80 && !gameWon && !gameLost) {
            setExtremeWeather(prev => Math.min(prev + 20, 100));
            setMessage("ارتفاع درجات الحرارة يؤدي إلى عواصف أكثر عنفًا وموجات حر.");
            setMessageType("warning");
            checkFirstAction();
            updateIceLevel();
        }
    };

    const checkFirstAction = () => {
        if (firstAction) {
            setFirstAction(false);
            setTimeout(() => {
                setMessage("لقد رأيت التأثير السلبي. تابع الملاحظة أو جرب أفعالًا أخرى لفهم جميع العواقب.");
                setMessageType("info");
            }, 3000);
        }
    };

    // Solutions to restore environment
    const removePollution = () => {
        if (pollution > 0 && !gameWon && !gameLost) {
            setPollution(prev => Math.max(prev - 20, 0));
            setFoodAvailability(prev => Math.min(prev + 10, 100));
            setMessage("الماء يصبح أنظف، غذاء الدب يزداد!");
            setMessageType("info");
            updateBearHealth();
        }
    };

    const reduceTemperature = () => {
        if (extremeWeather > 0 && !gameWon && !gameLost) {
            setExtremeWeather(prev => Math.max(prev - 20, 0));
            setMessage("انخفاض درجة الحرارة: تباطؤ ذوبان الجليد. النظام البيئي يبدأ في الاستقرار.");
            setMessageType("info");
            updateIceLevel();
        }
    };

    const restoreIce = () => {
        if (iceLevel < 100 && !gameWon && !gameLost) {
            setIceLevel(prev => Math.min(prev + 20, 100));
            setMessage("استعادة الجليد: الدب يستعيد مساحة الصيد ويمكنه التحرك بسهولة أكبر.");
            setMessageType("info");
            updateBearHealth();
        }
    };

    // Update dependent values functions
    const updateBearHealth = () => {
        const newHealth = ((iceLevel + foodAvailability) / 2) - (extremeWeather / 4);
        setBearHealth(Math.max(Math.min(newHealth, 100), 0));
    };

    const updateFoodAvailability = () => {
        const newFood = 100 - pollution;
        setFoodAvailability(Math.max(newFood, 0));
        updateBearHealth();
    };

    const updateIceLevel = () => {
        if (extremeWeather > 30) {
            const reduction = extremeWeather / 10;
            setIceLevel(prev => Math.max(prev - reduction, 0));
            updateBearHealth();
        }
    };

    // Tutorial management
    const nextTutorialStep = () => {
        if (tutorialStep < tutorialMessages.length) {
            setTutorialStep(prev => prev + 1);
        } else {
            setShowTutorial(false);
        }
    };

    // Check overall environment status
    useEffect(() => {
        const overallStatus = (iceLevel + (100 - pollution) + (100 - extremeWeather)) / 3;
        
        if (bearHealth <= 10 && !gameLost) {
            setGameLost(true);
            setMessage("الدب لم ينجو من التغيرات البيئية. موطنه متدهور جدًا.");
            setMessageType("warning");
        } else if (overallStatus < 40) {
            setEnvironmentalStatus("danger");
            if (!showSolutions && !gameLost && !gameWon) {
                setTimeout(() => {
                    setMessage("البيئة مهددة بشدة! يجب إيجاد حلول سريعًا!");
                    setMessageType("warning");
                    setShowSolutions(true);
                    
                    setTimeout(() => {
                        const solutionsSection = document.querySelector('.buttons-container h3:nth-child(3)');
                        if (solutionsSection) {
                            solutionsSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }, 1500);
            }
        } else if (overallStatus < 70) {
            setEnvironmentalStatus("warning");
        } else {
            setEnvironmentalStatus("stable");
            
            if (iceLevel >= 80 && pollution <= 20 && extremeWeather <= 20 && !gameWon && !gameLost) {
                setGameWon(true);
                setMessage("تهانينا! لقد نجحت في استعادة موطن الدب وإعادة توازن النظام البيئي.");
                setMessageType("success");
            }
        }
    }, [iceLevel, pollution, extremeWeather, bearHealth, foodAvailability, showSolutions, gameWon, gameLost]);

    // Fallback icons
    const bearIcon = "🐻‍❄️";
    const fishIcon = "🐟";
    const iceIcon = "❄️";
    const pollutionIcon = "🏭";
    const weatherIcon = "🌩️";

    // Image loading function
    const loadImage = (src, ref, imageType) => {
        const img = new Image();
        
        img.onload = () => {
            ref.current = img;
            setImagesLoaded(prev => ({...prev, [imageType]: true}));
        };
        
        img.onerror = () => {
            console.error(`تعذر تحميل الصورة: ${src}`);
            setImagesLoaded(prev => ({...prev, [imageType]: true}));
        };
        
        img.src = src;
    };

    // Check if all images are loaded
    useEffect(() => {
        const allLoaded = Object.values(imagesLoaded).every(status => status === true);
        setAllImagesLoaded(allLoaded);
    }, [imagesLoaded]);

    // Load images
    useEffect(() => {
        loadImage("/images/enigme2_bear.png", bearImgRef, "bear");
        loadImage("/images/ice_mountain.png", iceImgRef, "ice");  
        loadImage("/images/fish1.png", fishImgRef, "fish");
        loadImage("/images/pollution.png", pollutionImgRef, "pollution");
        loadImage("/images/weather.png", weatherImgRef, "weather");
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // Canvas drawing effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        const drawEnvironment = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw sky (changes with weather)
            const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height/2);
            
            if (extremeWeather > 50) {
                skyGradient.addColorStop(0, "#333333");
                skyGradient.addColorStop(1, "#666666");
            } else if (extremeWeather > 20) {
                skyGradient.addColorStop(0, "#6699cc");
                skyGradient.addColorStop(1, "#b3c6d1");
            } else {
                skyGradient.addColorStop(0, "#87CEEB");
                skyGradient.addColorStop(1, "#e0f7ff");
            }
            
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height/2);
            
            // Draw water (changes with pollution)
            const waterGradient = ctx.createLinearGradient(0, canvas.height/2, 0, canvas.height);
            
            if (pollution > 60) {
                waterGradient.addColorStop(0, "#5e4b3c");
                waterGradient.addColorStop(1, "#3d3229");
            } else if (pollution > 30) {
                waterGradient.addColorStop(0, "#5f7a8a");
                waterGradient.addColorStop(1, "#3d5f73");
            } else {
                waterGradient.addColorStop(0, "#6db9de");
                waterGradient.addColorStop(1, "#265b7e");
            }
            
            ctx.fillStyle = waterGradient;
            ctx.fillRect(0, canvas.height/2, canvas.width, canvas.height/2);
            
            // Draw border
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 5;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
            
            // Draw ice
            if (iceImgRef.current) {
                const iceWidth = canvas.width * (iceLevel / 100);
                ctx.drawImage(iceImgRef.current, 0, canvas.height - 150, iceWidth, 150);
            } else {
                ctx.fillStyle = "#FFFFFF";
                const iceWidth = canvas.width * (iceLevel / 100);
                ctx.fillRect(0, canvas.height - 80, iceWidth, 80);
                
                ctx.fillStyle = "#AADEFF";
                ctx.font = "24px Arial";
                for (let i = 0; i < iceLevel/10; i++) {
                    ctx.fillText(iceIcon, 30 + i * 50, canvas.height - 40);
                }
            }
            
            // Draw pollution
            if (pollutionImgRef.current && pollution > 0) {
                ctx.globalAlpha = pollution / 100;
                ctx.drawImage(pollutionImgRef.current, 0, canvas.height - 150, canvas.width, 150);
                ctx.globalAlpha = 1.0;
            } else if (pollution > 0) {
                ctx.fillStyle = "rgba(139, 69, 19, " + (pollution / 100) + ")";
                ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
                
                if (pollution > 20) {
                    ctx.fillStyle = "#000000";
                    ctx.font = "20px Arial";
                    for (let i = 0; i < pollution/20; i++) {
                        ctx.fillText(pollutionIcon, 50 + i * 100, canvas.height - 70);
                    }
                }
            }
            
            // Draw extreme weather effects
            if (weatherImgRef.current && extremeWeather > 30) {
                ctx.globalAlpha = extremeWeather / 100;
                ctx.drawImage(weatherImgRef.current, 0, 0, canvas.width, canvas.height / 2);
                ctx.globalAlpha = 1.0;
            } else if (extremeWeather > 30) {
                ctx.fillStyle = "rgba(120, 120, 120, " + (extremeWeather / 200) + ")";
                ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
                
                if (extremeWeather > 20) {
                    ctx.fillStyle = "#333333";
                    ctx.font = "24px Arial";
                    for (let i = 0; i < extremeWeather/20; i++) {
                        ctx.fillText(weatherIcon, 40 + i * 80, 40);
                    }
                }
            }
            
            if (extremeWeather > 50) {
                drawPrecipitation();
            }
            
            // Draw fish
            if (fishImgRef.current) {
                const fishCount = Math.floor(foodAvailability / 20);
                for (let i = 0; i < fishCount; i++) {
                    ctx.drawImage(
                        fishImgRef.current, 
                        200, 
                        280,
                        30, 15
                    );
                }
            } else {
                const fishCount = Math.floor(foodAvailability / 20);
                ctx.fillStyle = "#3385ff";
                ctx.font = "20px Arial";
                for (let i = 0; i < fishCount; i++) {
                    ctx.fillText(
                        fishIcon, 
                        100 + Math.random() * (canvas.width - 200), 
                        canvas.height - 80 - Math.random() * 50
                    );
                }
            }
            
            // Draw bear
            if (bearImgRef.current) {
                const bearSize = 80;
                let bearX = canvas.width / 2 - bearSize / 2;
                let bearY = canvas.height - 130 - bearSize / 2;
                
                if (bearHealth < 50) {
                    ctx.globalAlpha = Math.max(0.5, bearHealth / 100);
                    ctx.save();
                    ctx.translate(bearX + bearSize/2, bearY + bearSize/2);
                    ctx.rotate(Math.PI * 0.03);
                    ctx.drawImage(bearImgRef.current, -bearSize/2, -bearSize/2, bearSize, bearSize);
                    ctx.restore();
                    ctx.globalAlpha = 1.0;
                } else {
                    ctx.drawImage(bearImgRef.current, bearX, bearY, bearSize, bearSize);
                }
            } else {
                const bearSize = 60;
                let bearX = canvas.width / 2 - bearSize / 2;
                let bearY = canvas.height - 120;
                
                ctx.fillStyle = bearHealth < 50 ? "#999999" : "#FFFFFF"; 
                ctx.font = "60px Arial";
                ctx.fillText(bearIcon, bearX, bearY);
                
                const healthBarWidth = 50;
                const healthBarHeight = 8;
                ctx.fillStyle = "#e0e0e0";
                ctx.fillRect(bearX, bearY - 70, healthBarWidth, healthBarHeight);
                
                ctx.fillStyle = bearHealth > 70 ? '#4CAF50' : bearHealth > 30 ? '#FFC107' : '#F44336';
                ctx.fillRect(bearX, bearY - 70, healthBarWidth * (bearHealth/100), healthBarHeight);
            }
        };
        
        const drawPrecipitation = () => {
            const drops = 100;
            ctx.fillStyle = "#FFFFFF";
            
            for (let i = 0; i < drops; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height/2;
                const size = Math.random() * 3 + 1;
                
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const animate = () => {
            drawEnvironment();
            animationRef.current = requestAnimationFrame(animate);
        };
        
        animate();
    }, [iceLevel, pollution, extremeWeather, bearHealth, foodAvailability]);

    return (
        <div className="enigme4-body-container">
            <div className="enigme4-container">
                <canvas 
                    className="enigme4-canvas" 
                    ref={canvasRef} 
                    width={width} 
                    height={height}
                />
                
                <div className="enigme4-interactions">
                    <h2>البيئة القطبية</h2>
                    
                    <div className={`status-indicator ${environmentalStatus}`}>
                        <span>حالة البيئة: </span>
                        <span className="status-value">{
                            environmentalStatus === "stable" ? "مستقرة" : 
                            environmentalStatus === "warning" ? "في خطر" : "حرجة"
                        }</span>
                    </div>

                    <div className="bear-health">
                        <span>صحة الدب: {Math.round(bearHealth)}%</span>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{
                                    width: `${bearHealth}%`,
                                    backgroundColor: bearHealth > 70 ? '#4CAF50' : bearHealth > 30 ? '#FFC107' : '#F44336'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="ice-level">
                        <span>مستوى الجليد: {Math.round(iceLevel)}%</span>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{
                                    width: `${iceLevel}%`,
                                    backgroundColor: '#87CEEB'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="pollution-level">
                        <span>التلوث: {Math.round(pollution)}%</span>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{
                                    width: `${pollution}%`,
                                    backgroundColor: '#8B4513'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="weather-level">
                        <span>المناخ المتطرف: {Math.round(extremeWeather)}%</span>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{
                                    width: `${extremeWeather}%`,
                                    backgroundColor: '#FF5722'
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="buttons-container">
                        <h3>أفعال سلبية</h3>
                        <div className="action-buttons">
                            <button 
                                onClick={causeIceMelt}
                                disabled={iceLevel <= 0 || gameWon || gameLost}
                                className="negative-action"
                            >
                                ذوبان الجليد
                            </button>
                            <button 
                                onClick={causePollution}
                                disabled={pollution >= 100 || gameWon || gameLost}
                                className="negative-action"
                            >
                                إضافة تلوث
                            </button>
                            <button 
                                onClick={causeExtremeWeather}
                                disabled={extremeWeather >= 100 || gameWon || gameLost}
                                className="negative-action"
                            >
                                مناخ متطرف
                            </button>
                        </div>
                        
                        {showSolutions && (
                            <>
                                <h3>حلول</h3>
                                <div className="action-buttons">
                                    <button 
                                        onClick={removePollution}
                                        disabled={pollution <= 0 || gameWon || gameLost}
                                        className="positive-action"
                                    >
                                        تنظيف الماء
                                    </button>
                                    <button 
                                        onClick={reduceTemperature}
                                        disabled={extremeWeather <= 0 || gameWon || gameLost}
                                        className="positive-action"
                                    >
                                        تخفيض الحرارة
                                    </button>
                                    <button 
                                        onClick={restoreIce}
                                        disabled={iceLevel >= 100 || gameWon || gameLost}
                                        className="positive-action"
                                    >
                                        استعادة الجليد
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                
                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`message-box ${messageType}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {showTutorial && (
                    <motion.div
                        className="tutorial-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="tutorial-content">
                            <h3>البرنامج التعليمي - الخطوة {tutorialStep}/{tutorialMessages.length}</h3>
                            <p>{tutorialMessages[tutorialStep-1]}</p>
                            <button className = "next-buttons" onClick={nextTutorialStep}>
                                {tutorialStep < tutorialMessages.length ? "التالي" : "ابدأ"}
                            </button>
                        </div>
                    </motion.div>
                )}
                
                {gameWon && (
                    <motion.div
                        className="victory-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="victory-content">
                            <h2>فوز!</h2>
                            <p>تهانينا! لقد نجحت في استعادة موطن الدب وإعادة توازن النظام البيئي.</p>
                            <p>لقد فهمت أهمية الحفاظ على بيئة صحية للحيوانات القطبية.</p>
                            <button className="replay" onClick={() => window.location.reload()}>إعادة اللعب</button>
                        </div>
                    </motion.div>
                )}
                
                {gameLost && (
                    <motion.div
                        className="defeat-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="defeat-content">
                            <h2>الدب لم ينجو</h2>
                            <p>كانت التغيرات البيئية شديدة جدًا على الدب ليتكيف معها.</p>
                            <p>تذكر: لكل فعل بشري تأثير كبير على النظم البيئية الهشة.</p>
                            <button className="replay" onClick={() => window.location.reload()}>إعادة المحاولة</button>
                        </div>
                    </motion.div>
                )}
                
                {!allImagesLoaded && !showTutorial && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>جارٍ تحميل البيئة...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Enigme4;