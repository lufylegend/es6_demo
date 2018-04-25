/* eslint-env node */
const { exec } = require('child_process');
const fs = require('fs');
const commonJson = require('./prefab-class.json');
const DOMParser = require('dom-parser');

let imports = [];
for (let key of Object.keys(commonJson)) {
    imports.push(`import ${key} from "${commonJson[key]}";`);
}

const applicationPath = './assets/application.js';
let applicationText;
let metaList = [];


function getAtlas(atlas) {
    let paths = [];
    if (atlas.property.bind && atlas.property.bind.atlas) {
        paths.push(atlas.property.bind.atlas);
    }
    if (atlas.property.button) {
        let nodes = [];
        if (atlas.property.button.upState) {
            nodes.push(atlas.property.button.upState);
        }
        for (let child of nodes) {
            paths = paths.concat(getAtlas(child));
        }
    }
    if (atlas.childNodes) {
        for (let child of atlas.childNodes) {
            paths = paths.concat(getAtlas(child));
        }
    }
    return paths;
}
const jsPaths = ['./assets/plugin', './assets/scripts'];
let jsPathObject = {};
function getImpports(json) {
    let objs = [];
    if (json.class && !jsPathObject[json.class]) {
        let classes = [];
        for (let jsPath of jsPaths) {
            classes = classes.concat(readFiles(jsPath, new RegExp('.*\\' + json.class + '.js$')));
            if (classes.length > 0) {
                break;
            }
        }
        if (classes.length > 0) {
            let classPath = classes[0].replace('assets/', '');
            objs.push(`import ${json.class} from "${classPath}";`);
        }
        jsPathObject[json.class] = true;
    }
    if (json.childNodes) {
        for (let child of json.childNodes) {
            objs = objs.concat(getImpports(child));
        }
    }
    return objs;
}
function readFiles(path, regExp) {
    let result = [];
    let files = fs.readdirSync(path);
    for (let file of files) {
        let stat = statSync(`${path}/${file}`);
        if (!stat) {
            continue;
        }
        if (stat.isFile()) {
            if (regExp.test(file)) {
                result.push(`${path}/${file}`);
            }
            continue;
        }
        if (stat.isDirectory()) {
            result = result.concat(readFiles(`${path}/${file}`, regExp));
        }
    }
    return result;
}
function statSync(file) {
    let stat = '';
    try {
        stat = fs.statSync(file);
        return stat;
    } catch (err) {
        return stat;
    }
}
function readFile(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, function(err, data) {
            if (err) {
                reject();
            } else {
                resolve(data);
            }
        });
    });
}
function writeFile(path, text) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, text, function(err) {
            if (err) {
                reject();
            } else {
                resolve();
            }
        });
    });
}
function createPlistJson() {
    return new Promise(function(resolve, reject) {
        let plists = readFiles('./assets/resources', /.*\.plist$/);
        for (let plist of plists) {
            let prefabContext = fs.readFileSync(plist, 'utf8');
            let data = getPlistData(prefabContext);
            let metaPath = `${plist}.meta`;
            fs.writeFileSync(metaPath, data);
        }
        resolve();
    });
}
function getPlistData(xml) {
    let parser = new DOMParser();
    let xmlDom = parser.parseFromString(xml);
    for (let key in xmlDom.getElementsByTagName('dict')[2].childNodes) {
        console.log(xmlDom.getElementsByTagName('dict')[2].childNodes[key].nodeName);
    }
    console.log(xmlDom.getElementsByTagName('dict')[2].childNodes[1].nodeName);
    let plistDom = xmlDom.querySelector('plist').querySelector('dict');
    let children = plistDom.children;
    let frames;
    for (let i = 0;i < children.length; i++) {
        let child = children[i];
        if (child.tagName === 'key' && child.textContent === 'frames') {
            frames = children[i + 1].children;
            break;
        }
    }
    let _textureData = {};
    for (let i = 0;i < frames.length; i += 2) {
        let key = frames[i].textContent.replace('.png', '');
        let value = frames[i + 1];
        let data = _getTextureData(value.children);
        _textureData[key] = data;
    }
    return JSON.stringify(_textureData);
}
function _getTextureData(children) {
    let data = {};
    for (let i = 0;i < children.length; i += 2) {
        let key = children[i].textContent;
        let tict = children[i + 1];
        let value = JSON.parse(tict.tagName === 'string' ? tict.textContent.replace(/\{/g, '[').replace(/\}/g, ']') : tict.tagName);
        data[key] = value;
    }
    return data;
}

function createMeta() {
    return new Promise(function(resolve, reject) {
        let prefabs = readFiles('./assets/resources', /.*\.prefab$/);
        for (let prefab of prefabs) {
            let prefabContext = fs.readFileSync(prefab);
            let json = JSON.parse(prefabContext);
            let atlasPaths = getAtlas(json);
            imports = imports.concat(getImpports(json));
            let metaPath = `${prefab}.meta`;
            let metaContent = {};
            let atlasObj = {};
            for (let atlasPath of atlasPaths) {
                atlasObj[atlasPath] = true;
            }
            metaContent.atlas = Object.keys(atlasObj).map((atlas) => {
                let index = atlas.lastIndexOf('/');
                return { name: atlas.substring(index + 1), path: atlas.substring(0, index) };
            });
            metaList.push(metaPath);
            fs.writeFileSync(metaPath, JSON.stringify(metaContent));
        }
        resolve();
    });
}
function filesRestore() {
    for (let methPath of metaList) {
        fs.unlinkSync(methPath);
    }
    if (applicationText) {
        writeFile(applicationPath, applicationText);
    }
}

createMeta()
    .then(() => {
        return createPlistJson();
    })
    .then(() => {
        return readFile(applicationPath);
    })
    .then((data) => {
        applicationText = data;
        return writeFile(applicationPath, data + imports.join(''));
    })
    .then(() => {
        return ExecCommand('rm -rf build/resources');
    })
    .then(() => {
        return ExecCommand('cp -a assets/resources build/resources');
    })
    .then(() => {
        return ExecCommand('`npm bin`/webpack');
    })
    .then((res) => {
        console.log(res);
        filesRestore();
        console.log('build success!!');
    }).catch((err) => {
        console.error(err);
        filesRestore();
    });

function ExecCommand(command) {
    console.log(command);
    return new Promise(function(resolve, reject) {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err, stdout, stderr);
                reject(err);
            } else {
                resolve(stdout.split('\n'));
            }
        });
    });
}
