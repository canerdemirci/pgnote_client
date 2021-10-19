<template>
    <div>
        <span v-if="!searchFinished" class="material-icons rotate-anim">refresh</span>
        <span v-else class="material-icons">search</span>
        <input @input="onInput" v-model="searchStr" type="text" placeholder="Search in notes">
    </div>
</template>

<script>
export default {
    name: 'SearchBox',
    data() {
        return {
            searchStr: null,
        }
    },
    computed: {
        searchFinished() {
            return this.$store.state.searchFinished;
        }
    },
    methods: {
        onInput() {
            this.$store.dispatch('fetchNotes', this.searchStr);
        }
    }
}
</script>

<style scoped>
div {
    display: flex;
    align-items: center;
    gap: .5rem;
    margin: 2rem;
    background-color: #fff;
    border-radius: 5px;
    padding: .5rem;
}

div input {
    width: 100%;
    border: none;
    outline: none;
}

@media screen and (max-width: 1024px) {
    div {
        margin: 1rem;
    }
}
</style>