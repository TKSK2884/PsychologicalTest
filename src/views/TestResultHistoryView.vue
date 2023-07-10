<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.title">Test Result</div>
            <div
                :class="$style.box"
                v-for="(result, index) in reverseResultArray"
                :key="index"
            >
                <div :class="$style.time">
                    {{ getTimeDate(result) }}
                </div>
                <div :class="$style.selectTest">
                    {{ getSelectTest(result) }}
                </div>
                <div :class="$style.content">
                    {{ getContent(result) }}
                </div>
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

        alert(errorCode);

        if (errorCode == 500) {
            alert("서버 에러");
            return;
        }

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        console.log(res.data.result);
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
        .title {
            margin: 12px 0px;

            font-size: 24px;
        }

        .box {
            margin: 16px 0px;
            padding: 12px;

            border: 1px solid black;
            border-radius: 5px;
        }
    }
}
</style>
