<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.coverBox">
                <div :class="$style.title">로그인</div>
                <div :class="$style.box">
                    <input
                        v-model="inputID"
                        :class="$style.input"
                        type="text"
                        placeholder="아이디 입력"
                    />
                    <input
                        v-model="inputPassword"
                        :class="$style.input"
                        type="password"
                        placeholder="비밀번호 입력"
                    />
                    <div v-on:click="tryLogin" :class="$style.button">
                        로그인
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

        .coverBox {
            max-width: 360px;

            padding: 30px;

            border: none;
            border-radius: 10px;

            box-shadow: 0px 0px 1px 0px rgb(87, 87, 87);

            @include setCenter;

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

                .input {
                    padding: 8px;

                    margin-top: 10px;
                    margin-left: 10px;

                    border: none;
                    border-bottom: solid 1px rgb(107, 107, 107);
                    border-radius: 2px;

                    outline: none;
                }

                .button {
                    padding: 6px 18px;

                    margin-top: 20px;

                    border: 1px solid rgb(58, 58, 58);
                    border-radius: 4px;

                    @include setCenter;
                }

                .kakaoLogin {
                    width: 150px;
                    height: 40px;

                    margin-top: 10px;

                    background-image: url("@/assets/kakao_login_medium.png");
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center center;

                    @include setCenter;
                }
            }
        }
    }
}
</style>
