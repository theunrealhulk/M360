import { sharedState } from './sharedState.js';
import { watch } from 'vue';


export default {
    template: `
    <div id="sidebar" class="p-4 absolute top-0 left-0 w-64 z-40" style="height:100vh;">

        <img src="data/assets/logo.png" alt="client logo" class="mb-15">
        <h2 class="text-3xl text-center mt-10 mb-5">App TYPE</h2>
        <div class="flex justify-center mt-5 mb-5">
            <button type="button" :class="{'bg-black': isToggled, 'bg-gray-200': !isToggled}" class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black" role="switch" :aria-checked="isToggled.toString()" @click="isToggled = !isToggled">
            <span class="sr-only">Use setting</span>
            <span :class="{'translate-x-5': isToggled, 'translate-x-0': !isToggled}" aria-hidden="true" class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"></span>
            </button>
        
        </div>
        <hr />
        <h2 class="text-3xl text-center mt-10 mb-5">VUE</h2>
        <hr>
        <div v-if="data">

        <button @click="selectedLevel = 'lastLevel'" :class="{'selected': selectedLevel === 'lastLevel'}" class="border-2 border-black rounded-full p-2 block m-auto mt-5">

            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>
            </button>

            <button v-for="level in levelRange" :key="level" :class="{'selected': level === selectedLevel}" @click="selectedLevel = level" class="border-2 border-black rounded-full p-2 block m-auto mt-5">
                R+{{ level }}
            </button>

            <button @click="selectedLevel = 'firstLevel'" :class="{'selected': selectedLevel === 'firstLevel'}" class="border-2 border-black rounded-full p-1.5 block m-auto mt-5">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 320 512"><path d="M160 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM126.5 199.3c-1 .4-1.9 .8-2.9 1.2l-8 3.5c-16.4 7.3-29 21.2-34.7 38.2l-2.6 7.8c-5.6 16.8-23.7 25.8-40.5 20.2s-25.8-23.7-20.2-40.5l2.6-7.8c11.4-34.1 36.6-61.9 69.4-76.5l8-3.5c20.8-9.2 43.3-14 66.1-14c44.6 0 84.8 26.8 101.9 67.9L281 232.7l21.4 10.7c15.8 7.9 22.2 27.1 14.3 42.9s-27.1 22.2-42.9 14.3L247 287.3c-10.3-5.2-18.4-13.8-22.8-24.5l-9.6-23-19.3 65.5 49.5 54c5.4 5.9 9.2 13 11.2 20.8l23 92.1c4.3 17.1-6.1 34.5-23.3 38.8s-34.5-6.1-38.8-23.3l-22-88.1-70.7-77.1c-14.8-16.1-20.3-38.6-14.7-59.7l16.9-63.5zM68.7 398l25-62.4c2.1 3 4.5 5.8 7 8.6l40.7 44.4-14.5 36.2c-2.4 6-6 11.5-10.6 16.1L54.6 502.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L68.7 398z"/></svg>
            </button>
            <hr />
            <h1 class="mt-5 m-auto w-24">By</h1>
            <a href="https://decoversestudio.com/" target="_blank"><img class=" m-auto w-24" src="assets/decovers_logo.png" alt="decovers-logo" /></a>
            </div>
            
            <div v-else>
                Loading data or data not available...
            </div>
        </div>
    `,
    data() {
        return {
            data: null,
            isToggled: false,
            selectedLevel: 'lastLevel',
            sideVal:true
        };
    },
    computed: {
        levelRange() {
            if (this.data) {
                // Create an array from data.numberOfLevels down to 0
                return Array.from({ length: this.data.numberOfLevels + 1 }, (_, i) => this.data.numberOfLevels - i);
            } else {
                return [];
            }
        }
    },
    mounted() {
        axios.get('assets/config.json')
        .then(response => {
            this.data = response.data; // Set local data
            sharedState.data = response.data; // Set shared data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    },
    created() {
        // Watch for changes in 'data'
        watch(() => this.data, (newVal) => {
            sharedState.data = newVal;
        });

        // Watch for changes in 'isToggled'
        watch(() => this.isToggled, (newVal) => {
            sharedState.isToggled = newVal;
        });

        // Watch for changes in 'selectedLevel'
        watch(() => this.selectedLevel, (newVal) => {
            sharedState.selectedLevel = newVal;
        });
    }

};
