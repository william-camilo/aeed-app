import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata:Metadata={title:'AEED na Prática | Atendimento que Converte',description:'Conduza conversas com clareza. Assistente, treinamento e conteúdos do Método AEED para atendentes e gestores.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon-192.png'},appleWebApp:{capable:true,statusBarStyle:'default',title:'AEED'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#f7f1e8'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
