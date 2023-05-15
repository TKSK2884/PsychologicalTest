<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.title">Test List</div>
            <div :class="$style.linkSection">
                <div :class="$style.box">
                    <router-link :to="`/test?selectTest=${selectedTest}`">
                        <div v-on:click="selectTest()" :class="$style.link">
                            심리테스트 시작하기
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { api } from "@/api/api";
import { Store } from "vuex";
import { RouterLink } from "vue-router";

@Component({
    components: {},
})
export default class HomeView extends Vue {
    selectedTest: string = "";

    selectTest() {
        this.selectedTest = "1";
    }

    mounted() {
        let accessToken: string = localStorage.getItem("token") ?? "";
        let userId: string = localStorage.getItem("user_id") ?? "";

        if (accessToken != "" && userId != "") {
            this.$store.commit("setAccessToken", accessToken);
            this.$store.commit("setUserId", userId);

            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
        }
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: auto;

    .container {
        max-width: 1080px;
        margin-left: auto;
        margin-right: auto;

        .title {
            margin-top: 20px;

            font-size: 24px;

            text-align: center;
        }

        .linkSection {
            display: flex;

            .box {
                padding: 12px 20px;
                margin-top: 20px;

                border: 1px solid #727272;
                border-radius: 5px;

                @include setCenter;

                .link {
                    width: 100%;
                    height: 100%;

                    font-size: 24px;

                    text-align: center;
                }
            }

            a {
                text-decoration: none;

                color: #101010;
            }
        }

        .input {
            padding: 20px;
        }

        .button {
            padding: 20px;
        }
    }
}
</style>
