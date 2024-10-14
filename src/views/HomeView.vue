<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <router-link :to="`/`">
                <div :class="$style.logo" />
            </router-link>
            <div :class="$style.title">GPTMind</div>
            <div :class="$style.copyright">
                Copyright(c) by 조현석 |
                <span :class="$style.underLine">Open Source License</span>
            </div>
            <div :class="$style.section">
                <div :class="$style.frame">
                    <div
                        v-if="
                            getTestArray != null &&
                            getTestArray.length == 0 &&
                            !isLoading
                        "
                        :class="$style.message"
                    >
                        테스트를 불러오는데<br />
                        실패했습니다.

                        <br />
                        <br />
                        잠시 후 다시 시도해주세요.
                    </div>

                    <LoadingIndicator v-if="isLoading" />
                    <div
                        v-for="test in getTestArray"
                        :key="test.id"
                        :class="$style.tests"
                    >
                        <router-link
                            :to="`/test?selectTest=${getTestId(test)}`"
                        >
                            <div :class="$style.test">
                                {{ getTestName(test) }}
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-if="!isLogIn" :class="$style.infoBox">
                <div :class="$style.info">
                    테스트는 비회원 상태에서도 가능합니다.
                </div>
                <div :class="$style.info">
                    로그인 하시면 테스트 진행 결과를 보관할 수 있습니다.
                </div>
            </div>
            <div v-else :class="$style.infoBox">
                <div :class="$style.info">로그인 계정:{{ loginNickname }}</div>

                <div :class="$style.info">테스트 결과는 저장됩니다</div>
            </div>

            <div v-if="isLogIn" :class="$style.linkBox">
                <router-link :to="`/test/result/history`">
                    <div :class="$style.link">테스트 결과 보기</div>
                </router-link>
                <div :class="$style.bar">|</div>

                <div @click="logout()" :class="[$style.link, $style.logout]">
                    로그아웃
                </div>
            </div>

            <div v-else :class="$style.linkBox">
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
import { Component, Vue } from "vue-property-decorator";
import { RouterLink } from "vue-router";
import { api } from "@/api/api";
import { testList } from "@/structure/types";
import router from "@/router";
import { errorMessage } from "@/utils/errorMessage";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

@Component({
    components: {
        LoadingIndicator,
    },
})
export default class HomeView extends Vue {
    selectedTest: string = "";
    testListArray: testList[] | null = null;

    isLoading: boolean = false;

    loginNickname: string = "";

    isLogIn: boolean = false;

    accessToken: string = sessionStorage.getItem("accessToken") ?? "";
    saveResultToken: string = sessionStorage.getItem("saveResultToken") ?? "";

    logout() {
        sessionStorage.clear();

        router.go(0);
    }

    getUserNickname() {
        if (this.accessToken == "") {
            return;
        } else {
            api(
                "member/info",
                "get",
                {
                    accessToken: this.accessToken,
                },
                this
            )
                .catch(this.getUserNicknameError)
                .then(this.getUserNicknameSuccess);
        }
    }

    getUserNicknameError(err: any) {
        if (!err) {
            console.log(err);
            return;
        }

        let errorCode = err.response.data.errorCode;

        let alertErrorMessage: string = errorMessage(errorCode);

        alert(alertErrorMessage);

        return;
    }

    getUserNicknameSuccess(res: any) {
        if (res == null) return;

        let nickname: string = res.data.nickname as string;
        this.loginNickname = nickname;

        this.isLogIn = true;

        this.$forceUpdate();
    }

    loadTestList() {
        this.isLoading = true;

        api(
            "test/list",
            "get",
            {
                loadTestList: true,
            },
            this
        )
            .catch(this.loadError)
            .then(this.loadSuccess)
            .finally(() => {
                this.isLoading = false;
            });
    }

    loadError(err: any) {
        let errorCode = err.response.data.errorCode;

        let alertErrorMessage: string = errorMessage(errorCode);

        alert(alertErrorMessage);

        return;
    }

    loadSuccess(res: any) {
        if (res == null) return;

        this.testListArray = res.data.testList;

        this.$forceUpdate();
    }

    mounted() {
        let accessToken: string = localStorage.getItem("accessToken") ?? "";

        if (accessToken != "") {
            localStorage.removeItem("accessToken");
            sessionStorage.setItem("accessToken", accessToken);

            this.accessToken = accessToken;
        }

        if (this.accessToken != "") {
            this.getUserNickname();
        }
        this.loadTestList();
    }

    get getTestArray(): null | testList[] {
        if (this.testListArray == null) return null;

        if (this.testListArray.length == 0) return [];

        return this.testListArray;
    }

    getTestId(item: testList): number {
        return item.id ?? 0;
    }

    getTestName(item: testList): string {
        return item.test_name ?? "";
    }
}
</script>

<style lang="scss" module>
@import "@/assets/utils.scss";

.index {
    width: 100%;
    height: auto;

    > .container {
        max-width: 1080px;

        margin-inline: auto;

        > a > .logo {
            width: 70px;
            height: 70px;

            margin-top: 120px;
            margin-inline: auto;

            background-image: url("/src/assets/logo.png");
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
        }

        > .title {
            font-size: 60px;
            text-align: center;

            margin-top: 10px;
        }

        > .copyright {
            margin-top: 2px;

            font-size: 14px;

            text-align: center;

            color: #666666;

            > .underLine {
                text-decoration: underline;
            }
        }

        > .linkBox {
            display: flex;
            justify-content: center;

            > .bar {
                padding: 0px 10px;
            }

            > a > .link,
            > .logout {
                text-decoration: underline;

                color: #727272;
            }

            > .logout {
                &:hover {
                    cursor: pointer;
                }
            }
        }

        > .section {
            > .frame {
                display: flex;
                flex-direction: column-reverse;

                margin-top: 70px;

                @include mobile {
                    margin-top: 35px;
                }

                > .message {
                    font-size: 24px;

                    text-align: center;

                    @include mobile {
                        font-size: 18px;
                    }
                }

                > .tests {
                    margin-inline: auto;

                    > a {
                        text-decoration: none;

                        color: #101010;

                        > .test {
                            width: 300px;

                            font-size: 24px;
                            text-align: center;

                            padding: 16px 20px;
                            margin-top: 16px;
                            margin-inline: auto;

                            border-radius: 5px;

                            box-shadow: 0px 0px 1px #727272;

                            &:hover {
                                cursor: pointer;

                                background-color: #f2f2f2;
                            }
                        }
                    }
                }
            }
        }

        > .infoBox {
            text-align: center;

            margin-top: 36px;
            margin-bottom: 48px;

            color: #666666;

            > .info {
                padding: 2px;

                font-size: 16px;
            }
        }
    }
}
</style>
