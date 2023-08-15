<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.section">
                <div :class="$style.title">
                    {{ getTestTitle }}
                </div>
                <div :class="$style.selectBox">
                    <div
                        v-for="(select, index) in getTestArray()"
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
                    <div v-if="checkResult" :class="$style.result">
                        {{ result }}
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

@Component({
    components: {},
    computed: {},
})
export default class TestView extends Vue {
    progressToken: string =
        this.$store.state.progressToken ??
        localStorage.getItem("progress_token") ??
        "";
    userId: string = this.$store.state.userId ?? "";
    selectTest: string = (this.$route.query.selectTest ?? "") as string;

    result: string = "";
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

    mounted() {
        this.loadTest();
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

        this.resultComplete = true;

        this.$forceUpdate();
    }

    get checkResult(): boolean {
        return this.result != "";
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

        if (title === "") {
            return "결과를 기다려주세요";
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

    getTestArray() {
        if (this.test.questions?.length == 0) return [];

        if (this.test.questions?.length == this.progressNumber) {
            return [];
        }

        return this.test.questions[this.progressNumber]?.selection;
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";
.index {
    width: 100%;
    height: auto;

    .container {
        width: 800px;

        margin-left: auto;
        margin-right: auto;

        .section {
            .title {
                margin: 20px 0px;

                font-size: 24px;

                text-align: center;
            }

            .selectBox {
                .box {
                    width: 600px;

                    @include setCenter;

                    .select {
                        margin-top: 10px;

                        padding: 20px 24px;

                        text-align: center;

                        border: 1px solid #727272;
                        border-radius: 5px;
                    }
                }

                .result {
                    margin-top: 10px;

                    padding: 20px 24px;

                    text-align: center;
                    white-space: pre-wrap;

                    border: 1px solid #727272;
                    border-radius: 5px;
                }
            }
        }
    }
}
</style>
