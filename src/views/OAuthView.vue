<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.title"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { api } from "@/api/api";
import { getUnwrappedQuery } from "@/utils/strings";

@Component({
    components: {},
})
export default class OAuthView extends Vue {
    mounted() {
        this.tokenWithKakao(getUnwrappedQuery(this.$route.query.code));
    }

    tokenWithKakao(code: string) {
        if (code == "") return;

        console.log(code);
        api(
            "kakao/token",
            "post",
            {
                code: code,
            },
            this // is context
        )
            .catch(this.tokenError)
            .then(this.tokenSuccess);
    }

    tokenError(err: any) {
        let errorCode = err.response.data.errorCode;

        if (errorCode == 500) {
            alert("서버 오류");
            return;
        }

        alert("로그인에 실패하였습니다.");
        return;
    }

    tokenSuccess(res: any) {
        if (res == null) return;

        console.log(res.data.token);

        localStorage.setItem("accessToken", `${res.data.token}`); // Home으로 보내줌

        window.opener.location.href = "/";
        window.parent.close();
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
            font-size: 24px;
        }
    }
}
</style>
