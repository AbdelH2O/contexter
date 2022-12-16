import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import supabase from "../utils/supabase";

const Context = (
    {
        setShowContext,
        showContext,
        scene
    } :
    {
        setShowContext: Dispatch<SetStateAction<boolean>>,
        showContext: boolean,
        scene: string,
    }
) => {
    const handleExit: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target !== e.currentTarget) {
            return;
        }
        setShowContext(false);
    };
    return (
        <div
            onClick={handleExit}
            className="flex-col backdrop-blur-sm items-center justify-center h-screen w-screen z-50 absolute"
            style={{
                display: showContext ? 'flex' : 'none',
            }}
        >
            <div className="grid grid-cols-1 grid-rows-[8vh_72vh] rounded-lg border bg-white h-[80vh] w-[90vw]">
                <div className="font-Poppins flex rounded-lg shadow-sm justify-center items-center font-bold text-3xl bg-rose-700">
                    <p className="bg-rose-700 text-white px-4 py-2 rounded-md">
                        Context
                    </p>
                </div>
                <div className="px-4 pb-2 text-start font-Lato text-lg overflow-scroll indent-4">
                    {
                        scene
                    }
                </div>
                {/* <div className="font-Poppins text-red-700 flex justify-center items-center font-bold text-3xl">
                    <p className="bg-rose-700 text-white px-4 py-2 rounded-md">
                        Scene
                    </p>
                </div>
                <div className="px-4 text-center font-Lato text-lg">
                    {
                        context.scene
                    }
                </div> */}
            </div>
        </div>
    );
};

export default Context