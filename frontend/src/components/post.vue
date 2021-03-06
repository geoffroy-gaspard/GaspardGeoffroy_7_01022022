<template>
    <div class="posts">
        <div class="allPosts text-center new_post">
            <input v-model="post.title" class="form-row__input" type="text" placeholder="Titre" />
            <textarea v-model="post.content" class="form-row__input form-control comment-section" type="text" placeholder="Publier un nouveau message" />
            <!-- Formulaire pour un nouveau post, si une image à été uploadé elle est ajoutée au formulaire, un message apparait et l'option d'ajout d'image disparait -->
            <form @submit.prevent="uploadImage()" v-if="this.image_url == null">
                <input type="file" name="filename" @change="onFileSelected($event)">
                <button class="btn btn-secondary">Ajouter une image</button>
            </form>
            <p v-else>Image Ajoutée !</p>
            <button @click="newPost()" class="btn btn-secondary">Publier un nouvel article</button>
        </div>
        <!-- Mise en pages de tout les posts -->
        <div :key="post.id" v-for="post in posts" class="allPosts card text-center">
            <h3 class="post_card_title card-header">{{ post.title }}</h3>
            <div  v-if="post.attachment !== null" class="attachment"><img class="attachment_link" :src="'http://localhost:3000/uploads/' + post.attachment" alt="post image"></div>
            <p v-if="post.content" class="post_card_content card-body card-text">{{ post.content }}</p>
            <comment v-bind:postId='post.id' v-bind:postUserId="post.user_id" v-bind:userFirstName="users[post.user_id].first_name" v-bind:userLastName="users[post.user_id].last_name">
                <template v-slot:like>
                    <div class="card-footer comment_section_like">
                        <div class="text-muted">Créé le {{ post.createdAt | moment("DD.MM.YY") }} à {{ post.createdAt | moment("HH:mm") }} par {{users[post.user_id].first_name}} {{users[post.user_id].last_name}}</div>
                        <p class="post_card_content">{{ post.likes }} likes</p>
                    </div>
                </template>
            </comment>
            <div class="post_card_content comment_content">
                <!-- Mise en page des commentaires de chaque post -->
                <div :key="comment.id" v-for="comment in comments">
                    <p class="post_card_content comment__content--section" v-if="post.id == comment.post_id">{{ comment.content }}<br> posté le {{ comment.createdAt | moment("DD.MM.YY") }} à {{ comment.createdAt | moment("HH:mm")  }} de {{users[comment.user_id].first_name}} {{users[comment.user_id].last_name}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import { mapState } from 'vuex';
    import comment from '@/components/comment.vue'

    export default {
        name: 'post',
        components: {
            comment
    },
        data() {
            return {
                post: {
                    title: null,
                    content: null,
                    attachment: null,
                    id: null,
                    userId: null
                },
                comment: {
                    content: null,
                    postId: null,
                    userId: null
                },
                users: {},
                posts: [],
                comments: [],
                selectedFile: null,
                image_url: JSON.parse(localStorage.getItem("image_url"))
            }
        },
        created() {
            // Récupération des utilisateurs par leur id
            axios
                .get('http://localhost:3000/users/me')
                .then((res) => {
                    this.users = res.data.reduce((acc, value) => {
                        acc[value.id] = value
                        return acc
                    }, {});
                });
            // Récupération des posts
            axios
                .get("http://localhost:3000/posts")
                .then((res) => {
                    this.posts = res.data;
                });
        },
        mounted: function() {
            // Récupération des commentaires
            axios
                .get('http://localhost:3000/comments')
                .then((res) => {
                    this.comments = res.data;
                });
            this.userId = JSON.parse(localStorage.getItem("user"));
        },
        computed: {
        ...mapState({ user: 'userInfos' })
        },
        methods: {
            // Méthode de création d'un nouveau post
            newPost: function () {
                // Si une image est attaché au post
                if (localStorage.image_url) {
                    this.image_url = JSON.parse(localStorage.getItem("image_url"));
                    const post = {
                    title: this.post.title,
                    content: this.post.content,
                    image_url: this.image_url.url
                }
                this.$store.dispatch('newPost', post)
                .then(window.location.reload(),
                localStorage.removeItem('image_url')
                , function (error) {
                    console.log(error)
                })
                } else {
                    // Si le post ne contient aucune image
                    const post = {
                        title: this.post.title,
                        content: this.post.content
                    }
                    this.$store.dispatch('newPost', post)
                .then(window.location.reload(),
                localStorage.removeItem('image_url')
                , function (error) {
                    console.log(error)
                })
                }
            },
            onFileSelected(event) {
                this.selectedFile = event.target.files[0]
            },
            // Méthode d'ajout d'une image à un nouveau post
            uploadImage: function () {
                const fd = new FormData();
                fd.append('image', this.selectedFile, this.selectedFile.name)
                this.$store.dispatch('uploadImage', fd)
                .then(res => {
                    console.log(res)
                });
            }
        },
    }
</script>
<style scoped>
    .posts {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        background-color: #f0f2f5;
        background-image: url(../assets/background2.jpg);
        background-size: auto;
        background-repeat: repeat;
        background-position: center;
        opacity: 0.85;
    }

    .allPosts { 
        width: 80%;
        margin: 3% 0 3% 0;
        background-color: white;
        min-height: 240px;
        height: auto;
        border: 5px solid #ffffff;
        box-shadow: 0px 0px 2px 2px #9e9fa0;
    }

    .post_card_title {
        display: flex;
        justify-self: center;
        justify-content: space-between;
    }

    .attachment {
        width: auto;
        height: 400px;
        max-height: 60%;
    }

    .attachment_link {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .post_card_content {
        margin: 5px 0 5px 0;
    }

    .post_card_creation {
        font-size: 9px;
    }
    .new_post {
        order: 99;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .comment-section {
        width: 100%;
        height: 100px;
        resize: none;
    }
    .comment_section_like {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .comment_content {
        display: flex;
        flex-direction: column-reverse;
        flex-wrap: nowrap;
        justify-content: space-between;
    }
    .comment__content--section {
        background: rgb(240, 242, 245, 0.85);
    }
    .like-btn{
        height: 50px;
        width: 50px;
        border: 3px solid #DEEBFF;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4rem/4rem;
        background-color: #277ceb;
        color: #DEEBFF;
        align-self: flex-end;
    }
    .dislike-btn{
        height: 50px;
        width: 50px;
        border: 3px solid #DEEBFF;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4rem/4rem;
        background-color: #c71212;
        color: #DEEBFF;
        align-self: flex-end;
    }
    .like-icone {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px/40px;
    background-color: #277ceb;
    color: #DEEBFF;
    }
    .dislike-icone {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px/40px;
    background-color: #c71212;
    color: #DEEBFF;
    }
    .like-btn:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
    }
    .like-btn:hover > .icone {
        background-color: #0b5ed7;
        border-color: #0a58ca;
    }
</style>