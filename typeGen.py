"Generate types from JSON data"

content = "interface TypeGen {\n"

import json, textwrap 
def pytype2js(i, indent:int) -> str:
    typ = type(i)
    if typ == int or typ == float: 
        return "number"
    if typ == str: 
        return "string"
    if typ == bool:
        return "boolean"
    if typ == None:
        return "null"
    if typ == list:
        types = list(dict.fromkeys([pytype2js(j, indent) for j in i]))
        return ("(" if len(types) != 1 else "")+"| ".join(types)+(")" if len(types) != 1 else "")+"[]"
    if typ == dict:
        return "{\n"+textwrap.indent(gen(i,indent), " "*indent)+" "*(indent-2)+"}"

    return "Object"

def gen(d: dict, indent = 2):
    r = ""
    for k in d.keys():
        if "-" in k or k[0].isdigit(): k = '"'+k+'"'
        r+=(" "*indent)+k+": "+pytype2js(d[k], indent+2)+"\n"
    return r
content+=gen(json.load(open("test","r")))

content += "}"

open("out.ts","w").write(content)
