#!/usr/bin/env node
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { compile } from "../src/compiler.js";

const [command,input,output="dist/index.html"]=process.argv.slice(2);
if(command!=="build"||!input){
  console.log("Usage: lynxtr build <file.ltr> [output.html]");
  process.exit(1);
}
try{
  const source=await readFile(resolve(input),"utf8");
  const html=compile(source);
  const target=resolve(output);
  await mkdir(dirname(target),{recursive:true});
  await writeFile(target,html,"utf8");
  console.log(`Lynxtr: ${input} -> ${output}`);
}catch(error){
  console.error(`Lynxtr error: ${error.message}`);
  process.exit(1);
}
