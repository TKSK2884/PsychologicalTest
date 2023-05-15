<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <Header />
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
export default class AppView extends Vue {}
</script>
<style lang="scss" module>
.index {
    width: 100%;
    height: auto;

    .container {
        width: 100%;
        height: auto;
    }
}
</style>

<style lang="scss">
* {
    box-sizing: border-box;
    font-family: "Noto Sans KR", sans-serif;
}

html,
body {
    width: 100%;
    height: auto;
    margin: 0;
}
</style>
