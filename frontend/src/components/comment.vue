<template>
    <div class="card">
        <slot name="text"></slot>
        <slot name="like"></slot>
    </div>
</template>

<script>
export default {
    name: 'comment',
    data () {
            return {
                comments: {
                    content: '',
                    post_id: '',
                },
            }
        },
}
</script>

<style scoped>

</style>