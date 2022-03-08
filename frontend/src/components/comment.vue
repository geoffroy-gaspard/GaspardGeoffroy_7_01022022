<template>
    <div class="card">
        <form class="form-group">
            <textarea v-model="content" name="content" class="form-row__input form-control comment-section" type="text" placeholder="Publier un commentaire"  rows="3"/>
        </form>
        <div>
            <button @click="postComment()" type="submit" class="btn btn-secondary">Publier le commentaire</button>
        </div>
        <slot name="like"></slot>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'comment',
        data () {
            return {
                posts: {
                    title: null,
                    content: null,
                    attachment: null,
                    id: null,
                    userId: null,
                    comments: null
                },
                comments: {
                    content: null,
                    postId: null,
                    userId: null
                },
            }
        },
        props: {
        postId: Number
    },
        mounted: function() {  
            axios
            .get('http://localhost:3000/comments')
            .then((res) => {
                this.comments = res.data;
                console.log(this.comments);
            });
            this.$store.dispatch('getComments');
            this.userId = JSON.parse(localStorage.getItem("user"));
            },
        methods: {
            postComment: function () {
                this.$store.dispatch('getPosts');
                const comment = { 
                    content: this.content,
                    postId: this.postId,
                };
                this.$store.dispatch('postComment', comment)
                .then(window.location.reload()
                , function (error) {
                    console.log(error)
                })
            },
        },
    }
</script>

<style scoped>

</style>