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

    mounted() {
        this.onRouteChange();
    }
}
</script>

<style lang="scss" module>
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
@import "@/assets/utils.scss";

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
