import Image from "next/image";
import Stars from "@/public/images/general/stars.webp";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import Link from "next/link";
import CartAccount from "./cart-account";
import GetContent from "@/lib/wp/get-content";

export default async function Header() {
    const session = await getServerSession(options);
    const query = `
{
    pageBy(pageId: ${process.env.PAGE_ID}) {
        pageContent {
            menuIcon {
                node {
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            menuIconText
            menuLogo {
                node {
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
        }
        featuredImage {
            node {
                sourceUrl
                mediaDetails {
                    height
                    width
                }
                title
            }
        }
    }
}
    `;
    const pageContent = (await GetContent(query)).pageBy.pageContent;
    const featuredImage = (await GetContent(query)).pageBy.featuredImage.node;

    return (
        <>
            <header className="top-0 left-0 w-full bg-gradient-to-bz-[1000]">
                <div className="py-5">
                    <div className="container mx-auto px-4 2xl:max-w-[calc(100%_-_5rem)]">
                        <div className="grid grid-cols-3 items-center">
                            <div className="flex justify-start items-center gap-4">
                                <Image
                                    src={pageContent.menuIcon.node.sourceUrl}
                                    alt="Planet Icon"
                                    width={
                                        pageContent.menuIcon.node.mediaDetails
                                            .width
                                    }
                                    height={
                                        pageContent.menuIcon.node.mediaDetails
                                            .height
                                    }
                                    priority
                                    className="max-w-[30px] sm:max-w-full h-auto"
                                />
                                <p className="text-2xl sm:text-4xl leading-none text-primary secondary-font hidden sm:block">
                                    {pageContent.menuIconText}
                                </p>
                            </div>
                            <div className="flex justify-center items-center">
                                <Link href="/">
                                    {/* <img
                                        src="/images/email/logo-dark.png"
                                        alt="Website Logo"
                                        className="h-[80px]"
                                    /> */}
                                    <img
                                        src={
                                            pageContent.menuLogo.node.sourceUrl
                                        }
                                        className="h-[80px]"
                                        alt="Website Logo"
                                    // width={
                                    //     pageContent.menuLogo.node
                                    //         .mediaDetails.width
                                    // }
                                    // height={
                                    //     pageContent.menuLogo.node
                                    //         .mediaDetails.height
                                    // }
                                    // priority
                                    />
                                </Link>
                            </div>
                            <CartAccount session={session} />
                        </div>
                    </div>
                </div>
            </header>
            <img
                src="/videos/green-beat.gif"
                alt=""
                className="fixed  object-cover z-[-1000] -bottom-9 left-0"
            />
            <img
                src="/videos/green-beat.gif"
                alt=""
                className="fixed  object-cover z-[-1000] -bottom-9 right-0"
            />
        </>
    );
}
