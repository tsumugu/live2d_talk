export let s_instance: CoeFont = null;
export class CoeFont {
  constructor() {
  }
  public static getInstance(): CoeFont {
    if (s_instance == null) {
      s_instance = new CoeFont();
    }
    return s_instance;
  }
  public getWAVUrl(): void {
    console.log(process.env.COEFONT_ID);
  }
}