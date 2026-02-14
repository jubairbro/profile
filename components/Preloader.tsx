import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const bootLines = [
    "init system --verbose",
    "Loading kernel modules... [OK]",
    "Mounting file systems... [OK]",
    "Starting network services... [OK]",
    "Bypassing firewalls... [SUCCESS]",
    "System Ready."
  ];

  useEffect(() => {
    // --- Matrix Rain Effect (Runs once) ---
    const canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    let matrixInterval: NodeJS.Timeout;

    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const letters = katakana.split('');
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops: number[] = [];
            for (let i = 0; i < columns; i++) drops[i] = 1;

            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#0F0';
                ctx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = letters[Math.floor(Math.random() * letters.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            };
            matrixInterval = setInterval(draw, 33);
        }
    }

    return () => {
        if (matrixInterval) clearInterval(matrixInterval);
    };
  }, []); // Empty dependency array ensures Matrix runs once and persists

  useEffect(() => {
    // --- Boot Sequence Logic ---
    let bootTimeout: NodeJS.Timeout;

    if (currentLineIndex >= bootLines.length) {
      bootTimeout = setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 500); // Fade out duration
      }, 800); // Wait after last line
    } else {
      const currentText = bootLines[currentLineIndex];

      if (currentLineIndex === 0) {
        // First line: Typewriter effect
        if (currentCharIndex < currentText.length) {
            bootTimeout = setTimeout(() => {
                setLines(prev => {
                    const newLines = [...prev];
                    newLines[0] = currentText.substring(0, currentCharIndex + 1);
                    return newLines;
                });
                setCurrentCharIndex(prev => prev + 1);
            }, 30); // Typing speed
        } else {
            // Line finished
            bootTimeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 300); // Pause after typing
        }
      } else {
        // Subsequent lines: Fast block appear
        bootTimeout = setTimeout(() => {
            setLines(prev => {
                const newLines = [...prev];
                newLines[currentLineIndex] = currentText;
                return newLines;
            });
            setCurrentLineIndex(prev => prev + 1);
        }, 200); // Speed for subsequent lines
      }
    }

    return () => {
        if (bootTimeout) clearTimeout(bootTimeout);
    };
  }, [currentLineIndex, currentCharIndex, onComplete, bootLines]);

  return (
    <div 
      className={`fixed inset-0 bg-[#050505] z-[10000] flex flex-col items-center justify-center font-mono text-green-500 transition-all duration-700 ${isComplete ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}
    >
      <canvas id="matrix-canvas" className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none"></canvas>
      
      <div className="w-[90%] max-w-lg p-6 border border-green-500/30 rounded-xl bg-black/60 backdrop-blur-sm shadow-2xl relative overflow-hidden z-10 min-h-[300px] flex flex-col justify-end transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-pulse"></div>
        
        {lines.map((line, index) => (
          <p key={index} className="mb-1 text-xs md:text-sm tracking-wider font-mono break-all leading-relaxed">
            {index === 0 ? (
                <span>
                    <span className="text-blue-400 font-bold">root@jubair</span>:<span className="text-blue-500">~</span>$ {line}
                </span>
            ) : (
                <span className="text-gray-400">
                    <span className="text-gray-600 mr-2">❯</span>
                    <span dangerouslySetInnerHTML={{ 
                    __html: line
                        .replace('[OK]', '<span class="text-green-500 font-bold">[OK]</span>')
                        .replace('[SUCCESS]', '<span class="text-cyan-400 font-bold">[SUCCESS]</span>')
                    }} />
                </span>
            )}
          </p>
        ))}
        {/* Blinking Cursor */}
        {!isComplete && (
             <div className="mt-1">
                 <span className="inline-block w-2 h-4 bg-green-500 animate-pulse"></span>
             </div>
        )}
      </div>
      
      <div className="mt-8 text-xs text-gray-500 uppercase tracking-[0.3em] animate-pulse relative z-10">
        Initializing System...
      </div>
    </div>
  );
};

export default Preloader;