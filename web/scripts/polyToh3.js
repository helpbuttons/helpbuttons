const geojson2h3 = require('geojson2h3');

const provinces = require('../public/geo/spain-provinces.json')
const turf = require('@turf/turf'); // if you're in NodeJS
const _ = require('lodash');

async function getMaxResolution() {
    const provincesConsts = await import('../src/shared/provinces.consts.cjs');
    return provincesConsts.hexesProvincesMaxResolution;
}

const grr = getMaxResolution()
grr.then((hexesProvincesMaxResolution) => {


    console.log(hexesProvincesMaxResolution)

    // npx simplify-geojson -t 0.02 spain-provinces.json > spain-provinces-simplified.json
    const provinceHexes = provinces.features.map((prov) => {
        const rnd = () => {
            return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, 0.3)`;
        }
        const start = performance.now()
        const provinceHexes = geojson2h3.featureToH3Set(prov, hexesProvincesMaxResolution);
        const k = {
            code: `${prov.properties.Codigo}${prov.properties.Cod_CCAA}`,
            name: prov.properties.Texto,
            centroid: turf.centroid(prov),
            hexes: provinceHexes,
            color: rnd(),
            polygon: geojson2h3.h3SetToFeature(provinceHexes)
        }

        const total = performance.now() - start
        console.log(`${k.code}: ${k.name} time to generate: ${total.toFixed(2)} ms`)
        return k;
    })

    provinceHexes.sort((provA, provB) => provA.name.localeCompare(provB.name))
    console.log(provinceHexes.length)

    console.log(provinceHexes.map((p) => `${p.name}`))

    const groupedHexagons = provinceHexes.reduce(
        (accumulator, currentValue) => {
            const found = accumulator.find(
                (province) => {
                    return province.code == currentValue.code
                }

            );
            if (found) {
                const newAcc = accumulator.map((prov) => {
                    if (prov.code == found.code) {
                        const z = prov.hexes.slice(0)
                        const kz = _.union(z, found.hexes)
                        return { ...prov, hexes: kz };
                    }
                    return prov
                })
                return newAcc
            } else {
                accumulator.push(currentValue)
            }
            return accumulator;
        },
        []
    );
    console.log(groupedHexagons.map((p) => `${p.code}: ${p.name} > ${p.hexes.length}`))
    console.log(groupedHexagons.length)
    // return;

    const write = async (data) => {
        const fs = require('fs')
        await fs.writeFileSync('public/geo/provinces_h3.json', data)
    }
    write(JSON.stringify(groupedHexagons, null, 2))
})