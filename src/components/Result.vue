<template>
    <div :class="$style.index">
        <div :class="$style.progressBar">
            <div :class="$style.gauge">
                <div :class="$style.progress"></div>
            </div>
            <div :class="$style.text">100%</div>
        </div>
        <div :class="$style.container">
            <div :class="$style.section">
                <div :class="$style.title">결과</div>

                <div :class="$style.result">
                    {{ result }}
                </div>

                <div :class="$style.buttonBox">
                    <div v-on:click="reTryTest()" :class="$style.button">
                        다시하기
                    </div>
                    <router-link to="/">
                        <div :class="$style.button">처음으로</div>
                    </router-link>
                </div>
                <div v-if="!isLogIn" :class="$style.textBox">
                    <div :class="$style.text">
                        결과를 저장하려면
                        <span :class="$style.underLine"
                            ><router-link
                                :to="`/login?saveResult=${progressToken}`"
                                >로그인</router-link
                            ></span
                        >
                        하세요.
                    </div>
                    <div :class="$style.text"></div>
                </div>
                <div v-if="isLogIn" :class="$style.textBox">
                    <div :class="$style.text">
                        테스트 결과가 저장되었습니다.
                    </div>
                    <div
                        v-on:click="goHistory()"
                        :class="[$style.text, $style.historyLink]"
                    >
                        <span :class="$style.underLine">결과 목록 보기</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from "@/router";
import { Component, Prop, Vue } from "vue-property-decorator";
import { RouterLink } from "vue-router";

@Component({
    components: {},
})
export default class Result extends Vue {
    @Prop() result?: string;
    @Prop() selectTestID?: string;
    @Prop() progressToken?: string;

    accessToken: string = sessionStorage.getItem("accessToken") ?? "";

    get isLogIn(): boolean {
        return this.accessToken != "";
    }

    getTestId(id: string) {
        return id;
    }

    reTryTest() {
        if (this.selectTestID == undefined) {
            return;
        }

        let testURL: string = `/test?selectTest=${this.selectTestID}`;

        if (testURL == this.$route.fullPath) {
            return this.$router.go(0);
            // this.$store.commit("setUrl", testURL);
            // this.$router.push(`/path/finder`);
        }
        return this.$router.push(testURL);
    }

    goHistory() {
        let historyURL: string = `/test/result/history`;

        if (historyURL == this.$route.fullPath) {
            return this.$router.go(0);
            // this.$store.commit("setUrl", historyURL);
            // return this.$router.push(`/path/finder`);
        }
        return this.$router.push(historyURL);
    }

    mounted() {
        if (this.result == undefined) {
            router.push("/");
        }
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: auto;

    .progressBar {
        .gauge {
            width: 100%;
            height: 2px;

            background-color: #63ac9b83;

            .progress {
                width: 100%;
                height: 100%;

                background-color: #63ac9b;
            }
        }

        .text {
            margin-top: 10px;

            font-size: 16px;

            text-align: end;
        }
    }

    .container {
        width: 800px;

        @include setCenter;
        .section {
            margin-top: 80px;

            .title {
                max-width: 500px;

                margin-top: 10px;
                margin-bottom: 40px;

                white-space: pre-wrap;

                font-size: 28px;

                text-align: center;

                @include setCenter;
            }

            .result {
                padding: 20px 24px;

                text-align: center;
                white-space: pre-wrap;
            }

            .buttonBox {
                margin-top: 20px;

                display: flex;

                justify-content: center;

                a {
                    text-decoration: none;
                }
                .button {
                    max-width: 180px;

                    margin: 0 10px;

                    padding: 16px 60px;

                    border-radius: 10px;

                    box-shadow: 0px 0px 1px #727272;

                    text-align: center;

                    color: #000000;

                    &:hover {
                        cursor: pointer;
                        background-color: #72727276;
                    }
                }
            }

            .textBox {
                margin-top: 20px;

                text-align: center;

                .text {
                    .underLine {
                        text-decoration: underline;

                        a {
                            color: black;
                        }
                    }
                }

                .historyLink {
                    margin-top: 5px;
                    a {
                        text-decoration: none;

                        color: #000000;
                    }

                    &:hover {
                        cursor: pointer;
                    }
                }
            }
        }
    }
}
</style>
