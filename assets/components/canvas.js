import { sharedState } from './sharedState.js';
import { watch } from 'vue';

export default {
    template: `
        <canvas ref="myCanvas" width="1920" height="1080" class="absolute top-0 left-0"></canvas>
    `,
    data() {
        return {
            lowResImages: [],
            highResImages: [],
            currentFrame: 0,
            isPlaying: false,
            lastMouseX: 0,
            lastMouseY: 0,
            highResImage: null, 
            mouseMoveThreshold: 5,
            circles: [
                { x: 500, y: 650, radius: 30, data: 'Circle 1' },
                { x: 200, y: 250, radius: 30, data: 'Circle 2' },
                // ... add more circles
            ],
        };
    },
    computed: {
        levelKey() {
            let level = sharedState.selectedLevel;
            if (typeof level === 'number') {
                return `R${level}`;
            } else {
                return level === 'firstLevel' ? 'BAS' : 'HAUT';
            }
        }
    },
    mounted() {
        watch(() => sharedState.selectedLevel, (newLevel) => {
            if (newLevel || newLevel === 0) {
                this.loadImages(this.levelKey, 'LQ', () => {
                    this.loadImages(this.levelKey, 'HQ');
                });
            }
        }, { immediate: true });

        this.setupCanvas();
    },
    methods: {
        loadImages(levelKey) {
            // Reset arrays
            this.lowResImages = [];
            this.highResImages = [];
        
            let lowResSources = [];
            let highResSources = [];
            for (let i = 1; i <= 35; i++) {
                lowResSources.push(`data/LQ/${levelKey}_${i.toString().padStart(3, '0')}.jpg`);
                highResSources.push(`data/HQ/${levelKey}_${i.toString().padStart(3, '0')}.jpg`);
            }
        
            // Preload high-resolution images and draw the first frame once it's loaded
            highResSources.forEach((src, index) => {
                const img = new Image();
                img.onload = () => {
                    this.highResImages.push(img);
                    if (index === 0) {
                        this.drawImageOnCanvas(img); // Draw first high-res frame
                        this.loadLowResImages(lowResSources); // Load low-res images after drawing the first high-res frame
                    }
                };
                img.src = src;
            });
        },
        
        loadLowResImages(lowResSources) {
            // Load low-resolution images
            lowResSources.forEach(src => {
                const img = new Image();
                img.onload = () => {
                    this.lowResImages.push(img);
                };
                img.src = src;
            });
        },
        setupCanvas() {
            const canvas = this.$refs.myCanvas;
            canvas.addEventListener('mousedown', this.startPlaying);
            canvas.addEventListener('mousemove', this.onMouseMove);
            window.addEventListener('mouseup', this.stopPlaying);
            canvas.addEventListener('click', this.handleCanvasClick);
        },
        startPlaying(event) {
            this.isPlaying = true;
            this.lastMouseX = event.offsetX;
            this.loadImages(this.levelKey, 'LQ');
        },
        onMouseMove(event) {
            if (!this.isPlaying) return; // Only proceed if isPlaying is true
    
            const currentMouseX = event.offsetX;
            const deltaX = currentMouseX - this.lastMouseX;
    
            // Check for significant mouse movement
            if (Math.abs(deltaX) > this.mouseMoveThreshold) {
                this.currentFrame += deltaX > 0 ? 1 : -1; // Increment or decrement frame
                this.currentFrame = this.correctFrameIndex(this.currentFrame); // Correct the frame index
                this.drawImageOnCanvas(this.lowResImages[this.currentFrame]); // Draw the new frame
                this.lastMouseX = currentMouseX; // Update the last mouse X position
            }
        },
    
        correctFrameIndex(frame) {
            // Corrects the frame index to loop within the bounds of the lowResImages array
            if (frame >= this.lowResImages.length) {
                return 0;
            } else if (frame < 0) {
                return this.lowResImages.length - 1;
            }
            return frame;
        },
    
        stopPlaying(event) {
            this.isPlaying = false;
            if (this.highResImages[this.currentFrame]) {
                this.drawImageOnCanvas(this.highResImages[this.currentFrame]);
            }
        },
        drawImageOnCanvas(image) {
            const canvas = this.$refs.myCanvas;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            if (sharedState.isToggled && typeof sharedState.selectedLevel === 'number') {
                this.circles.forEach(circle => {
                    if (this.isMouseClose(circle)) {
                        ctx.beginPath();
                        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }
        },
        isMouseClose(circle) {
            const distance = Math.sqrt(Math.pow(this.lastMouseX - circle.x, 2) + Math.pow(this.lastMouseY - circle.y, 2));
            return distance < 30;
        },
        handleCanvasClick(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            this.circles.forEach(circle => {
                const distance = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
                if (distance < circle.radius) {
                    console.log('Circle clicked:', circle.data);
                }
            });
        },
    }
};
