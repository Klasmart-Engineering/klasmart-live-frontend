import React, { useEffect, useRef, useMemo } from "react";
import { useTheme } from "@material-ui/core/styles";

interface Props {
    color?: string
    input?: MediaStream | HTMLMediaElement | null
    output?: boolean
    raw?: boolean
}

export function FFT(props: Props & React.CanvasHTMLAttributes<HTMLCanvasElement>) {
    if(!window.AudioContext) {return <></>}
    const {color, input, output, raw, ...canvasProps} = props;
    const canvas = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();
    
    const audioContext = useMemo(() => new AudioContext(), []);
    useEffect(() => {
        return () => {audioContext.close();}; //Destroy audio context when this component is destroyed
    }, []);

    const source = useMemo(() => {
        if(!input) { return }
        if(input instanceof MediaStream) { return audioContext.createMediaStreamSource(input) } 
        if(input instanceof HTMLMediaElement) { return audioContext.createMediaElementSource(input) }
    }, [input]);
    useEffect(() => {
        if(!source || !output) {return}
        source.connect(audioContext.destination);
        const s = source, d = audioContext.destination;
        return () => s.disconnect(d);
    }, [source]);



    const merger = useMemo(() => audioContext.createChannelMerger(1), []);
    useEffect(() => {
        if(!source) {return}
        source.connect(merger);
        const s = source, m = merger;
        return () => s.disconnect(m);
    }, [source, merger]);


    const processor = useMemo(() => audioContext.createScriptProcessor(1024, 1, 1), []);
    useEffect(()=>{
        merger.connect(processor);
        const m = merger, p = processor;
        return () => m.disconnect(p);
    },[merger,processor]);

    useEffect(() => {
        processor.connect(audioContext.destination);
        audioContext.resume();
        function process(e: AudioProcessingEvent) {
            if(!canvas.current) {return;}
            const ctx = canvas.current.getContext("2d");
            if(!ctx) {return;}
            ctx.strokeStyle = color ? color : (theme.palette.type === "dark" ? "#fff" : "#000");
            const width = canvas.current.width;
            const height = canvas.current.height;
            ctx.clearRect(0,0,width,canvas.current.height);
            const [re] = fft(e.inputBuffer.getChannelData(0));
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let i = 0; i < 2*re.length/3; i++) {
                const x = width * ((i+1) / (1+2*re.length/3));
                const index = raw ? i : i & 1 ? re.length - (i >> 1) : (i >> 1);
                ctx.lineTo(x, height-0.1*height*Math.sqrt(Math.abs(re[index])));
            }
            ctx.stroke();
        }
        processor.addEventListener("audioprocess", process);
        const a = audioContext, p = processor, d = audioContext.destination;
        return () => {
            p.removeEventListener("audioprocess", process);
            p.disconnect(d);
            if(a.state === "running") {
                a.suspend();
            }
        };
    }, [processor]);
    
    return <canvas ref={canvas} {...canvasProps}/>;
}

function fft(signal: Float32Array) {
    return fft_inplace(new Float32Array(signal), new Float32Array(signal.length));
}

function fft_inplace(re: Float32Array, im: Float32Array) {
    //takes power of 2 input, Does not pad
    const bits = Math.floor(Math.log2(re.length));
    const length = Math.pow(2, bits);


    let phiTR = Math.cos(Math.PI / length);
    let phiTI = -Math.sin(Math.PI / length);

    let k = length;
    while (k > 1) {
        const n = k;
        k >>= 1;
        //phiT = phiT*phiT
        [phiTR, phiTI] = [phiTR * phiTR - phiTI * phiTI, 2 * phiTR * phiTI];
        //T = 1.0L
        let [TR, TI] = [1.0, 0.0];
        for (let l = 0; l < k; l++) {
            for (let a = l; a < length; a += n) {
                const b = a + k;

                //t = a-b
                const [tR, tI] = [re[a] - re[b], im[a] - im[b]];

                //a+=b
                re[a] += re[b];
                im[a] += im[b];

                //b = t*T
                re[b] = tR * TR - tI * TI;
                im[b] = tR * TI + tI * TR;
            }

            // T *= phiT
            [TR, TI] = [TR * phiTR - TI * phiTI, TR * phiTI + TI * phiTR];
        }
    }

    for (let i = 0; i < length; i++) {
        const j = bitReverse(i, bits);
        if (i < j) {
            const reSwap = re[i];
            re[i] = re[j];
            im[i] = im[j];

            const imSwap = im[i];
            re[j] = reSwap;
            im[j] = imSwap;

        }
    }

    return [re, im];
}

function bitReverse(a: number, bits: number) {
    let reverse = 0;
    for (let i = 0; i < bits; i++) {
        reverse = reverse << 1 | a & 1;
        a >>= 1;
    }
    return reverse;
}