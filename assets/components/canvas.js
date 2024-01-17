import { sharedState } from './sharedState.js';
import { watch } from 'vue';

export default {
    template: `
        <canvas ref="myCanvas" class="w-100wh h-100vh absolute top-0 left-0"></canvas>
    `,
    mounted() {
        watch(() => sharedState.isToggled, (newData) => {

                this.updateCanvas(newData);
                console.log( newData );

        }, { immediate: true });
        watch(() => sharedState.selectedLevel, (newLevel) => {

            // this.updateCanvas(newLevel);
            console.log( newLevel );

    }, { immediate: true });
    },
    methods: {
        updateCanvas(data) {
            const canvas = this.$refs.myCanvas;
            if (canvas && canvas.getContext) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (data.isToggled) {
                    // Draw based on isToggled
                } else {
                    // Draw something else
                }
            }
        },
        drawImageOnCanvas(imageSrc) {
            const canvas = this.$refs.myCanvas;
            if (canvas.getContext) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
    
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Adjust x, y, width, height as needed
                };
    
                img.src = imageSrc;
            }
        }
    }
};
