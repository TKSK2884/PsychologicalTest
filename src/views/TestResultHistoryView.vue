<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.section">
                <div :class="$style.infoBox">
                    <div :class="$style.title">테스트 결과 목록</div>
                    <div :class="$style.info">
                        테스트 결과는 XX개까지만 표시됩니다.
                    </div>
                </div>
                <!-- 5개로 제한해야함  -->
                <div
                    :class="$style.box"
                    v-for="(result, index) in reverseResultArray"
                    :key="index"
                >
                    <div :class="$style.testTitle">
                        <div :class="$style.selectTest">
                            {{ getSelectTest(result) }}
                        </div>
                        <div :class="$style.time">
                            {{ getTimeDate(result) }}
                        </div>
                    </div>

                    <div :class="$style.content">
                        {{ getContent(result) }}
                    </div>

                    <div :class="$style.arrowButton"></div>
                </div>
            </div>
            <div :class="$style.buttonBox">
                <router-link :to="`/`">
                    <div :class="$style.button">처음으로</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { api } from "@/api/api";
import { ResultObject } from "@/structure/types";

@Component({
    components: {},
})
export default class TestResultHistoryView extends Vue {
    userId: string = this.$store.state.userId ?? "";
    resultArray: ResultObject[] = [];
    reverseResultArray: ResultObject[] = [];

    mounted() {
        this.loadTestResult();
    }

    loadTestResult() {
        api(
            "test/result/history",
            "get",
            {
                user_id: this.userId,
            },
            this
        )
            .catch(this.loadError)
            .then(this.loadSuccess);
    }

    loadError(err: any) {
        let errorCode = err.response.data.errorCode;

        if (errorCode == 500) {
            alert("서버 에러");
            return;
        }

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        this.resultArray = res.data.result;

        this.reverseResultArray = [...this.resultArray].reverse();

        this.$forceUpdate();
    }

    getSelectTest(content: ResultObject) {
        return content.select_test ?? "";
    }

    getContent(content: ResultObject) {
        return content.content ?? "";
    }
    getTimeDate(content: ResultObject) {
        let timedate: Date = new Date(content.time_date ?? new Date());

        let convertedTimeDate = timedate.toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
        });

        return convertedTimeDate;
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
            .infoBox {
                margin-top: 60px;

                text-align: center;
                .title {
                    margin: 12px 0px;

                    font-size: 24px;
                }
                .info {
                    font-size: 16px;
                }
            }

            .box {
                display: flex;

                width: 450px;

                margin: 16px 0px;
                padding: 12px;

                border-bottom: 1px solid #7272727c;

                @include setCenter;

                .testTitle {
                    width: 150px;

                    .selectTest {
                        font-size: 16px;
                    }
                    .time {
                        font-size: 12px;
                    }
                }

                .content {
                    width: 250px;
                    height: 30px;

                    font-size: 12px;

                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;

                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }

            .arrowButton {
                padding: 6px;

                margin-left: auto;

                background-image: url("/src/assets/arrow.png");
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
            }
        }

        .buttonBox {
            margin-top: 20px;

            display: flex;
            justify-content: center;

            a {
                text-decoration: none;

                color: black;

                .button {
                    min-width: 180px;
                    min-height: 60px;

                    margin: 0 10px;

                    padding: 20px;

                    border-radius: 10px;

                    box-shadow: 0px 0px 1px #727272;

                    text-align: center;
                }
            }
        }
    }
}
</style>
