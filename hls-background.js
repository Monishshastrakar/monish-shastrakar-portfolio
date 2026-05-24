export function initHLSBackground() {
    const container = document.getElementById('hls-bg-container');
    if (!container) return;

    // Build the DOM structure
    container.innerHTML = `
        <video id="hls-video" class="hls-video" autoplay loop muted playsinline></video>
        <div class="hls-gradient-overlay"></div>
        <div class="hls-grid">
            <div class="hls-grid-line"></div>
            <div class="hls-grid-line"></div>
            <div class="hls-grid-line"></div>
        </div>
        <div class="hls-glow"></div>
        <div class="hls-mouse-glow" id="hls-mouse-glow"></div>
    `;

    const video = document.getElementById('hls-video');
    const videoSrc = 'https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8';

    if (window.Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: false // Stability for sandboxed environments as requested
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(e => console.warn("Autoplay blocked:", e));
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari natively supporting HLS
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function () {
            video.play().catch(e => console.warn("Autoplay blocked:", e));
        });
    }

    // Interactive mouse hover feature
    const mouseGlow = document.getElementById('hls-mouse-glow');
    let isMouseActive = false;

    window.addEventListener('mousemove', (e) => {
        if (!isMouseActive) {
            isMouseActive = true;
            mouseGlow.style.opacity = '1';
        }
        // Smooth positioning using transform
        requestAnimationFrame(() => {
            mouseGlow.style.transform = `translate(-50%, -50%) translate(${e.clientX}px, ${e.clientY}px)`;
        });
    });

    window.addEventListener('mouseout', (e) => {
        // Hide glow when mouse leaves the browser window
        if (!e.relatedTarget) {
            isMouseActive = false;
            mouseGlow.style.opacity = '0';
        }
    });
}
