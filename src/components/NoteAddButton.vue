<template>
    <div class="add-button">
        <span class="material-icons" style="font-size: 48px">note_add</span>
    </div>
</template>

<script>
export default {
    name: 'NoteAddButton'
}
</script>

<style scoped>
.add-button {
    position: fixed;
    right: 2rem;
    bottom: 2rem; 
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, .3);
    transition: all .5s; 
}
    .add-button {
        display: block;
        cursor: pointer;
        border-radius: 50%;
        background-color: #fff;
        border: 3px dotted #7e7e7e;
        padding: 1rem;
    }

    .add-button:hover {
        opacity: .6;
        transform: scale(1.2);
    }
</style>