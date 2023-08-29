<template>
    <div :class="$style.index">
        <div :class="$style.progressBar">
            <div :class="$style.gauge">
                <div
                    :style="{
                        width: getProgressPercent,
                    }"
                    :class="$style.progress"
                ></div>
            </div>
            <div
                :style="{
                    width: getProgressPercent,
                }"
                :class="$style.text"
            >
                {{ getProgressPercent }}
            </div>
        </div>
        <div :class="$style.container">
            <div :class="$style.section">
                <div
                    v-if="!pendingResult && !resultComplete"
                    :class="$style.mark"
                ></div>
                <div :class="$style.title">
                    {{ getTestTitle }}
                </div>
                <div :class="$style.selectBox">
                    <div
                        v-for="(select, index) in getTestArray"
                        :key="index"
                        :class="$style.box"
                    >
                        <div
                            v-on:click="updateProgress(index)"
                            :class="$style.select"
                        >
                            {{ select.title }}
                        </div>
                    </div>
                    <div v-if="pendingResult" :class="$style.pendigBox">
                        <div :class="$style.pendigText">
                            답변을 생성하는 중...
                        </div>
                        <div class="loadingio-spinner-rolling-5ax215itman">
                            <div class="ldio-r0kv4ehu2ae">
                                <div></div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!resultComplete" :class="$style.resultBox">
                        <Result :result="result" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { api } from "@/api/api";
import { JsonData } from "@/structure/types";
import { Selection } from "@/structure/types";
import Result from "@/components/Result.vue";

@Component({
    components: {
        Result,
    },
})
export default class TestView extends Vue {
    progressToken: string =
        this.$store.state.progressToken ??
        localStorage.getItem("progress_token") ??
        "";
    userId: string = this.$store.state.userId ?? "";
    selectTest: string = (this.$route.query.selectTest ?? "") as string;

    result: string = "";
    pendingResult: boolean = false;
    resultComplete: boolean = false;

    test: JsonData = {
        settings: {
            question_type: 0,
            parameters: [],
        },
        questions: [
            {
                title: "",
                selection: [
                    {
                        title: "",
                    },
                ],
            },
        ],
    };

    progressNumber: number = 0;

    get getProgressPercent(): string {
        if (this.test.questions?.length == 0) return "0%";

        return `${Math.floor(
            (this.progressNumber / this.test.questions?.length) * 100
        )}%`;
    }

    loadTest() {
        api(
            "test",
            "get",
            {
                progressToken: this.progressToken,
                selectTest: this.selectTest,
            },
            this
        )
            .catch(this.loadError)
            .then(this.loadSuccess);
    }

    loadError(err: any) {
        let errorCode = err.response.data.errorCode;

        alert(errorCode);

        if (errorCode == 500) {
            alert("서버 오류");
            return;
        }

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        let token = res.data.token as string;
        this.test = res.data.test;

        if (this.progressToken == "") {
            this.progressToken = token;
        }

        if ((this.progressToken ?? "") == "") return;

        this.$store.commit("setProgressToken", this.progressToken);
        localStorage.setItem("progress_token", `${this.progressToken}`);

        this.$forceUpdate();
    }

    updateProgressApi(selectNumber: number) {
        api(
            "test/update",
            "post",
            {
                token: this.progressToken,
                progress: selectNumber,
            },
            this
        )
            .catch(this.loadError)
            .then(this.updateSuccess);
    }

    updateSuccess(res: any) {
        if (this.test.questions?.length == this.progressNumber) {
            this.pendingResult = true;
            this.resultApi();
            localStorage.removeItem("progress_token");
            this.$store.commit("setProgressToken", undefined);
            return;
        }
    }

    resultApi() {
        api(
            "test/result",
            "post",
            {
                token: this.progressToken,
                user_id: this.userId,
            },
            this
        )
            .catch(this.loadError)
            .then(this.resultSuccess);
    }

    resultSuccess(res: any) {
        this.result = res.data.result ?? "";

        this.pendingResult = false;
        this.resultComplete = true;

        this.$forceUpdate();
    }

    get getTestTitle(): string {
        if (Object.keys(this.test.questions).length == 0) {
            return "";
        }

        let title: string =
            this.test.questions[this.progressNumber]?.title ?? "";

        if (this.resultComplete) {
            return "결과";
        }

        return title;
    }

    updateProgress(selectNumber: number) {
        if (this.test.questions?.length == this.progressNumber) {
            return;
        }

        this.updateProgressApi(selectNumber);

        this.progressNumber += 1;
    }

    get getTestArray(): Selection[] {
        if (this.test.questions?.length == 0) return [];

        if (this.test.questions?.length == this.progressNumber) {
            return [];
        }

        return this.test.questions[this.progressNumber]?.selection;
    }

    mounted() {
        this.loadTest();
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

        margin-left: auto;
        margin-right: auto;

        .section {
            margin-top: 80px;

            .mark {
                width: 50px;
                height: 50px;

                background-image: url("/src/assets/question-and-answer.png");
                background-repeat: no-repeat;
                background-size: cover;
                background-position: center;

                @include setCenter;
            }

            .title {
                max-width: 500px;

                margin-top: 10px;
                margin-bottom: 40px;

                white-space: pre-wrap;

                font-size: 28px;

                text-align: center;

                @include setCenter;
            }

            .selectBox {
                .box {
                    width: 400px;

                    @include setCenter;

                    .select {
                        margin-top: 10px;

                        padding: 20px 24px;

                        text-align: center;

                        border-radius: 5px;

                        box-shadow: 0px 0px 1px #727272;
                    }
                }
                .pendigBox {
                    margin-top: 10px;

                    text-align: center;
                    .pendigText {
                        padding: 10px 24px;

                        font-size: 24px;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
@keyframes ldio-r0kv4ehu2ae {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
.ldio-r0kv4ehu2ae div {
    position: absolute;
    width: 50px;
    height: 50px;
    border: 6px solid #666666;
    border-top-color: transparent;
    border-radius: 50%;
}
.ldio-r0kv4ehu2ae div {
    animation: ldio-r0kv4ehu2ae 0.5434782608695652s linear infinite;
    top: 100px;
    left: 100px;
}
.loadingio-spinner-rolling-5ax215itman {
    width: 200px;
    height: 200px;
    display: inline-block;
    overflow: hidden;
    background: none;
}
.ldio-r0kv4ehu2ae {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
}
.ldio-r0kv4ehu2ae div {
    box-sizing: content-box;
}
/* generated by https://loading.io/ */
</style>
