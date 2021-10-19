<template>
    <div>
        <button 
            v-for="(color, index) in colors"
            @click.prevent="selectColor(color)"
            :key="index"
            :style="buttonStyle(color)"
            class="color-select-button"
        ></button>
    </div>
</template>

<script>
export default {
    name: 'NoteColorSelect',
    props: [
        'colors',
        'initialColor'
    ],
    data() {
        return {
            selected: null,
        }
    },
    mounted() {
        if (this.initialColor)
            this.$store.commit('setSelectedNoteColor', this.initialColor);
    },
    methods: {
        selectColor(color) {
            this.selected = color;
            this.$store.commit('setSelectedNoteColor', color);
        },
        buttonStyle(color) {
            let style = {
                backgroundColor: color,
                borderColor: 'rgba(0, 0, 0, .3)',
                borderRadius: '50%',
            };

            if (this.initialColor && !this.selected) {
                if (color == this.initialColor && !this.selected) {
                    style.backgroundColor = this.initialColor;
                    style.borderColor = '#000';
                    style.borderRadius = '0';
                }
            }

            if (this.selected) {
                if (color == this.selected) {
                    style.backgroundColor = this.selected;
                    style.borderColor = '#000';
                    style.borderRadius = '0';
                }
            }
        
            return style;
        }
    }
}
</script>

<style scoped>
.color-select-button {
    margin: .3rem;
    outline: none;
    border: 3px solid rgba(0, 0, 0, .3);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    cursor: pointer;
}
    .color-select-button:hover {
        opacity: .5;
    }
</style>