import Image from "next/image";

export default function Footer(){
    return (
        <footer className="h-[40vh] py-1 sm:py-2 md:py-3 lg:py-4">
            <div className="flex flex-col justify-end h-[100%] w-[90%] md:w-[85%] mx-auto mt-auto">
                <div className='flex flex-col justify-end h-[75%] mb-[2%]'>
                    <div className='w-[100%] sm:w-[80%] md:w-[60%] lg:w-[40%]'>
                        <div className="flex w-[40%] h-[25px] sm:h-[30px] md:h-[35px] lg:h-[40px] py-[5px] sm:py-[6px] md:py-[7px] lg:py-[8px] relative">
                            <Image
                                src="/urainews.svg"
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className='py-[5px] sm:py-[6px] md:py-[7px] lg:py-[8px] text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px]'>
                            Brings you the latest AI news headlines from multiple sources in one place.
                        </p>
                    </div>
                </div>
                <div className='h-[10%] flex justify-center items-center'>
                    <p className='text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px]'>Copyright © 2025, Urainews</p>
                </div>
            </div>
        </footer>
    )
}