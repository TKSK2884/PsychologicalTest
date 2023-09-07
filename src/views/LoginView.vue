<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.form">
                <div :class="$style.title">로그인</div>
                <div :class="$style.infoBox">
                    <div :class="$style.info">
                        아이디 비밀번호 입력하기 귀찮으시죠?
                    </div>
                    <div :class="$style.info">
                        1초만에 카카오 로그인 해 보세요
                        {{ $route.params.result }}
                    </div>
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
                    <div v-on:click="tryLogin()" :class="$style.button">
                        로그인
                    </div>

                    <div :class="$style.orBox">
                        <div :class="$style.orBar"></div>
                        <div :class="$style.orText">또는</div>
                    </div>
                    <div v-on:click="goJoinPage()" :class="$style.joinBox">
                        <div :class="$style.join">회원가입</div>
                    </div>
                    <div
                        v-on:click="loginWithKakao()"
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
import router from "@/router";

@Component({
    components: {},
})
export default class LoginView extends Vue {
    inputID: string = "";
    inputPassword: string = "";

    accessKey = process.env.VUE_APP_KAKAO_ACCESS_KEY;
    redirectURI = process.env.VUE_APP_KAKAO_REDIRECT_URI;

    saveResultToken: string = (this.$route.query.saveResult as string) ?? "";

    mounted() {
        if (sessionStorage.getItem("accessToken") != undefined) {
            alert("이미 로그인 되어있습니다.");

            this.$router.push("/");
        }

        if (this.saveResultToken != "") {
            sessionStorage.setItem("saveResultToken", this.saveResultToken);
        }
    }

    tryLogin() {
        if (this.inputID == "") {
            return alert("아이디를 입력해주세요");
        }
        if (this.inputPassword == "") {
            return alert("비밀번호를 입력해주세요");
        }
        api(
            "memeber/login",
            "post",
            {
                id: this.inputID,
                pw: this.inputPassword,
            },
            this
        )
            .catch(this.loginError)
            .then(this.loginSuccess);
    }

    loginError(err: any) {
        let errorCode = err.response.data.errorCode;

        if (errorCode == 500) {
            alert("서버 에러");
            return;
        }

        if (errorCode == 101) {
            alert("아이디 혹은 비밀번호를 확인 해주세요");
            return;
        }

        alert("알 수 없는 에러 다시 시도해주세요");
        return;
    }

    loginSuccess(res: any) {
        if (res == null) return;

        let accessToken: string = res.data.token as string;

        sessionStorage.setItem("accessToken", accessToken);

        this.$router.push("/");
    }

    goJoinPage() {
        this.$router.push("/join");
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

            .infoBox {
                margin-bottom: 20px;

                text-align: center;

                .info {
                    font-size: 18px;

                    color: #6b6b6b;
                }
            }

            .title {
                padding: 20px 0px;

                font-size: 40px;
                font-weight: bold;

                text-align: center;
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

                .joinBox {
                    margin-bottom: 20px;

                    text-align: center;

                    .join {
                        font-size: 16px;

                        color: #6b6b6b;

                        &:hover {
                            text-decoration: underline;
                            cursor: pointer;
                        }
                    }
                }

                .kakaoLogin {
                    @include kakaoButton;

                    @include setCenter;
                }
            }
        }
    }
}
</style>
