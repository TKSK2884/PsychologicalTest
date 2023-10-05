<template>
    <div :class="$style.index">
        <div v-if="!resultComplete" :class="$style.progressBar">
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
            <div v-if="!resultComplete" :class="$style.section">
                <div v-if="!pendingResult" :class="$style.mark"></div>
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
                </div>
            </div>
            <div v-if="resultComplete" :class="$style.resultBox">
                <Result
                    :result="result"
                    :selectTestID="selectTest"
                    :progressToken="progressToken"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { api } from "@/api/api";
import { JsonData } from "@/structure/types";
import { Selection } from "@/structure/types";
import Result from "@/components/Result.vue";
import { errorMessage } from "@/utils/errorMessage";

@Component({
    components: {
        Result,
    },
})
export default class TestView extends Vue {
    accessToken: string = sessionStorage.getItem("accessToken") ?? "";
    selectTest: string = (this.$route.query.selectTest ?? "") as string;
    progressToken: string =
        localStorage.getItem(`progressToken=${this.selectTest}`) ?? "";
    progress: string = "";
    progressID: string = "";

    selectedTest: string = "";

    result: string = "";
    pendingResult: boolean = false;
    resultComplete: boolean = false;

    test: JsonData | null = null;

    progressNumber: number = 0;

    @Watch("test")
    onTestChange() {
        if (this.test == null) {
            this.$store.commit("setIsLoading", true);
        } else {
            this.$store.commit("setIsLoading", false);
        }

        this.$forceUpdate();
    }

    get getProgressPercent(): string {
        if (this.test == null) return "0%";

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
                progressID: this.progressID,
            },
            this
        )
            .catch(this.loadError)
            .then(this.loadSuccess);
    }

    loadError(err: any) {
        let errorCode = err.response.data.errorCode;

        let alertErrorMessage: string = errorMessage(errorCode);

        alert(alertErrorMessage);

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        let token = res.data.token as string; //진행도 토큰

        this.test = res.data.test as JsonData;

        let testName: string = res.data.test_name as string;

        if (this.progressToken == "") {
            this.progressToken = token;
        }

        if ((this.progressToken ?? "") == "") return;

        this.progress = res.data.progress ?? "";

        if (this.progress != "") {
            this.progressNumber = this.progress.length;

            if (this.test == null) {
                return;
            }

            if (this.progressNumber > this.test.questions?.length ?? 0) {
                this.progressNumber = this.test.questions?.length ?? 0;
            }
        }

        localStorage.setItem(
            `progressToken=${this.selectTest}`,
            `${this.progressToken}`
        );

        this.$store.commit("setSelectedTestName", testName);

        this.$forceUpdate();
    }

    updateProgressApi(selectNumber: number) {
        api(
            "test/update",
            "post",
            {
                token: this.progressToken,
                progress: selectNumber,
                selectTest: this.selectTest,
            },
            this
        )
            .catch(this.loadError)
            .then(this.updateSuccess);
    }

    updateSuccess(res: any) {
        if (this.test == null) return;

        if (this.test.questions?.length == this.progressNumber) {
            this.pendingResult = true;
            this.resultApi();

            localStorage.removeItem(`progressToken=${this.selectTest}`); // 진행도 토큰 삭제

            return;
        }
    }

    resultApi() {
        api(
            "test/result",
            "post",
            {
                progressToken: this.progressToken,
                accessToken: this.accessToken,
                selectTest: this.selectTest,
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
        if (this.test == null) return "";

        if (Object.keys(this.test.questions).length == 0) {
            return "테스트를 불러오는데 실패했습니다.";
        }

        let title: string =
            this.test.questions[this.progressNumber]?.title ?? "";

        if (this.resultComplete) {
            return "";
        }

        return title;
    }

    updateProgress(selectNumber: number) {
        if (this.test == null) return;

        if (this.test.questions?.length == this.progressNumber) {
            return;
        }

        this.updateProgressApi(selectNumber);

        this.progressNumber += 1;
    }

    get getTestArray(): Selection[] {
        if (this.test == null) return [];

        if (this.test.questions?.length == 0) return [];

        if (this.test.questions?.length == this.progressNumber) {
            return [];
        }

        return this.test.questions[this.progressNumber]?.selection;
    }

    mounted() {
        this.loadTest();
    }

    beforeDestroy() {
        this.$store.commit("setSelectedTestName", undefined);
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
        @include setCenter;

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

                        :hover {
                            background-color: #63ac9b;
                            color: #ffffff;
                        }
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

<style lang="scss"></style>
