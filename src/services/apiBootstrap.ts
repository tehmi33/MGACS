let FIRST_API_DONE = false;
 let firstApiResolver: (() => void) | null = null;
 
 export const waitForFirstApi = () =>
   new Promise<void>((resolve) => {
     if (FIRST_API_DONE) {
       resolve();
     } else {
       firstApiResolver = resolve;
     }
   });
 
 export const firstApiDone = () => {
   if (FIRST_API_DONE) return; // 🔒 lock
 
   FIRST_API_DONE = true;
   firstApiResolver?.();
   firstApiResolver = null;
 
//    console.log('✅ First API completed');
 };