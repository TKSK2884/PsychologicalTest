<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.logo"></div>
            <div :class="$style.title">GPTMind</div>
            <div :class="[$style.textBox, $style.copyright]">
                Copyright(c) by 조현석 |
                <span :class="$style.underLine">Open Source License</span>
            </div>
            <div :class="$style.section">
                <div :class="$style.frame">
                    <!-- v-for로 만들기 -->
                    <div
                        :class="$style.box"
                        v-for="test in getTestArray"
                        :key="test.id"
                    >
                        <router-link
                            :to="`/test?selectTest=${getTestId(test)}`"
                        >
                            <div :class="$style.testLink">
                                {{ getTestName(test) }}
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-if="!isLogIn" :class="[$style.textBox, $style.infoBox]">
                <div :class="$style.info">
                    테스트는 비회원 상태에서도 가능합니다.
                </div>
                <div :class="$style.info">
                    로그인 하시면 테스트 진행 결과를 보관할 수 있습니다.
                </div>
            </div>
            <div v-else :class="[$style.textBox, $style.infoBox]">
                <div :class="$style.info">로그인 계정:</div>
                <div :class="$style.bar">|</div>
                <div :class="$style.info">테스트 결과는 저장됩니다</div>
            </div>

            <div v-if="isLogIn" :class="$style.linkBox">
                <router-link :to="`/test/result/history`">
                    <div :class="$style.link">테스트 결과 보기</div>
                </router-link>
                <div :class="$style.bar">|</div>
                <router-link :to="`/`">
                    <div v-on:click="logout()" :class="$style.link">
                        로그아웃
                    </div>
                </router-link>
            </div>

            <div :class="$style.linkBox" v-else>
                <router-link :to="`/login`">
                    <div :class="$style.link">로그인</div>
                </router-link>
                <div :class="$style.bar">|</div>
                <router-link :to="`/join`">
                    <div :class="$style.link">회원가입</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { RouterLink } from "vue-router";
import { api } from "@/api/api";
import { testList } from "@/structure/types";

@Component({
    components: {},
})
export default class HomeView extends Vue {
    selectedTest: string = "";
    testListArray: testList[] = [];

    selectTest() {
        this.selectedTest = "1";
    }

    get isLogIn(): boolean {
        return this.$store.state.accesToken != undefined;
    }

    logout() {
        this.$store.commit("setAccessToken", undefined);
        this.$store.commit("setUserId", undefined);
    }

    cleanLocalStorage() {
        localStorage.clear();
        this.$store.commit("setProgressToken", undefined);
    }

    loadTestList() {
        api("test/list", "get", {}, this)
            .catch(this.loadError)
            .then(this.loadSuccess);
    }

    loadError(err: any) {
        let errorCode = err.response.data.errorCode;

        alert(errorCode);

        if (errorCode == 500) {
            alert("서버 오류");
            return;
        }

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        this.testListArray = res.data.testList;

        this.$forceUpdate();
    }

    get getTestArray(): testList[] {
        if (this.testListArray.length == 0) return [];

        return this.testListArray;
    }

    getTestId(item: testList): number {
        return item.id ?? 0;
    }

    getTestName(item: testList): string {
        return item.test_name ?? "";
    }

    mounted() {
        let accessToken: string = localStorage.getItem("token") ?? "";
        let userId: string = localStorage.getItem("user_id") ?? "";

        if (accessToken != "" && userId != "") {
            this.$store.commit("setAccessToken", accessToken);
            this.$store.commit("setUserId", userId);

            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
        }

        this.loadTestList();
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: auto;

    .container {
        max-width: 1080px;

        margin-left: auto;
        margin-right: auto;

        .logo {
            width: 100px;
            height: 100px;

            margin-top: 200px;

            background-image: url("/src/assets/logo.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;

            @include setCenter;
        }

        .title {
            margin-top: 20px;

            font-size: 24px;

            text-align: center;
        }

        .textBox {
            margin-top: 20px;

            font-size: 12px;

            text-align: center;

            .underLine {
                text-decoration: underline;
            }
        }

        .infoBox {
            margin-top: 20px;
            margin-bottom: 20px;

            .info {
                padding: 2px;

                font-size: 16px;
            }
        }

        .linkBox {
            display: flex;
            justify-content: center;

            .bar {
                padding: 0px 10px;
            }

            .link {
                text-decoration: underline;

                color: #727272;
            }
        }

        .copyright {
            margin-top: 20px;

            font-size: 12px;

            text-align: center;
        }

        .section {
            .frame {
                display: flex;
                flex-direction: column-reverse;

                .box {
                    @include setCenter;

                    .testLink {
                        width: 300px;

                        margin-top: 20px;

                        padding: 12px 20px;

                        border-radius: 5px;

                        box-shadow: 0px 0px 1px #727272;

                        font-size: 24px;

                        text-align: center;

                        @include setCenter;
                    }
                }
            }

            a {
                text-decoration: none;

                color: #101010;
            }
        }

        .input {
            padding: 20px;
        }

        .button {
            padding: 20px;
        }
    }
}
</style>
