<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.form">
                <div :class="$style.title">회원가입</div>
                <div :class="$style.infoBox">
                    <div :class="$style.info">
                        회원 가입 시
                        <span :class="$style.underLine">이용약관</span> 및
                        <span :class="$style.underLine">개인정보취급방침</span
                        >에
                    </div>
                    <div :class="$style.info">동의하는 것으로 간주합니다.</div>
                </div>
                <div :class="$style.box">
                    <div :class="$style.textLabel">ID</div>
                    <input
                        v-model="inputID"
                        :class="$style.input"
                        type="text"
                    />
                    <div :class="$style.textLabel">Password</div>
                    <input
                        v-model="inputPassword"
                        :class="$style.input"
                        type="password"
                    />
                    <div :class="$style.textLabel">Password Confirm</div>
                    <input
                        v-model="inputCheckPassword"
                        :class="$style.input"
                        type="password"
                    />
                    <div :class="$style.textLabel">Nickname</div>
                    <input
                        v-model="inputNickname"
                        :class="$style.input"
                        type="text"
                    />
                    <div v-on:click="createAccount" :class="$style.button">
                        회원 가입
                    </div>
                    <div :class="$style.orBox">
                        <div :class="$style.orBar"></div>
                        <div :class="$style.orText">또는</div>
                    </div>
                    <div
                        v-on:click="loginWithKakao"
                        :class="$style.kakaoLogin"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { api } from "@/api/api";
import { errorMessage } from "@/utils/errorMessage";

@Component({
    components: {},
})
export default class JoinView extends Vue {
    inputID: string = "";
    inputPassword: string = "";
    inputCheckPassword: string = "";

    inputNickname: string = "";

    localAccessToken: string =
        (localStorage.getItem("accessToken") as string) ?? "";

    sessionAccessToken: string =
        (sessionStorage.getItem("accessToken") as string) ?? "";

    saveResultToken: string = (this.$route.query.saveResult as string) ?? "";

    accessKey = process.env.VUE_APP_KAKAO_ACCESS_KEY;
    redirectURI = process.env.VUE_APP_KAKAO_REDIRECT_URI;

    mounted() {
        if (this.localAccessToken != "") {
            sessionStorage.setItem("accessToken", this.localAccessToken);
        }

        if (this.saveResultToken != "") {
            sessionStorage.setItem("saveResultToken", this.saveResultToken);
        }

        if (this.localAccessToken != "") {
            localStorage.removeItem("accessToken");
            if ((sessionStorage.getItem("saveResultToken") ?? "") != "") {
                return this.$router.push("/test/save/result");
            }
        }

        if ((sessionStorage.getItem("accessToken") ?? "") != "") {
            return this.$router.push("/");
        }
    }

    createAccount() {
        if (this.inputID == "") {
            alert("아이디를 입력해주세요");
            return;
        }
        if (this.inputPassword == "") {
            alert("비밀번호를 입력해주세요");
            return;
        }
        if (this.inputCheckPassword != this.inputPassword) {
            alert("비밀번호가 일치하지 않습니다");
            return;
        }

        if (this.inputNickname == "") {
            alert("닉네임을 입력해주세요");
            return;
        }

        api(
            "memeber/join",
            "post",
            {
                id: this.inputID,
                pw: this.inputPassword,
                name: this.inputNickname,
            },
            this
        )
            .catch(this.joinError)
            .then(this.joinSuccess);
    }

    joinError(err: any) {
        let errorCode = err.response.data.errorCode;

        let alertErrorMessage = errorMessage(errorCode);

        alert(alertErrorMessage);
    }

    joinSuccess(res: any) {
        if (res == null) {
            alert("회원가입에 실패했습니다. 다시 시도해주세요");
            return;
        }
        this.$router.push("/login");
        return;
    }

    loginWithKakao() {
        const url: string = `https://kauth.kakao.com/oauth/authorize?client_id=${this.accessKey}&redirect_uri=${this.redirectURI}&response_type=code`;

        window.open(url, "", "width=600,height=600");
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    .container {
        max-width: 1080px;

        padding: 20px 0px;

        @include setCenter;

        .form {
            max-width: 600px;

            margin-top: 20px;
            padding: 30px;

            @include setCenter;

            .title {
                padding: 20px 0px;

                font-size: 40px;

                text-align: center;
            }

            .infoBox {
                margin-bottom: 20px;

                text-align: center;

                .info {
                    font-size: 18px;

                    color: #6b6b6b;

                    .underLine {
                        text-decoration: underline;

                        color: #000000;
                    }
                }
            }

            .box {
                max-width: 240px;

                display: flex;
                flex-direction: column;

                @include setCenter;

                .textLabel {
                    margin-bottom: 4px;

                    font-size: 16px;
                }

                .orBox {
                    position: relative;

                    margin-top: 20px;
                    margin-bottom: 20px;

                    text-align: center;

                    .orBar {
                        position: absolute;

                        z-index: -1;
                        width: 100%;

                        top: 50%;

                        border-bottom: 1px solid #a7a5a57e;
                    }

                    .orText {
                        max-width: 50px;

                        padding: 12px 10px;

                        background-color: #ffffff;
                        color: #999999;

                        @include setCenter;
                    }
                }

                .input {
                    padding: 4px;

                    border: none;
                    border-bottom: solid 1px #a7a5a57e;

                    outline: none;
                }

                .button {
                    @include authButton;
                    @include setCenter;
                }

                .kakaoLogin {
                    @include kakaoButton;

                    @include setCenter;
                }

                .kakaoLogin:hover {
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
