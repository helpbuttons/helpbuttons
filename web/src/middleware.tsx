import { NextResponse } from "next/server";

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  const accept = req.headers.get('Accept');

  const isActivityJson =
    accept?.includes('application/activity+json') ||
    accept?.includes('application/ld+json');
  if (isActivityJson &&
    (
      (pathname.startsWith('/Explore/') && pathname.split('/').length === 6) ||
      (pathname.startsWith('/Show') && pathname.split('/').length === 3)
    )
  ) {
    const pathSplit = pathname.split('/')
    const hbId = pathSplit[pathSplit.length - 1]
    return NextResponse.rewrite(`${process.env.API_URL}/u/helpbuttons_${hbId}`)
  }
  if (isActivityJson &&
    (
      (pathname.startsWith('/p/') && pathname.split('/').length === 3)
    )
  ) {
    const pathSplit = pathname.split('/')
    const userId = pathSplit[pathSplit.length - 1]
    return NextResponse.rewrite(`${process.env.API_URL}/u/${userId}`)
  }
}