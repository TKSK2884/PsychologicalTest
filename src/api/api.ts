import axios, { AxiosRequestConfig } from "axios";

export function api(
    route: string,
    method: "get" | "post",
    params: any,
    context: Vue
): Promise<any> {
    let headers: any = {};

    if (context.$store.state.token != undefined) {
        headers["Authorization"] = context.$store.state.token;
    }

    return new Promise((resolve, reject) => {
        switch (method) {
            case "get":
                axios
                    .get(getAPIURL() + route, {
                        params: params,
                        headers: headers,
                    })
                    .then((res: any) => {
                        if (res == null) return;
                        resolve(res);
                    })
                    .catch(reject);
                break;
            case "post":
                axios
                    .post(getAPIURL() + route, params, {
                        headers: headers,
                    })
                    .then(resolve)
                    .catch(reject);

                break;
        }
    });
}

function getAPIURL(): string {
    return process.env.VUE_API_URL;
}
