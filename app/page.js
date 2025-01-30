import Image from "next/image";
import Link from "next/link";
import FAQs from "./components/general/faqs";
import GetContent from "@/lib/wp/get-content";
import TextHightlight from "./components/animated/text-highlight";
import LowPowerModeVideo from "./components/general/low-power-mode-video";
import GenerateSignature from "@/lib/dapp/generate-signature";
import EligibleConditionsCarousel from "./components/carousels/eligible-conditions-carousel";
import NewsCarousel from "./components/carousels/news-carousel";
import ShopStrains from "./components/shop/strains/shop-strains";

export async function generateMetadata() {
    const query = `
{
    pageBy(pageId: ${process.env.PAGE_ID}) {
        title
        pageContent {
            heroCelebrityPhoto {
                node {
                    sourceUrl
                }
            }
        }
    }
}
    `;
    const pageBy = (await GetContent(query)).pageBy;

    return {
        title: "Dr. Green: " + pageBy.title,
        description: "Your trusted source for medical cannabis.",
        openGraph: {
            images: [pageBy?.pageContent?.heroCelebrityPhoto?.node?.sourceUrl],
        },
    };
}

export default async function Home() {
    const query = `
{
    pageBy(pageId: ${process.env.PAGE_ID}) {
        title
        pageSide {
            featuredStrainId
        }
        pageContent {
            heroPlanet {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            heroCelebrityPhoto {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            referPlanet {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            largeParagraphText
            madePossibleParagraphText
            madePossibleBackgroundImage {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            madePossibleCelebrityImage {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
            questionsBackgroundImage {
                node {
                    title
                    sourceUrl
                    mediaDetails {
                        height
                        width
                    }
                }
            }
        }
    }
    globalContent {
        eligibleConditions {
            condition {
                condition
                description
            }
        }
        threeSteps {
            steps {
                description
                icon {
                    node {
                        mediaDetails {
                            height
                            width
                        }
                        sourceUrl
                        title
                    }
                }
                title
            }
        }
    }
}
    `;
    const content = (await GetContent(query)).pageBy;
    const global = (await GetContent(query)).globalContent;

    const featuredStrainId = content.pageSide.featuredStrainId;
    const payload = { strainId: featuredStrainId };
    const getStrains = await fetch(
        `https://stage-api.drgreennft.com/api/v1/dapp/strains/${payload.strainId}`,
        {
            method: "GET",
            redirect: "follow",
            headers: {
                "x-auth-apikey": process.env.DAPP_API,
                "x-auth-signature": GenerateSignature(payload),
                "Content-Type": "application/json",
            },
        }
    );
    const strain = await getStrains.json();

    const feed = await fetch(
        "https://rss.app/feeds/v1.1/uE6LV8h0fRax2HfE.json",
        {
            method: "GET",
        }
    );

    const rssItems = (await feed.json()).items;
    const availableLocations = strain?.data?.strainLocations?.map((loc) => {
        if (loc.isAvailable) return loc.location.country;
    });

    let locationData;
    const fetchCountry = async () => {
        try {
            const response = await fetch(`${process.env.LOCATION}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            locationData = await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    await fetchCountry();

    return (
        <main>
            <section id="hero" className="md:pt-48 pt-28 bg-center relative min-h-screen">
                {/* <Image
                    src={content.pageContent.heroPlanet.node.sourceUrl}
                    alt={content.pageContent.heroPlanet.node.title}
                    width={
                        content.pageContent.heroPlanet.node.mediaDetails.width
                    }
                    height={
                        content.pageContent.heroPlanet.node.mediaDetails.height
                    }
                    priority
                    className="absolute top-[-25px] sm:top-0 left-0 max-w-[50%] sm:max-w-[25%]"
                /> */}
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover z-[-20]"
                    src="/videos/wave.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>

                {/* Color Overlay */}
                <div
                    className="absolute top-0 left-0 w-full h-full bg-[#DBEAF3] opacity-70 z-[-10]"
                /* Replace "bg-primary" with your global color class */
                ></div>

                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-[60px] text-[#005371] sm:text-[80px] md:text-[90px] lg:text-[120px] 2xl:text-[140px] mb-4 sm:mb-6 relative z-10">
                            Welcome to <br />
                            <span className="text-[#005371]">
                                {/* {content.title} */} Goldilocks
                            </span>
                        </h1>
                        {/* <div className="text-center mt-8 sm:mt-10">
                            <Link href="/dashboard/eligibility">
                                <button
                                    className="uppercase py-4 px-6 rounded-[10px] bg-[#098b74] border-[#098b74] text-[#FFFF] border-2 text-[15px] shadow hover:shadow-[0_0_10px_0px_#0aba90] duration-200 ease-in-out"
                                    title="Check Eligibility"
                                >
                                    SHOP NOW
                                </button>
                            </Link>
                        </div> */}
                        <p className="hidden lg:flex justify-center items-center gap-4 animate-bounce text-lg font-semibold mt-32 relative z-10 text-[#005371]">
                            <Image
                                src="/images/icons/mouse-icon.svg"
                                alt="Mouse Icon"
                                width={14}
                                height={19}
                                priority
                            />
                            Scroll to Discover
                        </p>
                    </div>
                </div>
                <div className="mt-0 lg:mt-[-15%] 2xl:mt-[-20%]   w-fit-content ml-auto pointer-events-none max-w-[100%] sm:max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] overflow-hidden z-50">
                    <img
                        src={
                            content?.pageContent?.heroCelebrityPhoto?.node?.sourceUrl
                        }
                        alt={content?.pageContent?.heroCelebrityPhoto?.node?.title}
                        width={
                            content?.pageContent?.heroCelebrityPhoto?.node?.mediaDetails?.width
                        }
                        height={
                            content?.pageContent?.heroCelebrityPhoto?.node?.mediaDetails?.height
                        }
                        // priority
                        className="object-contain mix-blend-multiply  object-right-bottom ml-[30%]  "
                    />
                </div>

                {/* <video
                    className="absolute left-0 hidden sm:block top-[70%] 2xl:top-[50%] max-w-[40%] max-h-full object-fit w-auto h-auto object-left z-[-10] pointer-events-none"
                    src="/images/videos/heartbeat.gif"
                    autoPlay
                    loop
                    muted
                    playsInline
                    width={735}
                    height={910}
                    alt="Rock Video"
                /> */}
            </section>

            {/* <section className="pt-8 sm:pt-0" id="process">
                <div className="container mx-auto px-4">
                    <div>
                        <h2 className="text-center text-[#005371]  mt-10 text-4xl sm:text-4xl sm:text-[50px] leading-tight mb-8">
                            Access your treatment <br />
                            <div className="mt-3">
                                in three easy steps
                            </div>
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 xl:gap-x-20 gap-y-10 text-center">
                            {global.threeSteps.steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={
                                        global.threeSteps.steps.length == i + 1
                                            ? "col-span-1 sm:col-span-2 lg:col-span-1 w-full sm:w-[50%] lg:w-full mx-auto"
                                            : ""
                                    }
                                >
                                    <Image
                                        className="mb-4 mx-auto"
                                        src={step.icon.node.sourceUrl}
                                        alt={step.icon.node.title}
                                        width={
                                            step.icon.node.mediaDetails.width
                                        }
                                        height={
                                            step.icon.node.mediaDetails.height
                                        }
                                    />
                                    <h3 className="text-3xl font-semibold mb-4 text-[#005371]">
                                        {step.title}
                                    </h3>
                                    <p className="text-xl font-light text-[#005371]">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-10 sm:mt-20">
                            <Link href="/dashboard/eligibility">
                                <button
                                    className="uppercase py-4 px-6 rounded-[10px] bg-[#005371] border-[#005371] border-2 text-[15px] shadow hover:shadow-[0_0_15px_0px_#005371] duration-200 ease-in-out"
                                    title="Check Eligibility"
                                >
                                    Check Eligibility
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* <section className="pt-40" id="eligibile-conditions">
                <div className="container mx-auto px-4">
                    <div>
                        <h2 className="text-4xl sm:text-[50px] leading-tight mb-8 max-w-[900px] text-[#005371]">
                            What type of eligible conditions can we help with?
                        </h2>
                        <EligibleConditionsCarousel
                            conditions={global.eligibleConditions}
                        />
                    </div>
                </div>
            </section> */}

            {/* <section id="shop-by-strain" className="relative">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8">
                        Shop <br />
                        <span className="green-stroke">by strain</span>
                    </h2>
                    <ShopStrains />
                </div>
            </section> */}

            {
                availableLocations && locationData && availableLocations?.[0].toLowerCase().replace(/\s+/g, "") !== locationData?.country?.toLowerCase().replace(/\s+/g, "") && (
                    <>
                        <div className="relative ">
                            <section className="container mx-auto lg:w-[80%] px-4 ">
                                <div className="text-start text-[125px] leading-none pb-2 py-10 ">
                                    <h2 className="leading-none text-[#00537152] font-medium text-[20px] font-quatro">SHOP</h2>
                                    <h2 className="leading-none text-primary text-[64px] font-semibold font-quatro">by strain</h2>
                                </div>
                                <ShopStrains />


                            </section>
                            <Image
                                className="absolute -left-60 top-10 -rotate-45 mix-blend-multiply -z-20 pointer-events-none"
                                src="/images/general/stethoscope.png"
                                alt="Comet"
                                width={942}
                                height={1100}
                            />
                        </div>
                    </>
                )
            }

            <section className="relative text-white mt-16 py-32 px-6 mx-2 sm:mx-8 rounded-2xl overflow-hidden">
                <video
                    className="absolute inset-0 w-full h-full object-cover rounded-2xl z-[-20]"
                    src="/videos/smoke.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
                <video
                    className="absolute mix-blend-screen  -right-72 h-full  z-10 object-cover rounded-2xl"
                    src="/videos/green-flower.mp4"
                    autoPlay
                    loop
                    muted
                ></video>

                <div className="absolute inset-0 bg-[#378aa8] opacity-60  rounded-2xl"></div>
                <div className="relative flex flex-col items-center text-center z-10">
                    <p className="text-sm uppercase tracking-wide text-[#FFFF] font-bold mb-2">
                        Need a Prescription?
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl text-[#FFFF] lg:text-[100px] font-light mb-6">
                        Refer to your doctor
                    </h2>
                    <Link href="/dashboard/eligibility">
                        <button className="text-[#FFFF] bg-[#098b74]  py-4 px-6 font-medium rounded-[10px]">
                            Refer Now
                        </button>
                    </Link>
                </div>
            </section>

            {/* <section className="mt-40 relative"> */}
            {/* <Image
                    className="absolute right-0 top-[50%] lg:top-0 max-w-full w-auto object-fit object-left z-[-10] pointer-events-none"
                    src={content.pageContent.referPlanet.node.sourceUrl}
                    alt={content.pageContent.referPlanet.node.title}
                    width={
                        content.pageContent.referPlanet.node.mediaDetails.width
                    }
                    height={
                        content.pageContent.referPlanet.node.mediaDetails.height
                    }
                /> */}
            {/* <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold tracking-wider mb-8 text-[#005371]">
                            NEED A PRESCRIPTION?
                        </p>
                        <h2 className="text-3xl sm:text-[74px] mb-10 text-[#005371]">
                            Check your{" "}
                            <span>eligibility</span>
                        </h2>
                        <Link href="/dashboard/eligibility">
                            <button
                                className="uppercase py-4 px-6 rounded-full bg-[#005371] border-[#005371] border-2 text-[15px] shadow hover:shadow-[0_0_15px_0px_#005371] duration-200 ease-in-out"
                                title="Check Eligibility"
                            >
                                Check Eligibility
                            </button>
                        </Link>
                    </div>
                </div> */}
            {/* </section> */}

            <section className="mt-10 lg:mt-32 lg:px-20 py-10 sm:py-16 relative">
                <div className="absolute top-0 left-0 w-full h-full z-[-10] pointer-events-none mask-top-bottom mix-blend-screen">
                    <LowPowerModeVideo
                        image={
                            <Image
                                className="absolute top-0 left-0 w-full h-full z-[-10] object-cover object-center"
                                src="/images/general/smoke-poster.webp"
                                alt="Smoke"
                                width={1920}
                                height={1080}
                            />
                        }
                        video={
                            <video
                                className="absolute top-0 left-0 w-full h-full z-[-10] object-cover object-center"
                                muted
                                loop
                                playsInline
                                autoPlay
                                preload="none"
                                poster="/images/general/smoke-poster.webp"
                                width={1920}
                                height={1080}
                            >
                                <source
                                    src="/videos/smoke.mp4"
                                    type="video/mp4"
                                />
                                Your browser does not support the video tag.
                            </video>
                        }
                    />
                </div>
                <div className="container mx-auto px-4">
                    <div className="text-center text-[#005371]">
                        <span className="text-[#00537152] text-[20px]">EXCLUSIVE TO US</span> <br />
                        <span className="text-[94px]">Blue Dream</span>
                        {/* <h2>EXCLUSIVE TO US <br /> Blue Dream {content.title}</h2> */}
                    </div>
                    <div className="mx-auto sm:max-w-[80%] md:max-w-full backdrop-blur-[10px] rounded-[20px]  border-4 border-[#005371] p-8 sm:p-16 mt-8 sm:mt-16 grid md:grid-cols-2 gap-8 sm:gap-16 items-center">
                        <div className="relative w-[100%] lg:w-[80%] h-0 pb-[100%] lg:pb-[80%] mx-auto">
                            <Image
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_SERVER +
                                    strain.data.imageUrl
                                }
                                alt={strain.data.name}
                                fill
                                className="sm:p-10 animate-wiggle animate-duration-[4000ms] animate-infinite rounded-full"
                            />
                        </div>
                        <div>
                            <p className="text-3xl font-semibold text-[#005371]">
                                {strain.data.name}
                            </p>
                            <hr className="h-[2px] border-none bg-[#005371]  my-10" />
                            <p className="text-xl mb-4 text-[#005371]">
                                <span className="font-bold ">FEELINGS: </span>
                                {strain.data.feelings}
                            </p>
                            <p className="text-xl mb-4 text-[#005371]">
                                <span className="font-bold">HELPS WITH: </span>
                                {strain.data.helpsWith}
                            </p>
                            <p className="text-xl mb-16 text-[#005371]">
                                <span className="font-bold">FLAVOURS: </span>
                                {strain.data.flavour}
                            </p>
                            <Link href="#eligibile-conditions">
                                <button
                                    className="uppercase py-4 px-6 rounded-full bg-[#005371] border-[#005371] border-2 text-[15px] shadow hover:shadow-[0_0_15px_0px_#005371] duration-200 ease-in-out"
                                    title="Eligible Conditions"
                                >
                                    Eligible Conditions
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>

                <Image
                    className="absolute right-0  top-[60%] max-w-[50%] sm:max-w-[40%] md:max-w-[30%] h-auto w-auto object-fit object-left z-[10] pointer-events-none"
                    src="/images/icons/stethoscope.svg"
                    alt="Comet"
                    width={942}
                    height={1100}
                />
            </section>

            {/* <section className="mt-20 sm:mt-0">
                <div className="container mx-auto px-4">
                    <div>
                        <p className="text-[#005371] text-lg font-semibold tracking-wider mb-2">
                            NEWS / UPDATES
                        </p>
                        <h2 className="text-4xl text-[#005371] sm:text-[50px] leading-tight mb-8">
                            Dr. Green In The Press
                        </h2>
                        <NewsCarousel items={rssItems} />
                    </div>
                </div>
            </section> */}

            {/* lorem text and learn more  */}
            <div className="relative mask-top-bottom">
                {/* Video Background */}
                <video
                    className="absolute top-0 left-0 h-full w-full object-cover object-top -z-50"
                    src="/videos/smoke.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >
                    Your browser does not support the video tag.
                </video>

                {/* Section 1 */}
                <section className="py-10 md:pt-56 relative">
                    {/* <Image
                        className="absolute right-0 -bottom-96 max-w-[50%] sm:max-w-[40%] md:max-w-[30%] h-auto w-auto object-fit object-left z-[-10] pointer-events-none"
                        src="/images/icons/stethoscope.svg"
                        alt="Comet"
                        width={942}
                        height={1100}
                    /> */}
                    <div className="container mx-auto px-4">
                        <div className="lg:w-[80%] m-auto">
                            <TextHightlight
                                text={
                                    <p
                                        className="text-4xl sm:text-5xl lg:text-[47px] !font-thin text-white text-center leading-tight"
                                        dangerouslySetInnerHTML={{
                                            __html: content.pageContent.largeParagraphText,
                                        }}
                                    />
                                }
                                class="home-text"
                            />
                        </div>
                    </div>
                </section>


                <div className="container mx-auto w-[80%] flex justify-center">
                    <img src="/videos/heartbeat.gif" className="w-1/2" alt="" />
                </div>


                {/* Section 2 */}
                <section className="relative ">
                    <div className="container mx-auto px-4 md:flex md:justify-center">
                        <div>
                            <h2 className="text-4xl sm:text-[94px] leading-tight font-semibold  text-center">
                                Made possible <br />
                            </h2>
                            <div className="flex items-center justify-center md:justify-end -mt-6">
                                <div className="text-center mt-0 text-[40px]">with</div>
                                <img className="w-[100px] md:w-auto " src="/images/logos/green.png" alt="" />
                            </div>
                            <p
                                className="text-[18px] font-light max-w-[750px] mb-8 text-center"
                                dangerouslySetInnerHTML={{
                                    __html: content.pageContent.madePossibleParagraphText,
                                }}
                            />
                            <div className="text-center mb-36">
                                <Link href="https://drgreennft.com/" target="_blank">
                                    <button
                                        className="uppercase py-4 px-6 rounded-[10px] border-[#FFFF] border-2 text-[15px] shadow hover:shadow-[0_0_15px_0px_#0aba90] duration-200 ease-in-out"
                                        title="Learn More"
                                    >
                                        Learn More
                                    </button>
                                </Link>
                            </div>
                            {/* <div className="mt-10 sm:mt-0 xl:mt-[-10%] pointer-events-none">
                                <div className="ml-auto w-fit flex flex-col justify-center items-center max-w-full">
                                    <div className="h-0 pb-[100%] relative max-w-full w-[800px]">
                                        <img
                                            className="absolute top-0 left-0 h-full w-full object-cover object-center rounded-full"
                                            src={
                                                content.pageContent
                                                    .madePossibleCelebrityImage.node
                                                    .sourceUrl
                                            }
                                            alt={
                                                content.pageContent
                                                    .madePossibleCelebrityImage.node
                                                    .title
                                            }
                                            width={
                                                content.pageContent
                                                    .madePossibleCelebrityImage.node
                                                    .mediaDetails.width
                                            }
                                            height={
                                                content.pageContent
                                                    .madePossibleCelebrityImage.node
                                                    .mediaDetails.height
                                            }
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </section>
            </div>


            <section className="relative pt-40" id="faqs">
                {/* <Image
                    className="absolute bottom-0 left-0 w-full h-full object-right md:object-bottom-right object-cover md:object-fit mask-top-bottom pointer-events-none z-[-10]"
                    src={
                        content.pageContent.questionsBackgroundImage.node
                            .sourceUrl
                    }
                    alt={
                        content.pageContent.questionsBackgroundImage.node.title
                    }
                    width={
                        content.pageContent.questionsBackgroundImage.node
                            .mediaDetails.width
                    }
                    height={
                        content.pageContent.questionsBackgroundImage.node
                            .mediaDetails.height
                    }
                /> */}
                <div className="container mx-auto px-4">
                    <div>
                        <div className="text-center mb-20">
                            <h2 className="text-5xl sm:text-[74px] font-semibold text-[#005371]">
                                Questions?
                            </h2>
                            <p className="text-[#005371] font-fontspring text-2xl sm:text-3xl font-semibold">
                                We&apos;ve got answers...
                            </p>
                        </div>
                        <FAQs />
                    </div>
                </div>
            </section>

            <section className="mt-20">
                <div className="container mx-auto px-4">
                    <div>
                        <div className=" text-center">
                            <p className="text-3xl font-semibold mb-4 text-[#005371]">
                                Something else on your mind? 🧐
                            </p>
                            <Link href="mailto:support@drgreennft.com">
                                <button
                                    className="uppercase py-4 px-6 rounded-[10px]  bg-[#008B74] text-white border-2 text-[15px] shadow hover:shadow-[0_0_15px_0px_#005371] duration-200 ease-in-out"
                                    title="Reach Out"
                                >
                                    Reach Out
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
