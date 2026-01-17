declare global {
  var updateFcmOnRefresh: ((token?: string) => void) | undefined;
   var visitId: string | undefined;
}

export {};
