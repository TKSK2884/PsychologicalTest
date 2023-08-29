<template>
    <div :class="$style.index">
        <div :class="$style.container">
            <div :class="$style.result">
                {{ result }}
            </div>

            <div :class="$style.buttonBox">
                <div :class="$style.button" v-on:click="$router.push('/test')">
                    다시하기
                </div>
                <div :class="$style.button" v-on:click="$router.push('/')">
                    처음으로
                </div>
            </div>
            <div :class="$style.textBox">
                <!-- v-if로 구현해야함 -->
                <div :class="$style.text">
                    결과를 저장하려면
                    <span :class="$style.underLine">로그인</span> 하세요.
                </div>
                <div :class="$style.text"></div>
            </div>
            <div :class="$style.textBox">
                <div :class="$style.text">테스트 결과가 저장되었습니다.</div>
                <div :class="$style.text">
                    <span :class="$style.underLine">결과 목록 보기</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
    components: {},
})
export default class Result extends Vue {
    @Prop() result?: string;

    isLogIn: boolean = false;
}
</script>

<style lang="scss" module>
.index {
    width: 100%;
    height: auto;

    .container {
        width: 100%;
        height: auto;

        .result {
            margin-top: 10px;

            padding: 20px 24px;

            text-align: center;
            white-space: pre-wrap;
        }

        .buttonBox {
            margin-top: 20px;

            display: flex;

            justify-content: center;

            .button {
                max-width: 180px;

                margin: 0 10px;

                padding: 16px 60px;

                border-radius: 10px;

                box-shadow: 0px 0px 1px #727272;

                text-align: center;

                &:hover {
                    cursor: pointer;
                    background-color: #72727276;
                }
            }
        }

        .textBox {
            margin-top: 20px;

            text-align: center;

            .text {
                .underLine {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>
