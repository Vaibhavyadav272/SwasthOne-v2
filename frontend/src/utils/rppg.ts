export type RGBSample = { t: number; r: number; g: number; b: number; motion: number; brightness: number }
export type RPPGMethod = 'green' | 'chrom' | 'pos'

const clamp = (v:number,a:number,b:number) => Math.max(a, Math.min(b,v))
const mean = (x:number[]) => x.length ? x.reduce((a,b)=>a+b,0)/x.length : 0
const std = (x:number[]) => { const m=mean(x); return Math.sqrt(mean(x.map(v=>(v-m)**2))) }

function detrend(x:number[]) {
  const n=x.length; if(n<2) return x.slice()
  const xm=(n-1)/2, ym=mean(x)
  let num=0, den=0
  for(let i=0;i<n;i++){ const dx=i-xm; num+=dx*(x[i]-ym); den+=dx*dx }
  const slope=den?num/den:0, intercept=ym-slope*xm
  return x.map((v,i)=>v-(slope*i+intercept))
}
function normalized(x:number[]) { const m=mean(x), s=std(x)||1; return x.map(v=>(v-m)/s) }

// Frequency-domain band-pass. The pulse band is deliberately conservative for a
// screening signal: 0.70–3.00 Hz (42–180 BPM). This removes slow illumination
// drift and most high-frequency camera/motion noise without pretending to be a
// clinical filter implementation.
function bandpass(x:number[], fs:number, low=0.70, high=3.00) {
  if(x.length<16 || fs<=0) return x.slice()
  const n=x.length, y=detrend(x)
  const out=new Array<number>(n).fill(0)
  for(let k=0;k<n;k++){
    const f=k<=n/2 ? k*fs/n : (n-k)*fs/n
    if(f<low || f>high) continue
    let re=0, im=0
    for(let i=0;i<n;i++){
      const a=2*Math.PI*k*i/n; re+=y[i]*Math.cos(a); im-=y[i]*Math.sin(a)
    }
    for(let i=0;i<n;i++){
      const a=2*Math.PI*k*i/n
      out[i]+=(re*Math.cos(a)-im*Math.sin(a))/n
    }
  }
  return out
}

// CHROM: de Haan & Jeanne (2013). It works on temporally normalized RGB
// channels and projects them into two chrominance axes before alpha tuning.
export function chrom(samples:RGBSample[], fs:number) {
  const r=normalized(samples.map(s=>s.r)), g=normalized(samples.map(s=>s.g)), b=normalized(samples.map(s=>s.b))
  const x=r.map((v,i)=>3*v-2*g[i])
  const y=r.map((v,i)=>1.5*v+g[i]-1.5*b[i])
  const alpha=(std(x)/(std(y)||1))
  return bandpass(x.map((v,i)=>v-alpha*y[i]),fs)
}

// POS: Wang et al. (2017). Apply temporal normalization in a sliding window,
// project onto the plane orthogonal to the skin-tone direction, then alpha tune.
export function pos(samples:RGBSample[], fs:number) {
  const out:number[]=[]
  const window=Math.max(32,Math.round(fs*1.6))
  for(let i=0;i<samples.length;i++){
    const a=Math.max(0,i-window+1), w=samples.slice(a,i+1)
    if(w.length<8){ out.push(0); continue }
    const r=normalized(w.map(s=>s.r)), g=normalized(w.map(s=>s.g)), b=normalized(w.map(s=>s.b))
    const x=r.map((_,j)=>g[j]-b[j])
    const y=r.map((v,j)=>g[j]+b[j]-2*v)
    const alpha=std(x)/(std(y)||1)
    out.push(x[x.length-1]-alpha*y[y.length-1])
  }
  return bandpass(out,fs)
}

export function green(samples:RGBSample[], fs:number) {
  return bandpass(normalized(samples.map(s=>s.g)),fs)
}

export function spectrum(signal:number[], fs:number) {
  const n=signal.length; if(n<8) return []
  const out:{hz:number; power:number}[]=[]
  const x=detrend(signal)
  for(let k=0;k<=Math.floor(n/2);k++){
    const hz=k*fs/n
    if(hz<0.7 || hz>3.0) continue
    let re=0, im=0
    for(let i=0;i<n;i++){ const a=2*Math.PI*k*i/n; re+=x[i]*Math.cos(a); im-=x[i]*Math.sin(a) }
    out.push({hz,power:(re*re+im*im)/n})
  }
  return out
}
function peakAndSNR(spec:{hz:number;power:number}[]) {
  if(!spec.length) return {peak:null as {hz:number;power:number}|null, snr:0}
  const sorted=spec.slice().sort((a,b)=>b.power-a.power)
  const peak=sorted[0]
  const nearby=spec.filter(p=>Math.abs(p.hz-peak.hz)>=0.12 && Math.abs(p.hz-peak.hz)<=0.45)
  const noise=mean(nearby.map(p=>p.power)) || 1e-9
  return {peak,snr:peak.power/noise}
}

export function estimateHR(signal:number[], fs:number) {
  const spec=spectrum(signal,fs)
  const {peak,snr}=peakAndSNR(spec)
  if(!peak) return {hr:null, spectrum:[] as {hz:number;power:number}[], peakPower:0, snr:0}
  return {hr:clamp(Math.round(peak.hz*60),42,180), spectrum:spec, peakPower:peak.power, snr}
}
export function signalQuality(signal:number[], fs:number) {
  if(signal.length<30) return 0
  const spec=spectrum(signal,fs)
  const {peak,snr}=peakAndSNR(spec)
  if(!peak) return 0
  const total=spec.reduce((a,p)=>a+p.power,0)||1
  const concentration=peak.power/total
  const snrScore=clamp((snr-1)/5,0,1)
  const concentrationScore=clamp(concentration*6,0,1)
  return clamp(Math.round(100*(0.65*snrScore+0.35*concentrationScore)),0,100)
}

export function analyze(samples:RGBSample[], fs:number) {
  const methods:{name:RPPGMethod; signal:number[]}[]=[
    {name:'green',signal:green(samples,fs)},
    {name:'chrom',signal:chrom(samples,fs)},
    {name:'pos',signal:pos(samples,fs)},
  ]
  const results=methods.map(m=>({method:m.name, signal:m.signal, ...estimateHR(m.signal,fs), quality:signalQuality(m.signal,fs)}))
  const valid=results.filter(r=>r.hr!==null) as (typeof results[number] & {hr:number})[]
  const hrs=valid.map(r=>r.hr)
  const range=hrs.length?Math.max(...hrs)-Math.min(...hrs):999
  const agreement=hrs.length>1 ? clamp(Math.round(100-Math.max(0,range-4)*8),0,100) : 0
  const best=results.slice().sort((a,b)=>(b.quality+(b.snr||0)*4)-(a.quality+(a.snr||0)*4))[0]
  let fused:number|null=null
  if(valid.length){
    const agreeing=valid.filter(r=>Math.abs(r.hr-(best.hr??r.hr))<=8)
    const pool=agreeing.length>=2?agreeing:[best as typeof valid[number]]
    const weightSum=pool.reduce((a,r)=>a+Math.max(r.quality,1),0)
    fused=Math.round(pool.reduce((a,r)=>a+r.hr*Math.max(r.quality,1),0)/weightSum)
  }
  const motionScore=clamp(100-Math.round(mean(samples.map(s=>s.motion))*320),0,100)
  const lighting=clamp(Math.round(100- Math.abs(mean(samples.map(s=>s.brightness))-128)/1.28),0,100)
  const quality=Math.round(mean(results.map(r=>r.quality)))
  const trustScore=Math.round(0.35*quality+0.30*agreement+0.20*motionScore+0.15*lighting)
  return {results,fused,agreement,motion:motionScore,lighting,quality,trustScore:clamp(trustScore,0,100),best}
}

