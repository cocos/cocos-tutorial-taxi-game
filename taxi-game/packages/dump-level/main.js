'use strict';

const fs = require('fs');
const LZString = require('lz-string');

async function _export(node) {
    const mapName = node.name.value;
    const objExport = {};
    console.log(`exporting(${mapName})`);
    await _parseDetail(node, objExport);

    let projectPath = Editor.Project.path;
    let data = JSON.stringify(objExport);
    data = LZString.compressToEncodedURIComponent(data);

    const fileName = `${projectPath}/assets/resources/gameMap/data/${mapName}.zip`;
    fs.writeFile(fileName, data, null, () => {
        console.log('export successful!');
        Editor.Message.send('asset-db', 'refresh-asset', 'db://assets/resources/gameMap/data');
    })
}

async function _parseDetail(currNode, objExport) {
    for (let i = 0; i < currNode.children.length; i++) {
        let manager = await Editor.Message.request('scene', 'query-node', currNode.children[i].value.uuid);
        if (manager.name.value !== 'path') {
            await _parseTypeDetail(manager, objExport);
        } else {
            await _parsePath(currNode, manager, objExport);
        }
    }
}

async function _parseTypeDetail(managerNode, objExport) {
    let objDetail = {
        name: managerNode.name.value,
        pX: managerNode.position.value.x,
        pY: managerNode.position.value.y,
        pZ: managerNode.position.value.z,
        children: []
    }

    for (let i = 0; i < managerNode.children.length; i++) {
        let child = await Editor.Message.request('scene', 'query-node', managerNode.children[i].value.uuid);
        let objChild = await _parseChildDetail(child);

        objDetail.children.push(objChild);
    }

    objExport[objDetail.name] = objDetail;
}

async function _parseChildDetail(child) {
    let objChild = {
        name: child.name.value,
        pX: Number(child.position.value.x.toFixed(3)),
        pY: Number(child.position.value.y.toFixed(3)),
        pZ: Number(child.position.value.z.toFixed(3)),
        rX: Number(child.rotation.value.x.toFixed(3)),
        rY: Number(child.rotation.value.y.toFixed(3)),
        rZ: Number(child.rotation.value.z.toFixed(3)),
        sX: Number(child.scale.value.x.toFixed(3)),
        sY: Number(child.scale.value.y.toFixed(3)),
        sZ: Number(child.scale.value.z.toFixed(3)),
    }

    return objChild;
}

async function _parsePath(root, manager, objExport) {
    let comps = root.__comps__;
    let gameMap = null;
    for (let i = 0; i < comps.length; i++) {
        if (comps[i].type === 'GameMap') {
            gameMap = comps[i];
            break;
        }
    }

    if (!gameMap) {
        console.warn('There is no \'GameMap\' script');
        return;
    }

    let objDetail = {
        name: manager.name.value,
        pX: manager.position.value.x,
        pY: manager.position.value.y,
        pZ: manager.position.value.z,
        children: []
    }

    for (let i = 0; i < gameMap.value.path.value.length; i++) {
        let nodePoint = await Editor.Message.request('scene', 'query-node', gameMap.value.path.value[i].value.uuid);
        let nodePath = await Editor.Message.request('scene', 'query-node', nodePoint.parent.value.uuid);

        let objPath = {
            name: nodePath.name.value,
            pX: nodePath.position.value.x,
            pY: nodePath.position.value.y,
            pZ: nodePath.position.value.z,
            path: await _parseDetailPath(nodePoint, objExport),
        }

        objDetail.children.push(objPath);
    }

    objExport[objDetail.name] = objDetail;
}

async function _parseDetailPath(nodePoint) {
    let comps = nodePoint.__comps__;
    let point = null;
    for (let i = 0; i < comps.length; i++) {
        if (comps[i].type === 'RoadPoint') {
            point = comps[i];
            break;
        }
    }

    if (!point) {
        return null;
    }

    let nextStation = null;
    if (point.value.nextStation.value.uuid) {
        nextStation = await _parseDetailPath(await Editor.Message.request('scene', 'query-node', point.value.nextStation.value.uuid));
    }

    let objChild = {
        name: nodePoint.name.value,
        pX: Number(nodePoint.position.value.x.toFixed(3)),
        pY: Number(nodePoint.position.value.y.toFixed(3)),
        pZ: Number(nodePoint.position.value.z.toFixed(3)),
        rX: Number(nodePoint.rotation.value.x.toFixed(3)),
        rY: Number(nodePoint.rotation.value.x.toFixed(3)),
        rZ: Number(nodePoint.rotation.value.x.toFixed(3)),
        sX: Number(nodePoint.scale.value.x.toFixed(3)),
        sY: Number(nodePoint.scale.value.x.toFixed(3)),
        sZ: Number(nodePoint.scale.value.x.toFixed(3)),
        type: point.value.type.value,
        nextStation,
        moveType: point.value.moveType.value,
        clockwise: point.value.clockwise.value,
        direction: point.value.direction.value,
        delayTime: point.value.delayTime.value,
        interval: point.value.interval.value,
        speed: point.value.speed.value,
        cars: point.value.cars.value,
    };

    return objChild;
}


module.exports = {
    // Called when ths package is loaded correctly
    load() { },


    // Called when the package is properly uninstalled
    unload() { },

    methods: {
        async 'start-dump-level'() {
            console.log('start dump level');
            const type = Editor.Selection.getLastSelectedType();
            if (type !== 'node') {
                console.warn('The type is not node');
                return;
            }

            const uuids = Editor.Selection.getSelected(type);
            for (let i = 0; i < uuids.length; i++) {
                const dump = await Editor.Message.request('scene', 'query-node', uuids[i]);
                _export(dump);
            }
        },
    }
}
