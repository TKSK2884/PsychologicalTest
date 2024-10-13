<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div v-if="isHeaderEnable" :class="$style.header">
                <Header />
            </div>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Header from "@/components/Header.vue";

@Component({
    components: {
        Header,
    },
})
export default class AppView extends Vue {
    isHeaderEnable: boolean = true;

    @Watch("$route")
    onRouteChange() {
        if (this.$route.path != "/") {
            this.isHeaderEnable = true;
        } else {
            this.isHeaderEnable = false;
        }
    }

    @Watch("$store.state.pageTitle")
    onTitleChange() {
        document.title = this.$store.state.pageTitle;
    }

    mounted() {
        this.onRouteChange();

        document.title = this.$store.state.pageTitle;
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: auto;

    > .container {
        width: 100%;
        height: auto;

        > .header {
            width: 100%;
            height: auto;
        }
    }
}
</style>

<style lang="scss">
* {
    box-sizing: border-box;
    // font-family: "Noto Sans KR", sans-serif;

    font-family: "Pretendard-Regular", sans-serif;
}

html,
body {
    width: 100%;
    height: auto;
    margin: 0;
}
</style>
