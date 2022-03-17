<template>
    <div class="card">
        <form class="form-group">
            <textarea v-model="content" name="content" class="form-row__input form-control comment-section" type="text" placeholder="Publier un commentaire"  rows="3"/>
        </form>
        <div class="comment_interaction">
            <div>
                <button @click="postComment()" type="submit" class="btn btn-secondary likeBtn">Publier le commentaire</button>
            </div>
            <div>
                <button @click="likedAction()" class="btn like-btn btn-primary"><div class="like-icone"><font-awesome-icon icon="thumbs-up"/></div></button>
                <button :hidden='isActive' @click="dislikedAction()" class="btn dislike-btn btn-danger">Supprimer le like</button>
            </div>
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
                isActive : '',
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
            console.log(this.userId)
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
            likedAction: function() {
            this.isActive = false,
            axios
                .get(`http://localhost:3000/likes/${this.postId}/like`, {
                    headers: {
                        'Authorization': `Bearer ${this.userId.token}`
                    }
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(function () {
                });
            },
            dislikedAction: function() {
            axios
                .get(`http://localhost:3000/likes/${this.postId}/dislike`, {
                    headers: {
                        'Authorization': `Bearer ${this.userId.token}`
                    }
                })
                .then(() => {
                    window.location.reload()
                })
                .catch(function () {
                });
            }
        },
    }
</script>

<style scoped>

.comment_interaction {
    display: flex;
    justify-content: space-around;
}

</style>