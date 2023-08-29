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
                    <div v-on:click="tryLogin" :class="$style.button">
                        로그인
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

@Component({
    components: {},
})
export default class LoginView extends Vue {
    inputID: string = "";
    inputPassword: string = "";

    accessKey = process.env.VUE_APP_KAKAO_ACCESS_KEY;
    redirectURI = process.env.VUE_APP_KAKAO_REDIRECT_URI;

    mounted() {
        if (this.$store.state.accessToken != undefined) {
            this.$router.push("/");
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
            alert("서버 오류");
            return;
        }

        if (errorCode == 101) {
            alert("아이디 혹은 비밀번호를 확인 해주세요");
            return;
        }
        alert("로그인에 실패하였습니다.");
        return;
    }

    loginSuccess(res: any) {
        if (res == null) return;

        let token: string = res.data.token as string;
        let userId: string = res.data.id as string;

        this.$store.commit("setAccessToken", token);
        this.$store.commit("setUserId", userId);

        this.$router.push("/");
    }

    loginWithKakao() {
        const url: string = `https://kauth.kakao.com/oauth/authorize?client_id=${this.accessKey}&redirect_uri=${this.redirectURI}&response_type=code`;

        console.log(url);
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
            max-width: 360px;

            padding: 30px;

            border: none;
            border-radius: 10px;

            @include setCenter;

            .infoBox {
                margin-bottom: 20px;

                text-align: center;

                .info {
                    color: #6b6b6b;
                }
            }

            .title {
                padding: 20px 0px;

                font-size: 24px;
                font-weight: bold;

                text-align: center;
            }

            .box {
                max-width: 300px;

                display: flex;
                flex-direction: column;

                @include setCenter;

                .textLabel {
                    margin-left: 10px;
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
                        max-width: 60px;

                        padding: 12px 10px;

                        background-color: #ffffff;

                        @include setCenter;
                    }
                }

                .input {
                    margin-top: 10px;
                    margin-left: 10px;

                    padding: 4px;

                    border: none;
                    border-bottom: solid 1px #a7a5a57e;
                    // border-radius: 2px;

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
            }
        }
    }
}
</style>
