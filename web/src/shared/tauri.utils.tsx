import t from 'i18n';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';

export const shouldEnableSSR = process.env.TAURI_BUILD !== 'true';

export async function getServerSidePropsHandler(subtitle: string, ctx: NextPageContext) {
  return setMetadata(subtitle, ctx);
}