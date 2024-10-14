<template>
    <div :class="$style.index">
        <div :class="$style.container" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {},
})
export default class PathFinderView extends Vue {
    storeUrl: string = this.$store.state.url ?? "";

    mounted() {
        if (this.storeUrl != "") {
            this.$store.commit("setUrl", undefined);
            return this.$router.push(this.storeUrl);
        }
        return this.$router.push("/");
    }
}
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: auto;
    > .container {
        width: 100%;
        height: auto;
    }
}
</style>
