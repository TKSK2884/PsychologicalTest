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
import { errorMessage } from "@/utils/errorMessage";

@Component({
    components: {},
})
export default class OAuthView extends Vue {
    mounted() {
        this.tokenWithKakao(getUnwrappedQuery(this.$route.query.code));
    }

    tokenWithKakao(code: string) {
        if (code == "") return;

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

        let alertErrorMessage = errorMessage(errorCode);

        alert(alertErrorMessage);

        return;
    }

    tokenSuccess(res: any) {
        if (res == null) return;

        localStorage.setItem("accessToken", `${res.data.token}`);

        window.opener.location.reload();
        // window.opener.console.log("test");
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
