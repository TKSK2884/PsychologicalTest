<template>
    <div :class="$style.index">
        <div :class="$style.container"></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { api } from "@/api/api";

@Component({
    components: {},
})
export default class SaveResultView extends Vue {
    accessToken: string = sessionStorage.getItem("accessToken") ?? "";
    saveResultToken: string = sessionStorage.getItem("saveResultToken") ?? "";

    saveResult() {
        api(
            "test/result/save",
            "post",
            {
                accessToken: this.accessToken,
                saveResultToken: this.saveResultToken,
            },
            this
        )
            .catch(this.saveResultError)
            .then(this.saveResultSuccess);
    }

    saveResultError(err: any) {
        let errorCode = err.response.data.errorCode;

        if (errorCode == 400) {
            alert("잘못된 요청입니다.");
            return;
        }

        if (errorCode == 500) {
            alert("서버 오류");
            return;
        }

        return;
    }

    saveResultSuccess(res: any) {
        if (res == null) return;

        sessionStorage.removeItem("saveResultToken");

        console.log("테스트 결과가 저장되었습니다.");
        return this.$router.push("/");
    }
    mounted() {
        if (this.saveResultToken == "") {
            return this.$router.push("/");
        }

        if (this.accessToken != "") {
            this.saveResult();
        }
        return;
    }
}
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: auto;

    .container {
        width: 100%;
        height: auto;
    }
}
</style>
