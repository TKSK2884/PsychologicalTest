<template>
    <div :class="[$style.index, 'general-background-color']">
        <div :class="$style.container">
            <div :class="$style.linkSection">
                <div :class="[$style.box, $style.leftBox]">
                    <router-link :to="`/`">
                        <div
                            v-on:click="cleanLocalStorage()"
                            :class="$style.link"
                        >
                            Main
                        </div>
                    </router-link>
                </div>

                <div :class="[$style.box, $style.rightBox]">
                    <router-link v-if="isLogIn" :to="`/test/result/history`">
                        <div :class="$style.link">history</div>
                    </router-link>
                    <router-link v-if="isLogIn" :to="`/`">
                        <div v-on:click="logout()" :class="$style.link">
                            Logout
                        </div>
                    </router-link>

                    <div :class="$style.coverLink" v-else>
                        <router-link :to="`/login`">
                            <div :class="$style.link">Login</div>
                        </router-link>

                        <router-link :to="`/join`">
                            <div :class="$style.link">Join</div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
    components: {},
})
export default class Header extends Vue {
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
    border-bottom: 1px solid #dbdbdb;

    background-color: #6e6e6e;

    .container {
        max-width: 1080px;
        height: 80px;

        padding: 12px;

        @include setCenter;

        .title {
            display: inline-block;
        }

        .linkSection {
            display: flex;

            a {
                text-decoration: none;
            }

            .box {
                width: 50%;

                display: flex;
            }

            .box.rightBox {
                justify-content: end;
            }

            .coverLink {
                display: flex;
            }

            .link {
                padding: 16px 12px;

                font-size: 16px;

                color: #ffffff;
            }
        }
    }
}
</style>
