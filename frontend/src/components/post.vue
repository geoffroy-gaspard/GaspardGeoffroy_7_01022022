<template>
    <div class="posts">
        <div :key="post.id" v-for="post in posts" class="allPosts card text-center">
            <h3 class="post_card_title card-header">{{ post.title }}</h3>
            <div class="attachment card-body"><img v-if="post.attachment" class="attachment_link" :src="'http://localhost:3000/uploads/' + post.attachment" alt="post image"></div>
            <p v-if="post.content" class="post_card_content card-text">{{ post.content }}</p>
            <comment v-bind:postId='post.id' @name="getPostId">
                <template v-slot:like>
                    <div class="card-footer comment_section_like">
                        <div class="text-muted">Créé le {{ post.createdAt }}</div>
                        <p class="post_card_content">0 likes</p>
                        <button class="btn like-btn btn-primary"><div class="icone"><font-awesome-icon icon="thumbs-up"/></div></button>
                    </div>
                </template>
            </comment>
            <div :key="comment.id" v-for="comment in comments" class="post_card_content">
                <p class="post_card_content" v-if="post.id == comment.post_id">{{ comment.content }}<br> posté le {{ comment.createdAt }}</p>
            </div>
        </div>
        <div>
            <button v-if="post == null" class="btn btn-secondary">Publier un nouvel article</button>
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
                    userId: null,
                    comments: null
                },
                comment: {
                    content: null,
                    postId: null,
                    userId: null
                },
                posts : [],
                comments: []
            }
        },
        created() {
            axios
                .get("http://localhost:3000/posts")
                .then((res) => {
                    this.posts = res.data;
                    console.log(this.posts);
                });
            this.$store.dispatch('getPosts');
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
        computed: {
        ...mapState({ user: 'userInfos' })
    },
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