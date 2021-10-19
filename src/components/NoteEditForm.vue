<template>
    <div @click.self="closeModal()" class="modal-back fade-in-anim-500ms">
        <div class="editform-container">
            <button @click="closeModal()" class="close-button"><span class="material-icons">close</span></button>
            <form @submit.prevent="onSubmit()" class="edit-form">
                <!-- Error Message -->
                <h4 v-if="errorMessage" class="error-message">{{errorMessage}}</h4>

                <!-- Title -->
                <label for="title">Title</label>
                <input v-model.trim="title" type="text" id="title" maxlength="150">

                <!-- Color Select -->
                <NoteColorSelect :colors="systemNoteColors" :initialColor="initialColor" />

                <!-- Description -->
                <label for="description">Description</label>
                <textarea v-model.trim="description" id="description" rows="10"></textarea>

                <!-- Submit Button -->
                <input :disabled="saveBtnDisabled" :class="{'btn-disabled': saveBtnDisabled}" class="blue-button" type="submit" value="SAVE">
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import constants from '../constants';
import NoteColorSelect from '@/components/NoteColorSelect';
import axios from 'axios';

export default {
    name: 'NoteEditForm',
    components: {
        NoteColorSelect
    },
    data() {
        return {
            systemNoteColors: constants.NOTE_COLORS,
            title: null,
            description: null,
            saveBtnDisabled: false,
            errorMessage: null,
        }
    },
    mounted() {
        // Fill fields with selected note infos
        if (this.selectedNote) {
            if (this.selectedNote.title) this.title = this.selectedNote.title;
            if (this.selectedNote.description) this.description = this.selectedNote.description;
            if (this.selectedNote.color) this.$store.commit('setSelectedNoteColor', this.selectedNote.color);
        }
    },
    computed: {
        ...mapState([
            'selectedNote',
            'notesCurrentPage',
            'selectedNoteColor',
            'notesPageLimit',
            'notesCurrentPage',
            'notes'
        ]),
        initialColor() {
            return this.selectedNote ? this.selectedNote.color : constants.NOTE_COLORS.WHITE;
        }
    },
    methods: {
        ...mapActions([
            'toggleNoteEditForm',
            'addNote',
            'fetchNotes'
        ]),
        closeModal() {
            this.toggleNoteEditForm();
        },
        onSubmit() {
            if (!this.title && !this.description) {
                this.errorMessage = 'Title or description mustn\'t be empty.';
            } else {
                this.errorMessage = null;
                this.saveBtnDisabled = true;

                const note = {
                    title: this.title,
                    description: this.description,
                };
                
                const selectedColor = this.selectedNoteColor;

                if (selectedColor)
                    note.color = selectedColor;
                
                /*
                ** If a note card has been selected, update it
                ** otherwise create new note
                */
                if (this.selectedNote) {
                    note.id = this.selectedNote.id;
                    note.color = selectedColor || this.selectedNote.color;

                    const createdAt = this.selectedNote.createdAt;
                    const updatedAt = this.selectedNote.updatedAt;

                    axios.put(constants.baseUrl + constants.endpoints.note + `/${note.id}`, note)
                        .then(result => {
                            if (result.status == 204) {
                                this.toggleNoteEditForm();
                                this.$store.commit('changeNote', {
                                    ...note,
                                    createdAt,
                                    updatedAt
                                });
                            } else {
                                this.setErrorMessage(constants.INTERNAL_SERVER_ERROR);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            this.setErrorMessage(constants.INTERNAL_SERVER_ERROR);
                        })
                        .finally(() => this.saveBtnDisabled = false);
                } else {
                    axios.post(constants.baseUrl + constants.endpoints.note, note)
                        .then(result => {
                            if (result.status == 201) {
                                this.toggleNoteEditForm();
                                this.$store.commit('addNotesToStart', [result.data]);

                                if (this.notes.length > this.notesCurrentPage * this.notesPageLimit) {
                                    this.fetchNotes();
                                }
                            } else {
                                this.setErrorMessage(constants.INTERNAL_SERVER_ERROR);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            this.setErrorMessage(constants.INTERNAL_SERVER_ERROR);
                        })
                        .finally(() => this.saveBtnDisabled = false);
                }
            }
        },
        setErrorMessage(message) {
            this.errorMessage = message;
        },
    }
}
</script>

<style scoped>
.editform-container {
    background-color: #fff;
    padding: 1rem;
    border-radius: 5px;
    position: fixed;
    top: 0;
    left: 0;
    margin: 15vh 25vw;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 50vw;
    height: 70vh;
}

.error-message {
    padding: .5rem;
    background-color: #ff0000;
    color: #fff;
    font-size: .8rem;
}

@media screen and (max-width: 425px) {
    .editform-container {
        margin: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
    }

    .edit-form {
        width: 100%;
        height: 100%;
    }
}
</style>