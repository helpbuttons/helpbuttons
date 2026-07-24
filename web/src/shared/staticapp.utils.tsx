import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { isStaticApp } from './environment';

export const  shouldEnableSSR = !(isStaticApp());

export async function getServerSidePropsHandler(subtitle: string, ctx: NextPageContext) {
  return setMetadata(subtitle, ctx);
}