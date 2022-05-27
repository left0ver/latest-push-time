export const PORT:number=3000;
export const IP:string= process.env.NODE_ENV==='production' ? '0.0.0.0':'localhost';
export const GITHUB_API:string= 'https://api.github.com/repos'