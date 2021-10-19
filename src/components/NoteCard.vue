<template>
    <!-- If there is no title then show description on the card -->
    <div class="note-card" :class="{'fade-in-anim-2s': fadeInAnim}" :style="{backgroundColor: noteColor}">
        <div v-if="note.title" class="note-card-caption">{{note.title}}</div>
        <div v-if="note.description && !note.title" class="note-card-caption">{{note.description}}</div>
        <div class="note-card-date">{{date(note.createdAt)}}</div>
        <button v-if="deleteBtnEnable" @click.stop="onClickDelete(note.id)" class="note-delete-btn">
            <span class="material-icons">delete</span>
        </button>
    </div>
</template>

<script>
import constants from '@/constants';
import axios from 'axios';

export default {
    name: 'NoteCard',
    props: {
        note: Object
    },
    data() {
        return {
            fadeInAnim: false,
            deleteBtnEnable: true,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.fadeInAnim = true;
        });
    },
    computed: {
        // If there is no color in the note then default color of note is white.
        noteColor() {
            return !this.note.color ? constants.NOTE_COLORS.WHITE : this.note.color;
        },
        notesCurrentPage() {
            return this.$store.state.notesCurrentPage;
        }
    },
    methods: {
        date(dateStr) {
            let dtHrArr = dateStr.split('T');
            let dtArr = dtHrArr[0].split('-');
            let date = dtArr.reverse().join('.');
            let hour = dtHrArr[1].split('.')[0];

            return date + ' ' + hour;
        },
        onClickDelete(noteId) {
            this.deleteBtnEnable = false;

            axios.delete(constants.baseUrl + constants.endpoints.note + `/${noteId}`)
                .then(response => {
                    if (response.status == 204) {
                        this.$store.commit('removeNote', noteId);

                        let noteLength = this.$store.state.notes.length;

                        if (noteLength < 1) {
                            this.$store.commit('setMoreNoteButtonShow', false);
                            this.$store.dispatch('fetchNotes');
                        }
                    }
                })
                .catch(() => this.deleteBtnEnable = true);
        }
    }
}
</script>

<style scoped>
.note-delete-btn {
    padding: .5rem;
    display: none;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .3);
    cursor: pointer;
    position: absolute;
    right: .5rem;
    top: .5rem;
}
    .note-delete-btn:hover {
        background-color: #fff;
    }

@media screen and (max-width: 425px) {
    .note-delete-btn {
        display: block;
    }
}
</style>