/**
 * Creates a skeleton of the character's details using daisyUI's skeleton components. 
 * 
 * @author Created using Claude.
 */

export default function CharacterDetailsLoadingSkeleton(){
    return (
        <>
            <div className="flex m-auto gap-4 p-1 pt-8">
                <div className="skeleton h-9 w-24 rounded-lg" />
                <div className="skeleton h-9 w-20 rounded-lg" />
                <div className="skeleton h-9 w-20 rounded-lg" />
            </div>

            <div className="grid place-items-center p-4">
                <div className="grid sm:grid-cols-1 md:grid-cols-2 bg-base-200 w-3xl items-center p-16 gap-8">
                    {/* left col */}
                    <div className="flex flex-col items-center gap-6">
                        <div className="skeleton w-64 h-64 rounded-full" />
                    </div>

                    {/* right col */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="skeleton h-10 w-48 rounded-lg" />
                        <div className="flex gap-2">
                            <div className="skeleton h-6 w-16 rounded-full" />
                            <div className="skeleton h-6 w-20 rounded-full" />
                            <div className="skeleton h-6 w-14 rounded-full" />
                        </div>
                        <div className="skeleton h-4 w-40 rounded" />
                        <div className="skeleton h-4 w-36 rounded" />
                        <div className="skeleton h-9 w-32 rounded-lg mt-2" />
                    </div>

                    {/* bio — full width */}
                    <div className="col-span-2 w-full flex flex-col items-center gap-3 pt-4 border-t border-base-300">
                        <div className="skeleton h-8 w-44 rounded-lg" />
                        <div className="skeleton h-20 w-full rounded-lg" />
                    </div>
                </div>
            </div>

            {/* reference image */}
            <div className="flex flex-col w-3xl m-auto text-center items-center bg-base-200 p-8 gap-4">
                <div className="skeleton h-8 w-52 rounded-lg" />
                <div className="skeleton h-80 w-full rounded-lg" />
            </div>
        </>
    );
}