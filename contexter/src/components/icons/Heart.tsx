const Heart = ({ height, width}: {height: number, width: number}) => {
    return (
        <div className="mt-1 block">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width={width} height={height} fill="#fff" className="block justify-center items-center m-auto">
                <path
                    // style={{lineHeight:"normal",textIndent:0,textAlign:"start",text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal}}
                    // style={{lineHeight:"normal",textIndent:0,textAlign:"start",text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;block-progression:tb;isolation:auto;mix-blend-mode:normal}}
                    style={{
                        lineHeight: "normal",
                        textIndent: 0,
                        textAlign: "center",
                        textDecorationLine: "none",
                        textDecorationStyle: "solid",
                        textDecorationColor: "#fff",
                        textTransform: "none",
                        // blockSize: "tb",
                        isolation: "auto",
                        mixBlendMode: "normal",
                        margin: "auto",
                        display: "block",
                        height: "100px",
                        width: "100px",
                    }}
                    d="M4.996 2.004C3.98 1.95 2.961 2.29 2.211 3.04.71 4.544.867 7.068 2.473 8.676l.513.513 4.662 4.666a.5.5 0 0 0 .706 0l4.66-4.666.513-.513c1.606-1.608 1.762-4.132.26-5.635-1.501-1.503-4.02-1.343-5.625.264L8 3.467l-.162-.162C7.035 2.5 6.013 2.058 4.996 2.004Z"
                    // color="#000" font-family="sans-serif" font-weight="400" overflow="visible" 
                    />
            </svg>
        </div>
    )
};
export default Heart;