export interface ResultListener {
    handleResult(result: boolean, msg: string, action: number, resultData: number);
}
