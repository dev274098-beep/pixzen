"use client";

import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Activity, Bot, ChevronDown, ChevronRight, CircleHelp, Code2, Command,
  File, FileCode2, FilePlus2, Folder, FolderOpen, GitBranch, LayoutPanelLeft,
  MoreHorizontal, Play, Plus, Search, Settings, Sparkles, SquareTerminal,
  Terminal, X, Zap
} from "lucide-react";

type FileItem = {name:string; language:string; content:string; icon:"html"|"css"|"js"|"md"|"json"};

const starter: FileItem[] = [
  {name:"index.html",language:"html",icon:"html",content:`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NEXUS Preview</title>
</head>
<body>
  <main class="hero">
    <span class="eyebrow">NEXUS STUDIO AI</span>
    <h1>Build something<br/><span>remarkable.</span></h1>
    <p>Describe your idea to the AI agent and turn it into a working project.</p>
    <button>Start building →</button>
  </main>
</body>
</html>`},
  {name:"styles.css",language:"css",icon:"css",content:`* { box-sizing: border-box; }
body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #090a0c; color: #f5f5f5; }
.hero { min-height: 100vh; display: grid; place-content: center; padding: 48px; }
.eyebrow { font-size: 12px; letter-spacing: .18em; opacity: .55; }
h1 { font-size: clamp(44px, 7vw, 82px); line-height: .95; margin: 18px 0; letter-spacing: -.06em; }
h1 span { opacity: .45; }
p { max-width: 520px; line-height: 1.7; color: #9298a3; }
button { border: 0; border-radius: 10px; padding: 13px 18px; background: #f5f5f5; color: #111; font-weight: 650; }`},
  {name:"app.js",language:"javascript",icon:"js",content:`console.log("Welcome to NEXUS Studio AI");`},
  {name:"README.md",language:"markdown",icon:"md",content:`# NEXUS Studio AI

AI coding workspace.

## Next
Ask the AI agent to build your project.`},
  {name:"package.json",language:"json",icon:"json",content:`{
  "name": "my-first-project",
  "private": true
}`}
];

function FileIcon({kind}:{kind:FileItem["icon"]}) {
  return kind==="html" ? <FileCode2 className="htmlIcon"/> :
    kind==="css" ? <FileCode2 className="cssIcon"/> :
    kind==="js" ? <FileCode2 className="jsIcon"/> :
    kind==="json" ? <FileCode2 className="jsonIcon"/> : <File size={14}/>;
}

export default function Workspace(){
  const [files,setFiles]=useState(starter);
  const [active,setActive]=useState("index.html");
  const [chat,setChat]=useState<{role:"user"|"ai";text:string;provider?:string}[]>([]);
  const [input,setInput]=useState("");
  const [busy,setBusy]=useState(false);
  const [panel,setPanel]=useState<"terminal"|"preview"|"problems">("terminal");
  const [sidebar,setSidebar]=useState(true);
  const [right,setRight]=useState(true);
  const [explorerSearch,setExplorerSearch]=useState("");

  const current=files.find(f=>f.name===active) ?? files[0];
  const filtered=useMemo(()=>files.filter(f=>f.name.toLowerCase().includes(explorerSearch.toLowerCase())),[files,explorerSearch]);

  const send=async()=>{
    const text=input.trim();
    if(!text || busy)return;
    setChat(c=>[...c,{role:"user",text}]);
    setInput(""); setBusy(true);
    try{
      const history=chat.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}));
      const projectContext=files.map(f=>`FILE ${f.name}\\n${f.content}`).join("\\n\\n");
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,history,projectContext})});
      const d=await r.json();
      if(!r.ok) throw new Error(d.error||"AI request failed");
      setChat(c=>[...c,{role:"ai",text:d.answer,provider:d.provider}]);
    }catch(e){
      setChat(c=>[...c,{role:"ai",text:`${e instanceof Error?e.message:"Request failed"}`}]);
    }finally{setBusy(false);}
  };

  const update=(value?:string)=>{
    if(value===undefined)return;
    setFiles(fs=>fs.map(f=>f.name===active?{...f,content:value}:f));
  };

  const addFile=()=>{
    const name=prompt("File name","component.jsx");
    if(!name)return;
    if(files.some(f=>f.name===name))return;
    const ext=name.split(".").pop();
    const language=ext==="js"||ext==="jsx"?"javascript":ext==="ts"||ext==="tsx"?"typescript":ext==="css"?"css":ext==="html"?"html":ext==="json"?"json":"plaintext";
    const icon=(ext==="css"?"css":ext==="js"||ext==="jsx"?"js":ext==="json"?"json":ext==="html"?"html":"md") as FileItem["icon"];
    setFiles(fs=>[...fs,{name,language,icon,content:""}]); setActive(name);
  };

  return <div className="shell">
    <header className="top">
      <div className="brand">
        <div className="logo"><Zap size={15} fill="currentColor"/></div>
        <span className="brandName">NEXUS</span><span className="brandSub">Studio</span>
      </div>
      <button className="workspaceBtn">my-first-project <ChevronDown size={14}/></button>
      <div className="topCenter"><span className="branch"><GitBranch size={13}/> main</span><span className="saved"><i/> Saved</span></div>
      <div className="topRight">
        <button className="iconBtn"><CircleHelp size={16}/></button>
        <button className="iconBtn"><Settings size={16}/></button>
        <button className="runBtn"><Play size={14} fill="currentColor"/> Run</button>
        <div className="avatar">D</div>
      </div>
    </header>

    <div className="main">
      <aside className={`activity ${sidebar?"":"hide"}`}>
        <button className="activityBtn active" title="Explorer"><LayoutPanelLeft size={19}/></button>
        <button className="activityBtn" title="Search"><Search size={19}/></button>
        <button className="activityBtn" title="Source control"><GitBranch size={19}/><b>0</b></button>
        <button className="activityBtn" title="AI"><Sparkles size={19}/></button>
        <div className="activitySpacer"/>
        <button className="activityBtn"><Settings size={19}/></button>
      </aside>

      <aside className={`explorer ${sidebar?"":"hide"}`}>
        <div className="explorerTop"><span>EXPLORER</span><div><button onClick={addFile}><FilePlus2 size={15}/></button><button><MoreHorizontal size={16}/></button></div></div>
        <div className="searchBox"><Search size={13}/><input value={explorerSearch} onChange={e=>setExplorerSearch(e.target.value)} placeholder="Filter files..."/><kbd>⌘ P</kbd></div>
        <div className="tree">
          <div className="treeFolder"><ChevronDown size={13}/><FolderOpen size={15}/><b>MY-FIRST-PROJECT</b></div>
          {filtered.map(f=><button key={f.name} onClick={()=>setActive(f.name)} className={`treeFile ${active===f.name?"selected":""}`}><FileIcon kind={f.icon}/><span>{f.name}</span></button>)}
        </div>
        <div className="explorerBottom">
          <div><span>WORKSPACE</span><span className="liveDot">●</span></div>
          <p>5 files · Local project</p>
        </div>
      </aside>

      <section className="codeArea">
        <div className="editorTop">
          <button className="collapse" onClick={()=>setSidebar(v=>!v)}><LayoutPanelLeft size={16}/></button>
          <div className="tab active"><FileIcon kind={current.icon}/><span>{active}</span><X size={13}/></div>
          <div className="editorActions"><button><Command size={14}/></button><button><MoreHorizontal size={16}/></button></div>
        </div>
        <div className="editorWrap">
          <Editor height="100%" theme="vs-dark" language={current.language} value={current.content} onChange={update}
            options={{minimap:{enabled:false},fontSize:13,scrollBeyondLastLine:false,automaticLayout:true,padding:{top:18},lineNumbers:"on",renderLineHighlight:"line",smoothScrolling:true,roundedSelection:false}}/>
        </div>
        <div className="bottomPanel">
          <div className="panelTabs">
            <button className={panel==="terminal"?"on":""} onClick={()=>setPanel("terminal")}><Terminal size={13}/> TERMINAL</button>
            <button className={panel==="preview"?"on":""} onClick={()=>setPanel("preview")}>PREVIEW</button>
            <button className={panel==="problems"?"on":""} onClick={()=>setPanel("problems")}><Activity size={13}/> PROBLEMS <em>0</em></button>
            <span className="panelPush"/>
            <button><SquareTerminal size={13}/></button>
          </div>
          <div className="panelBody">
            {panel==="terminal" && <><div><span className="termGreen">➜</span> <span>my-first-project</span> <span className="termDim">%</span> npm run dev</div><div className="termDim">NEXUS terminal ready · local workspace</div></>}
            {panel==="preview" && <div className="previewMini"><Sparkles size={15}/> Live preview will appear here when the project is running.</div>}
            {panel==="problems" && <div className="previewMini">No problems detected.</div>}
          </div>
        </div>
      </section>

      <aside className={`agent ${right?"":"hide"}`}>
        <div className="agentHeader">
          <div className="agentTitle"><div className="aiMark"><Sparkles size={14}/></div><div><b>AI Agent</b><small>Build with NEXUS</small></div></div>
          <div className="agentHeadBtns"><button onClick={()=>setChat([])}><MoreHorizontal size={16}/></button><button onClick={()=>setRight(false)}><X size={16}/></button></div>
        </div>
        <div className="agentStatus"><span><i/> Ready</span><button>Auto <ChevronDown size={11}/></button></div>
        <div className="chat">
          {chat.length===0 ? <div className="welcome">
            <div className="welcomeOrb"><Sparkles size={20}/></div>
            <h2>What are we building?</h2>
            <p>Describe your idea and NEXUS can plan, code, debug and improve your project.</p>
            <div className="suggestions">
              <button onClick={()=>setInput("Build a modern SaaS landing page")}>Build a SaaS landing page <ChevronRight size={13}/></button>
              <button onClick={()=>setInput("Explain this project")}>Explain this project <ChevronRight size={13}/></button>
              <button onClick={()=>setInput("Find and fix bugs")}>Find and fix bugs <ChevronRight size={13}/></button>
            </div>
          </div> : chat.map((m,i)=><div className={`msg ${m.role}`} key={i}>
            <div className="msgLabel">{m.role==="user"?"You":<>NEXUS {m.provider&&<span>· {m.provider}</span>}</>}</div>
            <div className="msgBody">{m.text}</div>
          </div>)}
          {busy&&<div className="msg ai"><div className="msgLabel">NEXUS</div><div className="typing"><i/><i/><i/></div></div>}
        </div>
        <div className="agentComposer">
          <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Ask NEXUS to build anything..."/>
          <div className="composerBottom"><span><Sparkles size={12}/> Groq <span className="arrow">→</span> Gemini <span className="arrow">→</span> OpenRouter</span><button onClick={send} disabled={!input.trim()||busy}><Play size={13} fill="currentColor"/></button></div>
        </div>
      </aside>
      {!right&&<button className="reopen" onClick={()=>setRight(true)}><Sparkles size={15}/> AI Agent</button>}
    </div>
    <footer className="statusbar"><span>● NEXUS Studio AI</span><span>main</span><span>UTF-8</span><span>Ln 1, Col 1</span><span className="statusPush"/><span>AI: {busy?"Working":"Ready"}</span></footer>
  </div>
}