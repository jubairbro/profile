document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById("preloader");
    const bootLinesContainer = document.getElementById("boot-lines");
    const bootCursor = document.getElementById("boot-cursor");
    document.body.classList.add("preloader-active");

    const bootLines = [
        "JubairOS initializing...",
        "Checking system files... <span class='ok-status'>[OK]</span>",
        "Loading user profile... <span class='ok-status'>[OK]</span>",
        "Mounting animations... <span class='ok-status'>[OK]</span>",
        "Loading UI components... <span class='ok-status'>[OK]</span>",
        "Welcome to, \"<span class='highlight'>Jubair Ahmad</span>\" World ⚡",
        "Starting GUI..."
    ];

    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex >= bootLines.length) {
            bootCursor.style.display = "none";
            setTimeout(startGUI, 100);
            return;
        }

        let currentLine = bootLines[lineIndex];
        let currentLineElement = document.querySelector(`#line-${lineIndex}`);
        
        if (!currentLineElement) {
            currentLineElement = document.createElement("p");
            currentLineElement.id = `line-${lineIndex}`;
            bootLinesContainer.appendChild(currentLineElement);
        }

        if (charIndex < currentLine.length) {
            currentLineElement.innerHTML = currentLine.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeLine, 10);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeLine, 50);
        }
    }

    function startGUI() {
        preloader.style.opacity = "0";
        setTimeout(() => {
            preloader.style.display = "none";
            document.body.classList.remove("preloader-active");
            document.dispatchEvent(new Event('preloaderFinished'));
        }, 500);
    }

    setTimeout(typeLine, 100);
});
