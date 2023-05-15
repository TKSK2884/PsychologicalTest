<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.coverBox">
                <div :class="$style.title">회원가입</div>
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
                    <input
                        v-model="inputCheckPassword"
                        :class="$style.input"
                        type="password"
                        placeholder="비밀번호 확인"
                    />

                    <input
                        v-model="inputNickname"
                        :class="$style.input"
                        type="text"
                        placeholder="닉네임 입력"
                    />
                    <div v-on:click="createAccount" :class="$style.button">
                        회원 가입
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { api } from "@/api/api";
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
    components: {
        // HelloWorld,
    },
})
export default class JoinView extends Vue {
    inputID: string = "";
    inputPassword: string = "";
    inputCheckPassword: string = "";

    inputNickname: string = "";

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
            "join",
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

        if (errorCode == 500) {
            alert("서버 오류");
            return;
        }

        if (errorCode == 202) {
            alert("중복되는 아이디 입니다.");
            return;
        }

        if (errorCode == 204) {
            alert("중복되는 닉네임 입니다.");
            return;
        }
        alert("가입에 실패했습니다");
    }
    joinSuccess(res: any) {
        if (res == null) {
            alert("가입에 실패했습니다");
            return;
        }
        this.$router.push("/login");
        return;
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

                    margin-top: 16px;
                    margin-bottom: 16px;

                    border: 1px solid rgb(58, 58, 58);
                    border-radius: 4px;

                    @include setCenter;
                }
            }
        }
    }
}
</style>
