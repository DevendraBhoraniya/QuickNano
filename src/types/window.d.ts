export {};

declare global {
  interface Window {
    LanguageModel: {
        availability(): Promise<string>;
        params(): Promise<any>;
        create(opts: any): Promise<any>;
    };
    __AI_SEARCH_CLEANER_ENABLED?: boolean;
  }
}

interface Window {
  Rewriter: any;
}