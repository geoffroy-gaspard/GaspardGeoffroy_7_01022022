<template>
    <div class="posts">
        <div :key="index" v-for="(posts, index) in posts" class="allPosts card text-center">
            <h3 class="post_card_title card-header">{{ posts.title }}</h3>
            <div class="attachment card-body"><img v-if="posts.attachment" class="attachment_link" :src="'http://localhost:3000/uploads/' + posts.attachment" alt="post image"></div>
            <p v-if="posts.content" class="post_card_content card-text">{{ posts.content }}</p>
            <div class="form-row">
                    <div class="form-group">
                        <textarea name="content" class="form-row__input form-control comment-section" type="text" placeholder="Publier un commentaire"  rows="3"/>
                    </div>
                <div class="card-footer comment_section_like">
                <div class="text-muted">Créé le {{ posts.createdAt }}</div>
                <button @click="postComment()" type="submit" class="btn btn-secondary">Publier le commentaire</button>
                <p class="post_card_content">0 likes</p>
                <button class="btn like-btn btn-primary"><div class="icone"><font-awesome-icon icon="thumbs-up"/></div></button>
                </div>
                <div :key="index" v-for="(comments, index) in comments" class="post_card_content">
                <p class="post_card_content" v-if="posts.id == comments.post_id">{{ comments.content }}<br> posté le {{ comments.createdAt }}</p>
            </div>
            <div>
            <button v-if="posts == null" class="btn btn-outline-primary">Publier</button>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: 'post',
        data() {
            return {
                posts: {
                    title: null,
                    content: null,
                    attachment: null,
                    id: null
                },
                comments: {
                    content: null
                },
                user: {
                    first_name: null,
                    last_name: null,
                    userId: null
                },
            }
        },
        created() {
            axios
                .get("http://localhost:3000/posts")
                .then((res) => {
                    this.posts = res.data;
                    console.log(this.posts);

                });
            axios
                .get("http://localhost:3000/users/me")
                .then((res) => {
                    this.users = res.data;
                    console.log(this.users);
                })
        },
        mounted: function() {  
            axios
                .get('http://localhost:3000/comments')
                .then((res) => {
                this.comments = res.data;
                console.log(this.comments);
            });
        },
        methods: {
            postComment() {
                axios
                .post('http://localhost:3000/comments', this.comments, {
                    params: {
                        user_id: this.user.id,
                        postId: this.posts.id,
                        content: this.content
                    }
                })
                .then((result) => {
                    console.log(result)
                })
            }
        }
    }
</script>
<style scoped>
    .posts {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .allPosts { 
        width: 70%;
        margin: 3% 0 3% 0;
        background-color: white;
        min-height: 240px;
        height: auto;
        border: 5px solid white;
        border-radius: 20px/20px;
        box-shadow: 0px 0px 12px 3px #d2d2d2;
    }

    .post_card_title {
        display: flex;
        margin: 5px 0 5px 0;
        justify-self: center;
    }

    .attachment {
        width: auto;
        height: 150px;
        max-height: 60%;
    }

    .attachment_link {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
    }

    .post_card_content {
        margin: 5px 0 5px 0;
    }

    .post_card_creation {
        font-size: 9px;
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
    .icone {
    height: 30px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 40px/40px;
    background-color: #277ceb;
    color: #DEEBFF;
    }
    .like-btn:hover > .icone {
        background-color: #0b5ed7;
        border-color: #0a58ca;
    }
</style>