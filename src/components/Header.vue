<template>
    <div :class="[$style.index, 'general-background-color']">
        <div :class="$style.container">
            <div :class="$style.navigation">
                <div :class="[$style.section]">
                    <router-link :to="`/`">
                        <div :class="$style.box">
                            <div :class="$style.logo"></div>
                            <div
                                v-on:click="cleanLocalStorage()"
                                :class="$style.link"
                            >
                                GPTMind
                            </div>
                        </div>
                    </router-link>

                    <div :class="[$style.text, $style.selectTest]">
                        {{ selectedTest }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {},
})
export default class Header extends Vue {
    selectedTest: string = "default";

    get isLogIn(): boolean {
        return this.$store.state.accesToken != undefined;
    }
    logout() {
        this.$store.commit("setAccessToken", undefined);
        this.$store.commit("setUserId", undefined);
    }
    cleanLocalStorage() {
        localStorage.clear();
        this.$store.commit("setProgressToken", undefined);
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    .container {
        max-width: 1080px;
        height: 80px;

        padding: 20px;

        @include setCenter;

        .title {
            display: inline-block;
        }

        .navigation {
            display: flex;

            a {
                text-decoration: none;
            }

            .section {
                display: flex;
            }
            .box {
                display: flex;
                .logo {
                    padding: 20px;

                    margin-right: 4px;

                    background-image: url("@/assets/logo.png");
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                .link {
                    padding: 0px 24px;

                    font-size: 32px;

                    color: black;
                }
            }
            .selectTest {
                padding: 16px 32px;

                font-size: 24px;

                color: #ffffff;
            }
        }
    }
}
</style>
