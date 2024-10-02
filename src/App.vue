<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.headerSection" v-if="isHeaderEnable">
                <Header />
            </div>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Header from "@/components/Header.vue";
import router from "./router";
import { watch } from "vue";

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

    .container {
        width: 100%;
        height: auto;

        .headerSection {
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

.ldio-r0kv4ehu2ae div {
    position: absolute;

    width: 50px;
    height: 50px;

    border: 6px solid #666666;
    border-top-color: transparent;
    border-radius: 50%;

    z-index: 350;
}
.ldio-r0kv4ehu2ae div {
    animation: ldio-r0kv4ehu2ae 0.5434782608695652s linear infinite;
    top: 100px;
    left: 100px;
}

.loadingio-spinner-rolling-5ax215itman {
    width: 200px;
    height: 200px;

    margin-inline: auto;

    display: block;
    overflow: hidden;
    background: none;
}
.ldio-r0kv4ehu2ae {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0;
}
.ldio-r0kv4ehu2ae div {
    box-sizing: content-box;
}

@keyframes ldio-r0kv4ehu2ae {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
