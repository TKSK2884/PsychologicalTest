<template>
    <div :class="$style.index">
        <div :class="$style.loading">
            <div class="loadingio-spinner-rolling-5ax215itman">
                <div class="ldio-r0kv4ehu2ae">
                    <div />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";

export default class LoadingIndicater extends Vue {}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: 100%;

    > .loading {
        @include loading;
    }
}
</style>
