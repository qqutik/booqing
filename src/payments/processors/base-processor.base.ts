
export abstract class BaseProcessor {
  protected buildSuccessUrl(): string {
    return '';
  }

  protected buildFailureUrl(): string {
    return '';
  }
}
