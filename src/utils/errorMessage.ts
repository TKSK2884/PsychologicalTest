export function errorMessage(errorCode: number): string {
    if (errorCode == null) return "";

    if (errorCode == 101) return "잘못된 유저 정보 다시 시도해 주세요";
    if (errorCode == 102) return "테스트를 로딩 실패 다시 시도해주세요";

    if (errorCode == 201) return "잘못된 테스트 정보 다시 시도해주세요";
    if (errorCode == 202) return "중복된 테스트 정보 다시 시도해주세요";
    if (errorCode == 203) return "테스트 정보가 없습니다 다시 시도해주세요";

    if (errorCode == 301) return "서버와의 연결 실패 다시 시도해주세요";
    if (errorCode == 302) return "잘못된 요청입니다 다시 시도해주세요";

    return "";
}
