import { NextPageContext } from 'next';
import { setMetadata } from 'pages/_serverprops';
import { isStaticApp } from './environment';

export const  shouldEnableSSR = !(isStaticApp());

export async function getServerSidePropsHandler(subtitle: string, ctx: NextPageContext) {
  return setMetadata(subtitle, ctx);
}