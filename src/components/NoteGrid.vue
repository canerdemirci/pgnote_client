<template>
    <div class="note-grid">
        <NoteCard @click.native="showNoteEditForm(note)" v-for="note in notes" :note="note" :key="note.id" />
        <LoadingNoteCard v-for="(card, index) in (addedNotesLoading ? 10 : 0)" :key="index" />
    </div>
</template>

<script>
import NoteCard from './NoteCard.vue';
import LoadingNoteCard from '@/components/LoadingNoteCard';

export default {
    name: 'NoteGrid',
    props: ['notes'],
    components: {
        NoteCard,
        LoadingNoteCard
    },
    computed: {
        addedNotesLoading() {
            return this.$store.state.addedNotesLoading;
        }
    },
    methods: {
        showNoteEditForm(note) {
            if (note) {
                this.$store.dispatch('toggleNoteEditForm', note);
                this.$store.commit('setSelectedNoteColor', note.color);
            }
            else {
                this.$store.dispatch('toggleNoteEditForm', null);
            }
        }
    }
}
</script>