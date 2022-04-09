<template>
    <div class="card">
        <form class="form-group">
            <textarea v-model="comment.content" name="content" class="form-row__input form-control comment-section" type="text" placeholder="Publier un commentaire"  rows="3"/>
        </form>
        <div class="comment_interaction">
            <div>
                <button @click="postComment()" type="submit" class="btn btn-secondary likeBtn">Publier le commentaire</button>
            </div>
            <!-- Apparition du bouton supprimer le post si utilisateur connecté est admin ou auteur du post -->
                <button @click="deletePost()" v-if="$store.state.isAdmin == true || $store.state.user.infos.id == postUserId" class="btn btn-danger">Supprimer le post</button>
            <div>
                <!-- Par défaut le bouton like est affiché et enclenche un like, si le post à déjà été liké par l'utilisateur cliquer sur le bouton fera apparaitre le bouton supprimer le like -->
                <button :hidden='!isActive' @click="likedAction()" class="btn like-btn btn-primary"><div class="like-icone"><font-awesome-icon icon="thumbs-up"/></div></button>
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
                post: {
                    title: null,
                    content: null,
                    attachment: null,
                    id: null,
                    userId: null,
                },
                comment: {
                    content: null,
                    postId: null,
                    userId: null,
                },
                users: {},
                isActive : true,
            }
        },
        props: {
        postId: Number,
        postUserId: Number,
        userFirstName: String,
        userLastName: String
    },
        mounted: function() {  
            axios
            .get('http://localhost:3000/comments')
            .then((res) => {
                this.comments = res.data;
            });
            this.$store.dispatch('getUserInfos');
            this.userId = JSON.parse(localStorage.getItem("user"));
            // Récupération des utilisateur par leur id
            axios
                .get('http://localhost:3000/users/me')
                .then((res) => {
                    this.users = res.data.reduce((acc, value) => {
                        acc[value.id] = value
                        return acc
                    }, {});
                });
            },
        methods: {
            // Méthode de création d'un nouveau commentaire
            postComment: function () {
                const comment = { 
                    content: this.comment.content,
                    postId: this.postId,
                };
                this.$store.dispatch('postComment', comment)
                .then(window.location.reload()
                , function (error) {
                    console.log(error)
                })
            },
            // Liker un post
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
            // Supprimer son like
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
            },
            // Supprimer un post
            deletePost: function () {
                let postId = this.postId
                this.$store.dispatch('deletePost', postId)
                window.location.reload();
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